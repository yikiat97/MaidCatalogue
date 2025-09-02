import React from 'react';
import { useAnimation } from '../../hooks/useAnimation';
import HelperFinderCard from './HelperFinderCard';

const HeroSection = () => {
  const { elementRef: headingRef, isVisible: isHeadingVisible } = useAnimation(0.3);
  const { elementRef: descRef, isVisible: isDescVisible } = useAnimation(0.2);
  const { elementRef: cardRef, isVisible: isCardVisible } = useAnimation(0.1);

  return (
    <section 
      className="relative flex items-center bg-gray-100"
      style={{
        minHeight: '100svh', // Safe viewport height for mobile
        height: '100vh',
        paddingTop: '96px' // Account for fixed navbar h-24 (96px)
      }}
    >
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/assets/0828.mp4" type="video/mp4" />
        {/* Fallback image for browsers that don't support video */}
        <img src="/images/hero-bg.jpg" alt="Hero background" className="w-full h-full object-cover" />
      </video>
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
      <div className="max-w-[1440px] w-full mx-auto px-4 relative z-20">
        {/* Main Heading */}
        <div 
          ref={headingRef}
          className={`text-center mb-4 sm:mb-6 md:mb-8 transition-all duration-1000 ease-out ${
            isHeadingVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-inter font-extrabold leading-tight capitalize">
            <span className="text-white">Most </span>
            <span className="text-[#ff690d]">affordable</span>
            <span className="text-white"> maid agency in Singapore</span>
          </h1>
        </div>

        {/* Description */}
        <div 
          ref={descRef}
          className={`text-center mb-4 sm:mb-6 md:mb-8 md:px-24 transition-all duration-1000 ease-out delay-300 ${
            isDescVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-inter font-normal leading-relaxed text-white">
            With one of our packages carrying absolutely no service fee, we are proud to be the most affordable maid agency in Singapore<span className="hidden sm:inline">—so every family can bring a helper home without stretching their budget. Beyond cost savings, our fee structure is fully transparent</span>
          </p>
        </div>

        {/* Helper Finder Card */}
        <div 
          ref={cardRef}
          className={`transition-all duration-1000 ease-out delay-500 ${
            isCardVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <HelperFinderCard />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
