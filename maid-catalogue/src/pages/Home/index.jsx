import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import HeroSection from '../../components/common/HeroSection';
import TestimonialsSection from './TestimonialsSection';
import AboutSection from './AboutSection';
import PromisesSection from './PromisesSection';
import ProcessSection from './ProcessSection';
import HelperProfilesSection from './HelperProfilesSection';
import FAQSection from './FAQSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <TestimonialsSection />
        <AboutSection />
        <PromisesSection />
        <ProcessSection />
        <HelperProfilesSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;