"use client";
import { useLocale } from '@/contexts/LocaleContext';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: 'en' | 'ja') => {
    if (newLocale === locale) return;
    
    // 現在のパスから言語コードを除いたパスを取得
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    router.push(newPath);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-blue-600 text-white'
            : 'text-blue-300 hover:text-blue-200 hover:bg-blue-600/20'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('ja')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          locale === 'ja'
            ? 'bg-blue-600 text-white'
            : 'text-blue-300 hover:text-blue-200 hover:bg-blue-600/20'
        }`}
      >
        JA
      </button>
    </div>
  );
}