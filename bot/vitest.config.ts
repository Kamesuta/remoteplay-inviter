import { generateKeyPairSync } from 'node:crypto';
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig(async () => {
  // Key pair standing in for Discord's signing key
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');
  const publicKeyHex = publicKey
    .export({ format: 'der', type: 'spki' })
    .subarray(-32)
    .toString('hex');
  const privateKeyBase64 = privateKey
    .export({ format: 'der', type: 'pkcs8' })
    .toString('base64');

  return {
    plugins: [
      cloudflareTest({
        wrangler: { configPath: './wrangler.toml' },
        miniflare: {
          bindings: {
            DISCORD_TOKEN: 'test-token',
            DISCORD_PUBLIC_KEY: publicKeyHex,
            TEST_SIGNING_KEY: privateKeyBase64,
            TEST_MIGRATIONS: await readD1Migrations('./migrations'),
          },
        },
      }),
    ],
    test: {
      setupFiles: ['./test/setup.ts'],
      deps: {
        // discord-api-types is CommonJS behind an ESM wrapper; bundle it for the test runtime
        optimizer: {
          ssr: { enabled: true, include: ['discord-api-types/v10'] },
        },
      },
    },
  };
});
