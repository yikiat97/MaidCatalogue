import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ServicePricingCards from '../../components/Services/ServicePricingCards';
import PaymentTimeline from '../../components/common/PaymentTimeline';
import ProcessSection from '../Home/ProcessSection';
import { Button } from '../../components/ui/button';
import { useAnimation } from '../../hooks/useAnimation';

const ServicesPage = () => {
  const navigate = useNavigate();
  const { elementRef: titleRef, isVisible: isTitleVisible } = useAnimation(0.3);

  // WhatsApp consultation handler
  const handleConsultantWhatsApp = () => {
    const message = "Hello! I'd like to speak to a consultant about your maid services.";
    const phoneNumber = "6588270086";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-12">
        {/* Hero Section */}
        <section 
          className="bg-cover bg-center bg-no-repeat relative overflow-hidden"
          style={{
            backgroundImage: "url('/images/easyhire-cover.svg')",
            height: 'clamp(300px, 40vh, 450px)',
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


        {/* Service Pricing Cards */}
        <ServicePricingCards />

        {/* Process Section */}
        <ProcessSection />

        {/* Payment Timeline Section */}
        <PaymentTimeline />

        {/* Call to Action Section */}
        <section className="py-4 md:py-12 lg:py-16 bg-[#ff690d] text-white relative overflow-hidden">
          <div className="max-w-[1440px] w-full mx-auto px-4 text-center relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold leading-tight mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Join hundreds of satisfied families who have found their perfect domestic helper through our comprehensive services.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center px-4">
              <Button
                size="lg"
                onClick={() => navigate('/catalogue')}
                className="bg-white text-[#ff690d] hover:bg-gray-100 px-6 md:px-8 py-3 text-base md:text-lg font-semibold transition-all duration-200 transform hover:scale-105 w-full sm:w-auto">
                FIND A HELPER NOW
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleConsultantWhatsApp}
                className="border-white text-white hover:bg-white hover:text-primary-orange hover:border-primary-orange px-6 md:px-8 py-3 text-base md:text-lg font-semibold transition-all duration-200 w-full sm:w-auto">
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