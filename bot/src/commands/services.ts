import type { DiscordApi } from '../discord/api.js';
import type { DaemonStatus } from '../daemon/DaemonObject.js';
import type {
  DaemonRequestCmd,
  DaemonRequests,
  DaemonResult,
  DaemonUser,
} from '../daemon/models.js';
import type { GameInfo } from '../steam.js';
import type { UserStore } from '../users.js';

/** A client, reached through its Durable Object */
export interface DaemonHandle {
  /** State of the client */
  status(): Promise<DaemonStatus>;
  /** Send a request and wait for the response */
  request<Cmd extends DaemonRequestCmd>(
    cmd: Cmd,
    user: DaemonUser,
    data: DaemonRequests[Cmd]['request'],
    timeoutMs: number,
  ): Promise<DaemonResult<DaemonRequests[Cmd]['response']>>;
  /** Show a message on the client */
  sendMessage(text: string, copy?: string): Promise<boolean>;
}

/** What the command handlers use (replaced with fakes in tests) */
export interface Services {
  /** Links between Discord users and clients */
  users: Pick<UserStore, 'findDaemonId' | 'findByDaemonId' | 'link'>;
  /** Get a client by ID */
  daemon(daemonId: string): DaemonHandle;
  /** Discord API */
  discord: Pick<DiscordApi, 'editOriginal' | 'deleteOriginal' | 'followUp'>;
  /** Get a game from the Steam store */
  gameInfo(gameId: number, language: string): Promise<GameInfo | undefined>;
  /** Keep the Worker running for work done after the response */
  waitUntil(promise: Promise<unknown>): void;
  /** Download page of the client */
  downloadUrl: string;
}
