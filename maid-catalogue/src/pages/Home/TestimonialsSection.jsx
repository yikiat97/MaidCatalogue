import React from 'react';
import { useAnimation } from '../../hooks/useAnimation';
import TestimonialCarousel from '../../components/common/TestimonialCarousel';

const TestimonialsSection = () => {
  const { elementRef: headingRef, isVisible: isHeadingVisible } = useAnimation(0.2);
  const { elementRef: carouselRef, isVisible: isCarouselVisible } = useAnimation(0.1);

  return (
    <section className="py-16 relative overflow-hidden" style={{backgroundColor: '#edebeb'}}>
      <div className="max-w-[1440px] w-full px-4 mx-auto relative">

        {/* Section Heading */}
        <div 
          ref={headingRef}
          className={`text-center mb-12 relative z-10 transition-all duration-1000 ease-out ${
            isHeadingVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold leading-tight capitalize mb-4">
            <span className="text-black">Our Clients who </span>
            <span className="text-[#ff690d]">trusted us</span>
            <span className="text-black"> since the very beginning</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-inter font-light leading-relaxed text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Hear from the families who have experienced our commitment to affordable, transparent, and caring service.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div 
          ref={carouselRef}
          className={`relative z-10 transition-all duration-1000 ease-out delay-300 ${
            isCarouselVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <TestimonialCarousel />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;