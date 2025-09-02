import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import logoBlack from '../../assets/logoBlack.png';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function Header({ isAuthenticated, onLogout }){
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const isActive = (path) => location.pathname === path;
  const isHomePage = location.pathname === '/';

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isHomePage 
          ? (isScrolled 
              ? 'bg-[#f8f8f8] shadow-lg border-b border-gray-200' 
              : 'bg-white/10 backdrop-blur-md border-b border-white/20')
          : 'bg-[#f8f8f8] shadow-lg border-b border-gray-200'
      }`}
      style={{
        backdropFilter: isHomePage && !isScrolled ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: isHomePage && !isScrolled ? 'blur(10px)' : 'none', // Safari support
      }}
    >
      <div className="max-w-[1440px] w-full mx-auto px-4 py-2 flex items-center justify-between relative h-24">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 hover-scale">
          <img
            src={logoBlack}
            alt="MaidCatalogue Logo"
            className="h-32 w-auto cursor-pointer"
            onClick={() => navigate('/catalogue')}
          />
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/about"
            className={`text-lg font-semibold transition-all duration-300 hover:scale-105 ${
              isActive('/about') 
                ? (isHomePage && !isScrolled ? 'text-white' : 'text-[#ff914d]')
                : (isHomePage && !isScrolled ? 'text-white' : 'text-[#585757]')
            } hover:text-[#ff914d]`}
          >
            About Us
          </Link>
          <Link
            to="/services"
            className={`text-lg font-semibold transition-all duration-300 hover:scale-105 ${
              isActive('/services') 
                ? (isHomePage && !isScrolled ? 'text-white' : 'text-[#ff914d]')
                : (isHomePage && !isScrolled ? 'text-white' : 'text-[#585757]')
            } hover:text-[#ff914d]`}
          >
            Services
          </Link>
          <Link
            to="/faqs"
            className={`text-lg font-semibold transition-all duration-300 hover:scale-105 ${
              isActive('/faqs') 
                ? (isHomePage && !isScrolled ? 'text-white' : 'text-[#ff914d]')
                : (isHomePage && !isScrolled ? 'text-white' : 'text-[#585757]')
            } hover:text-[#ff914d]`}
          >
            FAQs
          </Link>
          <Link
            to="/contact"
            className={`text-lg font-semibold transition-all duration-300 hover:scale-105 ${
              isActive('/contact') 
                ? (isHomePage && !isScrolled ? 'text-white' : 'text-[#ff914d]')
                : (isHomePage && !isScrolled ? 'text-white' : 'text-[#585757]')
            } hover:text-[#ff914d]`}
          >
            Contact us
          </Link>
        </nav>

        {/* Desktop FIND A HELPER & WhatsApp Buttons */}
        <div className="hidden md:flex items-center gap-3 ml-6">
          <Link
            to="/catalogue"
            className="px-6 py-3 bg-gradient-to-r from-[#ff914d] to-[#ffa366] text-white rounded-lg font-bold text-base sm:text-lg lg:text-xl hover:from-[#e67e22] hover:to-[#ff914d] hover:scale-105 transition-all duration-300 shadow-lg"
          >
            FIND A HELPER
          </Link>
          <button
            onClick={() => {
              const message = "Hi, I'm interested in your maid services.";
              window.open(`https://wa.me/88270086?text=${encodeURIComponent(message)}`, '_blank');
            }}
            className="px-4 py-3 bg-gradient-to-r from-[#25D366] to-[#1aab54] text-white rounded-lg font-bold text-lg hover:from-[#1aab54] hover:to-[#128c42] hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2"
          >
            <WhatsAppIcon sx={{ fontSize: 20 }} />
            <span className="max-[940px]:hidden">88270086</span>
          </button>
        </div>

        {/* Mobile Menu Section */}
        <div className="md:hidden flex items-center gap-3">
          <button
            className="flex items-center px-2 py-1 hover-scale transition-all duration-300"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg
              className={`h-6 w-6 ${
                isHomePage && !isScrolled ? 'text-white' : 'text-[#585757]'
              }`}
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
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <nav 
          className={`md:hidden border-t animate-fade-in-up transition-all duration-300 ease-in-out ${
            isHomePage 
              ? (isScrolled 
                  ? 'bg-[#f8f8f8] border-gray-200' 
                  : 'bg-white/90 backdrop-blur-md border-white/20')
              : 'bg-[#f8f8f8] border-gray-200'
          }`}
          style={{
            backdropFilter: isHomePage && !isScrolled ? 'blur(10px)' : 'none',
            WebkitBackdropFilter: isHomePage && !isScrolled ? 'blur(10px)' : 'none', // Safari support
          }}
        >
          <div className="flex flex-col items-center gap-4 py-4">
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={`text-base font-semibold transition-all duration-300 hover:scale-105 ${
                isActive('/about')
                  ? 'text-[#ff914d]'
                  : 'text-[#585757]'
              } hover:text-[#ff914d]`}
            >
              About Us
            </Link>
            <Link
              to="/services"
              onClick={() => setMenuOpen(false)}
              className={`text-base font-semibold transition-all duration-300 hover:scale-105 ${
                isActive('/services')
                  ? 'text-[#ff914d]'
                  : 'text-[#585757]'
              } hover:text-[#ff914d]`}
            >
              Services
            </Link>
            <Link
              to="/faqs"
              onClick={() => setMenuOpen(false)}
              className={`text-base font-semibold transition-all duration-300 hover:scale-105 ${
                isActive('/faqs')
                  ? 'text-[#ff914d]'
                  : 'text-[#585757]'
              } hover:text-[#ff914d]`}
            >
              FAQs
            </Link>
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className={`text-base font-semibold transition-all duration-300 hover:scale-105 ${
                isActive('/contact')
                  ? 'text-[#ff914d]'
                  : 'text-[#585757]'
              } hover:text-[#ff914d]`}
            >
              Contact us
            </Link>
            
            <div className="border-t border-gray-300 w-full my-2"></div>
            
            <Link
              to="/catalogue"
              onClick={() => setMenuOpen(false)}
              className="w-full px-4 py-3 text-center bg-gradient-to-r from-[#ff914d] to-[#ffa366] text-white rounded-lg font-bold text-sm sm:text-base hover:from-[#e67e22] hover:to-[#ff914d] transition-all duration-300 shadow-lg"
            >
              FIND A HELPER
            </Link>
            
            <button
              onClick={() => {
                const message = "Hi, I'm interested in your maid services.";
                window.open(`https://wa.me/88270086?text=${encodeURIComponent(message)}`, '_blank');
                setMenuOpen(false);
              }}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#25D366] to-[#1aab54] text-white rounded-lg font-bold text-lg hover:from-[#1aab54] hover:to-[#128c42] transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
            >
              <WhatsAppIcon sx={{ fontSize: 20 }} />
              <span>88270086</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

