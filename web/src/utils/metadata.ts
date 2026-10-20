import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_URL = "https://steaminviter.app";

interface PageMetadata {
  title: string;
  description: string;
  locale?: string;
  // Path after the locale, starting with "/" (empty for the top page)
  path?: string;
}

export function generateMetadata({ title, description, locale = routing.defaultLocale, path = "" }: PageMetadata): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  const ogImage = `${SITE_URL}/assets/branding/og-image-${locale}.png`;
  return {
    title,
    description,
    icons: {
      icon: [
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon.ico",
      apple: {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    },
    manifest: "/site.webmanifest",
    appleWebApp: {
      title: "RemotePlayInviter",
    },
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
        "x-default": `${SITE_URL}/${routing.defaultLocale}${path}`,
      },
    },
    openGraph: {
      siteName: "Remote Play Inviter",
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Remote Play Inviter",
        },
      ],
      url,
      locale: locale === "ja" ? "ja_JP" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
