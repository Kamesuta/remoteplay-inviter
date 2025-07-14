import React from 'react';
import Image from 'next/image';
import { useTranslations } from '@/contexts/LocaleContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navigation() {
  const { t } = useTranslations();

  return (
    <nav className="relative z-10 p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
            <Image 
              src="/assets/remoteplay_inviter.png" 
              alt="Remote Play Inviter Icon" 
              width={32} 
              height={32}
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Remote Play Inviter</h1>
        </div>
        <div className="flex items-center space-x-6">
          <a 
            href="#about"
            className="px-4 py-2 text-blue-300 hover:text-blue-200 transition-colors"
          >
            {t('nav.features')}
          </a>
          <a 
            href="#setup"
            className="px-4 py-2 text-blue-300 hover:text-blue-200 transition-colors"
          >
            {t('nav.setup')}
          </a>
          <a 
            href="#download"
            className="px-4 py-2 text-blue-300 hover:text-blue-200 transition-colors"
          >
            {t('nav.download')}
          </a>
          <a 
            href="https://github.com/Kamesuta/remoteplay-inviter" 
            target="_blank"
            className="px-4 py-2 text-blue-300 hover:text-blue-200 transition-colors"
          >
            {t('nav.github')}
          </a>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
} 