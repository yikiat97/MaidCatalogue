import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-[#f8f8f8] py-12 md:py-16">
      <div className="max-w-6xl w-full mx-auto px-4">
        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-inter font-extrabold leading-tight capitalize">
            <span className="text-black">Most </span>
            <span className="text-[#ff690d]">affordable</span>
            <span className="text-black"> maid agency in Singapore</span>
          </h1>
        </div>

        {/* Description */}
        <div className="text-center mb-8 md:px-24">
          <p className="text-base sm:text-lg md:text-xl font-inter font-normal leading-relaxed text-black">
            With one of our packages carrying absolutely no service fee, we are proud to be the most affordable maid agency in Singapore—so every family can bring a helper home without stretching their budget. Beyond cost savings, our fee structure is fully transparent
          </p>
        </div>

        {/* Hero Image */}
        <div className="flex justify-center">
          <img
            src="/images/img_rectangle_5.png"
            alt="Maid Agency Services"
            className="w-full max-w-3xl h-auto rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
