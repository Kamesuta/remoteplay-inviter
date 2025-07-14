"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from '@/contexts/LocaleContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const { t, tData } = useTranslations();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      src: "/assets/inviter_concept.svg",
      alt: "Remote Play Inviter コンセプト図",
      title: "簡単な招待システム"
    },
    {
      src: "/assets/inviter_concept_multiplay.svg",
      alt: "離れたお友達とローカルマルチプレイ",
      title: "マルチプレイヤー対応"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
              <Image 
                src="/assets/remoteplay_inviter.png" 
                alt="Remote Play Inviter Icon" 
                width={32} 
                height={32}
                className="object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-white">Remote Play Inviter</h1>
          </div>
          <div className="flex items-center space-x-6">
            <a 
              href="#about"
              className="px-4 py-2 text-blue-300 hover:text-blue-200 transition-colors"
            >
              {t('nav.features')}
            </a>
            <a 
              href="#setup"
              className="px-4 py-2 text-blue-300 hover:text-blue-200 transition-colors"
            >
              {t('nav.setup')}
            </a>
            <a 
              href="#download"
              className="px-4 py-2 text-blue-300 hover:text-blue-200 transition-colors"
            >
              {t('nav.download')}
            </a>
            <a 
              href="https://github.com/Kamesuta/remoteplay-inviter" 
              target="_blank"
              className="px-4 py-2 text-blue-300 hover:text-blue-200 transition-colors"
            >
              {t('nav.github')}
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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

      {/* Problem vs Solution */}
      <section id="about" className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            {t('problemSolution.title')}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Problem */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <i className="fas fa-times text-3xl mr-4 text-red-400"></i>
                <h3 className="text-2xl font-bold text-red-300">{t('problemSolution.problem.title')}</h3>
              </div>
              <ul className="space-y-4 text-slate-300 mb-6">
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 mt-1">•</span>
                  {t('problemSolution.problem.point1')}
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 mt-1">•</span>
                  {t('problemSolution.problem.point2')}
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 mt-1">•</span>
                  {t('problemSolution.problem.point3')}
                </li>
              </ul>
              <div className="rounded-lg overflow-hidden border border-red-500/30">
                <video 
                  className="w-full h-auto" 
                  controls 
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                  poster="/assets/remoteplay_inviter_og.png"
                >
                  <source src="/assets/without_inviter.mp4" type="video/mp4" />
                  お使いのブラウザは動画再生に対応していません。
                </video>
                <div className="p-3 bg-red-900/30">
                  <p className="text-red-300 text-sm font-medium">従来の方法：手動でのリンク発行</p>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <i className="fas fa-check text-3xl mr-4 text-green-400"></i>
                <h3 className="text-2xl font-bold text-green-300">{t('problemSolution.solution.title')}</h3>
              </div>
              <ul className="space-y-4 text-slate-300 mb-6">
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">•</span>
                  {t('problemSolution.solution.point1')}
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">•</span>
                  {t('problemSolution.solution.point2')}
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">•</span>
                  {t('problemSolution.solution.point3')}
                </li>
              </ul>
              <div className="rounded-lg overflow-hidden border border-green-500/30">
                <video 
                  className="w-full h-auto" 
                  controls 
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                  poster="/assets/remoteplay_inviter_og.png"
                >
                  <source src="/assets/with_inviter.mp4" type="video/mp4" />
                  お使いのブラウザは動画再生に対応していません。
                </video>
                <div className="p-3 bg-green-900/30">
                  <p className="text-green-300 text-sm font-medium">Remote Play Inviter：自動化された招待</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">{t('features.title')}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center hover:bg-slate-700/50 transition-all">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fab fa-discord text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('features.discord.title')}</h3>
              <p className="text-slate-300">{t('features.discord.description')}</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center hover:bg-slate-700/50 transition-all">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-link text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('features.autoInvite.title')}</h3>
              <p className="text-slate-300">{t('features.autoInvite.description')}</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center hover:bg-slate-700/50 transition-all">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-dollar-sign text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('features.free.title')}</h3>
              <p className="text-slate-300">{t('features.free.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Instructions */}
      <section id="setup" className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            {t('setup.title')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative h-full">
              <div className="bg-slate-800/70 border border-slate-600 rounded-xl p-8 text-center h-full flex flex-col">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="mt-6 mb-6 h-56 flex items-center justify-center rounded-lg overflow-hidden">
                  <Image src="/assets/invite_bot.png" alt="BOT招待画面" width={300} height={180} className="max-w-full max-h-full object-contain rounded-lg" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{t('setup.step1.title')}</h3>
                <p className="text-slate-300 mb-4 flex-grow">{t('setup.step1.description')}</p>
                <a 
                  href="https://discord.com/oauth2/authorize?client_id=1252429340780527714" 
                  target="_blank"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fab fa-discord"></i>
                  {t('setup.step1.button')}
                </a>
              </div>
            </div>

            <div className="relative h-full">
              <div className="bg-slate-800/70 border border-slate-600 rounded-xl p-8 text-center h-full flex flex-col">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="mt-6 mb-6 h-56 flex items-center justify-center rounded-lg overflow-hidden">
                  <Image src="/assets/inviter_client.png" alt="クライアント画面" width={300} height={180} className="max-w-full max-h-full object-contain rounded-lg" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{t('setup.step2.title')}</h3>
                <p className="text-slate-300 mb-4 flex-grow">{t('setup.step2.description')}</p>
                <a 
                  href="https://github.com/Kamesuta/remoteplay-inviter/releases/latest/download/remoteplay-inviter.exe" 
                  target="_blank"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-download"></i>
                  {t('setup.step2.button')}
                </a>
              </div>
            </div>

            <div className="relative h-full">
              <div className="bg-slate-800/70 border border-slate-600 rounded-xl p-8 text-center h-full flex flex-col">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="mt-6 mb-6 h-56 flex items-center justify-center rounded-lg overflow-hidden">
                  <Image src="/assets/inviter_setup.png" alt="セットアップ画面" width={300} height={180} className="max-w-full max-h-full object-contain rounded-lg" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{t('setup.step3.title')}</h3>
                <p className="text-slate-300 mb-4 flex-grow">{t('setup.step3.description')}</p>
                <div className="px-6 py-2 bg-slate-700 text-slate-300 rounded-lg font-mono text-sm">
                  /steam invite client_id:...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-8">
            {t('howToUse.title')}
          </h2>
          <p className="text-center text-slate-300 mb-16 text-lg">
            {t('howToUse.subtitle')}
          </p>
          
          {/* Demo Video */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                <i className="fas fa-play-circle mr-2"></i>{t('howToUse.videoTitle')}
              </h3>
              <div className="rounded-lg overflow-hidden border border-slate-600">
                <video 
                  className="w-full h-auto" 
                  controls 
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                  poster="/assets/remoteplay_inviter_og.png"
                >
                  <source src="/assets/howto_invite_join.mp4" type="video/mp4" />
                  お使いのブラウザは動画再生に対応していません。
                </video>
              </div>
              <p className="text-slate-300 text-center mt-4">
                {t('howToUse.videoDescription')}
              </p>
            </div>
          </div>
          
          <div className="space-y-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">1</span>
                  <h3 className="text-2xl font-bold text-white">{t('howToUse.step1.title')}</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  {t('howToUse.step1.description')}
                </p>
                <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 font-mono text-green-400">
                  /steam invite
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <Image 
                  src="/assets/invite_panel.png" 
                  alt="Discord招待パネル" 
                  width={400} 
                  height={300} 
                  className="rounded-lg border border-slate-600"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <div className="flex items-center mb-4">
                  <span className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">2</span>
                  <h3 className="text-2xl font-bold text-white">{t('howToUse.step2.title')}</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  {t('howToUse.step2.description')}
                </p>
              </div>
              <div className="md:order-1 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <Image 
                  src="/assets/invite_join.png" 
                  alt="参加ボタンを押した画面" 
                  width={400} 
                  height={250} 
                  className="rounded-lg border border-slate-600"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">3</span>
                  <h3 className="text-2xl font-bold text-white">{t('howToUse.step3.title')}</h3>
                </div>
                <p className="text-slate-300">
                  {t('howToUse.step3.description')}
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <Image 
                  src="/assets/invite_steam.png" 
                  alt="Steam Remote Play Together画面" 
                  width={400} 
                  height={300} 
                  className="rounded-lg border border-slate-600"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">{t('faq.title')}</h2>
          
          <div className="space-y-6">
            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>{t('faq.q1.question')}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                {t('faq.q1.answer')}
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>{t('faq.q2.question')}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                {t('faq.q2.answer')}
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>{t('faq.q3.question')}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                {t('faq.q3.answer')}
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>{t('faq.q4.question')}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                {t('faq.q4.answer')}
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>{t('faq.q5.question')}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                {t('faq.q5.answer')}
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>{t('faq.q6.question')}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                {t('faq.q6.answer')}
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>{t('faq.q7.question')}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                {t('faq.q7.answer')}
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>{t('faq.q8.question')}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                {t('faq.q8.answer')}
              </p>
            </details>

            <details className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 group">
              <summary className="text-xl font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>{t('faq.q9.question')}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-slate-300 mt-4 leading-relaxed">
                {t('faq.q9.answer')}
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="py-20 px-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-slate-300 mb-12">
            {t('cta.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://discord.com/oauth2/authorize?client_id=1252429340780527714" 
              target="_blank"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-center flex items-center justify-center gap-2"
            >
              <i className="fab fa-discord"></i>
              {t('cta.inviteBot')}
            </a>
            <a 
              href="https://github.com/Kamesuta/remoteplay-inviter/releases/latest/download/remoteplay-inviter.exe" 
              target="_blank"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-center flex items-center justify-center gap-2"
            >
              <i className="fas fa-download"></i>
              {t('cta.downloadClient')}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
              <Image 
                src="/assets/remoteplay_inviter.png" 
                alt="Remote Play Inviter Icon" 
                width={24} 
                height={24}
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold text-white">Remote Play Inviter</span>
          </div>
          <p className="text-slate-400 mb-6">
            {t('footer.description')}<br />
            <a href="https://store.steampowered.com/remoteplay_together?l=japanese" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">Steam Remote Play Together</a>{t('footer.description2')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a href="https://github.com/Kamesuta/remoteplay-inviter" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
              {t('footer.sourceCode.client')}
            </a>
            <a href="https://github.com/Kamesuta/remoteplay-inviter-bot" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
              {t('footer.sourceCode.bot')}
            </a>
            <a href="https://github.com/Kamesuta/remoteplay-inviter-web" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
              {t('footer.sourceCode.web')}
            </a>
          </div>
          
          <div className="text-slate-500 text-sm">
            <p className="mb-2">
              © <a href="https://github.com/Kamesuta" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">Kamesuta</a>
            </p>
            <p>
              {t('footer.license')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
