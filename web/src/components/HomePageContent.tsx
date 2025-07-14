"use client";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from '@/contexts/LocaleContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import FAQItem from '@/components/sections/FAQItem';
import SetupCard from '@/components/sections/SetupCard';
import FeatureCard from '@/components/sections/FeatureCard';
import HowToUseStep from '@/components/sections/HowToUseStep';
import ProblemSolutionCard from '@/components/sections/ProblemSolutionCard';

export default function HomePageContent() {
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

            {/* Solution */}
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

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">{t('features.title')}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="fab fa-discord" 
              iconColor="blue"
              title={t('features.discord.title')} 
              description={t('features.discord.description')}
            />

            <FeatureCard 
              icon="fas fa-link" 
              iconColor="purple"
              title={t('features.autoInvite.title')} 
              description={t('features.autoInvite.description')}
            />

            <FeatureCard 
              icon="fas fa-dollar-sign" 
              iconColor="green"
              title={t('features.free.title')} 
              description={t('features.free.description')}
            />
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
            <SetupCard 
              stepNumber={1} 
              title={t('setup.step1.title')} 
              description={t('setup.step1.description')} 
              imageSrc="/assets/invite_bot.png"
              imageAlt={t('media.altText.botInvite')}
              buttonText={t('setup.step1.button')} 
              buttonHref="https://discord.com/oauth2/authorize?client_id=1252429340780527714" 
              buttonColor="blue"
              buttonIcon="fab fa-discord"
            />

            <SetupCard 
              stepNumber={2} 
              title={t('setup.step2.title')} 
              description={t('setup.step2.description')} 
              imageSrc="/assets/inviter_client.png"
              imageAlt={t('media.altText.clientScreen')}
              buttonText={t('setup.step2.button')} 
              buttonHref="https://github.com/Kamesuta/remoteplay-inviter/releases/latest/download/remoteplay-inviter.exe" 
              buttonColor="purple"
              buttonIcon="fas fa-download"
            />

            <SetupCard 
              stepNumber={3} 
              title={t('setup.step3.title')} 
              description={t('setup.step3.description')} 
              imageSrc="/assets/inviter_setup.png"
              imageAlt={t('media.altText.setupScreen')}
              buttonText="/steam invite client_id:..."
              buttonHref=""
              buttonColor="green"
              isCodeExample={true}
            />
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
                  {t('media.videoFallback')}
                </video>
              </div>
              <p className="text-slate-300 text-center mt-4">
                {t('howToUse.videoDescription')}
              </p>
            </div>
          </div>
          
          <div className="space-y-12">
            <HowToUseStep 
              stepNumber={1} 
              title={t('howToUse.step1.title')} 
              description={t('howToUse.step1.description')} 
              imageSrc="/assets/invite_panel.png"
              imageAlt={t('media.altText.discordPanel')}
              stepColor="blue"
              codeExample="/steam invite"
            />

            <HowToUseStep 
              stepNumber={2} 
              title={t('howToUse.step2.title')} 
              description={t('howToUse.step2.description')} 
              imageSrc="/assets/invite_join.png" 
              imageAlt={t('media.altText.joinButton')} 
              stepColor="purple"
              reversed={true}
            />

            <HowToUseStep 
              stepNumber={3} 
              title={t('howToUse.step3.title')} 
              description={t('howToUse.step3.description')} 
              imageSrc="/assets/invite_steam.png" 
              imageAlt={t('media.altText.steamScreen')} 
              stepColor="green"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">{t('faq.title')}</h2>
          
          <div className="space-y-6">
            <FAQItem 
              question={t('faq.q1.question')} 
              answer={t('faq.q1.answer')} 
            />

            <FAQItem 
              question={t('faq.q2.question')} 
              answer={t('faq.q2.answer')} 
            />

            <FAQItem 
              question={t('faq.q3.question')} 
              answer={t('faq.q3.answer')} 
            />

            <FAQItem 
              question={t('faq.q4.question')} 
              answer={t('faq.q4.answer')} 
            />

            <FAQItem 
              question={t('faq.q5.question')} 
              answer={t('faq.q5.answer')} 
            />

            <FAQItem 
              question={t('faq.q6.question')} 
              answer={t('faq.q6.answer')} 
            />

            <FAQItem 
              question={t('faq.q7.question')} 
              answer={t('faq.q7.answer')} 
            />

            <FAQItem 
              question={t('faq.q8.question')} 
              answer={t('faq.q8.answer')} 
            />

            <FAQItem 
              question={t('faq.q9.question')} 
              answer={t('faq.q9.answer')} 
            />
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