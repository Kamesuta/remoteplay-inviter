import { env, SELF } from 'cloudflare:test';
import {
  APIActionRowComponent,
  APIButtonComponent,
  APIComponentInContainer,
  APIContainerComponent,
  APIInteraction,
  APIInteractionResponseChannelMessageWithSource,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonStyle,
  ComponentType,
  InteractionResponseType,
  InteractionType,
  APIMediaGalleryComponent,
  APISectionComponent,
  APITextDisplayComponent,
  MessageFlags,
  RESTPatchAPIWebhookWithTokenMessageJSONBody,
} from 'discord-api-types/v10';
import { describe, expect, it } from 'vitest';
import { handleInteraction } from '../src/commands/index.js';
import { inviteButton } from '../src/commands/inviteButton.js';
import { DaemonHandle, Services } from '../src/commands/services.js';
import { DaemonStatus } from '../src/daemon/DaemonObject.js';
import { DaemonResult } from '../src/daemon/models.js';
import { i18n } from '../src/i18n/index.js';
import { GameInfo } from '../src/steam.js';

const HOST = {
  id: '100',
  username: 'host',
  global_name: 'Host',
  avatar: null,
  discriminator: '0',
};
const GUEST = {
  id: '200',
  username: 'guest',
  global_name: null,
  avatar: null,
  discriminator: '0',
};

/** Fake services that record what the handlers do */
function fake(options: {
  daemonId?: string;
  status?: DaemonStatus;
  responses?: Record<string, DaemonResult<unknown>>;
  game?: GameInfo;
  /** User the client `client` is already linked to */
  linkedTo?: string;
}): Services & { calls: unknown[][]; done(): Promise<void> } {
  const calls: unknown[][] = [];
  const pending: Promise<unknown>[] = [];
  const handle: DaemonHandle = {
    status: () => Promise.resolve(options.status ?? { online: false }),
    request: (cmd, user, data) => {
      calls.push(['request', cmd, user, data]);
      return Promise.resolve(
        (options.responses?.[cmd] ?? {
          ok: false,
          phrase: 'error.request_timeout',
        }) as never,
      );
    },
    sendMessage: (text) => {
      calls.push(['sendMessage', text]);
      return Promise.resolve(true);
    },
  };
  return {
    calls,
    done: async () => {
      await Promise.all(pending);
    },
    users: {
      findByDaemonId: (daemonId) =>
        Promise.resolve(
          options.linkedTo && daemonId === 'client'
            ? {
                userId: options.linkedTo,
                name: 'other',
                locale: 'en',
                daemonId,
              }
            : undefined,
        ),
      findDaemonId: (userId) =>
        Promise.resolve(userId === HOST.id ? options.daemonId : undefined),
      link: (...args) => {
        calls.push(['link', ...args]);
        return Promise.resolve();
      },
    },
    daemon: () => handle,
    discord: {
      editOriginal: (token, body) => {
        calls.push(['editOriginal', token, body]);
        return Promise.resolve();
      },
      deleteOriginal: (token) => {
        calls.push(['deleteOriginal', token]);
        return Promise.resolve();
      },
      followUp: (token, body) => {
        calls.push(['followUp', token, body]);
        return Promise.resolve();
      },
    },
    gameInfo: () => Promise.resolve(options.game),
    waitUntil: (promise) => pending.push(promise),
    downloadUrl:
      'https://github.com/Kamesuta/remoteplay-inviter/releases/latest',
  };
}

/** `/steam <subcommand>` from the host */
function command(
  subcommand: string,
  options: { name: string; type: number; value: unknown }[] = [],
): APIInteraction {
  return {
    type: InteractionType.ApplicationCommand,
    token: 'token',
    locale: 'en-US',
    member: { user: HOST, nick: 'Host nick' },
    data: {
      type: ApplicationCommandType.ChatInput,
      name: 'steam',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: subcommand,
          options,
        },
      ],
    },
  } as unknown as APIInteraction;
}

/** Invite button clicked by a guest */
function click(session: string): APIInteraction {
  const button = inviteButton(
    { user: HOST.id, game: '1306180', session },
    'en-US',
  );
  return {
    type: InteractionType.MessageComponent,
    token: 'token',
    locale: 'ja',
    user: GUEST,
    data: { component_type: ComponentType.Button, custom_id: button.custom_id },
  } as unknown as APIInteraction;
}

/** Message body sent with editOriginal */
type Body = RESTPatchAPIWebhookWithTokenMessageJSONBody;

/**
 * Components inside the container of a V2 message
 * @param body message body
 * @returns components of the only container
 */
function containerOf(body: Body): APIComponentInContainer[] {
  const [container] = (body.components ?? []) as APIContainerComponent[];
  expect(container?.type).toBe(ComponentType.Container);
  return container!.components;
}

const RPT_GAME: GameInfo = {
  name: 'Retrocycles',
  headerImage: 'https://img/x.jpg',
  supportsRemotePlayTogether: true,
};
const ONLINE: DaemonStatus = { online: true, version: '0.3.1', sessionId: 7 };

describe('/steam invite', () => {
  it('asks to link first', async () => {
    const response = await handleInteraction(command('invite'), fake({}));
    expect(response).toEqual({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: i18n.t('en', 'invite_command.error.daemon_not_linked'),
        flags: MessageFlags.Ephemeral,
      },
    });
  });

  it('reports an offline client', async () => {
    const response = (await handleInteraction(
      command('invite'),
      fake({ daemonId: 'd' }),
    )) as APIInteractionResponseChannelMessageWithSource;
    expect(response.data.content).toBe(
      i18n.t('en', 'invite_command.error.daemon_offline'),
    );
  });

  it('posts an invite panel for the running game', async () => {
    const services = fake({
      daemonId: 'd',
      status: ONLINE,
      responses: {
        game: { ok: true, value: { id: 'x', cmd: 'game', game: 1306180 } },
      },
      game: RPT_GAME,
    });
    expect(await handleInteraction(command('invite'), services)).toEqual({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
    });
    await services.done();

    expect(services.calls[0]).toEqual([
      'request',
      'game',
      { id: HOST.id, name: HOST.username },
      {},
    ]);
    const [name, token, body] = services.calls[1] as [string, string, Body];
    expect([name, token]).toEqual(['editOriginal', 'token']);
    expect(body.flags).toBe(MessageFlags.IsComponentsV2);
    expect(body.content).toBeUndefined();
    expect(body.embeds).toBeUndefined();
    expect(body.allowed_mentions).toEqual({ parse: [] });

    const [header, gallery, , , row] = containerOf(body) as [
      APISectionComponent,
      APIMediaGalleryComponent,
      unknown,
      unknown,
      APIActionRowComponent<APIButtonComponent>,
    ];
    expect(header.components[0]!.content).toBe(
      "## Let's play Retrocycles together for free!\n**Host nick** is looking for players",
    );
    expect(header.accessory).toMatchObject({
      type: ComponentType.Thumbnail,
      media: { url: 'https://cdn.discordapp.com/embed/avatars/0.png' },
    });
    expect(gallery.items[0]!.media.url).toBe('https://img/x.jpg');
    expect(row.components[0]).toMatchObject({
      custom_id: '_=create_invite&_t=2&user=100&game=1306180&session=7',
    });
    expect(row.components[1]).toMatchObject({
      style: ButtonStyle.Link,
      url: 'https://store.steampowered.com/app/1306180?l=english',
    });
  });

  it('shows names as they are', async () => {
    const services = fake({
      daemonId: 'd',
      status: ONLINE,
      game: { ...RPT_GAME, name: 'Tom_&_Jerry*' },
    });
    const interaction = command('invite', [
      {
        name: 'game_id',
        type: ApplicationCommandOptionType.Number,
        value: 1306180,
      },
    ]) as unknown as { member: { nick: string } };
    interaction.member.nick = '**bold** <@1>';
    await handleInteraction(interaction as unknown as APIInteraction, services);
    await services.done();
    const [header] = containerOf(services.calls[0]![2] as Body) as [
      APISectionComponent,
    ];
    expect(header.components[0]!.content).toBe(
      "## Let's play Tom\\_&\\_Jerry\\* together for free!\n**\\*\\*bold\\*\\* \\<@1\\>** is looking for players",
    );
  });

  it('uses the game ID option without asking the client', async () => {
    const services = fake({ daemonId: 'd', status: ONLINE, game: RPT_GAME });
    await handleInteraction(
      command('invite', [
        {
          name: 'game_id',
          type: ApplicationCommandOptionType.Number,
          value: 1306180,
        },
      ]),
      services,
    );
    await services.done();
    expect(services.calls.map((call) => call[0])).toEqual(['editOriginal']);
  });

  it('tells privately that the game does not support Remote Play Together', async () => {
    const services = fake({
      daemonId: 'd',
      status: ONLINE,
      responses: {
        game: { ok: true, value: { id: 'x', cmd: 'game', game: 1318690 } },
      },
      game: { ...RPT_GAME, supportsRemotePlayTogether: false },
    });
    await handleInteraction(command('invite'), services);
    await services.done();
    expect(services.calls.slice(1)).toEqual([
      ['deleteOriginal', 'token'],
      [
        'followUp',
        'token',
        {
          content: i18n.t('en', 'invite_command.error.game_not_supported'),
          flags: MessageFlags.Ephemeral,
        },
      ],
    ]);
  });

  it('shows the error from the client', async () => {
    const services = fake({
      daemonId: 'd',
      status: ONLINE,
      responses: { game: { ok: false, phrase: 'error.daemon_invalid_app' } },
    });
    await handleInteraction(command('invite'), services);
    await services.done();
    expect(services.calls.at(-1)).toEqual([
      'followUp',
      'token',
      {
        content: i18n.t('en', 'error.daemon_invalid_app'),
        flags: MessageFlags.Ephemeral,
      },
    ]);
  });
});

describe('/steam invite errors', () => {
  it('still tells the error when deleting the reply fails', async () => {
    const services = fake({
      daemonId: 'd',
      status: ONLINE,
      responses: { game: { ok: false, phrase: 'error.daemon_invalid_app' } },
    });
    services.discord.deleteOriginal = () =>
      Promise.reject(new Error('404 Unknown Message'));
    await handleInteraction(command('invite'), services);
    await services.done();
    expect(services.calls.at(-1)).toEqual([
      'followUp',
      'token',
      {
        content: i18n.t('en', 'error.daemon_invalid_app'),
        flags: MessageFlags.Ephemeral,
      },
    ]);
  });
});

describe('invite button', () => {
  it('refuses a panel from an earlier session', async () => {
    const response = (await handleInteraction(
      click('6'),
      fake({ daemonId: 'd', status: ONLINE }),
    )) as APIInteractionResponseChannelMessageWithSource;
    expect(response.data.content).toBe(
      i18n.t('ja', 'invite_button.error.invalid_session'),
    );
  });

  it('sends the invite link to the guest', async () => {
    const services = fake({
      daemonId: 'd',
      status: ONLINE,
      responses: {
        link: {
          ok: true,
          value: { id: 'x', cmd: 'link', url: 'https://s.team/p/abc' },
        },
      },
    });
    expect(await handleInteraction(click('7'), services)).toEqual({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: { flags: MessageFlags.Ephemeral },
    });
    await services.done();

    expect(services.calls[0]).toEqual([
      'request',
      'link',
      { id: GUEST.id, name: GUEST.username },
      { game: 1306180 },
    ]);
    const body = services.calls[1]![2] as Body;
    // Ephemeral comes from the deferred response; the edit only switches to V2
    expect(body.flags).toBe(MessageFlags.IsComponentsV2);
    expect(body.content).toBeUndefined();

    const components = containerOf(body);
    // The join button comes first
    const [, joinRow, otherDevice] = components as [
      unknown,
      APIActionRowComponent<APIButtonComponent>,
      APITextDisplayComponent,
    ];
    expect(joinRow.components[0]).toMatchObject({
      style: ButtonStyle.Link,
      url: 'https://s.team/p/abc',
    });
    expect(otherDevice.content).toContain('`https://s.team/p/abc`');

    // The guest's language (ja), not the host's
    const galleries = components.flatMap((c) =>
      c.type === ComponentType.MediaGallery
        ? c.items.map((item) => item.media.url)
        : [],
    );
    expect(galleries).toEqual([
      'https://steaminviter.app/assets/discord/ja/join-phone-v1.gif',
      'https://steaminviter.app/assets/discord/ja/join-pc-v1.gif',
    ]);
    const text = components
      .flatMap((c) => (c.type === ComponentType.TextDisplay ? [c.content] : []))
      .join('\n');
    expect(text).toContain('https://steaminviter.app/ja/guide/x360ce');
    const urls = components.flatMap((c) =>
      c.type === ComponentType.ActionRow
        ? c.components.map((b) => ('url' in b ? b.url : undefined))
        : [],
    );
    expect(urls).toEqual([
      'https://s.team/p/abc',
      'https://apps.apple.com/app/steam-link/id1246969117',
      'https://play.google.com/store/apps/details?id=com.valvesoftware.steamlink',
    ]);
  });

  it('tells the error from the client as text', async () => {
    const services = fake({
      daemonId: 'd',
      status: ONLINE,
      responses: { link: { ok: false, phrase: 'error.daemon_invite_failed' } },
    });
    await handleInteraction(click('7'), services);
    await services.done();
    expect(services.calls.at(-1)).toEqual([
      'editOriginal',
      'token',
      { content: i18n.t('ja', 'error.daemon_invite_failed') },
    ]);
  });

  it('falls back to a text reply when Discord refuses the message', async () => {
    const services = fake({
      daemonId: 'd',
      status: ONLINE,
      responses: {
        link: {
          ok: true,
          value: { id: 'x', cmd: 'link', url: 'https://s.team/p/abc' },
        },
      },
    });
    const edit = services.discord.editOriginal;
    services.discord.editOriginal = (token, body) =>
      body.flags
        ? Promise.reject(new Error('400 Invalid Form Body'))
        : edit(token, body);
    await handleInteraction(click('7'), services);
    await services.done();
    expect(services.calls.at(-1)).toEqual([
      'editOriginal',
      'token',
      { content: i18n.t('ja', 'error.internal') },
    ]);
  });
});

describe('/steam setup', () => {
  it('links the user to a running client', async () => {
    const services = fake({ status: ONLINE });
    const response = (await handleInteraction(
      command('setup', [
        {
          name: 'client_id',
          type: ApplicationCommandOptionType.String,
          value: 'client',
        },
      ]),
      services,
    )) as APIInteractionResponseChannelMessageWithSource;
    expect(response.data.content).toBe(
      i18n.t('en', 'setup_command.setup_message'),
    );
    expect(services.calls[0]).toEqual([
      'link',
      { id: HOST.id, name: HOST.username },
      'client',
      'en-US',
      '0.3.1',
    ]);
    expect(services.calls[1]![0]).toBe('sendMessage');
  });

  it('refuses a client linked to another user', async () => {
    const services = fake({ status: ONLINE, linkedTo: '999' });
    const response = (await handleInteraction(
      command('setup', [
        {
          name: 'client_id',
          type: ApplicationCommandOptionType.String,
          value: 'client',
        },
      ]),
      services,
    )) as APIInteractionResponseChannelMessageWithSource;
    expect(response.data.content).toBe(
      i18n.t('en', 'setup_command.error.already_linked'),
    );
    expect(services.calls).toEqual([]);
  });

  it('relinks a client already linked to the same user', async () => {
    const services = fake({ status: ONLINE, linkedTo: HOST.id });
    await handleInteraction(
      command('setup', [
        {
          name: 'client_id',
          type: ApplicationCommandOptionType.String,
          value: 'client',
        },
      ]),
      services,
    );
    expect(services.calls[0]![0]).toBe('link');
  });

  it('links to the download page when the client is offline', async () => {
    const response = (await handleInteraction(
      command('setup', [
        {
          name: 'client_id',
          type: ApplicationCommandOptionType.String,
          value: 'client',
        },
      ]),
      fake({}),
    )) as APIInteractionResponseChannelMessageWithSource;
    expect(response.data.content).toContain(
      'https://github.com/Kamesuta/remoteplay-inviter/releases/latest',
    );
  });
});

describe('interaction endpoint', () => {
  /**
   * Send an interaction signed with the test key
   * @param body request body
   * @param valid whether to sign it correctly
   * @returns response
   */
  async function post(body: string, valid = true): Promise<Response> {
    const key = await crypto.subtle.importKey(
      'pkcs8',
      Uint8Array.from(atob(env.TEST_SIGNING_KEY), (c) => c.charCodeAt(0)),
      { name: 'Ed25519' },
      false,
      ['sign'],
    );
    const timestamp = `${Math.floor(Date.now() / 1000)}`;
    const signature = new Uint8Array(
      await crypto.subtle.sign(
        { name: 'Ed25519' },
        key,
        new TextEncoder().encode(timestamp + (valid ? body : 'x')),
      ),
    );
    return SELF.fetch('https://bot.test/interactions', {
      method: 'POST',
      headers: {
        'X-Signature-Ed25519': [...signature]
          .map((b) => b.toString(16).padStart(2, '0'))
          .join(''),
        'X-Signature-Timestamp': timestamp,
      },
      body,
    });
  }

  it('answers a ping', async () => {
    const response = await post(JSON.stringify({ type: InteractionType.Ping }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      type: InteractionResponseType.Pong,
    });
  });

  it('rejects a bad signature', async () => {
    expect(
      (await post(JSON.stringify({ type: InteractionType.Ping }), false))
        .status,
    ).toBe(401);
  });
});
