import { setRequestLocale } from "next-intl/server";
import PageShell from "@/components/PageShell";
import HomeFeatures from "@/components/home/HomeFeatures";
import HomeHero from "@/components/home/HomeHero";
import HomeNav from "@/components/home/HomeNav";
import HomeStart from "@/components/home/HomeStart";
import HomeWorry from "@/components/home/HomeWorry";
import { SITE_URL } from "@/utils/metadata";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PageShell>
      {/* React moves this into <head>, where Discord looks for the link preview card */}
      <link rel="discord:component-embed" type="application/json" href={`${SITE_URL}/discord/home-${locale}.json`} />
      <HomeNav />
      <HomeHero />
      <HomeWorry />
      <HomeFeatures />
      <HomeStart />
    </PageShell>
  );
}
