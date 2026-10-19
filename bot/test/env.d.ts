import type { D1Migration } from 'cloudflare:test';

declare global {
  namespace Cloudflare {
    interface Env {
      /** PKCS#8 private key (base64) matching DISCORD_PUBLIC_KEY */
      TEST_SIGNING_KEY: string;
      /** Migrations applied before each test file */
      TEST_MIGRATIONS: D1Migration[];
    }
  }
}
