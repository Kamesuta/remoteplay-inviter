"use client";
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center space-x-2">
      <Link
        href={pathname}
        locale="en"
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-blue-600 text-white'
            : 'text-blue-300 hover:text-blue-200 hover:bg-blue-600/20'
        }`}
      >
        EN
      </Link>
      <Link
        href={pathname}
        locale="ja"
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          locale === 'ja'
            ? 'bg-blue-600 text-white'
            : 'text-blue-300 hover:text-blue-200 hover:bg-blue-600/20'
        }`}
      >
        JA
      </Link>
    </div>
  );
}