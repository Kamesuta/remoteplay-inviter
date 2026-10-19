/** Discord user linked to a client */
export interface LinkedUser {
  /** Discord user ID */
  userId: string;
  /** Discord user name */
  name: string;
  /** Discord locale of the user */
  locale: string;
  /** Client ID */
  daemonId: string;
}

/**
 * Links between Discord users and clients (D1)
 */
export class UserStore {
  /**
   * Constructor
   * @param _db D1 database
   */
  constructor(private _db: D1Database) {}

  /**
   * Client linked to a Discord user
   * @param userId Discord user ID
   * @returns client ID, if linked
   */
  async findDaemonId(userId: string): Promise<string | undefined> {
    const row = await this._db
      .prepare('SELECT daemonId FROM UserData WHERE userId = ?')
      .bind(userId)
      .first<{ daemonId: string }>();
    return row?.daemonId;
  }

  /**
   * Discord user linked to a client
   * @param daemonId client ID
   * @returns the user, if linked
   */
  async findByDaemonId(daemonId: string): Promise<LinkedUser | undefined> {
    const row = await this._db
      .prepare(
        'SELECT userId, name, locale, daemonId FROM UserData WHERE daemonId = ?',
      )
      .bind(daemonId)
      .first<LinkedUser>();
    return row ?? undefined;
  }

  /**
   * Link a Discord user to a client (the client must not be linked to another user)
   * @param user Discord user
   * @param user.id user ID
   * @param user.name user name
   * @param daemonId client ID
   * @param locale Discord locale of the user
   * @param daemonVersion version of the client
   */
  async link(
    user: { id: string; name: string },
    daemonId: string,
    locale: string,
    daemonVersion: string | null,
  ): Promise<void> {
    await this._db
      .prepare(
        `INSERT INTO UserData (userId, name, locale, daemonId, daemonVersion) VALUES (?, ?, ?, ?, ?)
           ON CONFLICT (userId) DO UPDATE SET
             name = excluded.name, locale = excluded.locale,
             daemonId = excluded.daemonId, daemonVersion = excluded.daemonVersion`,
      )
      .bind(user.id, user.name, locale, daemonId, daemonVersion)
      .run();
  }

  /**
   * Record the version of a connected client (written only when it changed)
   * @param daemonId client ID
   * @param daemonVersion version of the client
   */
  async updateVersion(daemonId: string, daemonVersion: string): Promise<void> {
    await this._db
      .prepare(
        'UPDATE UserData SET daemonVersion = ? WHERE daemonId = ? AND daemonVersion IS NOT ?',
      )
      .bind(daemonVersion, daemonId, daemonVersion)
      .run();
  }

  /**
   * Number of linked users
   * @returns count
   */
  async count(): Promise<number> {
    const row = await this._db
      .prepare('SELECT COUNT(*) AS count FROM UserData')
      .first<{ count: number }>();
    return row?.count ?? 0;
  }
}
