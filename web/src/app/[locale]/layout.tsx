import type { Metadata } from "next";
import { LocaleProvider } from '@/contexts/LocaleContext';

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ja' }
  ];
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  
  // Load messages for metadata
  let messages;
  try {
    if (locale === 'en') {
      messages = (await import('../../../messages/en.json')).default;
    } else {
      messages = (await import('../../../messages/ja.json')).default;
    }
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    // Fallback to Japanese
    messages = (await import('../../../messages/ja.json')).default;
  }
  
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
      title: messages.title,
      description: messages.description,
      images: ["https://steaminviter.app/assets/remoteplay_inviter_og.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  let messages;
  try {
    if (locale === 'en') {
      messages = (await import('../../../messages/en.json')).default;
    } else {
      messages = (await import('../../../messages/ja.json')).default;
    }
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    // Fallback to Japanese
    messages = (await import('../../../messages/ja.json')).default;
  }
  
  return (
    <LocaleProvider locale={locale as 'en' | 'ja'} messages={messages}>
      {children}
    </LocaleProvider>
  );
}