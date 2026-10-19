import { checkConnection, refuseConnection } from './daemon/connect.js';

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
 * Route a request to the Worker
 * @param request request
 * @param env bindings
 * @returns response
 */
async function route(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (request.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
    return connectDaemon(request, env);
  }
  if (request.method === 'GET' && url.pathname === '/') {
    return Response.redirect(env.DAEMON_DOWNLOAD_URL, 302);
  }
  return new Response('Not Found', { status: 404 });
}

export default {
  /** Client connections and the download redirect */
  fetch: route,
} satisfies ExportedHandler<Env>;
