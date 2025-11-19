import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import { 
  Menu, 
  MenuItem, 
  IconButton, 
  Avatar, 
  Divider,
  Typography,
  ListItemIcon
} from '@mui/material';
import { 
  AccountCircle, 
  Logout, 
  Login,
  PersonAdd 
} from '@mui/icons-material';
import logoBlack from '../../assets/logoBlack.png';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useAuth } from '../../context/AuthContext';
import { getUserDisplayName, getUserInitials } from '../../utils/auth';

export default function Header(){
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

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
  const isCataloguePage = location.pathname === '/catalogue';

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuAnchor(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLoginClick = () => {
    setUserMenuAnchor(null);
    navigate('/login');
  };

  const handleSignupClick = () => {
    setUserMenuAnchor(null);
    navigate('/signup');
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
      <div className="max-w-[1440px] w-full mx-auto px-4 py-2 flex items-center justify-between relative h-16 sm:h-20 lg:h-24">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 hover-scale">
          <img
            src={logoBlack}
            alt="MaidCatalogue Logo"
            className="h-20 sm:h-24 lg:h-32 w-auto cursor-pointer"
            onClick={() => navigate('/catalogue')}
          />
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          <Link
            to="/"
            className={`text-lg font-semibold transition-all duration-300 hover:scale-105 ${
              isActive('/') 
                ? (isHomePage && !isScrolled ? 'text-white' : 'text-[#ff914d]')
                : (isHomePage && !isScrolled ? 'text-white' : 'text-[#585757]')
            } hover:text-[#ff914d]`}
          >
            Home
          </Link>
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
          {/* <Link
            to="/services"
            className={`text-lg font-semibold transition-all duration-300 hover:scale-105 ${
              isActive('/services') 
                ? (isHomePage && !isScrolled ? 'text-white' : 'text-[#ff914d]')
                : (isHomePage && !isScrolled ? 'text-white' : 'text-[#585757]')
            } hover:text-[#ff914d]`}
          >
            Services
          </Link> */}
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
          {isAuthenticated && (
            <>
              <Link
                to="/shortlisted"
                className={`text-lg font-semibold transition-all duration-300 hover:scale-105 ${
                  isActive('/shortlisted') 
                    ? (isHomePage && !isScrolled ? 'text-white' : 'text-[#ff914d]')
                    : (isHomePage && !isScrolled ? 'text-white' : 'text-[#585757]')
                } hover:text-[#ff914d]`}
              >
                Shortlist
              </Link>
              <Link
                to="/recommend"
                className={`text-lg font-semibold transition-all duration-300 hover:scale-105 ${
                  isActive('/recommend') 
                    ? (isHomePage && !isScrolled ? 'text-white' : 'text-[#ff914d]')
                    : (isHomePage && !isScrolled ? 'text-white' : 'text-[#585757]')
                } hover:text-[#ff914d]`}
              >
                Recommended 
              </Link>
            </>
          )}
        </nav>

        {/* Desktop FIND A HELPER, WhatsApp & User Buttons */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 ml-4 xl:ml-6">
          {!isCataloguePage && (
            <Link
              to="/catalogue"
              className="px-4 lg:px-6 py-1.5 lg:py-2 bg-gradient-to-r from-[#ff914d] to-[#ffa366] text-white rounded-xl font-bold text-sm lg:text-base xl:text-lg hover:from-[#e67e22] hover:to-[#ff914d] hover:scale-105 transition-all duration-300 shadow-lg min-h-[36px]"
            >
              FIND HELPER
            </Link>
          )}
          <button
            onClick={() => {
              const message = "Hi, I'm interested in your maid services.";
              window.open(`https://wa.me/6588270086?text=${encodeURIComponent(message)}`, '_blank');
            }}
            className="px-4 lg:px-6 py-1.5 lg:py-2 bg-gradient-to-r from-[#25D366] to-[#1aab54] text-white rounded-xl font-bold text-sm lg:text-base xl:text-lg hover:from-[#1aab54] hover:to-[#128c42] hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2 min-h-[36px]"
          >
            <WhatsAppIcon sx={{ fontSize: 18 }} />
            <span>+65 8827 0086</span>
          </button>
          
          {/* User Authentication Button */}
          <IconButton
            onClick={handleUserMenuOpen}
            className="min-h-[44px]"
            sx={{ 
              color: isHomePage && !isScrolled ? 'white' : '#585757',
              '&:hover': { 
                backgroundColor: 'rgba(255, 145, 77, 0.1)' 
              }
            }}
            aria-label="User account"
          >
            {isAuthenticated && user ? (
              <Avatar
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: '#ff914d',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {getUserInitials(user)}
              </Avatar>
            ) : (
              <AccountCircle sx={{ fontSize: 36 }} />
            )}
          </IconButton>
        </div>

        {/* Tablet/Mobile Menu Section */}
        <div className="lg:hidden flex items-center gap-3">
          {/* Mobile User Icon */}
          <IconButton
            onClick={handleUserMenuOpen}
            className="min-h-[44px]"
            sx={{ 
              color: isHomePage && !isScrolled ? 'white' : '#585757',
              '&:hover': { 
                backgroundColor: 'rgba(255, 145, 77, 0.1)' 
              }
            }}
            aria-label="User account"
          >
            {isAuthenticated && user ? (
              <Avatar
                sx={{ 
                  width: { xs: 32, sm: 36 }, 
                  height: { xs: 32, sm: 36 }, 
                  bgcolor: '#ff914d',
                  fontSize: { xs: '14px', sm: '16px' },
                  fontWeight: 'bold'
                }}
              >
                {getUserInitials(user)}
              </Avatar>
            ) : (
              <AccountCircle sx={{ fontSize: { xs: 32, sm: 36 } }} />
            )}
          </IconButton>
          
          <button
            className="flex items-center px-2 py-2 hover-scale transition-all duration-300 min-h-[44px] min-w-[44px] justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg
              className={`h-5 w-5 sm:h-6 sm:w-6 ${
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

      {/* Tablet/Mobile Dropdown Menu */}
      {menuOpen && (
        <nav 
          className={`lg:hidden border-t animate-fade-in-up transition-all duration-300 ease-in-out ${
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
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 py-2 px-4 min-h-[44px] flex items-center ${
                isActive('/')
                  ? 'text-[#ff914d]'
                  : 'text-[#585757]'
              } hover:text-[#ff914d]`}
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={`text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 py-2 px-4 min-h-[44px] flex items-center ${
                isActive('/about')
                  ? 'text-[#ff914d]'
                  : 'text-[#585757]'
              } hover:text-[#ff914d]`}
            >
              About Us
            </Link>
            {/* <Link
              to="/services"
              onClick={() => setMenuOpen(false)}
              className={`text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 py-2 px-4 min-h-[44px] flex items-center ${
                isActive('/services')
                  ? 'text-[#ff914d]'
                  : 'text-[#585757]'
              } hover:text-[#ff914d]`}
            >
              Services
            </Link> */}
            <Link
              to="/faqs"
              onClick={() => setMenuOpen(false)}
              className={`text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 py-2 px-4 min-h-[44px] flex items-center ${
                isActive('/faqs')
                  ? 'text-[#ff914d]'
                  : 'text-[#585757]'
              } hover:text-[#ff914d]`}
            >
              FAQs
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/shortlisted"
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 py-2 px-4 min-h-[44px] flex items-center ${
                    isActive('/shortlisted')
                      ? 'text-[#ff914d]'
                      : 'text-[#585757]'
                  } hover:text-[#ff914d]`}
                >
                  Shortlist
                </Link>
                <Link
                  to="/recommend"
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 py-2 px-4 min-h-[44px] flex items-center ${
                    isActive('/recommend')
                      ? 'text-[#ff914d]'
                      : 'text-[#585757]'
                  } hover:text-[#ff914d]`}
                >
                  Recommended Helper
                </Link>
              </>
            )}
            
            <div className="border-t border-gray-300 w-full my-2"></div>
            
            {!isCataloguePage && (
              <Link
                to="/catalogue"
                onClick={() => setMenuOpen(false)}
                className="w-full max-w-sm px-4 py-2 text-center bg-gradient-to-r from-[#ff914d] to-[#ffa366] text-white rounded-lg font-bold text-sm sm:text-base hover:from-[#e67e22] hover:to-[#ff914d] transition-all duration-300 shadow-lg min-h-[40px] flex items-center justify-center"
              >
                FIND A HELPER
              </Link>
            )}
            
            <button
              onClick={() => {
                const message = "Hi, I'm interested in your maid services.";
                window.open(`https://wa.me/6588270086?text=${encodeURIComponent(message)}`, '_blank');
                setMenuOpen(false);
              }}
              className="w-full max-w-sm px-4 py-2 bg-gradient-to-r from-[#25D366] to-[#1aab54] text-white rounded-lg font-bold text-sm sm:text-base hover:from-[#1aab54] hover:to-[#128c42] transition-all duration-300 shadow-lg flex items-center justify-center gap-2 min-h-[40px]"
            >
              <WhatsAppIcon sx={{ fontSize: 16 }} />
              <span>+65 8827 0086</span>
            </button>
          </div>
        </nav>
      )}

      {/* User Menu Dropdown */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
            },
          },
        }}
      >
        {isAuthenticated && user ? (
          [
            <MenuItem key="user-info" disabled>
              <Avatar
                sx={{ 
                  width: 24, 
                  height: 24, 
                  bgcolor: '#ff914d',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  mr: 2
                }}
              >
                {getUserInitials(user)}
              </Avatar>
              <Typography variant="body2" color="text.primary">
                {getUserDisplayName(user)}
              </Typography>
            </MenuItem>,
            <Divider key="divider" />,
            <MenuItem key="logout" onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          ]
        ) : (
          [
            <MenuItem key="login" onClick={handleLoginClick}>
              <ListItemIcon>
                <Login fontSize="small" />
              </ListItemIcon>
              Login
            </MenuItem>,
            <MenuItem key="signup" onClick={handleSignupClick}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Sign Up
            </MenuItem>
          ]
        )}
      </Menu>
    </header>
  );
};

