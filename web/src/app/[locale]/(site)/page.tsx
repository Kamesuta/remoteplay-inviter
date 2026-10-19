import { setRequestLocale } from 'next-intl/server';
import HomePageContent from '@/components/HomePageContent';

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomePageContent />;
}
