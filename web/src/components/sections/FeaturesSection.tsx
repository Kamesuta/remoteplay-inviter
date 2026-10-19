import React from 'react';
import { useTranslations } from 'next-intl';
import FeatureCard from './FeatureCard';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faLink, faDollarSign } from '@fortawesome/free-solid-svg-icons';

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
            icon={faDiscord} 
            iconColor="blue"
            title={t('discord.title')} 
            description={t('discord.description')}
          />

          <FeatureCard 
            icon={faLink} 
            iconColor="purple"
            title={t('autoInvite.title')} 
            description={t('autoInvite.description')}
          />

          <FeatureCard 
            icon={faDollarSign} 
            iconColor="green"
            title={t('free.title')} 
            description={t('free.description')}
          />
        </div>
      </div>
    </section>
  );
} 