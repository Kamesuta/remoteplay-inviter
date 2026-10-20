import { describe, expect, it } from 'vitest';
import { checkConnection, refuseConnection } from '../src/daemon/connect.js';

const REQUIRED = '0.3.1';
const DOWNLOAD =
  'https://github.com/Kamesuta/remoteplay-inviter/releases/latest';
const check = (query: string): ReturnType<typeof checkConnection> =>
  checkConnection(new URL(`wss://bot.test/ws?${query}`), REQUIRED, DOWNLOAD);

describe('checkConnection', () => {
  it('accepts a valid client', () => {
    expect(check('v=0.3.1&token=abc&session=42')).toEqual({
      ok: true,
      connection: { daemonId: 'abc', version: '0.3.1', sessionId: 42 },
    });
  });

  it('refuses an invalid version', () => {
    expect(check('v=abc&token=abc&session=1')).toMatchObject({
      ok: false,
      error: { error: 'invalid_version' },
    });
  });

  it('asks an outdated client to update', () => {
    expect(check('v=0.3.0&token=abc&session=1')).toEqual({
      ok: false,
      error: {
        error: 'outdated',
        required: REQUIRED,
        download: DOWNLOAD,
        message: 'Client version is outdated',
      },
    });
  });

  it('refuses a missing or too long client ID', () => {
    expect(check('v=0.3.1&session=1')).toMatchObject({
      ok: false,
      error: { error: 'invalid_token' },
    });
    expect(check(`v=0.3.1&token=${'a'.repeat(37)}&session=1`)).toMatchObject({
      ok: false,
      error: { error: 'invalid_token' },
    });
  });

  it('refuses an invalid session', () => {
    expect(check('v=0.3.1&token=abc&session=x')).toMatchObject({
      ok: false,
      error: { error: 'invalid_session' },
    });
  });
});

describe('refuseConnection', () => {
  it('puts the reason in the X-Error header', () => {
    const response = refuseConnection({
      error: 'invalid_token' as never,
      message: 'Invalid client UUID',
    });
    expect(response.status).toBe(400);
    expect(JSON.parse(response.headers.get('X-Error')!)).toEqual({
      error: 'invalid_token',
      message: 'Invalid client UUID',
    });
  });
});
