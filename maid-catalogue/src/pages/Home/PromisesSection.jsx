import React from 'react';
import Card from '../../components/ui/Card';
import { useAnimation, useStaggeredAnimation } from '../../hooks/useAnimation';

const PromisesSection = () => {
  const { elementRef: titleRef, isVisible: isTitleVisible } = useAnimation(0.3);
  const { elementRef: rightRef, isVisible: isRightVisible } = useAnimation(0.1);

  const promises = [
    {
      title: "Affordability.",
      description: "Every family can afford a helper with us",
      gradient: "from-green-400 to-emerald-500",
      image: "/images/1.jpeg"
    },
    {
      title: "Transparency",
      description: "No hidden fees. Promise",
      gradient: "from-blue-400 to-cyan-500",
      image: "/images/2.jpeg"
    },
    {
      title: "Post deployment service",
      description: "No missing in action after payment",
      gradient: "from-purple-400 to-indigo-500",
      image: "/images/3.jpeg"
    }
  ];

  const { containerRef, visibleItems } = useStaggeredAnimation(promises, 200);

  return (
    <section className="bg-[#585757] py-12 md:py-20">
      <div className="max-w-[1440px] w-full mx-auto px-4">
        {/* Section Title */}
        <div 
          ref={titleRef}
          className={`text-center mb-10 md:mb-16 transition-all duration-1000 ease-out ${
            isTitleVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold leading-tight capitalize">
            <span className="text-white">Our</span>
            <span className="text-black"> </span>
            <span className="text-[#ff690d]">promises</span>
            <span className="text-black"> </span>
            <span className="text-white">to you</span>
          </h2>
        </div>

        {/* Promise Cards Grid Layout */}
        <div ref={containerRef} className="max-w-7xl mx-auto">
          {/* Single Row - 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {promises.map((promise, index) => {
              return (
                <Card
                  key={index}
                  className={`group relative bg-white hover:shadow-2xl hover:shadow-[#ff690d]/20 transition-all duration-500 ease-out overflow-hidden border-0 hover:-translate-y-2 hover:scale-105 ${
                    visibleItems.includes(index)
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-95'
                  }`}
                  variant="default"
                  padding="none"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >

                  <div className="relative h-[350px] md:h-[400px] flex flex-row">
                    {/* Image Section with Diagonal Cut - Left Side */}
                    <div 
                      className="relative h-full w-[55%] bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url(${promise.image})`,
                        clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)'
                      }}
                    >
                    </div>
                    
                    {/* Text Section - Right Side */}
                    <div className="relative h-full w-[45%] bg-white -ml-[5%] pl-4 pr-3 md:pl-8 md:pr-6 flex flex-col justify-center">
                      <div className="text-left">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-inter font-extrabold text-black capitalize mb-3 group-hover:text-[#ff690d] transition-colors duration-300">
                          {promise.title}
                        </h3>
                        <p className="text-sm md:text-base font-inter font-medium text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                          {promise.description}
                        </p>
                      </div>
                      
                      {/* Bottom decorative line */}
                      <div className="mt-4 flex justify-start">
                        <div className={`h-1 bg-gradient-to-r ${promise.gradient} w-16 md:w-20 rounded-full group-hover:w-24 md:group-hover:w-28 transition-all duration-500`}></div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromisesSection;
