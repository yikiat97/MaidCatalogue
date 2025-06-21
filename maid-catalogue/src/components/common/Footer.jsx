import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#f8f8f8] py-6">
      <div className="max-w-6xl w-full mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left w-full md:w-auto">
            <p className="text-[#585757] text-sm md:text-base">
              © 2024 Easy Hire. All rights reserved.
            </p>
          </div>
          {/* Example: Add links or social icons here in future */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
