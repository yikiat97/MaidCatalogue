import React from 'react';

const ProcessSection = () => {
  const steps = [
    {
      number: "1",
      title: "Shortlist helper",
      description: "Browse profiles with our robust filters or post a job for helpers to apply.",
      image: "/images/img_rectangle_10.png"
    },
    {
      number: "2",
      title: "Online Interview",
      description: "Browse profiles with our robust filters or post a job for helpers to apply.",
      image: "/images/img_rectangle_10_245x195.png"
    },
    {
      number: "3",
      title: "Sign Documents \nonline",
      description: "Browse profiles with our robust filters or post a job for helpers to apply.",
      image: "/images/img_rectangle_10_1.png"
    },
    {
      number: "4",
      title: "We will arrange \nthe rest",
      description: "Browse profiles with our robust filters or post a job for helpers to apply.",
      image: "/images/img_rectangle_10_2.png"
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-6xl w-full mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold leading-tight capitalize">
            <span className="text-black">Hire from us in 4 </span>
            <span className="text-[#ff690d]">easy steps</span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col border border-[#bababa] rounded-2xl p-6 bg-white shadow-md h-full"
            >
              {/* Step Number */}
              <div className="w-10 h-10 bg-[#ff690d] rounded-full flex items-center justify-center mb-4">
                <span className="text-base font-inter font-semibold text-white">
                  {step.number}
                </span>
              </div>

              {/* Step Title */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-inter font-semibold text-[#0e0e0e] mb-2 whitespace-pre-line">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-base sm:text-lg font-inter text-[#333232] mb-4 flex-1">
                {step.description}
              </p>

              {/* Step Image */}
              <div className="mt-auto flex justify-center">
                <img
                  src={step.image}
                  alt={`Step ${step.number}`}
                  className="w-36 h-44 sm:w-44 sm:h-52 object-cover rounded-md"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
