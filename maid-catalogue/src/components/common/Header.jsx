import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import Button from '../ui/Button';

export default function Header(){
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/Catalogue');
  };

  return (
    <header className="bg-[#f8f8f8] shadow">
      <div className="max-w-6xl w-full mx-auto px-4 py-2 flex items-center justify-between relative h-24">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 hover-scale">
          <img
            src="/images/img_logo.png"
            alt="Easy Hire Logo"
            className="h-16 w-auto"
          />
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-lg font-arial font-normal text-[#585757] hover:text-[#ff690d] transition-all duration-300 hover:scale-105"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-lg font-arial font-normal text-[#585757] hover:text-[#ff690d] transition-all duration-300 hover:scale-105"
          >
            About Us
          </Link>
          <Link
            to="/services"
            className="text-lg font-arial font-normal text-[#585757] hover:text-[#ff690d] transition-all duration-300 hover:scale-105"
          >
            Services
          </Link>
          <Link
            to="/faqs"
            className="text-lg font-arial font-normal text-[#585757] hover:text-[#ff690d] transition-all duration-300 hover:scale-105"
          >
            FAQs
          </Link>
          <Link
            to="/contact"
            className="text-lg font-arial font-normal text-[#585757] hover:text-[#ff690d] transition-all duration-300 hover:scale-105"
          >
            Contact us
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block ml-6">
          <Button variant="primary" size="medium" onClick={handleClick} className="hover-scale">
            FIND A HELPER
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center px-2 py-1 hover-scale transition-all duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg
            className="h-7 w-7 text-[#585757]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-[#f8f8f8] border-t animate-fade-in-up">
          <div className="flex flex-col items-center gap-4 py-4">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-base font-arial text-[#585757] hover:text-[#ff690d] transition-all duration-300 hover:scale-105"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="text-base font-arial text-[#585757] hover:text-[#ff690d] transition-all duration-300 hover:scale-105"
            >
              About Us
            </Link>
            <Link
              to="/services"
              onClick={() => setMenuOpen(false)}
              className="text-base font-arial text-[#585757] hover:text-[#ff690d] transition-all duration-300 hover:scale-105"
            >
              Services
            </Link>
            <Link
              to="/faqs"
              onClick={() => setMenuOpen(false)}
              className="text-base font-arial text-[#585757] hover:text-[#ff690d] transition-all duration-300 hover:scale-105"
            >
              FAQs
            </Link>
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="text-base font-arial text-[#585757] hover:text-[#ff690d] transition-all duration-300 hover:scale-105"
            >
              Contact us
            </Link>
            <Button variant="primary" size="medium" className="mt-2 hover-scale" onClick={handleClick}>
              FIND A HELPER
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

