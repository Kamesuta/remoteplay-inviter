import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/utils/metadata";

const BOT_INVITE_URL = "https://discord.com/oauth2/authorize?client_id=1252429340780527714";
const RELEASES_URL = "https://github.com/Kamesuta/remoteplay-inviter/releases/latest";
const REPO_URL = "https://github.com/Kamesuta/remoteplay-inviter";

// Discord ignores a component embed larger than this
const MAX_BYTES = 3000;

// Component types and the link button style, as Discord numbers them
const ACTION_ROW = 1;
const BUTTON = 2;
const SECTION = 9;
const TEXT = 10;
const THUMBNAIL = 11;
const GALLERY = 12;
const SEPARATOR = 14;
const CONTAINER = 17;
const LINK_STYLE = 5;

const linkButton = (label: string, url: string) => ({ type: BUTTON, style: LINK_STYLE, label, url });
const divider = { type: SEPARATOR, spacing: 2, divider: true };

/**
 * The card Discord shows instead of the usual link preview when the top page is shared.
 * The Open Graph tags stay as the fallback.
 */
export async function buildHomeComponentEmbed(locale: string) {
  const t = await getTranslations({ locale, namespace: "discordEmbed" });
  const home = `${SITE_URL}/${locale}`;
  const embed = {
    component: {
      type: CONTAINER,
      accent_color: 0x1a9fff,
      components: [
        { type: GALLERY, items: [{ media: { url: `${SITE_URL}/assets/branding/og-image-${locale}.png` } }] },
        {
          type: SECTION,
          components: [{ type: TEXT, content: `## [Remote Play Inviter](${home})\n${t("lead")}` }],
          accessory: { type: THUMBNAIL, media: { url: `${SITE_URL}/assets/branding/logo.png` } },
        },
        divider,
        {
          type: SECTION,
          components: [{ type: TEXT, content: `**${t("addTitle")}**\n-# ${t("addText")}` }],
          accessory: linkButton(t("addButton"), BOT_INVITE_URL),
        },
        {
          type: SECTION,
          components: [{ type: TEXT, content: `**${t("appTitle")}**\n-# ${t("appText")}` }],
          accessory: linkButton(t("appButton"), RELEASES_URL),
        },
        { type: TEXT, content: t("invite") },
        divider,
        { type: ACTION_ROW, components: [linkButton(t("siteButton"), home)] },
        { type: TEXT, content: `-# ${t("foot", { github: `[GitHub](${REPO_URL})` })}` },
      ],
    },
  };

  // Fail the build rather than ship a card Discord would drop
  const bytes = new TextEncoder().encode(JSON.stringify(embed)).length;
  if (bytes > MAX_BYTES) {
    throw new Error(`Discord component embed for ${locale} is ${bytes} bytes (max ${MAX_BYTES})`);
  }
  return embed;
}
