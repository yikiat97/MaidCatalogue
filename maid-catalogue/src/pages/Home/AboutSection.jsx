import React from 'react';
import Button from '../../components/ui/Button';
import { useAnimation } from '../../hooks/useAnimation';

const AboutSection = () => {
  const { elementRef: leftRef, isVisible: isLeftVisible } = useAnimation(0.2);
  const { elementRef: rightRef, isVisible: isRightVisible } = useAnimation(0.1);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl w-full px-4 mx-auto relative">
        <div className="flex flex-col md:flex-row items-start md:justify-between gap-8">
          {/* Left Content */}
          <div 
            ref={leftRef}
            className={`w-full md:w-1/2 transition-all duration-1000 ease-out ${
              isLeftVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-8'
            }`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-medium leading-tight text-black mb-4">
              Why We Started Easy Hire
            </h2>
            <div className="mb-6 shadow-md rounded-lg p-4 bg-white hover-lift">
              <p className="text-base sm:text-lg md:text-xl font-inter font-light leading-relaxed text-black">
                {/* " Our mum raised three of us single-handedly. We came from a humble background but hiring a helper was necessary. Unfortunately for us, the experience was often frustrating—high fees, unclear costs, and no real support. It made an already tough time even harder.
                <br /><br />
                That experience inspired us to start Easy Hire.
                <br /><br />
                We believe families deserve honesty, care, and guidance—not added stress. That is why, even as costs rise, we continue to offer a package that waives agency fees for families in need.
                <br /><br />
                Easy Hire is not just a business. It is a promise to support others the way we once wished someone had supported us. " */}
                <br /><br />
                A Note From Our Founder 
                <br /><br />
                Hello, I’m Li Ling  
                <br /><br />
                I started this agency because I want to provide affordable help to all Singaporean families who need it; the kind of help I wished my mum had. 
                My mum singlehandedly raised me and my two younger sisters, and I grew up watching her struggle with high agency fees, hidden charges, and poor support whenever we faced issues with helpers. 
                <br /><br />
                Easy Hire is my way of doing things differently. 
                I pledge to retain a $0 service fee package for our new Myanmar helper.  
                I promise my clients honesty, transparent pricing structure, and full support from the start to every step after your helper joins your home. 
                Because here, you’re not just hiring a worker,  you’re choosing someone who will be caring for your love ones and who will be living under the same roof as you. 
                </p>
            </div>
            <Button variant="primary" size="medium" className="hover-scale">
              FIND A HELPER
            </Button>
          </div>
          {/* Right Image */}
          <div 
            ref={rightRef}
            className={`w-full md:w-5/12 flex justify-center md:justify-end transition-all duration-1000 ease-out delay-300 ${
              isRightVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-8'
            }`}
          >
            <img
              src="/images/img_familypic_1.png"
              alt="Family Picture"
              className="w-60 h-72 sm:w-80 sm:h-96 md:w-[421px] md:h-[526px] object-cover rounded-xl shadow hover-lift"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
