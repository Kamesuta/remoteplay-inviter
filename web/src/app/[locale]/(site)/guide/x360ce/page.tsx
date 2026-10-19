import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageShell from "@/components/PageShell";
import GuideHero from "@/components/guide/GuideHero";
import GuideNav from "@/components/guide/GuideNav";
import GuideReady from "@/components/guide/GuideReady";
import GuideSteps from "@/components/guide/GuideSteps";
import GuideWhen from "@/components/guide/GuideWhen";
import { generateMetadata as createMetadata } from "@/utils/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guide.meta" });
  return createMetadata({ title: t("title"), description: t("description"), locale, path: "/guide/x360ce" });
}

export default async function X360ceGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PageShell>
      <GuideNav />
      <GuideHero />
      <GuideWhen />
      <GuideReady />
      <GuideSteps />
    </PageShell>
  );
}
