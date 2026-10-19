import React from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
      <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
        <span>{question}</span>
        <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <p className="text-slate-300 mt-4 leading-relaxed">
        {answer}
      </p>
    </details>
  );
} 