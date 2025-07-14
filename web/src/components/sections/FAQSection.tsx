import React from 'react';
import { useTranslations } from '@/contexts/LocaleContext';
import FAQItem from './FAQItem';

export default function FAQSection() {
  const { t } = useTranslations();

  return (
    <section className="py-20 px-6 bg-slate-800/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          {t('faq.title')}
        </h2>
        
        <div className="space-y-6">
          <FAQItem 
            question={t('faq.q1.question')} 
            answer={t('faq.q1.answer')} 
          />

          <FAQItem 
            question={t('faq.q2.question')} 
            answer={t('faq.q2.answer')} 
          />

          <FAQItem 
            question={t('faq.q3.question')} 
            answer={t('faq.q3.answer')} 
          />

          <FAQItem 
            question={t('faq.q4.question')} 
            answer={t('faq.q4.answer')} 
          />

          <FAQItem 
            question={t('faq.q5.question')} 
            answer={t('faq.q5.answer')} 
          />

          <FAQItem 
            question={t('faq.q6.question')} 
            answer={t('faq.q6.answer')} 
          />

          <FAQItem 
            question={t('faq.q7.question')} 
            answer={t('faq.q7.answer')} 
          />

          <FAQItem 
            question={t('faq.q8.question')} 
            answer={t('faq.q8.answer')} 
          />

          <FAQItem 
            question={t('faq.q9.question')} 
            answer={t('faq.q9.answer')} 
          />
        </div>
      </div>
    </section>
  );
} 