import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

const Footer = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const handleFindHelper = () => {
    navigate('/Catalogue');
  };

  return (
    <footer className="bg-white">
      {/* Main Footer Section */}
      <div className="bg-[#585757] py-12 md:py-16">
        <div className="max-w-[1440px] w-full mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12">

            {/* Column 1: About Easy Hire - Full width on mobile, stays same on larger screens */}
            <div className="space-y-6 md:col-span-1">
              <div>
                <Link to="/" className="inline-block hover-scale">
                  <img
                    src="/images/img_logo.png"
                    alt="Easy Hire Logo"
                    className="h-12 w-auto"
                  />
                </Link>
              </div>
              <p className="text-white font-inter text-sm leading-relaxed">
                Making domestic help affordable and accessible for all Singaporean families.
                Transparent pricing, genuine care, and full support every step of the way.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="medium"
                  onClick={handleFindHelper}
                  className="hover-scale"
                >
                  FIND A HELPER
                </Button>
              </div>
            </div>

            {/* Columns 2-3: Links Section - 2 columns on mobile, stays same on larger screens */}
            <div className="grid grid-cols-2 gap-6 md:col-span-2 lg:col-span-2">

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-white font-inter font-bold text-base lg:text-lg">
                  Quick Links
                </h3>
                <nav className="flex flex-col space-y-2 lg:space-y-3">
                  <Link
                    to="/"
                    className="text-white font-inter text-sm hover:text-[#ff690d] transition-colors duration-300"
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className="text-white font-inter text-sm hover:text-[#ff690d] transition-colors duration-300"
                  >
                    About Us
                  </Link>
                  {/* <Link
                    to="/services"
                    className="text-white font-inter text-sm hover:text-[#ff690d] transition-colors duration-300"
                  >
                    Services
                  </Link> */}
                  <Link
                    to="/faqs"
                    className="text-white font-inter text-sm hover:text-[#ff690d] transition-colors duration-300"
                  >
                    FAQs
                  </Link>
                  <Link
                    to="/contact"
                    className="text-white font-inter text-sm hover:text-[#ff690d] transition-colors duration-300"
                  >
                    Contact Us
                  </Link>
                </nav>
              </div>

              {/* Our Services */}
              <div className="space-y-4">
                <h3 className="text-white font-inter font-bold text-base lg:text-lg">
                  Our Services
                </h3>
                <nav className="flex flex-col space-y-2 lg:space-y-3">
                  <Link
                    to="/catalogue?country=Myanmar"
                    className="text-white font-inter text-sm hover:text-[#ff690d] transition-colors duration-300"
                  >
                    Myanmar Helpers
                  </Link>
                  <Link
                    to="/catalogue?country=Indonesia"
                    className="text-white font-inter text-sm hover:text-[#ff690d] transition-colors duration-300"
                  >
                    Indonesian Helpers
                  </Link>
                  <Link
                    to="/catalogue?country=Philippines"
                    className="text-white font-inter text-sm hover:text-[#ff690d] transition-colors duration-300"
                  >
                    Filipino Helpers
                  </Link>
                  <Link
                    to="/catalogue?type=Transfer"
                    className="text-white font-inter text-sm hover:text-[#ff690d] transition-colors duration-300"
                  >
                    Transfer Helpers
                  </Link>
                  {/* <Link
                    to="/services"
                    className="text-white font-inter text-sm hover:text-[#ff690d] transition-colors duration-300"
                  >
                    Documentation Support
                  </Link> */}
                </nav>
              </div>
            </div>

            {/* Column 4: Contact & Hours - Full width on mobile, stays same on larger screens */}
            <div className="grid grid-cols-1 gap-6 md:col-span-3 lg:col-span-1">

              {/* Get In Touch */}
              <div className="space-y-4">
                <h3 className="text-white font-inter font-bold text-base lg:text-lg">
                  Get In Touch
                </h3>

                {/* Contact Information */}
                <div className="space-y-2 lg:space-y-3">
                  <div className="flex items-start space-x-3">
                    <svg className="w-4 h-4 text-[#ff690d] mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <a
                      href="mailto:easyhiresg@gmail.com"
                      className="text-white font-inter text-sm hover:text-[#ff690d] transition-colors duration-300"
                    >
                      easyhiresg@gmail.com
                    </a>
                  </div>

                  <div className="flex items-start space-x-3">
                    <svg className="w-4 h-4 text-[#ff690d] mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    <a
                      href="tel:+6588270086"
                      className="text-white font-inter text-sm hover:text-[#ff690d] transition-colors duration-300"
                    >
                      +65 8827 0086
                    </a>
                  </div>

                </div>
              </div>

              {/* Operating Hours */}
              <div className="space-y-4">
                <h4 className="text-white font-inter font-semibold text-base lg:text-lg">
                  Operating Hours
                </h4>
                <p className="text-white font-inter text-sm">
                  Mon - Fri: 11am - 8pm<br />
                  Sat: 11am - 2pm<br />
                  Sun: By appointment basis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="bg-[#f8f8f8] py-6 border-t border-gray-200">
        <div className="max-w-[1440px] w-full mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-[#585757] font-inter text-sm">
                © 2024 Easy Hire. All rights reserved.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-6">
              <Link
                to="/privacy"
                className="text-[#585757] font-inter text-sm hover:text-[#ff690d] transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-[#585757] font-inter text-sm hover:text-[#ff690d] transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-[#585757] font-inter text-sm hover:text-[#ff690d] transition-colors duration-300"
              >
                Cookie Policy
              </Link>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://facebook.com/easyhiresg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#585757] hover:text-[#ff690d] transition-colors duration-300 hover-scale"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a
                href="https://instagram.com/easyhiresg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#585757] hover:text-[#ff690d] transition-colors duration-300 hover-scale"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-2.297 0-4.163-1.865-4.163-4.163 0-2.297 1.866-4.162 4.163-4.162 2.298 0 4.163 1.865 4.163 4.162 0 2.298-1.865 4.163-4.163 4.163zm7.424-10.11h-.481c-.424 0-.77-.345-.77-.769s.346-.769.77-.769h.481c.424 0 .769.345.769.769s-.345.769-.769.769z"/>
                </svg>
              </a>
              
              <a
                href="https://linkedin.com/company/easyhiresg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#585757] hover:text-[#ff690d] transition-colors duration-300 hover-scale"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
