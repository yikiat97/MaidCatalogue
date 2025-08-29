import React from 'react';
import { useAnimation, useStaggeredAnimation } from '../../hooks/useAnimation';

const ProcessSection = () => {
  const { elementRef: titleRef, isVisible: isTitleVisible } = useAnimation(0.3);
  const steps = [
    {
      number: "1",
      title: "Browse & Shortlist",
      description: "Browse through verified helper profiles using our advanced filters or post your requirements for helpers to apply directly.",
      image: "/images/img_rectangle_10.png"
    },
    {
      number: "2",
      title: "Interview Online",
      description: "Conduct convenient video interviews with shortlisted candidates to find the perfect match for your household needs.",
      image: "/images/img_rectangle_10_245x195.png"
    },
    {
      number: "3",
      title: "Complete Documentation",
      description: "Sign contracts and complete all necessary paperwork digitally through our secure online platform.",
      image: "/images/img_rectangle_10_1.png"
    },
    {
      number: "4",
      title: "We Handle the Rest",
      description: "Relax while we coordinate visa processing, work permits, and arrival arrangements for your new helper.",
      image: "/images/img_rectangle_10_2.png"
    }
  ];

  const { containerRef, visibleItems } = useStaggeredAnimation(steps, 200);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div 
          ref={titleRef}
          className={`text-center mb-12 transition-all duration-1000 ease-out ${
            isTitleVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold leading-tight capitalize">
            <span className="text-black">Hire from us in 4 </span>
            <span className="text-[#ff690d]">easy steps</span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div ref={containerRef} className="relative">
          {/* Desktop dotted line connectors */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5">
            <div className="flex justify-between items-center h-full max-w-6xl mx-auto px-24">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex-1 border-t-2 border-dotted border-gray-300 mx-8"></div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-center transition-all duration-700 ease-out ${
                  visibleItems.includes(index)
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {/* Large Circular Icon Container */}
                <div className="relative mb-6">
                  <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden border-4 border-gray-100">
                    <img
                      src={step.image}
                      alt={`Step ${step.number}`}
                      className="w-40 h-40 object-cover rounded-full"
                    />
                  </div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#ff690d] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-lg font-inter font-bold text-white">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="text-xl lg:text-2xl font-inter font-bold text-[#0e0e0e] mb-4 leading-tight min-h-[3.5rem] lg:min-h-[4rem] flex items-center justify-center">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-base font-inter text-[#555555] leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
