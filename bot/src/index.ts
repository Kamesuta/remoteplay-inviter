import { APIInteraction } from 'discord-api-types/v10';
import { handleInteraction } from './commands/index.js';
import { Services } from './commands/services.js';
import { checkConnection, refuseConnection } from './daemon/connect.js';
import { DiscordApi } from './discord/api.js';
import { verifyInteraction } from './discord/verify.js';
import { logStatistics } from './statistics.js';
import { fetchGameInfo } from './steam.js';
import { UserStore } from './users.js';

export { DaemonObject } from './daemon/DaemonObject.js';

/**
 * Connect a client to its Durable Object
 * @param request WebSocket upgrade request
 * @param env bindings
 * @returns 101 response, or 400 with the reason in X-Error
 */
async function connectDaemon(request: Request, env: Env): Promise<Response> {
  const result = checkConnection(
    new URL(request.url),
    env.DAEMON_REQUIRED_VERSION,
    env.DAEMON_DOWNLOAD_URL,
  );
  if (!result.ok) return refuseConnection(result.error);

  const { connection } = result;
  const stub = env.DAEMON.get(env.DAEMON.idFromName(connection.daemonId));
  const forwarded = new Request(request);
  forwarded.headers.set('X-Daemon-Connection', JSON.stringify(connection));
  return stub.fetch(forwarded);
}

/**
 * Services backed by the bindings
 * @param env bindings
 * @param ctx execution context
 * @returns services
 */
function services(env: Env, ctx: ExecutionContext): Services {
  return {
    users: new UserStore(env.DB),
    daemon: (daemonId) => env.DAEMON.get(env.DAEMON.idFromName(daemonId)),
    discord: new DiscordApi({ applicationId: env.DISCORD_APPLICATION_ID }),
    gameInfo: (gameId, language) => fetchGameInfo(gameId, language),
    waitUntil: (promise) => ctx.waitUntil(promise),
    downloadUrl: env.DAEMON_DOWNLOAD_URL,
  };
}

/**
 * Handle an interaction request from Discord
 * @param request interaction request
 * @param env bindings
 * @param ctx execution context
 * @returns interaction response
 */
async function interactions(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const body = await verifyInteraction(request, env.DISCORD_PUBLIC_KEY);
  if (body === undefined)
    return new Response('Bad request signature', { status: 401 });

  const interaction = JSON.parse(body) as APIInteraction;
  return Response.json(
    await handleInteraction(interaction, services(env, ctx)),
  );
}

/**
 * Route a request to the Worker
 * @param request request
 * @param env bindings
 * @param ctx execution context
 * @returns response
 */
async function route(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  if (request.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
    return connectDaemon(request, env);
  }
  if (request.method === 'POST' && url.pathname === '/interactions') {
    return interactions(request, env, ctx);
  }
  if (request.method === 'GET' && url.pathname === '/') {
    return Response.redirect(env.DAEMON_DOWNLOAD_URL, 302);
  }
  return new Response('Not Found', { status: 404 });
}

/**
 * Hourly job: log usage statistics
 * @param _controller cron trigger
 * @param env bindings
 */
async function hourly(
  _controller: ScheduledController,
  env: Env,
): Promise<void> {
  const discord = new DiscordApi({
    applicationId: env.DISCORD_APPLICATION_ID,
    token: env.DISCORD_TOKEN,
  });
  await logStatistics(discord, new UserStore(env.DB));
}

export default {
  /** Client connections, Discord interactions and the download redirect */
  fetch: route,
  /** Cron trigger */
  scheduled: hourly,
} satisfies ExportedHandler<Env>;
