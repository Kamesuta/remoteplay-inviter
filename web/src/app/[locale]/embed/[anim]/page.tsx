import type { Metadata } from "next";
import type { ComponentType } from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Compare from "@/components/anim/Compare";
import GuideAdd from "@/components/anim/GuideAdd";
import GuideCheck from "@/components/anim/GuideCheck";
import GuideDownload from "@/components/anim/GuideDownload";
import GuideIssues from "@/components/anim/GuideIssues";
import GuidePaste from "@/components/anim/GuidePaste";
import InviteFlow from "@/components/anim/InviteFlow";
import KeyMap from "@/components/anim/KeyMap";
import Phone from "@/components/anim/Phone";
import Setup from "@/components/anim/Setup";
import Worry from "@/components/anim/Worry";

// One animation alone at its stage size, for recording GIFs (Discord can't play the page's animations)
const ANIMS: Record<string, ComponentType> = {
  "invite-flow": InviteFlow,
  worry: Worry,
  compare: Compare,
  phone: Phone,
  setup: Setup,
  "key-map": KeyMap,
  "guide-download": GuideDownload,
  "guide-issues": GuideIssues,
  "guide-add": GuideAdd,
  "guide-paste": GuidePaste,
  "guide-check": GuideCheck,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => Object.keys(ANIMS).map((anim) => ({ locale, anim })));
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function EmbedPage({ params }: { params: Promise<{ locale: string; anim: string }> }) {
  const { locale, anim } = await params;
  setRequestLocale(locale);
  const Anim = ANIMS[anim];
  return (
    <div style={{ display: "inline-block", fontFamily: "var(--font-zen), 'Hiragino Sans', sans-serif", fontSize: "16px", lineHeight: 1.8, color: "#ffffff" }}>
      <Anim />
    </div>
  );
}
