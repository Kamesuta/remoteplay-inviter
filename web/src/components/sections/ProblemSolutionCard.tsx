import React from 'react';

interface ProblemSolutionCardProps {
  type: 'problem' | 'solution';
  title: string;
  points: string[];
  videoSrc: string;
  videoCaption: string;
  videoFallback: string;
  videoPoster: string;
}

export default function ProblemSolutionCard({
  type,
  title,
  points,
  videoSrc,
  videoCaption,
  videoFallback,
  videoPoster
}: ProblemSolutionCardProps) {
  const isProblem = type === 'problem';
  const colorClasses = isProblem ? {
    container: 'bg-red-900/20 border-red-500/30',
    icon: 'fas fa-times text-red-400',
    titleColor: 'text-red-300',
    bulletColor: 'text-red-400',
    videoBorder: 'border-red-500/30',
    videoBackground: 'bg-red-900/30',
    videoCaptionColor: 'text-red-300'
  } : {
    container: 'bg-green-900/20 border-green-500/30',
    icon: 'fas fa-check text-green-400',
    titleColor: 'text-green-300',
    bulletColor: 'text-green-400',
    videoBorder: 'border-green-500/30',
    videoBackground: 'bg-green-900/30',
    videoCaptionColor: 'text-green-300'
  };

  return (
    <div className={`${colorClasses.container} border rounded-xl p-8`}>
      <div className="flex items-center mb-6">
        <i className={`${colorClasses.icon} text-3xl mr-4`}></i>
        <h3 className={`text-2xl font-bold ${colorClasses.titleColor}`}>{title}</h3>
      </div>
      <ul className="space-y-4 text-slate-300 mb-6">
        {points.map((point, index) => (
          <li key={index} className="flex items-start">
            <span className={`${colorClasses.bulletColor} mr-3 mt-1`}>•</span>
            {point}
          </li>
        ))}
      </ul>
      <div className={`rounded-lg overflow-hidden border ${colorClasses.videoBorder}`}>
        <video 
          className="w-full h-auto" 
          controls 
          autoPlay
          muted
          loop
          preload="metadata"
          poster={videoPoster}
        >
          <source src={videoSrc} type="video/mp4" />
          {videoFallback}
        </video>
        <div className={`p-3 ${colorClasses.videoBackground}`}>
          <p className={`${colorClasses.videoCaptionColor} text-sm font-medium`}>{videoCaption}</p>
        </div>
      </div>
    </div>
  );
} 