import React from 'react';
import Card from '../../components/ui/Card';
import { useAnimation, useStaggeredAnimation } from '../../hooks/useAnimation';

const PromisesSection = () => {
  const { elementRef: titleRef, isVisible: isTitleVisible } = useAnimation(0.3);
  const { elementRef: rightRef, isVisible: isRightVisible } = useAnimation(0.1);

  const promises = [
    {
      number: "1",
      title: "Affordability.",
      description: "Every family can afford a helper with us"
    },
    {
      number: "2",
      title: "Transparency",
      description: "No hidden fees. Promise"
    },
    {
      number: "3",
      title: "Post deployment service",
      description: "No missing in action after payment"
    }
  ];

  const { containerRef, visibleItems } = useStaggeredAnimation(promises, 200);

  return (
    <section className="bg-[#585757] py-12 md:py-20">
      <div className="max-w-6xl w-full mx-auto px-4">
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

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Left Side - Promise Cards */}
          <div ref={containerRef} className="w-full md:w-1/2 space-y-6">
            {promises.map((promise, index) => (
              <Card
                key={index}
                className={`flex items-center w-full md:w-[440px] min-h-[110px] bg-white hover-lift transition-all duration-700 ease-out ${
                  visibleItems.includes(index)
                    ? 'opacity-100 translate-x-0 scale-100'
                    : 'opacity-0 -translate-x-8 scale-95'
                }`}
                variant="default"
                padding="medium"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start">
                  <span className="text-4xl md:text-5xl font-impact font-normal text-[#ff690d] mr-6 -mt-2 animate-pulse-slow">
                    {promise.number}
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-inter font-extrabold text-black capitalize mb-1">
                      {promise.title}
                    </h3>
                    <p className="text-sm sm:text-base font-inter font-medium text-[#ff690d]">
                      {promise.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Right Side - Images */}
          <div 
            ref={rightRef}
            className={`flex flex-row justify-center md:justify-end gap-[2px] mt-8 md:mt-0 transition-all duration-1000 ease-out delay-500 ${
              isRightVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-8'
            }`}
          >
            <img
              src="/images/img_rectangle_1.png"
              alt="Promise Image 1"
              className="w-24 sm:w-36 md:w-44 h-40 sm:h-64 md:h-80 rounded-tl-3xl rounded-bl-3xl object-cover hover-scale"
            />
            <img
              src="/images/img_rectangle_2.png"
              alt="Promise Image 2"
              className="w-24 sm:w-36 md:w-44 h-40 sm:h-64 md:h-80 object-cover hover-scale"
            />
            <img
              src="/images/img_rectangle_3.png"
              alt="Promise Image 3"
              className="w-24 sm:w-36 md:w-44 h-40 sm:h-64 md:h-80 rounded-tr-3xl rounded-br-3xl object-cover hover-scale"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromisesSection;
