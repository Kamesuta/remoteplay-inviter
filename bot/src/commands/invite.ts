import {
  APIChatInputApplicationCommandInteraction,
  APIContainerComponent,
  APIInteractionResponse,
  ButtonStyle,
  ComponentType,
  InteractionResponseType,
  MessageFlags,
  SeparatorSpacingSize,
} from 'discord-api-types/v10';
import { DaemonCmd } from '../daemon/models.js';
import { i18n } from '../i18n/index.js';
import { GameInfo, storeLink } from '../steam.js';
import {
  afterResponse,
  avatarUrl,
  daemonUser,
  displayName,
  ephemeral,
  escapeMarkdown,
  interactionUser,
  PANEL_COLOR,
  subtext,
} from './common.js';
import { InviteButtonParams, inviteButton } from './inviteButton.js';
import { Services } from './services.js';

/** How long to wait for the client to report the running game */
export const GAME_TIMEOUT_MS = 10_000;

/**
 * Whether a number can be a Steam AppID
 * @param value number
 * @returns true for a positive 32-bit integer
 */
function isAppId(value: number): boolean {
  return Number.isInteger(value) && value > 0 && value <= 0xffffffff;
}

/**
 * `/steam invite [game_id]`: post an invite panel for the running game
 * @param interaction interaction
 * @param optionGameId game ID entered by the user
 * @param services services
 * @returns interaction response
 */
export async function handleInvite(
  interaction: APIChatInputApplicationCommandInteraction,
  optionGameId: number | undefined,
  services: Services,
): Promise<APIInteractionResponse> {
  const locale = interaction.locale;
  const user = interactionUser(interaction);

  const daemonId = await services.users.findDaemonId(user.id);
  if (!daemonId) {
    return ephemeral(i18n.t(locale, 'invite_command.error.daemon_not_linked'));
  }
  const daemon = services.daemon(daemonId);
  const status = await daemon.status();
  if (!status.online || status.sessionId === undefined) {
    return ephemeral(i18n.t(locale, 'invite_command.error.daemon_offline'));
  }
  const sessionId = status.sessionId;

  const token = interaction.token;
  // Delete the public message first so that the error is visible only to the user
  // (if the deletion fails, the follow-up replaces the "thinking" message instead)
  const fail = async (phrase: string): Promise<void> => {
    await services.discord.deleteOriginal(token).catch((err: unknown) => {
      console.error('Failed to delete the reply', err);
    });
    await services.discord.followUp(token, {
      content: i18n.t(locale, phrase),
      flags: MessageFlags.Ephemeral,
    });
  };

  services.waitUntil(
    afterResponse(
      async () => {
        // The running game, unless the user specified one
        let gameId: number;
        if (optionGameId !== undefined) {
          gameId = optionGameId;
        } else {
          const result = await daemon.request(
            DaemonCmd.gameId,
            daemonUser(user),
            {},
            GAME_TIMEOUT_MS,
          );
          if (!result.ok) {
            await fail(result.phrase);
            return;
          }
          gameId = result.value.game;
        }

        const language = i18n.t(locale, 'invite_panel.steam_language');
        const game = isAppId(gameId)
          ? await services.gameInfo(gameId, language)
          : undefined;
        if (!game) {
          await fail('invite_command.error.game_info_failed');
          return;
        }
        if (!game.supportsRemotePlayTogether) {
          await fail('invite_command.error.game_not_supported');
          return;
        }

        await services.discord.editOriginal(token, {
          flags: MessageFlags.IsComponentsV2,
          components: [
            invitePanel(interaction, game, storeLink(gameId, language), {
              user: user.id,
              game: `${gameId}`,
              session: `${sessionId}`,
            }),
          ],
          allowed_mentions: { parse: [] },
        });
      },
      () => fail('error.internal'),
    ),
  );

  return { type: InteractionResponseType.DeferredChannelMessageWithSource };
}

/**
 * Invite panel
 * @param interaction interaction of the host
 * @param game game to play
 * @param link store link of the game
 * @param button parameters of the invite button
 * @returns container
 */
function invitePanel(
  interaction: APIChatInputApplicationCommandInteraction,
  game: GameInfo,
  link: string,
  button: InviteButtonParams,
): APIContainerComponent {
  const locale = interaction.locale;
  const host = displayName(interaction);
  const title = i18n.t(locale, 'invite_panel.title', {
    name: escapeMarkdown(game.name),
  });
  const recruiting = i18n.t(locale, 'invite_panel.host', {
    name: escapeMarkdown(host),
  });
  return {
    type: ComponentType.Container,
    accent_color: PANEL_COLOR,
    components: [
      {
        type: ComponentType.Section,
        components: [
          {
            type: ComponentType.TextDisplay,
            content: `## ${title}\n${recruiting}`,
          },
        ],
        accessory: {
          type: ComponentType.Thumbnail,
          media: { url: avatarUrl(interactionUser(interaction)) },
          description: host,
        },
      },
      {
        type: ComponentType.MediaGallery,
        items: [{ media: { url: game.headerImage }, description: game.name }],
      },
      {
        type: ComponentType.TextDisplay,
        content: i18n.t(locale, 'invite_panel.features'),
      },
      {
        type: ComponentType.Separator,
        divider: true,
        spacing: SeparatorSpacingSize.Small,
      },
      {
        type: ComponentType.ActionRow,
        components: [
          inviteButton(button, locale),
          {
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            label: i18n.t(locale, 'invite_panel.store_button'),
            url: link,
          },
        ],
      },
      {
        type: ComponentType.TextDisplay,
        content: subtext(i18n.t(locale, 'invite_panel.note')),
      },
    ],
  };
}
