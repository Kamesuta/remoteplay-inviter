import React from 'react';
import Image from 'next/image';

interface SetupCardProps {
  stepNumber: number;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  buttonText: string;
  buttonHref: string;
  buttonColor: 'blue' | 'purple' | 'green';
  buttonIcon?: string;
  isCodeExample?: boolean;
}

export default function SetupCard({
  stepNumber,
  title,
  description,
  imageSrc,
  imageAlt,
  buttonText,
  buttonHref,
  buttonColor,
  buttonIcon,
  isCodeExample = false
}: SetupCardProps) {
  const getButtonColors = (color: 'blue' | 'purple' | 'green') => {
    switch (color) {
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'green':
        return 'bg-green-600 hover:bg-green-700';
    }
  };

  const getStepNumberColor = (color: 'blue' | 'purple' | 'green') => {
    switch (color) {
      case 'blue':
        return 'bg-blue-600';
      case 'purple':
        return 'bg-purple-600';
      case 'green':
        return 'bg-green-600';
    }
  };

  return (
    <div className="relative h-full">
      <div className="bg-slate-800/70 border border-slate-600 rounded-xl p-8 text-center h-full flex flex-col">
        <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 ${getStepNumberColor(buttonColor)} rounded-full flex items-center justify-center text-white font-bold`}>
          {stepNumber}
        </div>
        <div className="mt-6 mb-6 h-56 flex items-center justify-center rounded-lg overflow-hidden">
          <Image 
            src={imageSrc} 
            alt={imageAlt} 
            width={300} 
            height={180} 
            className="max-w-full max-h-full object-contain rounded-lg" 
          />
        </div>
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-slate-300 mb-4 flex-grow">{description}</p>
        
        {isCodeExample ? (
          <div className="px-6 py-2 bg-slate-700 text-slate-300 rounded-lg font-mono text-sm">
            {buttonText}
          </div>
        ) : (
          <a 
            href={buttonHref} 
            target="_blank"
            className={`px-6 py-2 ${getButtonColors(buttonColor)} text-white rounded-lg transition-colors flex items-center justify-center gap-2`}
          >
            {buttonIcon && <i className={buttonIcon}></i>}
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
} 