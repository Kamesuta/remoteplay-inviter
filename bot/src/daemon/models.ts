// Messages exchanged with the client over WebSocket (see client/src/models.rs)

/** Reasons for refusing a connection, sent in the X-Error header */
export enum DaemonErrorType {
  invalidVersion = 'invalid_version',
  outdated = 'outdated',
  invalidToken = 'invalid_token',
  invalidSession = 'invalid_session',
}

/** Body of the X-Error header */
export type ConnectionErrorMessage =
  | {
      error: Exclude<DaemonErrorType, DaemonErrorType.outdated>;
      message?: string;
    }
  | {
      error: DaemonErrorType.outdated;
      required: string;
      download: string;
      message?: string;
    };

/** Message types */
export enum DaemonCmd {
  message = 'message',
  gameId = 'game',
  link = 'link',
  exit = 'exit',
  error = 'error',
}

/** Discord user a request is made for */
export interface DaemonUser {
  /** Discord user ID */
  id: string;
  /** Discord user name (the client maps it to a guest) */
  name: string;
}

/** Messages sent to the client */
export type ServerMessage =
  | { id: string; cmd: DaemonCmd.message; text: string; copy?: string }
  | { id: string; user: DaemonUser; cmd: DaemonCmd.gameId }
  | { id: string; user: DaemonUser; cmd: DaemonCmd.link; game: number }
  | { id: string; cmd: DaemonCmd.exit };

/** Response to `game`: the running game */
export interface ClientMessageGameId {
  /** ID of the request */
  id: string;
  /** Message type */
  cmd: DaemonCmd.gameId;
  /** Steam AppID */
  game: number;
}

/** Response to `link`: the invite link */
export interface ClientMessageLink {
  /** ID of the request */
  id: string;
  /** Message type */
  cmd: DaemonCmd.link;
  /** Invite link */
  url: string;
}

/** Error response */
export interface ClientMessageError {
  /** ID of the request */
  id: string;
  /** Message type */
  cmd: DaemonCmd.error;
  /** Error code */
  code: string;
}

/** Messages received from the client */
export type ClientMessage =
  ClientMessageGameId | ClientMessageLink | ClientMessageError;

/** Requests and their responses */
export interface DaemonRequests {
  /** Ask for the running game */
  [DaemonCmd.gameId]: {
    request: Record<string, never>;
    response: ClientMessageGameId;
  };
  /** Ask for an invite link to a game */
  [DaemonCmd.link]: { request: { game: number }; response: ClientMessageLink };
}

/** Request types */
export type DaemonRequestCmd = keyof DaemonRequests;

/** Result of a request: the response, or the key of the message explaining the failure */
export type DaemonResult<T> =
  { ok: true; value: T } | { ok: false; phrase: string };
