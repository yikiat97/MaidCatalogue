import React from 'react';
import { useAnimation } from '../../hooks/useAnimation';
import HelperFinderCard from './HelperFinderCard';

const HeroSection = () => {
  const { elementRef: headingRef, isVisible: isHeadingVisible } = useAnimation(0.3);
  const { elementRef: descRef, isVisible: isDescVisible } = useAnimation(0.2);
  const { elementRef: cardRef, isVisible: isCardVisible } = useAnimation(0.1);

  return (
    <section 
      className="hero-section relative flex items-center bg-gray-100"
      style={{
        minHeight: '100svh',
        height: '100vh',
        paddingTop: 'var(--spacing-hero-top-mobile)',
        '--spacing-hero-top-mobile': 'clamp(4rem, 8vh, 6rem)'
      }}
    >
      {/* Image Background */}
      <img 
        src="/images/all-staff.PNG" 
        alt="Staff group photo" 
        className="absolute top-0 left-0 w-full h-full object-cover z-0" 
        style={{ 
          objectPosition: 'center center',
          aspectRatio: '16/9'
        }}
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
      <div className="container-responsive w-full relative z-20">
        {/* Main Heading */}
        <div 
          ref={headingRef}
          className={`text-center transition-all duration-1000 ease-out ${
            isHeadingVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{
            marginBottom: 'clamp(1rem, 3vw, 2rem)'
          }}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-inter font-extrabold leading-tight capitalize px-2 xs:px-4">
            <span className="text-white">Most </span>
            <span className="text-[#ff690d]">affordable</span>
            <span className="text-white"> maid agency in Singapore</span>
          </h1>
        </div>

        {/* Description */}
        <div 
          ref={descRef}
          className={`text-center transition-all duration-1000 ease-out delay-300 ${
            isDescVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{
            marginBottom: 'clamp(1.5rem, 4vw, 3rem)',
            paddingLeft: 'clamp(1rem, 8vw, 6rem)',
            paddingRight: 'clamp(1rem, 8vw, 6rem)'
          }}
        >
          <p className="text-responsive-desc font-inter font-normal text-white max-w-4xl mx-auto">
            <span className="hidden xxs:inline">With one of our packages carrying absolutely no service fee, we are proud to be the most affordable maid agency in Singapore</span>
            <span className="hidden sm:inline">—so every family can bring a helper home without stretching their budget. Beyond cost savings, our fee structure is fully transparent</span>
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
          style={{
            maxWidth: '100%',
            width: '100%'
          }}
        >
          <HelperFinderCard />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
