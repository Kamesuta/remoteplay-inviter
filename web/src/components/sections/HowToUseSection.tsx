import React from 'react';
import { useTranslations } from '@/contexts/LocaleContext';
import HowToUseStep from './HowToUseStep';

export default function HowToUseSection() {
  const { t } = useTranslations();

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-8">
          {t('howToUse.title')}
        </h2>
        <p className="text-center text-slate-300 mb-16 text-lg">
          {t('howToUse.subtitle')}
        </p>
        
        {/* Demo Video */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              <i className="fas fa-play-circle mr-2"></i>
              {t('howToUse.videoTitle')}
            </h3>
            <div className="rounded-lg overflow-hidden border border-slate-600">
              <video 
                className="w-full h-auto" 
                controls 
                autoPlay
                muted
                loop
                preload="metadata"
                poster="/assets/remoteplay_inviter_og.png"
              >
                <source src="/assets/howto_invite_join.mp4" type="video/mp4" />
                {t('media.videoFallback')}
              </video>
            </div>
            <p className="text-slate-300 text-center mt-4">
              {t('howToUse.videoDescription')}
            </p>
          </div>
        </div>
        
        <div className="space-y-12">
          <HowToUseStep 
            stepNumber={1} 
            title={t('howToUse.step1.title')} 
            description={t('howToUse.step1.description')} 
            imageSrc="/assets/invite_panel.png"
            imageAlt={t('media.altText.discordPanel')}
            stepColor="blue"
            codeExample="/steam invite"
          />

          <HowToUseStep 
            stepNumber={2} 
            title={t('howToUse.step2.title')} 
            description={t('howToUse.step2.description')} 
            imageSrc="/assets/invite_join.png" 
            imageAlt={t('media.altText.joinButton')} 
            stepColor="purple"
            reversed={true}
          />

          <HowToUseStep 
            stepNumber={3} 
            title={t('howToUse.step3.title')} 
            description={t('howToUse.step3.description')} 
            imageSrc="/assets/invite_steam.png" 
            imageAlt={t('media.altText.steamScreen')} 
            stepColor="green"
          />
        </div>
      </div>
    </section>
  );
} 