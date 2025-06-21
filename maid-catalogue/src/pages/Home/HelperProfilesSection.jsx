import React, { useState } from 'react';
import Button from '../../components/ui/Button';

const HelperProfilesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const helpers = [
    {
      id: 1,
      name: "Ilyn Alcalde",
      image: "/images/img_frame_4_309x253.png",
      location: "Singapore",
      startDate: "Start Apr 24, 2025",
      experience: "10 Years Exp"
    },
    {
      id: 2,
      name: "Ilyn Alcalde",
      image: "/images/img_frame_4_309x253.png",
      location: "Singapore",
      startDate: "Start Apr 24, 2025",
      experience: "10 Years Exp"
    },
    {
      id: 3,
      name: "Ilyn Alcalde",
      image: "/images/img_frame_4_309x253.png",
      location: "Singapore",
      startDate: "Start Apr 24, 2025",
      experience: "10 Years Exp"
    }
  ];

  const nextHelper = () => {
    setCurrentIndex((prev) => (prev + 1) % helpers.length);
  };

  const prevHelper = () => {
    setCurrentIndex((prev) => (prev - 1 + helpers.length) % helpers.length);
  };

  return (
      <section className="bg-[#f3f3f3] py-12 md:py-16 relative">
        <div className="max-w-6xl w-full mx-auto px-4">
          {/* Section Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-semibold text-[#0e0e0e] mb-2">
              Find Your Helper
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-inter font-normal text-[#333232]">
              Lorem ipsum dolor sit amet consectetur. Vulputate bibendum dictum ornare mauris ante.
            </p>
          </div>

          {/* Navigation Arrows (above grid, mobile friendly) */}
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <button
              onClick={prevHelper}
              className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
            >
              <img
                src="/images/img_frame_1000006136.svg"
                alt="Previous"
                className="w-8 h-8"
              />
            </button>
            <button
              onClick={nextHelper}
              className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
            >
              <img
                src="/images/img_frame_1000006135.svg"
                alt="Next"
                className="w-8 h-8"
              />
            </button>
          </div>

          {/* Helper Profiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {helpers.map((helper) => (
              <div
                key={helper.id}
                className="flex flex-col items-center border border-[#d9d9d9] rounded-2xl p-4 sm:p-6 bg-white shadow"
              >
                {/* Helper Image */}
                <img
                  src={helper.image}
                  alt={helper.name}
                  className="w-40 h-40 sm:w-52 sm:h-52 rounded-xl object-cover mb-8"
                />

                {/* Helper Info */}
                <div className="w-full space-y-3">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-inter font-semibold text-[#0e0e0e] text-center">
                    {helper.name}
                  </h3>

                  <div className="flex items-center justify-center">
                    <img
                      src="/images/img_location06.svg"
                      alt="Location"
                      className="w-5 h-5 mr-2"
                    />
                    <span className="text-base font-inter text-[#0e0e0e]">
                      {helper.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-center">
                    <img
                      src="/images/img_calendarfavorite02.svg"
                      alt="Calendar"
                      className="w-5 h-5 mr-2"
                    />
                    <span className="text-base font-inter text-[#0e0e0e]">
                      {helper.startDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-center">
                    <img
                      src="/images/img_work.svg"
                      alt="Experience"
                      className="w-5 h-5 mr-2"
                    />
                    <span className="text-base font-inter text-[#0e0e0e]">
                      {helper.experience}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Browse Button */}
          <div className="text-center">
            <Button variant="outline" size="medium" className="px-4 py-2">
              Browse Helpers
            </Button>
          </div>
        </div>
      </section>
    );
  };

  export default HelperProfilesSection;