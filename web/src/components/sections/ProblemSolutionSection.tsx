import React from 'react';
import { useTranslations } from 'next-intl';
import ProblemSolutionCard from './ProblemSolutionCard';

export default function ProblemSolutionSection() {
  const t = useTranslations('problemSolution');

  return (
    <section id="about" className="py-20 px-6 bg-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          {t('title')}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <ProblemSolutionCard 
            type="problem"
            title={t('problem.title')}
            points={[
              t('problem.point1'),
              t('problem.point2'),
              t('problem.point3')
            ]}
            videoSrc="/assets/comparison-without-tool.mp4"
            videoPoster="/assets/branding/og-image.png"
            videoCaption={t('media.videoCaption.without')}
            videoFallback={t('media.videoFallback')}
          />

          <ProblemSolutionCard 
            type="solution"
            title={t('solution.title')}
            points={[
              t('solution.point1'),
              t('solution.point2'),
              t('solution.point3')
            ]}
            videoSrc="/assets/comparison-with-tool.mp4"
            videoPoster="/assets/branding/og-image.png"
            videoCaption={t('media.videoCaption.with')}
            videoFallback={t('media.videoFallback')}
          />
        </div>
      </div>
    </section>
  );
} 