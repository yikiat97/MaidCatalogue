import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import HelperServicesSection from '../../components/common/HelperServicesSection';
import PaymentTimeline from '../../components/common/PaymentTimeline';
import { Button } from '../../components/ui/button';
import { useAnimation } from '../../hooks/useAnimation';

const ServicesPage = () => {
  const { elementRef: titleRef, isVisible: isTitleVisible } = useAnimation(0.3);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-12">
        {/* Hero Section */}
        <section 
          className="bg-cover bg-center bg-no-repeat relative overflow-hidden"
          style={{
            backgroundImage: "url('/images/easyhire-cover.svg')",
            height: '50vh',
            paddingTop: '30px' // Account for fixed navbar
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
          
          <div className="max-w-[1440px] w-full px-4 mx-auto relative z-20 h-full flex items-center">
            <div className="w-full text-center">
              <div 
                ref={titleRef}
                className={`mb-8 transition-all duration-1000 ease-out ${
                  isTitleVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-inter font-extrabold leading-tight">
                  <span className="text-white">Our </span>
                  <span className="text-[#ff690d]">Services</span>
                </h1>
                <p className="text-lg md:text-xl text-white mt-6 max-w-3xl mx-auto">
                  Comprehensive domestic helper services designed to make your hiring journey smooth, affordable, and stress-free.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Helper Services Section */}
        <HelperServicesSection />

        {/* Payment Timeline Section */}
        <PaymentTimeline />

        {/* Call to Action Section */}
        <section className="py-16 bg-[#ff690d] text-white relative overflow-hidden">
          <div className="max-w-[1440px] w-full mx-auto px-4 text-center relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold leading-tight mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied families who have found their perfect domestic helper through our comprehensive services.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Button 
                size="lg" 
                className="bg-white text-[#ff690d] hover:bg-gray-100 px-8 py-3 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                FIND A HELPER NOW
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-[#ff690d] px-8 py-3 text-lg font-semibold transition-all duration-200"
              >
                SPEAK TO CONSULTANT
              </Button>
            </div>
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-32 h-32 bg-white/10 rounded-full animate-float"
                 style={{ 
                   top: '20%', left: '10%',
                   animationDelay: '0s',
                   animationDuration: '8s'
                 }}></div>
            <div className="absolute w-24 h-24 bg-white/10 rounded-full animate-float"
                 style={{ 
                   bottom: '30%', right: '15%',
                   animationDelay: '2s',
                   animationDuration: '6s'
                 }}></div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServicesPage;