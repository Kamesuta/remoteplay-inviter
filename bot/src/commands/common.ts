import {
  APIInteraction,
  APIInteractionResponse,
  APIUser,
  InteractionResponseType,
  MessageFlags,
} from 'discord-api-types/v10';
import { DaemonUser } from '../daemon/models.js';
import { languageOf } from '../i18n/translator.js';

/** Accent color of the invite panel (Steam blue) */
export const PANEL_COLOR = 0x1a9fff;

/** Accent color of the invite link reply (Discord green) */
export const LINK_COLOR = 0x248046;

/** Website with the guides and the pictures used in messages */
export const SITE_URL = 'https://steaminviter.app';

/**
 * Language part of the website URLs
 * @param locale Discord locale
 * @returns `ja` or `en`
 */
export function siteLanguage(locale: string | undefined): string {
  return languageOf(locale);
}

/**
 * Show text as it is in Discord markdown
 * @param text user-provided text such as a name
 * @returns escaped text
 */
export function escapeMarkdown(text: string): string {
  return text.replace(/[\\*_~`|<>[\]()#-]/g, '\\$&');
}

/**
 * Small gray text (`-#` on every line)
 * @param text message
 * @returns markdown
 */
export function subtext(text: string): string {
  return text
    .split('\n')
    .map((line) => `-# ${line}`)
    .join('\n');
}

/**
 * User who triggered an interaction
 * @param interaction interaction
 * @returns user
 */
export function interactionUser(interaction: APIInteraction): APIUser {
  const user = interaction.member?.user ?? interaction.user;
  if (!user) throw new Error('Interaction has no user');
  return user;
}

/**
 * User as sent to the client
 * @param user Discord user
 * @returns user for requests
 */
export function daemonUser(user: APIUser): DaemonUser {
  return { id: user.id, name: user.username };
}

/**
 * Name shown for the user who triggered an interaction
 * @param interaction interaction
 * @returns server nickname, display name or user name
 */
export function displayName(interaction: APIInteraction): string {
  const user = interactionUser(interaction);
  return interaction.member?.nick ?? user.global_name ?? user.username;
}

/**
 * Avatar of a user
 * @param user Discord user
 * @returns image URL
 */
export function avatarUrl(user: APIUser): string {
  if (user.avatar) {
    const extension = user.avatar.startsWith('a_') ? 'gif' : 'webp';
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}`;
  }
  const index =
    user.discriminator === '0'
      ? Number((BigInt(user.id) >> 22n) % 6n)
      : Number(user.discriminator) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

/**
 * Reply that only the user can see
 * @param content message
 * @returns interaction response
 */
export function ephemeral(content: string): APIInteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content, flags: MessageFlags.Ephemeral },
  };
}

/**
 * Run work after the response, logging failures
 * @param work work to run
 * @param onError called when the work fails
 * @returns promise for waitUntil
 */
export async function afterResponse(
  work: () => Promise<void>,
  onError: () => Promise<void>,
): Promise<void> {
  try {
    await work();
  } catch (err) {
    console.error('Interaction failed', err);
    await onError().catch((err: unknown) => {
      console.error('Failed to report the error', err);
    });
  }
}
