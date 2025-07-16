import React from 'react';
import { useTranslations } from 'next-intl';
import FAQItem from './FAQItem';

export default function FAQSection() {
  const t = useTranslations('faq');

  return (
    <section className="py-20 px-6 bg-slate-800/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          {t('title')}
        </h2>
        
        <div className="space-y-6">
          <FAQItem 
            question={t('q1.question')} 
            answer={t('q1.answer')} 
          />

          <FAQItem 
            question={t('q2.question')} 
            answer={t('q2.answer')} 
          />

          <FAQItem 
            question={t('q3.question')} 
            answer={t('q3.answer')} 
          />

          <FAQItem 
            question={t('q4.question')} 
            answer={t('q4.answer')} 
          />

          <FAQItem 
            question={t('q5.question')} 
            answer={t('q5.answer')} 
          />

          <FAQItem 
            question={t('q6.question')} 
            answer={t('q6.answer')} 
          />

          <FAQItem 
            question={t('q7.question')} 
            answer={t('q7.answer')} 
          />

          <FAQItem 
            question={t('q8.question')} 
            answer={t('q8.answer')} 
          />

          <FAQItem 
            question={t('q9.question')} 
            answer={t('q9.answer')} 
          />
        </div>
      </div>
    </section>
  );
} 