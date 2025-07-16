import type { Metadata } from "next";

interface Messages {
  title: string;
  description: string;
}

export function generateMetadata(messages: Messages): Metadata {
  return {
    title: messages.title,
    description: messages.description,
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
    openGraph: {
      siteName: "Remote Play Inviter",
      title: messages.title,
      description: messages.description,
      images: [
        {
          url: "https://steaminviter.app/assets/branding/og-image.png",
          width: 1200,
          height: 630,
          alt: "Remote Play Inviter",
        },
      ],
      url: "https://steaminviter.app",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: messages.title,
      description: messages.description,
      images: ["https://steaminviter.app/assets/branding/og-image.png"],
    },
  };
}