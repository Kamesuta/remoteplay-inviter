import { DurableObject } from 'cloudflare:workers';
import { clientErrorPhrase, parseClientMessage } from '../errors.js';
import { i18n } from '../i18n/index.js';
import { UserStore } from '../users.js';
import { DaemonConnection } from './connect.js';
import {
  DaemonCmd,
  DaemonRequestCmd,
  DaemonRequests,
  DaemonResult,
  DaemonUser,
  ServerMessage,
} from './models.js';

/** State of a client */
export interface DaemonStatus {
  /** Whether the client is connected */
  online: boolean;
  /** Client version */
  version?: string;
  /** Random number chosen each time the client starts */
  sessionId?: number;
}

/** State kept with each connection (survives hibernation) */
interface ConnectionAttachment extends DaemonConnection {
  /** When the connection was accepted (ms) */
  connectedAt: number;
}

/** Request waiting for a response */
interface PendingRequest {
  /** Connection the request was sent on */
  ws: WebSocket;
  /** Request type */
  cmd: DaemonRequestCmd;
  /** Settle the request */
  settle: (result: DaemonResult<unknown>) => void;
}

/** Close code sent to a connection replaced by a newer one */
const CLOSE_REPLACED = 4000;

/**
 * One client and its WebSocket connection.
 *
 * The connection uses the WebSocket Hibernation API, so the object is not kept in memory
 * while the client is idle. The client sends pings, which the runtime answers by itself.
 */
export class DaemonObject extends DurableObject<Env> {
  /** Requests waiting for a response (only while a request is in progress) */
  private _requests = new Map<string, PendingRequest>();

  /**
   * Accept a connection (already checked by the Worker)
   * @param request WebSocket upgrade request
   * @returns 101 response
   */
  override async fetch(request: Request): Promise<Response> {
    const connection = JSON.parse(
      request.headers.get('X-Daemon-Connection') ?? '{}',
    ) as DaemonConnection;

    // A reconnect from the same client process replaces its old connection.
    // Another process with the same client ID (e.g. started twice) keeps its connection and the
    // newest one is used: closing it would make the processes keep reconnecting to each other.
    for (const ws of this.ctx.getWebSockets()) {
      const attachment =
        ws.deserializeAttachment() as ConnectionAttachment | null;
      if (attachment?.sessionId !== connection.sessionId) continue;
      this._settleRequests(ws, 'error.daemon_disconnected');
      try {
        ws.close(CLOSE_REPLACED, 'Replaced by a new connection');
      } catch {
        // Already closed
      }
    }

    const pair = new WebSocketPair();
    const [client, server] = [pair[0], pair[1]];
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({
      ...connection,
      connectedAt: Date.now(),
    } satisfies ConnectionAttachment);

    await this._greet(server, connection).catch((err: unknown) => {
      console.error(`Failed to greet client ${connection.daemonId}`, err);
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  /**
   * State of the client
   * @returns whether it is connected, and its session
   */
  status(): DaemonStatus {
    const ws = this._socket();
    if (!ws) return { online: false };
    const { version, sessionId } =
      ws.deserializeAttachment() as DaemonConnection;
    return { online: true, version, sessionId };
  }

  /**
   * Send a request and wait for the response
   * @param cmd request type
   * @param user Discord user the request is made for
   * @param data request fields
   * @param timeoutMs how long to wait
   * @returns the response, or the key of the message explaining the failure
   */
  async request<Cmd extends DaemonRequestCmd>(
    cmd: Cmd,
    user: DaemonUser,
    data: DaemonRequests[Cmd]['request'],
    timeoutMs: number,
  ): Promise<DaemonResult<DaemonRequests[Cmd]['response']>> {
    const ws = this._socket();
    if (!ws) return { ok: false, phrase: 'error.daemon_disconnected' };

    const id = crypto.randomUUID();
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this._requests.delete(id);
        resolve({ ok: false, phrase: 'error.request_timeout' });
      }, timeoutMs);
      this._requests.set(id, {
        ws,
        cmd,
        settle: (result) => {
          clearTimeout(timer);
          this._requests.delete(id);
          resolve(result as DaemonResult<DaemonRequests[Cmd]['response']>);
        },
      });

      try {
        ws.send(JSON.stringify({ id, user, cmd, ...data }));
      } catch {
        this._requests
          .get(id)
          ?.settle({ ok: false, phrase: 'error.send_request_failed' });
      }
    });
  }

  /**
   * Show a message on the client
   * @param text message
   * @param copy text to copy to the clipboard
   * @returns whether the message was sent
   */
  sendMessage(text: string, copy?: string): boolean {
    const ws = this._socket();
    if (!ws) return false;
    return this._send(ws, {
      id: crypto.randomUUID(),
      cmd: DaemonCmd.message,
      text,
      copy,
    });
  }

  /**
   * Handle a response from the client
   * @param ws connection
   * @param message received message
   */
  override webSocketMessage(
    ws: WebSocket,
    message: string | ArrayBuffer,
  ): void {
    if (typeof message !== 'string') return;

    const parsed = parseClientMessage(message);
    if (!parsed.ok) {
      if (parsed.phrase === 'error.invalid_response_json') {
        // Reset the connection and fail all its requests
        this._settleRequests(ws, parsed.phrase);
        ws.close(1007, 'Invalid JSON');
      } else if (parsed.id !== undefined) {
        this._requests
          .get(parsed.id)
          ?.settle({ ok: false, phrase: parsed.phrase });
      }
      return;
    }

    const response = parsed.message;
    const request = this._requests.get(response.id);
    if (!request || request.ws !== ws) return;

    if (response.cmd === DaemonCmd.error) {
      request.settle({ ok: false, phrase: clientErrorPhrase(response.code) });
    } else if (response.cmd !== request.cmd) {
      request.settle({ ok: false, phrase: 'error.invalid_response_type' });
    } else {
      request.settle({ ok: true, value: response });
    }
  }

  /**
   * Fail the requests of a closed connection
   * @param ws connection
   */
  override webSocketClose(ws: WebSocket): void {
    this._settleRequests(ws, 'error.daemon_disconnected');
  }

  /**
   * Fail the requests of a broken connection
   * @param ws connection
   */
  override webSocketError(ws: WebSocket): void {
    this._settleRequests(ws, 'error.daemon_disconnected');
  }

  /**
   * Current connection
   * @returns the newest open connection, if any
   */
  private _socket(): WebSocket | undefined {
    let newest: { ws: WebSocket; connectedAt: number } | undefined;
    for (const ws of this.ctx.getWebSockets()) {
      if (ws.readyState !== WebSocket.OPEN) continue;
      const { connectedAt } =
        ws.deserializeAttachment() as ConnectionAttachment;
      if (!newest || connectedAt >= newest.connectedAt)
        newest = { ws, connectedAt };
    }
    return newest?.ws;
  }

  /**
   * Send a message on a connection
   * @param ws connection
   * @param message message
   * @returns whether it was sent
   */
  private _send(ws: WebSocket, message: ServerMessage): boolean {
    try {
      ws.send(JSON.stringify(message));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Fail every request sent on a connection
   * @param ws connection
   * @param phrase key of the message explaining the failure
   */
  private _settleRequests(ws: WebSocket, phrase: string): void {
    for (const request of [...this._requests.values()]) {
      if (request.ws === ws) request.settle({ ok: false, phrase });
    }
  }

  /**
   * Welcome a linked user, or tell how to link
   * @param ws connection
   * @param connection client
   */
  private async _greet(
    ws: WebSocket,
    connection: DaemonConnection,
  ): Promise<void> {
    const users = new UserStore(this.env.DB);
    const user = await users.findByDaemonId(connection.daemonId);
    if (user) {
      await users.updateVersion(connection.daemonId, connection.version);
      this._send(ws, {
        id: crypto.randomUUID(),
        cmd: DaemonCmd.message,
        text: i18n.t(user.locale, 'daemon.welcome_message', {
          username: user.name,
        }),
      });
    } else {
      this._send(ws, {
        id: crypto.randomUUID(),
        cmd: DaemonCmd.message,
        text: i18n.t('en', 'daemon.link_message', {
          client_id: connection.daemonId,
        }),
        copy: `/steam setup client_id:${connection.daemonId}`,
      });
    }
  }
}
