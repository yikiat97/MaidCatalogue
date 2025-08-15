import React from 'react';
import { useAnimation } from '../../hooks/useAnimation';

const HeroSection = () => {
  const { elementRef: headingRef, isVisible: isHeadingVisible } = useAnimation(0.3);
  const { elementRef: descRef, isVisible: isDescVisible } = useAnimation(0.2);
  const { elementRef: imageRef, isVisible: isImageVisible } = useAnimation(0.1);

  return (
    <section className="bg-[#f8f8f8] py-12 md:py-16">
      <div className="max-w-6xl w-full mx-auto px-4">
        {/* Main Heading */}
        <div 
          ref={headingRef}
          className={`text-center mb-8 transition-all duration-1000 ease-out ${
            isHeadingVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-inter font-extrabold leading-tight capitalize">
            <span className="text-black">Most </span>
            <span className="text-[#ff690d]">affordable</span>
            <span className="text-black"> maid agency in Singapore</span>
          </h1>
        </div>

        {/* Description */}
        <div 
          ref={descRef}
          className={`text-center mb-8 md:px-24 transition-all duration-1000 ease-out delay-300 ${
            isDescVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-base sm:text-lg md:text-xl font-inter font-normal leading-relaxed text-black">
            With one of our packages carrying absolutely no service fee, we are proud to be the most affordable maid agency in Singapore—so every family can bring a helper home without stretching their budget. Beyond cost savings, our fee structure is fully transparent
          </p>
        </div>

        {/* Hero Image */}
        <div 
          ref={imageRef}
          className={`flex justify-center transition-all duration-1000 ease-out delay-500 ${
            isImageVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <img
            src="/images/img_rectangle_5.png"
            alt="Maid Agency Services"
            className="w-full max-w-3xl h-auto rounded-2xl object-cover animate-float"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
