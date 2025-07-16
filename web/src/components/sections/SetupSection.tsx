import React from 'react';
import { useTranslations } from 'next-intl';
import SetupCard from './SetupCard';

export default function SetupSection() {
  const t = useTranslations('setup');

  return (
    <section id="setup" className="py-20 px-6 bg-slate-800/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          {t('title')}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <SetupCard 
            stepNumber={1} 
            title={t('step1.title')} 
            description={t('step1.description')} 
            imageSrc="/assets/setup/bot-invitation-screen.png"
            imageAlt={t('media.altText.botInvite')}
            buttonText={t('step1.button')} 
            buttonHref="https://discord.com/oauth2/authorize?client_id=1252429340780527714" 
            buttonColor="blue"
            buttonIcon="fab fa-discord"
          />

          <SetupCard 
            stepNumber={2} 
            title={t('step2.title')} 
            description={t('step2.description')} 
            imageSrc="/assets/setup/client-interface.png"
            imageAlt={t('media.altText.clientScreen')}
            buttonText={t('step2.button')} 
            buttonHref="https://github.com/Kamesuta/remoteplay-inviter/releases/latest/download/remoteplay-inviter.exe" 
            buttonColor="purple"
            buttonIcon="fas fa-download"
          />

          <SetupCard 
            stepNumber={3} 
            title={t('step3.title')} 
            description={t('step3.description')} 
            imageSrc="/assets/setup/setup-configuration.png"
            imageAlt={t('media.altText.setupScreen')}
            buttonText="/steam invite client_id:..."
            buttonHref=""
            buttonColor="green"
            isCodeExample={true}
          />
        </div>
      </div>
    </section>
  );
} 