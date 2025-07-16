import React from 'react';
import { useTranslations } from 'next-intl';
import FeatureCard from './FeatureCard';

export default function FeaturesSection() {
  const t = useTranslations('features');

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          {t('title')}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="fab fa-discord" 
            iconColor="blue"
            title={t('discord.title')} 
            description={t('discord.description')}
          />

          <FeatureCard 
            icon="fas fa-link" 
            iconColor="purple"
            title={t('autoInvite.title')} 
            description={t('autoInvite.description')}
          />

          <FeatureCard 
            icon="fas fa-dollar-sign" 
            iconColor="green"
            title={t('free.title')} 
            description={t('free.description')}
          />
        </div>
      </div>
    </section>
  );
} 