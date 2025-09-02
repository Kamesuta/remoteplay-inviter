import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: IconDefinition;
  iconColor: 'blue' | 'purple' | 'green';
}

export default function FeatureCard({ title, description, icon, iconColor }: FeatureCardProps) {
  const getIconColor = (color: 'blue' | 'purple' | 'green') => {
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
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center hover:bg-slate-700/50 transition-all">
      <div className={`w-16 h-16 ${getIconColor(iconColor)} rounded-full flex items-center justify-center mx-auto mb-6`}>
        <FontAwesomeIcon icon={icon} className="text-2xl text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  );
} 