import React from 'react';
import Button from '../../components/ui/Button';

const AboutSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl w-full px-4 mx-auto relative">
        <div className="flex flex-col md:flex-row items-start md:justify-between gap-8">
          {/* Left Content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-medium leading-tight text-black mb-4">
              Why We Started Easy Hire
            </h2>
            <div className="mb-6 shadow-md rounded-lg p-4 bg-white">
              <p className="text-base sm:text-lg md:text-xl font-inter font-light leading-relaxed text-black">
                " Our mum raised three of us single-handedly. We came from a humble background but hiring a helper was necessary. Unfortunately for us, the experience was often frustrating—high fees, unclear costs, and no real support. It made an already tough time even harder.
                <br /><br />
                That experience inspired us to start Easy Hire.
                <br /><br />
                We believe families deserve honesty, care, and guidance—not added stress. That is why, even as costs rise, we continue to offer a package that waives agency fees for families in need.
                <br /><br />
                Easy Hire is not just a business. It is a promise to support others the way we once wished someone had supported us. "
              </p>
            </div>
            <Button variant="primary" size="medium">
              FIND A HELPER
            </Button>
          </div>
          {/* Right Image */}
          <div className="w-full md:w-5/12 flex justify-center md:justify-end">
            <img
              src="/images/img_familypic_1.png"
              alt="Family Picture"
              className="w-60 h-72 sm:w-80 sm:h-96 md:w-[421px] md:h-[526px] object-cover rounded-xl shadow"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
