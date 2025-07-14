import React from 'react';
import { useTranslations } from '@/contexts/LocaleContext';
import ProblemSolutionCard from './ProblemSolutionCard';

export default function ProblemSolutionSection() {
  const { t } = useTranslations();

  return (
    <section id="about" className="py-20 px-6 bg-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          {t('problemSolution.title')}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <ProblemSolutionCard 
            type="problem"
            title={t('problemSolution.problem.title')}
            points={[
              t('problemSolution.problem.point1'),
              t('problemSolution.problem.point2'),
              t('problemSolution.problem.point3')
            ]}
            videoSrc="/assets/without_inviter.mp4"
            videoPoster="/assets/remoteplay_inviter_og.png"
            videoCaption={t('media.videoCaption.without')}
            videoFallback={t('media.videoFallback')}
          />

          <ProblemSolutionCard 
            type="solution"
            title={t('problemSolution.solution.title')}
            points={[
              t('problemSolution.solution.point1'),
              t('problemSolution.solution.point2'),
              t('problemSolution.solution.point3')
            ]}
            videoSrc="/assets/with_inviter.mp4"
            videoPoster="/assets/remoteplay_inviter_og.png"
            videoCaption={t('media.videoCaption.with')}
            videoFallback={t('media.videoFallback')}
          />
        </div>
      </div>
    </section>
  );
} 