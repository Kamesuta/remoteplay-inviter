import React from 'react';
import Image from 'next/image';

interface HowToUseStepProps {
  stepNumber: number;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  stepColor: 'blue' | 'purple' | 'green';
  codeExample?: string;
  reversed?: boolean;
}

export default function HowToUseStep({
  stepNumber,
  title,
  description,
  imageSrc,
  imageAlt,
  stepColor,
  codeExample,
  reversed = false
}: HowToUseStepProps) {
  const getStepColor = (color: 'blue' | 'purple' | 'green') => {
    switch (color) {
      case 'blue':
        return 'bg-blue-600';
      case 'purple':
        return 'bg-purple-600';
      case 'green':
        return 'bg-green-600';
    }
  };

  const textContent = (
    <div className={reversed ? "md:order-2" : ""}>
      <div className="flex items-center mb-4">
        <span className={`w-8 h-8 ${getStepColor(stepColor)} rounded-full flex items-center justify-center text-white font-bold mr-4`}>
          {stepNumber}
        </span>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
      </div>
      <p className="text-slate-300 mb-4">
        {description}
      </p>
      {codeExample && (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 font-mono text-green-400">
          {codeExample}
        </div>
      )}
    </div>
  );

  const imageContent = (
    <div className={`${reversed ? "md:order-1" : ""} bg-slate-800/50 border border-slate-700 rounded-xl p-6`}>
      <Image 
        src={imageSrc} 
        alt={imageAlt} 
        width={400} 
        height={300} 
        className="rounded-lg border border-slate-600"
      />
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      {textContent}
      {imageContent}
    </div>
  );
} 