import React from 'react';
import { useTranslations } from '@/contexts/LocaleContext';
import FeatureCard from './FeatureCard';

export default function FeaturesSection() {
  const { t } = useTranslations();

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          {t('features.title')}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="fab fa-discord" 
            iconColor="blue"
            title={t('features.discord.title')} 
            description={t('features.discord.description')}
          />

          <FeatureCard 
            icon="fas fa-link" 
            iconColor="purple"
            title={t('features.autoInvite.title')} 
            description={t('features.autoInvite.description')}
          />

          <FeatureCard 
            icon="fas fa-dollar-sign" 
            iconColor="green"
            title={t('features.free.title')} 
            description={t('features.free.description')}
          />
        </div>
      </div>
    </section>
  );
} 