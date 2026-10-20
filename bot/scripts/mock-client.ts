// Mock client: connects to the bot like the real client and answers its requests
// with fixed values, so the Discord side can be tried without Steam.
//
//   npm run mock -- --config <remoteplay-inviter.config.toml> [options]
//
//   --config <file>      config file of a client (its client ID is used, and never printed)
//   --endpoint <url>     bot to connect to (default ws://localhost:8787)
//   --game <appid>       game answered to `game` (default 728880, Overcooked! 2)
//   --link <url>         link answered to `link` (default a dummy s.team link)
//   --fail-game <code>   answer `game` with an error code instead
//   --fail-link <code>   answer `link` with an error code instead
//                        (invalid_app, unsupported_app, invite_failed, unknown)
//   --delay <ms>         wait before answering (default 300)
//   --version <semver>   client version sent to the bot (default 0.3.1)
//
// The session is random; set MOCK_SESSION to keep panels posted by an earlier run working.
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { DaemonCmd, ServerMessage } from '../src/daemon/models.js';

const { values: options } = parseArgs({
  options: {
    config: { type: 'string' },
    endpoint: { type: 'string', default: 'ws://localhost:8787' },
    game: { type: 'string', default: '728880' },
    link: { type: 'string' },
    'fail-game': { type: 'string' },
    'fail-link': { type: 'string' },
    delay: { type: 'string', default: '300' },
    version: { type: 'string', default: '0.3.1' },
  },
});
if (!options.config)
  throw new Error('Pass --config <remoteplay-inviter.config.toml>');

const clientId = /^\s*uuid\s*=\s*"([^"]+)"/m.exec(
  readFileSync(options.config, 'utf8'),
)?.[1];
if (!clientId) throw new Error(`No uuid in ${options.config}`);

const session =
  Number(process.env.MOCK_SESSION) || Math.floor(Math.random() * 2 ** 31);
const url = `${options.endpoint}/ws?${new URLSearchParams({
  v: options.version,
  token: clientId,
  session: `${session}`,
})}`;

const log = (...args: unknown[]): void => {
  console.log(new Date().toISOString().slice(11, 19), ...args);
};

let ws: WebSocket;
let stopping = false;

const send = (message: object): void => {
  setTimeout(() => {
    ws.send(JSON.stringify(message));
    log('→', JSON.stringify(message));
  }, Number(options.delay));
};

const answer = (message: ServerMessage): void => {
  switch (message.cmd) {
    case DaemonCmd.gameId:
      send(
        options['fail-game']
          ? { id: message.id, cmd: DaemonCmd.error, code: options['fail-game'] }
          : {
              id: message.id,
              cmd: DaemonCmd.gameId,
              game: Number(options.game),
            },
      );
      break;
    case DaemonCmd.link:
      send(
        options['fail-link']
          ? { id: message.id, cmd: DaemonCmd.error, code: options['fail-link'] }
          : {
              id: message.id,
              cmd: DaemonCmd.link,
              url:
                options.link ??
                `https://s.team/p/MOCK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
            },
      );
      break;
    case DaemonCmd.exit:
      log('The bot asked the client to exit');
      stopping = true;
      ws.close();
      break;
    case DaemonCmd.message:
      break;
  }
};

const connect = (): void => {
  ws = new WebSocket(url);
  ws.addEventListener('open', () => log(`Connected (session ${session})`));
  ws.addEventListener('message', (event) => {
    const text = String(event.data);
    log('←', text);
    answer(JSON.parse(text) as ServerMessage);
  });
  ws.addEventListener('error', () => log('Connection error'));
  ws.addEventListener('close', (event) => {
    log(`Closed ${event.code} ${event.reason}`);
    if (stopping) process.exit(0);
    // The mock sends no pings, so an idle connection is dropped; reconnect with the same
    // session, as the real client does, so the posted panels keep working
    setTimeout(connect, 2000);
  });
};
connect();

const stop = (): void => {
  stopping = true;
  ws.close(1000, 'Mock stopped');
  setTimeout(() => process.exit(0), 1000);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
