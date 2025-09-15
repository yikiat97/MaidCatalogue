import React, { useState, useEffect } from 'react';
import { useAnimation } from '../../hooks/useAnimation';
import TestimonialCarousel from '../../components/common/TestimonialCarousel';
import { getGoogleReviews } from '../../services/googlePlaces';

const TestimonialsSection = () => {
  const { elementRef: headingRef, isVisible: isHeadingVisible } = useAnimation(0.2);
  const { elementRef: carouselRef, isVisible: isCarouselVisible } = useAnimation(0.1);

  // Google Reviews state
  const [reviews, setReviews] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [placeInfo, setPlaceInfo] = useState(null);

  // Fetch Google Reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID;
      const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
      
      // Skip if Place ID is not configured or is placeholder
      if (!placeId || placeId === 'ChIJ_YOUR_PLACE_ID_HERE') {
        console.log('ℹ️ Google Place ID not configured, using fallback testimonials');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await getGoogleReviews(placeId);
        setReviews(data.reviews);
        setPlaceInfo(data.placeInfo);
      } catch (err) {
        console.error('❌ Failed to fetch Google Reviews:', err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

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
          <TestimonialCarousel 
            reviews={reviews}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;