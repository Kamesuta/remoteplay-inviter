import { setRequestLocale } from "next-intl/server";
import PageShell from "@/components/PageShell";
import HomeFeatures from "@/components/home/HomeFeatures";
import HomeHero from "@/components/home/HomeHero";
import HomeNav from "@/components/home/HomeNav";
import HomeStart from "@/components/home/HomeStart";
import HomeWorry from "@/components/home/HomeWorry";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PageShell>
      <HomeNav />
      <HomeHero />
      <HomeWorry />
      <HomeFeatures />
      <HomeStart />
    </PageShell>
  );
}
