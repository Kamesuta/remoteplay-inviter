"use client";
import { useState, useEffect } from 'react';
import { LocaleProvider } from '@/contexts/LocaleContext';
import HomePageContent from '@/components/HomePageContent';

type Locale = 'en' | 'ja';

export default function RootPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [messages, setMessages] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeLocale() {
      let selectedLocale: Locale = 'en';
      
      // Check localStorage first
      if (typeof window !== 'undefined') {
        const storedLocale = localStorage.getItem('preferred-language') as Locale;
        if (storedLocale === 'ja' || storedLocale === 'en') {
          selectedLocale = storedLocale;
        } else {
          // Fallback to browser language detection
          const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
          selectedLocale = browserLanguage.startsWith('ja') ? 'ja' : 'en';
          localStorage.setItem('preferred-language', selectedLocale);
        }
      }

      // Load messages for selected locale
      try {
        const localeMessages = await import(`../../messages/${selectedLocale}.json`).then(m => m.default);
        setMessages(localeMessages);
        setLocale(selectedLocale);
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Fallback to English
        const enMessages = await import(`../../messages/en.json`).then(m => m.default);
        setMessages(enMessages);
        setLocale('en');
      }
      
      setIsLoading(false);
    }

    initializeLocale();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <LocaleProvider initialLocale={locale} initialMessages={messages}>
      <HomePageContent />
    </LocaleProvider>
  );
}