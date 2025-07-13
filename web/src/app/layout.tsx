import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Remote Play Inviter - DiscordでSteamゲームのストリーミングプレイに招待できるBOT",
  description: "Discordで友達をSteamゲームへ無料で簡単に招待！",
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
    title: "Remote Play Inviter 登場！",
    description: "Discordで友達をSteamゲームへ無料で簡単に招待！",
    images: [
      {
        url: "https://steaminviter.app/assets/remoteplay_inviter_og.png",
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
    title: "Remote Play Inviter 登場！",
    description: "Discordで友達をSteamゲームへ無料で簡単に招待！",
    images: ["https://steaminviter.app/assets/remoteplay_inviter_og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
