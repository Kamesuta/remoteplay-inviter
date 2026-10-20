import {
  APIButtonComponentWithCustomId,
  APIButtonComponentWithURL,
  APIContainerComponent,
  APIInteractionResponse,
  APIMessageComponentButtonInteraction,
  ButtonStyle,
  ComponentType,
  InteractionResponseType,
  MessageFlags,
  SeparatorSpacingSize,
} from 'discord-api-types/v10';
import { DaemonCmd } from '../daemon/models.js';
import { i18n } from '../i18n/index.js';
import {
  afterResponse,
  daemonUser,
  ephemeral,
  interactionUser,
  LINK_COLOR,
  SITE_URL,
  siteLanguage,
  subtext,
} from './common.js';
import { Services } from './services.js';

/** How long to wait for the client to create a link */
export const LINK_TIMEOUT_MS = 25_000;

/** Steam Link on the phone app stores */
const STEAM_LINK_STORES = [
  {
    label: 'App Store',
    url: 'https://apps.apple.com/app/steam-link/id1246969117',
  },
  {
    label: 'Google Play',
    url: 'https://play.google.com/store/apps/details?id=com.valvesoftware.steamlink',
  },
];

/**
 * Animation of the joining steps (bump the version when the picture changes,
 * since Discord keeps showing the cached one)
 * @param locale guest's locale
 * @param device `phone` or `pc`
 * @returns GIF URL
 */
export function joinGifUrl(locale: string, device: 'phone' | 'pc'): string {
  return `${SITE_URL}/assets/discord/${siteLanguage(locale)}/join-${device}-v1.gif`;
}

/**
 * Guide to use the keyboard as a controller
 * @param locale guest's locale
 * @returns URL
 */
export function controllerGuideUrl(locale: string): string {
  return `${SITE_URL}/${siteLanguage(locale)}/guide/x360ce`;
}

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

        await services.discord.editOriginal(token, {
          // The reply stays ephemeral from the deferred response
          flags: MessageFlags.IsComponentsV2,
          components: [inviteReply(result.value.url, locale)],
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

/**
 * Reply with the invite link and how to join
 * @param link invite link
 * @param locale guest's locale
 * @returns container
 */
function inviteReply(link: string, locale: string): APIContainerComponent {
  const storeButtons: APIButtonComponentWithURL[] = STEAM_LINK_STORES.map(
    ({ label, url }) => ({
      type: ComponentType.Button,
      style: ButtonStyle.Link,
      label,
      url,
    }),
  );
  return {
    type: ComponentType.Container,
    accent_color: LINK_COLOR,
    components: [
      {
        type: ComponentType.TextDisplay,
        content: `## ${i18n.t(locale, 'invite_button.reply.title')}`,
      },
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            label: i18n.t(locale, 'invite_button.reply.join_button'),
            url: link,
            emoji: { name: '🎮' },
          },
        ],
      },
      {
        type: ComponentType.TextDisplay,
        content: subtext(
          `${i18n.t(locale, 'invite_button.reply.other_device')}\n\`${link}\``,
        ),
      },
      {
        type: ComponentType.Separator,
        divider: true,
        spacing: SeparatorSpacingSize.Small,
      },
      {
        type: ComponentType.TextDisplay,
        content: `### ${i18n.t(locale, 'invite_button.reply.phone.title')}\n${i18n.t(locale, 'invite_button.reply.phone.steps')}`,
      },
      { type: ComponentType.ActionRow, components: storeButtons },
      {
        type: ComponentType.MediaGallery,
        items: [
          {
            media: { url: joinGifUrl(locale, 'phone') },
            description: i18n.t(locale, 'invite_button.reply.phone.gif'),
          },
        ],
      },
      {
        type: ComponentType.TextDisplay,
        content: [
          `### ${i18n.t(locale, 'invite_button.reply.pc.title')}`,
          i18n.t(locale, 'invite_button.reply.pc.steps'),
          subtext(
            i18n.t(locale, 'invite_button.reply.pc.note', {
              guide_url: controllerGuideUrl(locale),
            }),
          ),
        ].join('\n'),
      },
      {
        type: ComponentType.MediaGallery,
        items: [
          {
            media: { url: joinGifUrl(locale, 'pc') },
            description: i18n.t(locale, 'invite_button.reply.pc.gif'),
          },
        ],
      },
    ],
  };
}
