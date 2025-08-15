import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import { useAnimation, useStaggeredAnimation } from '../../hooks/useAnimation';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { elementRef: titleRef, isVisible: isTitleVisible } = useAnimation(0.3);
  const { elementRef: navRef, isVisible: isNavVisible } = useAnimation(0.2);

  const testimonials = [
    {
      id: 1,
      name: "Client Name",
      image: "/images/img_frame_4.png",
      rating: "/images/img_frame_2147224869.svg",
      content: "Lorem ipsum dolor sit amet consectetur. Metus ultrices vel sit imperdiet posuere suspendisse. Ullamcorper ornare nunc nec euismod ultrices turpis. Ipsum turpis sed elit gravida. Integer egestas volutpat lacus nunc.",
      platform: "/images/img_2993685brandbrandsgooglelogologosicon_1.png"
    },
    {
      id: 2,
      name: "Client Name",
      image: "/images/img_frame_4.png",
      rating: "/images/img_frame_2147224869.svg",
      content: "Lorem ipsum dolor sit amet consectetur. Metus ultrices vel sit imperdiet posuere suspendisse. Ullamcorper ornare nunc nec euismod ultrices turpis. Ipsum turpis sed elit gravida. Integer egestas volutpat lacus nunc.",
      platform: "/images/img_2993685brandbrandsgooglelogologosicon_1.png"
    },
    {
      id: 3,
      name: "Client Name",
      image: "/images/img_frame_4.png",
      rating: "/images/img_frame_2147224869.svg",
      content: "Lorem ipsum dolor sit amet consectetur. Metus ultrices vel sit imperdiet posuere suspendisse. Ullamcorper ornare nunc nec euismod ultrices turpis. Ipsum turpis sed elit gravida. Integer egestas volutpat lacus nuncfdfsfddddeddfdfdfsfnkjfhrjfhkjfhjshfdkjhfdhfhfshfjshdafdfvdsfdfhdsfgshjfghdsgfhjdsfghjdsgfhdsgfhjfghjsdgfhdgfjhsgfjhsgfjsgfjsgfjhsgfjhsgfjgfhdgsjfgsjfgsdjfgsjgfjs.",
      platform: "/images/img_2993685brandbrandsgooglelogologosicon_1.png"
    }
  ];

  const { containerRef, visibleItems } = useStaggeredAnimation(testimonials, 200);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="bg-[#edebeb] py-10 md:py-14 rounded-3xl md:rounded-[90px]">
      <div className="max-w-6xl w-full mx-auto px-4">
        {/* Section Title */}
        <div 
          ref={titleRef}
          className={`text-center mb-8 md:mb-14 transition-all duration-1000 ease-out ${
            isTitleVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold leading-tight capitalize">
            <span className="text-black">Our Clients who </span>
            <span className="text-[#ff690d]">trusted</span>
            <span className="text-black"> us since </span>
            <span className="text-[#ff690d]">the very beginning</span>
          </h2>
        </div>

        {/* Navigation Arrows (above grid for better mobile usability) */}
        <div 
          ref={navRef}
          className={`flex justify-center gap-6 mb-6 transition-all duration-1000 ease-out delay-300 ${
            isNavVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <button
            onClick={prevTestimonial}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-all duration-300 hover-scale"
          >
            <img
              src="/images/img_frame_1000006136.svg"
              alt="Previous"
              className="w-8 h-8"
            />
          </button>
          <button
            onClick={nextTestimonial}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-all duration-300 hover-scale"
          >
            <img
              src="/images/img_frame_1000006135.svg"
              alt="Next"
              className="w-8 h-8"
            />
          </button>
        </div>

        {/* Testimonials Grid */}
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`w-full max-w-xs min-h-[320px] relative hover-lift transition-all duration-700 ease-out ${
                visibleItems.includes(index)
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
              variant="default"
              padding="none"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Client Info */}
              <div className="flex items-center p-5 pb-7">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full mr-6 hover-scale"
                />
                <div className="flex-1">
                  <h3 className="text-base font-inter font-semibold leading-5 text-black mb-1">
                    {testimonial.name}
                  </h3>
                </div>
                <img
                  src={testimonial.rating}
                  alt="Rating"
                  className="w-16 h-4"
                />
              </div>

              {/* Testimonial Content */}
              <div className="px-3 mb-8">
                <p className="text-sm sm:text-base font-inter font-normal leading-tight text-[#333333d3] overflow-hidden">
                  {testimonial.content}
                </p>
              </div>

              {/* Platform Logo */}
              <div className="absolute bottom-14 right-16">
                <img
                  src={testimonial.platform}
                  alt="Platform"
                  className="w-8 h-8 hover-scale"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;