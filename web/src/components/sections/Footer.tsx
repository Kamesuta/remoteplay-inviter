import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="py-12 px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
            <Image 
              src="/assets/remoteplay_inviter.png" 
              alt="Remote Play Inviter Icon" 
              width={24} 
              height={24}
              className="object-cover"
            />
          </div>
          <span className="text-xl font-bold text-white">Remote Play Inviter</span>
        </div>
        <p className="text-slate-400 mb-6">
          {t('description')}<br />
          <a href="https://store.steampowered.com/remoteplay_together?l=japanese" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
            Steam Remote Play Together
          </a>
          {t('description2')}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <a href="https://github.com/Kamesuta/remoteplay-inviter" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
            {t('sourceCode.client')}
          </a>
          <a href="https://github.com/Kamesuta/remoteplay-inviter-bot" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
            {t('sourceCode.bot')}
          </a>
          <a href="https://github.com/Kamesuta/remoteplay-inviter-web" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
            {t('sourceCode.web')}
          </a>
        </div>
        
        <div className="text-slate-500 text-sm">
          <p className="mb-2">
            © <a href="https://github.com/Kamesuta" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">Kamesuta</a>
          </p>
          <p>
            {t('license')}
          </p>
        </div>
      </div>
    </footer>
  );
} 