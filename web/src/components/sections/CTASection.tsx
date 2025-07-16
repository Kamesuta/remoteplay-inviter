import React from 'react';
import { useTranslations } from 'next-intl';

export default function CTASection() {
  const t = useTranslations('cta');

  return (
    <section id="download" className="py-20 px-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          {t('title')}
        </h2>
        <p className="text-xl text-slate-300 mb-12">
          {t('description')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://discord.com/oauth2/authorize?client_id=1252429340780527714" 
            target="_blank"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-center flex items-center justify-center gap-2"
          >
            <i className="fab fa-discord"></i>
            {t('inviteBot')}
          </a>
          <a 
            href="https://github.com/Kamesuta/remoteplay-inviter/releases/latest/download/remoteplay-inviter.exe" 
            target="_blank"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-center flex items-center justify-center gap-2"
          >
            <i className="fas fa-download"></i>
            {t('downloadClient')}
          </a>
        </div>
      </div>
    </section>
  );
} 