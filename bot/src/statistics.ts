import { DiscordApi } from './discord/api.js';
import { UserStore } from './users.js';

/**
 * Log usage statistics
 * @param discord Discord API (with the bot token)
 * @param users linked users
 */
export async function logStatistics(
  discord: DiscordApi,
  users: UserStore,
): Promise<void> {
  const app = await discord.getApplication();
  const linkedUsers = await users.count();
  console.log(
    `Stats: guilds=${app.approximate_guild_count}, users=${app.approximate_user_install_count}, linked_users=${linkedUsers}`,
  );
}
