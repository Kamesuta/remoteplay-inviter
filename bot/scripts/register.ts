// Register the global commands: DISCORD_TOKEN=<bot token> npm run register
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { DiscordApi } from '../src/discord/api.js';
import { buildCommands } from '../src/discord/commands.js';
import { Dictionary, Translator } from '../src/i18n/translator.js';

const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error('Set DISCORD_TOKEN to the bot token');

// The application ID is read from wrangler.toml
const config = readFileSync(
  new URL('../wrangler.toml', import.meta.url),
  'utf8',
);
const applicationId = /^DISCORD_APPLICATION_ID\s*=\s*"(\d+)"/m.exec(
  config,
)?.[1];
if (!applicationId)
  throw new Error('DISCORD_APPLICATION_ID is missing in wrangler.toml');

const load = (language: string): Dictionary =>
  parse(
    readFileSync(
      new URL(`../locales/${language}.yml`, import.meta.url),
      'utf8',
    ),
  ) as Dictionary;
const i18n = new Translator({ en: load('en'), ja: load('ja') });

await new DiscordApi({ applicationId, token }).putCommands(buildCommands(i18n));
console.log('Registered the commands');
