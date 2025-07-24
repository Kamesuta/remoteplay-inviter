import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navigation() {
  const t = useTranslations('nav');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="relative z-10 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo and title */}
          <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image 
                src="/assets/branding/logo.png" 
                alt="Remote Play Inviter Icon" 
                width={32} 
                height={32}
                className="object-cover"
              />
            </div>
            <h1 className="text-lg md:text-2xl font-bold text-white truncate">Remote Play Inviter</h1>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <a 
              href="#about"
              className="px-3 py-2 text-blue-300 hover:text-blue-200 transition-colors whitespace-nowrap"
            >
              {t('features')}
            </a>
            <a 
              href="#setup"
              className="px-3 py-2 text-blue-300 hover:text-blue-200 transition-colors whitespace-nowrap"
            >
              {t('setup')}
            </a>
            <a 
              href="#download"
              className="px-3 py-2 text-blue-300 hover:text-blue-200 transition-colors whitespace-nowrap"
            >
              {t('download')}
            </a>
            <a 
              href="https://github.com/Kamesuta/remoteplay-inviter" 
              target="_blank"
              className="px-3 py-2 text-blue-300 hover:text-blue-200 transition-colors whitespace-nowrap"
            >
              {t('github')}
            </a>
            <LanguageSwitcher />
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-blue-300 hover:text-blue-200 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-slate-700">
            <div className="flex flex-col space-y-2">
              <a 
                href="#about"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-blue-300 hover:text-blue-200 hover:bg-blue-600/10 rounded-lg transition-colors"
              >
                {t('features')}
              </a>
              <a 
                href="#setup"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-blue-300 hover:text-blue-200 hover:bg-blue-600/10 rounded-lg transition-colors"
              >
                {t('setup')}
              </a>
              <a 
                href="#download"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-blue-300 hover:text-blue-200 hover:bg-blue-600/10 rounded-lg transition-colors"
              >
                {t('download')}
              </a>
              <a 
                href="https://github.com/Kamesuta/remoteplay-inviter" 
                target="_blank"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-blue-300 hover:text-blue-200 hover:bg-blue-600/10 rounded-lg transition-colors"
              >
                {t('github')}
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 