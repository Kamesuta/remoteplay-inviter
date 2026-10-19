import {
  APIButtonComponentWithCustomId,
  APIInteractionResponse,
  APIMessageComponentButtonInteraction,
  ButtonStyle,
  ComponentType,
  InteractionResponseType,
  MessageFlags,
} from 'discord-api-types/v10';
import { DaemonCmd } from '../daemon/models.js';
import { i18n } from '../i18n/index.js';
import {
  afterResponse,
  daemonUser,
  EMBED_COLOR,
  ephemeral,
  interactionUser,
} from './common.js';
import { Services } from './services.js';

/** How long to wait for the client to create a link */
export const LINK_TIMEOUT_MS = 25_000;

/** Button parameters kept in its custom ID */
export interface InviteButtonParams {
  /** Host's Discord user ID */
  user: string;
  /** Steam AppID */
  game: string;
  /** Session of the host's client when the panel was created */
  session: string;
}

/**
 * Button that creates an invite link
 * @param params button parameters
 * @param locale host's locale
 * @returns button component
 */
export function inviteButton(
  params: InviteButtonParams,
  locale: string,
): APIButtonComponentWithCustomId {
  return {
    type: ComponentType.Button,
    style: ButtonStyle.Success,
    // `_t` is the component type
    custom_id: new URLSearchParams({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _: 'create_invite',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _t: `${ComponentType.Button}`,
      ...params,
    }).toString(),
    label: i18n.t(locale, 'invite_button.label'),
    emoji: { name: '🔗' },
  };
}

/**
 * Read the parameters of an invite button
 * @param customId custom ID of the clicked component
 * @returns parameters, or undefined if it is not an invite button
 */
export function parseInviteButton(
  customId: string,
): InviteButtonParams | undefined {
  const params = new URLSearchParams(customId);
  if (
    params.get('_') !== 'create_invite' ||
    params.get('_t') !== `${ComponentType.Button}`
  ) {
    return undefined;
  }
  const user = params.get('user');
  const game = params.get('game');
  const session = params.get('session');
  if (!user || !game || !session) return undefined;
  return { user, game, session };
}

/**
 * Invite button: get an invite link from the host's client
 * @param interaction interaction
 * @param params button parameters
 * @param services services
 * @returns interaction response
 */
export async function handleInviteButton(
  interaction: APIMessageComponentButtonInteraction,
  params: InviteButtonParams,
  services: Services,
): Promise<APIInteractionResponse> {
  const locale = interaction.locale;

  const daemonId = await services.users.findDaemonId(params.user);
  if (!daemonId) {
    return ephemeral(i18n.t(locale, 'invite_button.error.daemon_not_linked'));
  }
  const daemon = services.daemon(daemonId);
  const status = await daemon.status();
  if (!status.online) {
    return ephemeral(i18n.t(locale, 'invite_button.error.daemon_offline'));
  }
  if (`${status.sessionId}` !== params.session) {
    return ephemeral(i18n.t(locale, 'invite_button.error.invalid_session'));
  }

  const token = interaction.token;
  const user = daemonUser(interactionUser(interaction));
  services.waitUntil(
    afterResponse(
      async () => {
        const result = await daemon.request(
          DaemonCmd.link,
          user,
          { game: Number(params.game) },
          LINK_TIMEOUT_MS,
        );
        if (!result.ok) {
          await services.discord.editOriginal(token, {
            content: i18n.t(locale, result.phrase),
          });
          return;
        }

        const link = result.value.url;
        await services.discord.editOriginal(token, {
          content: i18n.t(locale, 'invite_button.invite_message', { link }),
          embeds: [
            {
              fields: [
                {
                  name: i18n.t(locale, 'invite_button.how_to_join_mobile.name'),
                  value: i18n.t(
                    locale,
                    'invite_button.how_to_join_mobile.value',
                  ),
                },
                {
                  name: i18n.t(locale, 'invite_button.how_to_join_pc.name'),
                  value: i18n.t(locale, 'invite_button.how_to_join_pc.value'),
                },
              ],
              color: EMBED_COLOR,
            },
          ],
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.Button,
                  style: ButtonStyle.Link,
                  label: i18n.t(locale, 'invite_button.join_button'),
                  url: link,
                  emoji: { name: '🎮' },
                },
              ],
            },
          ],
        });
      },
      () =>
        services.discord.editOriginal(token, {
          content: i18n.t(locale, 'error.internal'),
        }),
    ),
  );

  return {
    type: InteractionResponseType.DeferredChannelMessageWithSource,
    data: { flags: MessageFlags.Ephemeral },
  };
}
