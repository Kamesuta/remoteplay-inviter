import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from '@/contexts/LocaleContext';

export default function HeroSection() {
  const { t, tData } = useTranslations();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slidesData = tData<{alt: string, title: string}[]>('hero.slides');
  const slides = [
    {
      src: "/assets/inviter_concept.svg",
      alt: Array.isArray(slidesData) ? slidesData[0]?.alt : "Remote Play Inviter Concept Diagram",
      title: Array.isArray(slidesData) ? slidesData[0]?.title : "Easy Invitation System"
    },
    {
      src: "/assets/inviter_concept_multiplay.svg", 
      alt: Array.isArray(slidesData) ? slidesData[1]?.alt : "Local Multiplayer with Remote Friends",
      title: Array.isArray(slidesData) ? slidesData[1]?.title : "Multiplayer Support"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium mb-6">
                {t('hero.badge')}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {(() => {
                const titleData = tData<{text: string, style: string, break?: boolean, nowrap?: boolean}[]>('hero.title');
                if (Array.isArray(titleData)) {
                  return titleData.map((segment: {text: string, style: string, break?: boolean, nowrap?: boolean}, index: number) => {
                    const getClassName = (style: string) => {
                      switch (style) {
                        case 'gradient':
                          return 'bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent';
                        case 'discord':
                          return 'text-indigo-400';
                        case 'white':
                        default:
                          return 'text-white';
                      }
                    };
                    
                    return (
                      <span key={index}>
                        {segment.break && <br />}
                        <span 
                          className={`${getClassName(segment.style)} ${segment.nowrap ? 'whitespace-nowrap' : ''}`}
                        >
                          {segment.text}
                        </span>
                      </span>
                    );
                  });
                }
                return t('hero.title');
              })()}
            </h1>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed">
              {t('hero.description')}<br />
              {t('hero.description2')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="#setup"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg text-center flex items-center justify-center gap-3"
              >
                <i className="fas fa-rocket"></i>
                {t('hero.getStarted')}
              </a>
              <a 
                href="https://github.com/Kamesuta/remoteplay-inviter" 
                target="_blank"
                className="px-8 py-4 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
              >
                <i className="fab fa-github"></i>
                {t('hero.viewGitHub')}
              </a>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 backdrop-blur-sm border border-slate-600/50">
              {/* Carousel container */}
              <div className="relative overflow-hidden rounded-lg">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {slides.map((slide, index) => (
                    <div key={index} className="w-full flex-shrink-0 flex items-center justify-center">
                      <Image 
                        src={slide.src}
                        alt={slide.alt}
                        width={600} 
                        height={400}
                        className="rounded-lg shadow-2xl max-w-full h-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Navigation dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentSlide === index 
                          ? 'bg-blue-500 scale-110' 
                          : 'bg-slate-400 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Slide title overlay */}
                <div className="absolute bottom-6 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-white text-sm font-medium">
                    {slides[currentSlide].title}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 