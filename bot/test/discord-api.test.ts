import { afterEach, describe, expect, it, vi } from 'vitest';
import { DiscordApi } from '../src/discord/api.js';

describe('DiscordApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls the global fetch by default', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }));
    await new DiscordApi({ applicationId: '1' }).deleteOriginal('token');
    expect(spy).toHaveBeenCalledWith(
      'https://discord.com/api/v10/webhooks/1/token/messages/@original',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('reports a failed call without the interaction token', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('nope', { status: 404 }),
    );
    await expect(
      new DiscordApi({ applicationId: '1' }).editOriginal('secret', {
        content: 'x',
      }),
    ).rejects.toThrow(
      '/webhooks/1/<token>/messages/@original failed: 404 nope',
    );
  });
});
