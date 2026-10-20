import { env, SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { DaemonCmd } from '../src/daemon/models.js';

/** Client connected to the bot in a test */
interface TestClient {
  ws: WebSocket;
  /** Next message the bot sends */
  next(): Promise<Record<string, unknown>>;
  /** Resolves when the bot closes the connection */
  closed: Promise<CloseEvent>;
}

/**
 * Connect a client
 * @param token client ID
 * @param session session ID
 * @returns connected client
 */
async function connect(token: string, session = 1): Promise<TestClient> {
  const response = await SELF.fetch(
    `https://bot.test/ws?v=0.3.1&token=${token}&session=${session}`,
    {
      headers: { Upgrade: 'websocket' },
    },
  );
  expect(response.status).toBe(101);
  const ws = response.webSocket!;

  const queue: Record<string, unknown>[] = [];
  const waiters: ((message: Record<string, unknown>) => void)[] = [];
  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data as string) as Record<string, unknown>;
    const waiter = waiters.shift();
    if (waiter) waiter(message);
    else queue.push(message);
  });
  const closed = new Promise<CloseEvent>((resolve) =>
    ws.addEventListener('close', resolve),
  );
  ws.accept();

  return {
    ws,
    next: () => {
      const message = queue.shift();
      return message
        ? Promise.resolve(message)
        : new Promise((resolve) => waiters.push(resolve));
    },
    closed,
  };
}

/**
 * Durable Object of a client
 * @param token client ID
 * @returns stub
 */
function daemon(
  token: string,
): DurableObjectStub<import('../src/index.js').DaemonObject> {
  return env.DAEMON.get(env.DAEMON.idFromName(token));
}

const USER = { id: '100', name: 'host' };

describe('connection', () => {
  it('refuses an outdated client with the reason in X-Error', async () => {
    const response = await SELF.fetch(
      'https://bot.test/ws?v=0.3.0&token=a&session=1',
      {
        headers: { Upgrade: 'websocket' },
      },
    );
    expect(response.status).toBe(400);
    expect(JSON.parse(response.headers.get('X-Error')!)).toMatchObject({
      error: 'outdated',
      required: '0.3.1',
      download:
        'https://github.com/Kamesuta/remoteplay-inviter/releases/latest',
    });
  });

  it('tells an unlinked client how to link', async () => {
    const client = await connect('unlinked');
    const message = await client.next();
    expect(message).toMatchObject({
      cmd: 'message',
      copy: '/steam setup client_id:unlinked',
    });
    expect(message.text).toContain('/steam setup client_id:unlinked');
  });

  it('welcomes a linked user and records the client version', async () => {
    await env.DB.prepare(
      "INSERT INTO UserData (userId, name, locale, daemonId) VALUES ('1', 'alice', 'ja', 'linked')",
    ).run();
    const client = await connect('linked');
    expect((await client.next()).text).toContain('alice');
    const row = await env.DB.prepare(
      "SELECT daemonVersion FROM UserData WHERE daemonId = 'linked'",
    ).first();
    expect(row).toEqual({ daemonVersion: '0.3.1' });
  });

  it('replaces the previous connection of the same client process', async () => {
    const first = await connect('replace', 1);
    await first.next();
    const second = await connect('replace', 1);
    await second.next();
    expect((await first.closed).code).toBe(4000);
    expect(await daemon('replace').status()).toEqual({
      online: true,
      version: '0.3.1',
      sessionId: 1,
    });
  });

  it('keeps another process with the same client ID and uses the newest', async () => {
    const first = await connect('twice', 1);
    await first.next();
    const second = await connect('twice', 2);
    await second.next();
    expect(first.ws.readyState).toBe(WebSocket.OPEN);
    expect(await daemon('twice').status()).toMatchObject({ sessionId: 2 });

    // Requests go to the newest connection
    const result = daemon('twice').request(DaemonCmd.gameId, USER, {}, 5_000);
    const request = await second.next();
    second.ws.send(JSON.stringify({ id: request.id, cmd: 'game', game: 1 }));
    expect(await result).toMatchObject({ ok: true });

    // The older one takes over when the newest disconnects
    second.ws.close(1000, 'bye');
    await expect
      .poll(() => daemon('twice').status())
      .toMatchObject({ sessionId: 1 });
  });

  it('is offline when no client is connected', async () => {
    expect(await daemon('nobody').status()).toEqual({ online: false });
  });
});

describe('requests', () => {
  it('returns the response of the client', async () => {
    const client = await connect('game');
    await client.next();

    const result = daemon('game').request(DaemonCmd.gameId, USER, {}, 5_000);
    const request = await client.next();
    expect(request).toMatchObject({ cmd: 'game', user: USER });
    client.ws.send(
      JSON.stringify({ id: request.id, cmd: 'game', game: 1306180 }),
    );

    expect(await result).toEqual({
      ok: true,
      value: { id: request.id, cmd: 'game', game: 1306180 },
    });
  });

  it('returns the message for an error code', async () => {
    const client = await connect('error');
    await client.next();

    const result = daemon('error').request(
      DaemonCmd.link,
      USER,
      { game: 1 },
      5_000,
    );
    const request = await client.next();
    expect(request).toMatchObject({ cmd: 'link', game: 1 });
    client.ws.send(
      JSON.stringify({ id: request.id, cmd: 'error', code: 'invite_failed' }),
    );

    expect(await result).toEqual({
      ok: false,
      phrase: 'error.daemon_invite_failed',
    });
  });

  it('rejects a response of the wrong type', async () => {
    const client = await connect('wrong');
    await client.next();

    const result = daemon('wrong').request(
      DaemonCmd.link,
      USER,
      { game: 1 },
      5_000,
    );
    const request = await client.next();
    client.ws.send(JSON.stringify({ id: request.id, cmd: 'game', game: 1 }));

    expect(await result).toEqual({
      ok: false,
      phrase: 'error.invalid_response_type',
    });
  });

  it('times out when the client does not answer', async () => {
    const client = await connect('slow');
    await client.next();
    expect(
      await daemon('slow').request(DaemonCmd.gameId, USER, {}, 100),
    ).toEqual({
      ok: false,
      phrase: 'error.request_timeout',
    });
  });

  it('fails when the client disconnects', async () => {
    const client = await connect('gone');
    await client.next();

    const result = daemon('gone').request(DaemonCmd.gameId, USER, {}, 5_000);
    await client.next();
    client.ws.close(1000, 'bye');

    expect(await result).toEqual({
      ok: false,
      phrase: 'error.daemon_disconnected',
    });
  });
});

describe('fetch', () => {
  it('redirects / to the download page', async () => {
    const response = await SELF.fetch('https://bot.test/', {
      redirect: 'manual',
    });
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe(
      'https://github.com/Kamesuta/remoteplay-inviter/releases/latest',
    );
  });
});
