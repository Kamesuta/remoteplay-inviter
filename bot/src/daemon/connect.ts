import semver from 'semver';
import { ConnectionErrorMessage, DaemonErrorType } from './models.js';

/** Client that asked to connect */
export interface DaemonConnection {
  /** Client ID */
  daemonId: string;
  /** Client version */
  version: string;
  /** Random number chosen each time the client starts */
  sessionId: number;
}

/**
 * Check the query of a connection request (`?v=<version>&token=<id>&session=<number>`)
 * @param url request URL
 * @param requiredVersion oldest client version accepted
 * @param downloadUrl page shown to clients that need an update
 * @returns the client, or the reason for refusing it
 */
export function checkConnection(
  url: URL,
  requiredVersion: string,
  downloadUrl: string,
):
  | { ok: true; connection: DaemonConnection }
  | { ok: false; error: ConnectionErrorMessage } {
  const version = url.searchParams.get('v');
  if (version === null || !semver.valid(version)) {
    return {
      ok: false,
      error: {
        error: DaemonErrorType.invalidVersion,
        message: 'Invalid client version',
      },
    };
  }

  if (!semver.gte(version, requiredVersion)) {
    return {
      ok: false,
      error: {
        error: DaemonErrorType.outdated,
        required: requiredVersion,
        download: downloadUrl,
        message: 'Client version is outdated',
      },
    };
  }

  // UUID length is 36 characters
  const daemonId = url.searchParams.get('token');
  if (daemonId === null || daemonId.length > 36) {
    return {
      ok: false,
      error: {
        error: DaemonErrorType.invalidToken,
        message: 'Invalid client UUID',
      },
    };
  }

  const sessionId = parseInt(url.searchParams.get('session') ?? '');
  if (isNaN(sessionId)) {
    return {
      ok: false,
      error: {
        error: DaemonErrorType.invalidSession,
        message: 'Invalid session ID',
      },
    };
  }

  return { ok: true, connection: { daemonId, version, sessionId } };
}

/**
 * Refuse a connection; the client reads the reason from the X-Error header
 * @param error reason
 * @returns response to the connection request
 */
export function refuseConnection(error: ConnectionErrorMessage): Response {
  return new Response(null, {
    status: 400,
    headers: { 'X-Error': JSON.stringify(error) },
  });
}
