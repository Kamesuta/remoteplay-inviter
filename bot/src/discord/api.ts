import type {
  APIApplication,
  RESTPatchAPIWebhookWithTokenMessageJSONBody,
  RESTPostAPIWebhookWithTokenJSONBody,
  RESTPutAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v10';

/** Discord REST API */
const API_BASE = 'https://discord.com/api/v10';

/** Settings for calling the Discord API */
export interface DiscordConfig {
  /** Application ID */
  applicationId: string;
  /** Bot token (needed only for bot endpoints) */
  token?: string;
}

/**
 * Discord REST API client
 */
export class DiscordApi {
  /**
   * Constructor
   * @param _config application settings
   * @param _fetch fetch implementation
   */
  constructor(
    private _config: DiscordConfig,
    // Called through a wrapper: the runtime's fetch must not be called as a method of this class
    private _fetch: typeof fetch = (input, init) => fetch(input, init),
  ) {}

  /**
   * Edit the original response of an interaction
   * @param token interaction token
   * @param body new message
   */
  async editOriginal(
    token: string,
    body: RESTPatchAPIWebhookWithTokenMessageJSONBody,
  ): Promise<void> {
    await this._call(
      'PATCH',
      `/webhooks/${this._config.applicationId}/${token}/messages/@original`,
      body,
    );
  }

  /**
   * Delete the original response of an interaction
   * @param token interaction token
   */
  async deleteOriginal(token: string): Promise<void> {
    await this._call(
      'DELETE',
      `/webhooks/${this._config.applicationId}/${token}/messages/@original`,
    );
  }

  /**
   * Send a follow-up message for an interaction
   * @param token interaction token
   * @param body message
   */
  async followUp(
    token: string,
    body: RESTPostAPIWebhookWithTokenJSONBody,
  ): Promise<void> {
    await this._call(
      'POST',
      `/webhooks/${this._config.applicationId}/${token}`,
      body,
    );
  }

  /**
   * The application, including approximate install counts
   * @returns application
   */
  async getApplication(): Promise<APIApplication> {
    return (await this._call(
      'GET',
      '/applications/@me',
      undefined,
      true,
    )) as APIApplication;
  }

  /**
   * Overwrite the global commands
   * @param commands command definitions
   */
  async putCommands(
    commands: RESTPutAPIApplicationCommandsJSONBody,
  ): Promise<void> {
    await this._call(
      'PUT',
      `/applications/${this._config.applicationId}/commands`,
      commands,
      true,
    );
  }

  /**
   * Call the API
   * @param method HTTP method
   * @param path path under the API base
   * @param body JSON body
   * @param auth whether to send the bot token
   * @returns parsed response body (undefined when empty)
   */
  private async _call(
    method: string,
    path: string,
    body?: unknown,
    auth = false,
  ): Promise<unknown> {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (auth) {
      if (!this._config.token) throw new Error('DISCORD_TOKEN is not set');
      headers.Authorization = `Bot ${this._config.token}`;
    }

    const response = await this._fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(
        `Discord API ${method} ${path.replace(/\/webhooks\/(\d+)\/[^/]+/, '/webhooks/$1/<token>')} failed: ${response.status} ${await response.text()}`,
      );
    }
    const text = await response.text();
    return text ? (JSON.parse(text) as unknown) : undefined;
  }
}
