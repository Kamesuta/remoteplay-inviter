"use client";
import React from "react";
import Navigation from '@/components/sections/Navigation';
import HeroSection from '@/components/sections/HeroSection';
import ProblemSolutionSection from '@/components/sections/ProblemSolutionSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import SetupSection from '@/components/sections/SetupSection';
import HowToUseSection from '@/components/sections/HowToUseSection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';
import Footer from '@/components/sections/Footer';

export default function HomePageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <Navigation />
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <SetupSection />
      <HowToUseSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}