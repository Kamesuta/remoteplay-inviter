"use client";
import React from "react";
import { useEffect } from "react";

interface HomeProps {
  params: Promise<{locale: string}>;
}

export default function Home({ params }: HomeProps) {
  // If accessed via /ja or /en, redirect to root after saving preference
  useEffect(() => {
    params.then(({ locale }) => {
      if (locale === 'ja' || locale === 'en') {
        if (typeof window !== 'undefined') {
          localStorage.setItem('preferred-language', locale);
          window.location.href = '/';
        }
      }
    });
  }, [params]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}