import { ClientMessage, DaemonCmd } from './daemon/models.js';

/** Messages for the error codes the client sends */
const CLIENT_ERROR_PHRASES: Record<string, string> = {
  unknown: 'error.daemon_unknown',
  invalid_cmd: 'error.daemon_invalid_cmd',
  invalid_app: 'error.daemon_invalid_app',
  unsupported_app: 'error.daemon_game_not_supported',
  invite_failed: 'error.daemon_invite_failed',
};

/**
 * Message key for an error code from the client
 * @param code error code
 * @returns message key (unknown codes give the generic message)
 */
export function clientErrorPhrase(code: unknown): string {
  if (typeof code !== 'string') return 'error.invalid_response_message';
  return Object.hasOwn(CLIENT_ERROR_PHRASES, code)
    ? CLIENT_ERROR_PHRASES[code]!
    : 'error.daemon_unknown';
}

/**
 * Parse a message from the client
 * @param text received text
 * @returns the message, or the key of the message explaining why it is invalid
 */
export function parseClientMessage(
  text: string,
):
  | { ok: true; message: ClientMessage }
  | { ok: false; id?: string; phrase: string } {
  let message: unknown;
  try {
    message = JSON.parse(text);
  } catch {
    return { ok: false, phrase: 'error.invalid_response_json' };
  }
  if (typeof message !== 'object' || message === null) {
    return { ok: false, phrase: 'error.invalid_response_json' };
  }

  const { id, cmd } = message as Record<string, unknown>;
  if (typeof id !== 'string') {
    return { ok: false, phrase: 'error.invalid_response_message' };
  }
  const fields = message as Record<string, unknown>;
  switch (cmd) {
    case DaemonCmd.gameId:
      return typeof fields.game === 'number'
        ? { ok: true, message: message as ClientMessage }
        : { ok: false, id, phrase: 'error.invalid_response_message' };
    case DaemonCmd.link:
      return typeof fields.url === 'string'
        ? { ok: true, message: message as ClientMessage }
        : { ok: false, id, phrase: 'error.invalid_response_message' };
    case DaemonCmd.error:
      return { ok: true, message: message as ClientMessage };
    default:
      return { ok: false, id, phrase: 'error.invalid_response_type' };
  }
}
