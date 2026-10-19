import React, { useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import LocalizedSvg from '@/components/LocalizedSvg';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export default function HeroSection() {
  const t = useTranslations('hero');
  const tDiagram = useTranslations('diagram');
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Get slide data - since next-intl doesn't support arrays directly, 
  // we'll access each slide individually
  const slides = [
    {
      src: "/assets/hero/concept-diagram.svg",
      alt: t('slides.0.alt'),
      title: t('slides.0.title'),
      isLocalizedSvg: true,
      textTranslations: {
        text1: {
          ja: "Discordでフレンドを招待",
          en: tDiagram('text1')
        },
        text2: {
          ja: "参加ボタン押すと自動で招待リンク発行！",
          en: tDiagram('text2')
        }
      } as { [key: string]: { ja: string; en: string } }
    },
    {
      src: "/assets/hero/multiplayer-concept.svg", 
      alt: t('slides.1.alt'),
      title: t('slides.1.title'),
      isLocalizedSvg: true,
      textTranslations: {
        multiplayer1: {
          ja: "離れたお友達と",
          en: tDiagram('multiplayer1')
        },
        multiplayer2: {
          ja: "ローカルマルチプレイ",
          en: tDiagram('multiplayer2')
        },
        multiplayer3: {
          ja: "参加者",
          en: tDiagram('multiplayer3')
        },
        multiplayer4: {
          ja: "はゲーム購入不要！",
          en: tDiagram('multiplayer4')
        }
      } as { [key: string]: { ja: string; en: string } }
    }
  ];

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );
  
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);
  
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative py-8 sm:py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium mb-6">
                {t('badge')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {t('title.0.text')}
              </span>
              <span className="text-white">
                {t('title.1.text')}
              </span>
              <span className="text-white">
                {t('title.2.text')}
              </span>
              <span className="text-indigo-400">
                {t('title.3.text')}
              </span>
              <span className="text-white">
                {t('title.4.text')}
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 mb-6 md:mb-8 lg:mb-12 leading-relaxed">
              {t('description')}<br />
              {t('description2')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="#setup"
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg text-center flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FontAwesomeIcon icon={faRocket} className="w-4 h-4" />
                {t('getStarted')}
              </a>
              <a 
                href="https://github.com/Kamesuta/remoteplay-inviter" 
                target="_blank"
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
                {t('viewGitHub')}
              </a>
            </div>
          </div>
          
          <div className="relative mt-6 sm:mt-8 lg:mt-0">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 backdrop-blur-sm border border-slate-600/50">
              {/* Embla Carousel container */}
              <div className="embla overflow-hidden rounded-lg aspect-[1/1] bg-slate-900/50" ref={emblaRef}>
                <div className="embla__container flex h-full">
                  {slides.map((slide, index) => (
                    <div key={index} className="embla__slide flex-[0_0_100%] min-w-0">
                      <div className="flex items-center justify-center h-full">
                        {slide.isLocalizedSvg ? (
                          <LocalizedSvg 
                            src={slide.src}
                            alt={slide.alt}
                            className="rounded-lg shadow-2xl w-full h-full"
                            textTranslations={slide.textTranslations || {}}
                          />
                        ) : (
                          <Image 
                            src={slide.src}
                            alt={slide.alt}
                            width={600} 
                            height={400}
                            className="rounded-lg shadow-2xl w-full h-auto object-contain"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Navigation dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollTo(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        selectedIndex === index 
                          ? 'bg-blue-500 scale-110' 
                          : 'bg-slate-400 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Slide title overlay */}
                <div className="absolute bottom-6 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 max-w-[calc(100%-2rem)]">
                  <span className="text-white text-xs sm:text-sm font-medium truncate block">
                    {slides[selectedIndex]?.title}
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