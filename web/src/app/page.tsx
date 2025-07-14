"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // ブラウザの言語設定を取得
    const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
    
    // 日本語の場合はjaへ、それ以外はenへリダイレクト
    if (browserLanguage.startsWith('ja')) {
      router.replace('/ja');
    } else {
      router.replace('/en');
    }
  }, [router]);

  // ローディング中の表示
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}