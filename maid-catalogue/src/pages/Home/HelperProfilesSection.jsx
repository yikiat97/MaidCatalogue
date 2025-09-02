import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardMedia,
  Typography, 
  Button, 
  Chip,
  Box,
  Checkbox,
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '../../components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { useAnimation } from '../../hooks/useAnimation';
import { useMaidContext } from '../../context/maidList';
import API_CONFIG from '../../config/api.js';
import MaidDetailsPopup from '../../components/Catalogue/MaidDetailsPopup';

// Brand colors
const brandColors = {
  primary: '#ff914d',
  secondary: '#0c191b',
  primaryLight: '#ffa366',
  primaryDark: '#e67e22',
  secondaryLight: '#1a2a2d',
  secondaryDark: '#061012',
  background: '#fafafa',
  surface: '#ffffff',
  text: '#0c191b',
  textSecondary: '#5a6c6f',
  border: '#e0e0e0',
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c'
};

// Professional font imports
const professionalFonts = {
  primary: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  secondary: "'Source Sans Pro', 'Roboto', 'Arial', sans-serif",
  accent: "'Poppins', 'Inter', 'system-ui', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace"
};

const HelperProfilesSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 0-599px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg')); // 600-1199px
  
  // State management
  const [maids, setMaids] = useState([]);
  const [selectedMaids, setSelectedMaids] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});
  const [imageError, setImageError] = useState({});
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedMaidForDetails, setSelectedMaidForDetails] = useState(null);
  
  const { elementRef: titleRef, isVisible: isTitleVisible } = useAnimation(0.3);

  // Utility functions
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getCountryFlag = (country) => {
    const countryCodeMap = {
      'Philippines': 'ph',
      'Indonesia': 'id',
      'Myanmar': 'mm',
      'India': 'in',
      'Bangladesh': 'bd',
      'Sri Lanka': 'lk',
      'Cambodia': 'kh',
      'Vietnam': 'vn',
      'Thailand': 'th',
      'Malaysia': 'my',
      'Taiwan': 'tw',
    };
    
    const countryCode = countryCodeMap[country] || 'un';
    return `https://flagcdn.com/${countryCode}.svg`;
  };

  const getOptimizedImageUrl = (originalUrl) => {
    if (!originalUrl) return '/images/img_frame_4_309x253.png';
    
    const finalUrl = originalUrl.startsWith('http') ? originalUrl : API_CONFIG.buildImageUrl(originalUrl);
    return finalUrl;
  };

  // Responsive styles function - Updated for portrait orientation
  const getResponsiveStyles = () => {
    if (isMobile) {
      return {
        cardHeight: 450,
        cardWidth: '100%',
        imageHeight: 300,
        chipFontSize: '0.65rem',
        chipHeight: '20px',
        nameFontSize: '1rem',
        bodyFontSize: '0.8rem',
        contentPadding: 1.25,
        spacing: 1,
        flagSize: { width: 16, height: 12 },
        iconSize: 14,
        buttonHeight: 36,
        buttonPadding: '8px'
      };
    } else if (isTablet) {
      return {
        cardHeight: 520,
        cardWidth: '100%',
        imageHeight: 360,
        chipFontSize: '0.7rem',
        chipHeight: '22px',
        nameFontSize: '1.1rem',
        bodyFontSize: '0.85rem',
        contentPadding: 1.5,
        spacing: 1.25,
        flagSize: { width: 18, height: 13 },
        iconSize: 15,
        buttonHeight: 40,
        buttonPadding: '10px'
      };
    } else {
      return {
        cardHeight: 600,
        cardWidth: '320px', // Fixed width for desktop for consistent card size
        imageHeight: 420,
        chipFontSize: '0.75rem',
        chipHeight: '24px',
        nameFontSize: '1.2rem',
        bodyFontSize: '0.9rem',
        contentPadding: 1.5,
        spacing: 1.5,
        flagSize: { width: 20, height: 15 },
        iconSize: 16,
        buttonHeight: 42,
        buttonPadding: '12px'
      };
    }
  };

  const styles = getResponsiveStyles();
  
  // Hardcoded helper data - updated to match maid data structure
  const helpers = [
    {
      id: 1,
      name: 'Maria Santos',
      country: 'Philippines',
      salary: 680,
      skills: ['Cooking', 'Child Care', 'Elderly Care'],
      imageUrl: '/images/img_frame_4_309x253.png',
      rating: 4.8,
      experience: '8 years',
      availability: 'Available',
      DOB: '1992-01-15', // Added DOB instead of age
      languages: ['English', 'Filipino', 'Mandarin'],
      type: 'Experienced' // Added type field for badge
    },
    {
      id: 2,
      name: 'Siti Rahman',
      country: 'Indonesia',
      salary: 650,
      skills: ['Housekeeping', 'Cooking', 'Pet Care'],
      imageUrl: '/images/img_frame_4_309x253.png',
      rating: 4.9,
      experience: '6 years',
      availability: 'Available',
      DOB: '1996-03-22',
      languages: ['English', 'Indonesian', 'Malay'],
      type: 'Transfer'
    },
    {
      id: 3,
      name: 'Chen Wei Lin',
      country: 'Taiwan',
      salary: 720,
      skills: ['Child Care', 'Tutoring', 'Housekeeping'],
      imageUrl: '/images/img_frame_4_309x253.png',
      rating: 4.7,
      experience: '10 years',
      availability: 'Available',
      DOB: '1989-07-10',
      languages: ['Mandarin', 'English', 'Taiwanese'],
      type: 'Experienced'
    },
    {
      id: 4,
      name: 'Priya Sharma',
      country: 'India',
      salary: 600,
      skills: ['Cooking', 'Housekeeping', 'Elderly Care'],
      imageUrl: '/images/img_frame_4_309x253.png',
      rating: 4.6,
      experience: '5 years',
      availability: 'Available',
      DOB: '1994-05-18',
      languages: ['English', 'Hindi', 'Tamil'],
      type: 'New/Fresh'
    },
    {
      id: 5,
      name: 'Fatima Al-Zahra',
      country: 'Myanmar',
      salary: 620,
      skills: ['Child Care', 'Cooking', 'Light Housework'],
      imageUrl: '/images/img_frame_4_309x253.png',
      rating: 4.5,
      experience: '4 years',
      availability: 'Available',
      DOB: '1998-11-03',
      languages: ['English', 'Burmese', 'Thai'],
      type: 'Transfer'
    },
    {
      id: 6,
      name: 'Lily Nguyen',
      country: 'Vietnam',
      salary: 640,
      skills: ['Housekeeping', 'Cooking', 'Ironing'],
      imageUrl: '/images/img_frame_4_309x253.png',
      rating: 4.8,
      experience: '7 years',
      availability: 'Available',
      DOB: '1995-09-12',
      languages: ['English', 'Vietnamese', 'Cantonese'],
      type: 'Experienced'
    }
  ];

  const toggleSelection = (helperId) => {
    setSelectedMaids(prev => {
      if (prev.includes(helperId)) {
        return prev.filter(id => id !== helperId);
      } else {
        return [...prev, helperId];
      }
    });
  };

  const handleViewDetails = (helper) => {
    setSelectedMaidForDetails(helper);
    setShowDetailsPopup(true);
  };

  const handleCloseDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedMaidForDetails(null);
  };

  const handleViewAll = () => {
    navigate('/catalogue');
  };

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div 
          ref={titleRef}
          className={`text-center mb-12 transition-all duration-1000 ease-out ${
            isTitleVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold leading-tight capitalize text-gray-900 mb-4">
            <span className="text-black">Find Your Perfect </span>
            <span className="text-[#ff690d]">Helper</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover talented helpers, ready to become part of your family
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: false,
                stopOnMouseEnter: true
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4 my-4">
              {helpers.map((helper) => {
                const displayLabel = helper.type.includes("Transfer")
                  ? "Transfer"
                  : helper.type.includes("New/Fresh")
                  ? "New/Fresh"
                  : "Experienced";
                
                const helperAge = calculateAge(helper.DOB);
                const isSelected = selectedMaids.includes(helper.id);
                
                return (
                  <CarouselItem key={helper.id} className="pl-4 py-2 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    {/* Global CSS for Image Protection */}
                    {!isAuthenticated && (
                      <style>
                        {`
                          [data-helper-id="${helper.id}"] img {
                            user-select: none !important;
                            -webkit-user-select: none !important;
                            -moz-user-select: none !important;
                            -ms-user-select: none !important;
                            user-drag: none !important;
                            -webkit-user-drag: none !important;
                            -moz-user-drag: none !important;
                            -ms-user-drag: none !important;
                            pointer-events: auto !important;
                          }
                        `}
                      </style>
                    )}
                    
                    <Card  
                      data-helper-id={helper.id}
                      sx={{
                        width: styles.cardWidth,
                        height: styles.cardHeight,
                        maxWidth: '100%',
                        margin: '0 auto',
                        borderRadius: isMobile ? '12px' : isTablet ? '14px' : '16px',
                        overflow: 'hidden',
                        boxShadow: isMobile ? '0 2px 8px rgba(12, 25, 27, 0.08)' : isTablet ? '0 3px 12px rgba(12, 25, 27, 0.1)' : '0 4px 16px rgba(12, 25, 27, 0.12)',
                        position: 'relative',
                        background: brandColors.surface,
                        border: `1px solid ${brandColors.border}`,
                        filter: !isAuthenticated ? 'grayscale(20%)' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: isMobile ? 'none' : 'translateY(-2px)',
                          boxShadow: isMobile ? '0 2px 8px rgba(12, 25, 27, 0.08)' : isTablet ? '0 6px 20px rgba(12, 25, 27, 0.15)' : '0 8px 24px rgba(12, 25, 27, 0.18)'
                        }
                      }}
                    >
                      {/* Image Container with Overlay */}
                      <Box sx={{ 
                        position: 'relative', 
                        overflow: 'hidden', 
                        height: styles.imageHeight,
                        flexShrink: 0
                      }}>
                        {/* Loading skeleton */}
                        {!imageLoaded[helper.id] && !imageError[helper.id] && (
                          <Skeleton 
                            variant="rectangular" 
                            width="100%" 
                            height={styles.imageHeight}
                            sx={{ bgcolor: 'grey.200' }}
                          />
                        )}
                        
                        {/* Error fallback */}
                        {imageError[helper.id] && (
                          <Box
                            sx={{
                              width: '100%',
                              height: styles.imageHeight,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'grey.100',
                              color: 'grey.500'
                            }}
                          >
                            <PersonIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                          </Box>
                        )}
                        
                        <CardMedia
                          component="img"
                          image={getOptimizedImageUrl(helper.imageUrl)}
                          alt={helper.name}
                          loading="lazy"
                          sx={{
                            width: '100%',
                            height: styles.imageHeight,
                            objectFit: 'cover',
                            filter: isAuthenticated ? 'none' : 'blur(12px)',
                            transform: isAuthenticated ? 'none' : 'scale(1.1)',
                            transition: 'all 0.3s ease',
                            opacity: imageLoaded[helper.id] ? 1 : 0,
                          }}
                          onLoad={() => {
                            setImageLoaded(prev => ({ ...prev, [helper.id]: true }));
                          }}
                          onError={() => {
                            setImageError(prev => ({ ...prev, [helper.id]: true }));
                            setImageLoaded(prev => ({ ...prev, [helper.id]: true }));
                          }}
                        />
                        
                        {/* Overlay gradient */}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '60px',
                            background: `linear-gradient(to top, ${brandColors.secondary}80 0%, transparent 100%)`,
                            pointerEvents: 'none',
                          }}
                        />

                        {/* Lock Icon Overlay for Unauthenticated Users */}
                        {!isAuthenticated && (
                          <Box
                            onClick={() => navigate('/login')}
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 1,
                              pointerEvents: 'auto',
                              zIndex: 1,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translate(-50%, -50%) scale(1.05)',
                              }
                            }}
                          >
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: 'rgba(12, 25, 27, 0.9)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                              }}
                            >
                              <LockIcon sx={{ fontSize: 30, color: 'white' }} />
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'white',
                                fontWeight: 600,
                                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                                textAlign: 'center',
                                fontSize: '0.8rem',
                              }}
                            >
                              Sign in to view
                            </Typography>
                          </Box>
                        )}
                        
                        {/* Glassmorphism Status Badge - top left */}
                        <Chip
                          label={displayLabel}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: isMobile ? 8 : 12,
                            left: isMobile ? 8 : 12,
                            background: 'rgba(255, 255, 255, 0.25)',
                            backdropFilter: 'blur(15px)',
                            WebkitBackdropFilter: 'blur(15px)',
                            color: brandColors.text,
                            fontFamily: professionalFonts.accent,
                            fontWeight: 700,
                            fontSize: styles.chipFontSize,
                            height: styles.chipHeight,
                            letterSpacing: '0.02em',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            zIndex: 3,
                          }}
                        />
                        
                        {/* Selection Checkbox - moved to right top */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: isMobile ? 8 : 12,
                            right: isMobile ? 8 : 12,
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            backdropFilter: 'blur(15px)',
                            WebkitBackdropFilter: 'blur(15px)',
                            borderRadius: '8px',
                            border: `1px solid rgba(255, 255, 255, 0.3)`,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.4)',
                              transform: isMobile ? 'none' : 'scale(1.05)',
                            },
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleSelection(helper.id);
                            }}
                            sx={{
                              padding: isMobile ? '4px' : '6px',
                              color: '#666666',
                              '&.Mui-checked': {
                                color: brandColors.primary,
                              },
                              '& .MuiSvgIcon-root': {
                                fontSize: isMobile ? 18 : 20,
                              },
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Content - Minimalist Layout */}
                      <CardContent 
                        sx={{ 
                          p: styles.contentPadding, 
                          pb: styles.contentPadding * 0.75,
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start'
                        }}
                      >
                        {/* Top Section - Name and Country */}
                        <Box>
                          {/* Name */}
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontFamily: professionalFonts.primary,
                              fontWeight: 700,
                              fontSize: styles.nameFontSize,
                              color: brandColors.text,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              letterSpacing: '-0.02em',
                              lineHeight: 1.2,
                              mb: 1
                            }}
                          >
                            {helper.name}
                          </Typography>
                          
                          {/* Country with Flag */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
                            <img 
                              src={getCountryFlag(helper.country)} 
                              alt={`${helper.country} flag`}
                              style={{ 
                                width: styles.flagSize.width, 
                                height: styles.flagSize.height, 
                                borderRadius: '3px',
                                border: `1px solid ${brandColors.border}`
                              }}
                            />
                            <Typography variant="body2" sx={{ 
                              fontFamily: professionalFonts.secondary,
                              color: brandColors.textSecondary, 
                              fontSize: styles.bodyFontSize,
                              fontWeight: 500,
                              letterSpacing: '0.01em'
                            }}>
                              {helper.country}
                            </Typography>
                          </Box>
                          
                          {/* Age */}
                          {helperAge && (
                            <Typography variant="body2" sx={{ 
                              fontFamily: professionalFonts.secondary,
                              color: brandColors.primary, 
                              fontSize: styles.bodyFontSize,
                              fontWeight: 600,
                              letterSpacing: '0.01em'
                            }}>
                              {helperAge} years old
                            </Typography>
                          )}
                        </Box>
                        
                        {/* Bottom Section - Single Action Button */}
                        <Box sx={{ mt: 'auto', pt: 1.5 }}>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleViewDetails(helper);
                            }}
                            variant="contained"
                            fullWidth
                            sx={{
                              fontFamily: professionalFonts.accent,
                              background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%)`,
                              color: '#FFFFFF',
                              borderRadius: isMobile ? '10px' : '12px',
                              fontSize: isMobile ? '0.75rem' : '0.8rem',
                              fontWeight: 600,
                              textTransform: 'none',
                              padding: styles.buttonPadding,
                              minHeight: `${styles.buttonHeight}px`,
                              letterSpacing: '0.02em',
                              boxShadow: `0 4px 16px rgba(255, 145, 77, 0.25)`,
                              '&:hover': {
                                background: `linear-gradient(135deg, ${brandColors.primaryDark} 0%, #d35400 100%)`,
                                boxShadow: `0 6px 20px rgba(255, 145, 77, 0.35)`,
                                transform: isMobile ? 'none' : 'translateY(-1px)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            View Details
                          </Button>
                        </Box>
                      </CardContent>
                  </Card>
                </CarouselItem>
                );
              })}
            </CarouselContent>
            
            {/* Navigation Arrows */}
            <CarouselPrevious className="-left-12 lg:-left-16 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl" />
            <CarouselNext className="-right-12 lg:-right-16 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl" />
          </Carousel>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-4">
          <button
            onClick={handleViewAll}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            View All Helpers
            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Maid Details Popup */}
      {selectedMaidForDetails && (
        <MaidDetailsPopup
          open={showDetailsPopup}
          onClose={handleCloseDetailsPopup}
          maid={selectedMaidForDetails}
          isAuthenticated={isAuthenticated}
        />
      )}
    </section>
  );
};

export default HelperProfilesSection;