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
  useMediaQuery,
  IconButton,
  Tooltip
} from '@mui/material';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '../../components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
// Skill icons
import KitchenIcon from '@mui/icons-material/Kitchen';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CribIcon from '@mui/icons-material/Crib';
import ElderlyIcon from '@mui/icons-material/Elderly';
import PetsIcon from '@mui/icons-material/Pets';
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

// Skill icons mapping
const skillIcons = {
  Cooking: KitchenIcon,
  Housekeeping: CleaningServicesIcon,
  Childcare: ChildCareIcon,
  'Child Care': ChildCareIcon,
  Babysitting: CribIcon,
  'Elderly Care': ElderlyIcon,
  'Dog(s)': PetsIcon,
  'Cat(s)': PetsIcon,
  'Pet Care': PetsIcon,
  Caregiving: FavoriteIcon,
};

const HelperProfilesSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 0-599px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg')); // 600-1199px
  
  // State management
  const [maids, setMaids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaids, setSelectedMaids] = useState([]);
  const [favoriteMaids, setFavoriteMaids] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});
  const [imageError, setImageError] = useState({});
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedMaidForDetails, setSelectedMaidForDetails] = useState(null);
  
  const { setMaidList } = useMaidContext();
  
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
        cardHeight: 380,
        cardWidth: '100%',
        imageHeight: 200,
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
        cardHeight: 440,
        cardWidth: '100%',
        imageHeight: 220,
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
        cardHeight: 480,
        cardWidth: '320px', // Fixed width for desktop for consistent card size
        imageHeight: 240,
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

  // Function to fetch maids from API (limit to first 6 for homepage display)
  const fetchMaids = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch(API_CONFIG.buildUrlWithParams(API_CONFIG.ENDPOINTS.CATALOGUE.MAIDS, {
        page: '1',
        limit: '6' // Limit to 6 for homepage carousel
      }), {
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error(`Failed to load helpers (${res.status}: ${res.statusText})`);
      }
      
      // Check if response is JSON before parsing
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await res.text();
        console.error('Non-JSON response received:', textResponse.substring(0, 200));
        throw new Error(`Expected JSON response but received ${contentType || 'unknown content type'}`);
      }
      
      const data = await res.json();
      console.log('Fetched maids for homepage:', data);
      
      const maidsData = data.maids || [];
      setMaids(maidsData);
      // Update global context with homepage maids
      setMaidList(prev => {
        // Merge with existing data, avoiding duplicates
        const existingIds = new Set(prev.map(maid => maid.id));
        const newMaids = maidsData.filter(maid => !existingIds.has(maid.id));
        return [...prev, ...newMaids];
      });
    } catch (err) {
      console.error('Error fetching maids from API:', err);
      setError(err.message);
      setMaids([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check authentication
  const checkAuth = async () => {
    try {
      const res = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.PROFILE), {
        credentials: 'include',
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Error checking authentication:', err);
      setIsAuthenticated(false);
    }
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    checkAuth();
    fetchMaids();
  }, []);

  const toggleSelection = (helperId) => {
    setSelectedMaids(prev => {
      if (prev.includes(helperId)) {
        return prev.filter(id => id !== helperId);
      } else {
        return [...prev, helperId];
      }
    });
  };

  const toggleFavorite = (helperId) => {
    setFavoriteMaids(prev => {
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

        {/* Error State */}
        {error && (
          <div className="mb-8 max-w-2xl mx-auto">
            <Alert severity="error" className="rounded-lg">
              <strong>Unable to load helpers:</strong> {error}
              <Button 
                onClick={fetchMaids}
                startIcon={<RefreshIcon />}
                size="small" 
                className="ml-4"
              >
                Retry
              </Button>
            </Alert>
          </div>
        )}

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
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <CarouselItem key={`skeleton-${index}`} className="pl-4 py-2 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <div className="w-full max-w-sm mx-auto">
                      <Skeleton 
                        variant="rectangular" 
                        width="100%" 
                        height={styles.cardHeight}
                        className="rounded-2xl"
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                maids.map((helper) => {
                // Handle type field - might be string or need different logic for real API data
                const helperType = helper.type || helper.category || 'Experienced';
                const displayLabel = helperType.includes && helperType.includes("Transfer")
                  ? "Transfer"
                  : helperType.includes && helperType.includes("New/Fresh")
                  ? "New/Fresh"
                  : helperType === "Transfer" 
                  ? "Transfer"
                  : helperType === "New/Fresh" || helperType === "Fresh"
                  ? "New/Fresh"
                  : "Experienced";
                
                const helperAge = calculateAge(helper.DOB);
                const isSelected = selectedMaids.includes(helper.id);
                const isFavorited = favoriteMaids.includes(helper.id);
                
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
                        
                        <Tooltip
                          title={!isAuthenticated ? "Click to view details (sign in for full access)" : "Click to view details"}
                          arrow
                          placement="top"
                          enterTouchDelay={0}
                          leaveTouchDelay={1500}
                          disableFocusListener={isMobile}
                          disableHoverListener={isMobile}
                          PopperProps={{
                            sx: {
                              '& .MuiTooltip-tooltip': {
                                backgroundColor: brandColors.secondary,
                                color: '#FFFFFF',
                                fontSize: isMobile ? '0.75rem' : '0.875rem',
                                maxWidth: isMobile ? '200px' : '250px',
                                padding: isMobile ? '8px 12px' : '10px 16px',
                                borderRadius: '8px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                border: `1px solid ${brandColors.border}`,
                              },
                              '& .MuiTooltip-arrow': {
                                color: brandColors.secondary,
                              },
                            },
                          }}
                        >
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
                        </Tooltip>
                        
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
                        
                        {/* Heart Favorite Icon - top right */}
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(helper.id);
                          }}
                          sx={{
                            position: 'absolute',
                            top: isMobile ? 8 : 12,
                            right: isMobile ? 8 : 12,
                            width: isMobile ? 32 : isTablet ? 36 : 40,
                            height: isMobile ? 32 : isTablet ? 36 : 40,
                            background: `rgba(255, 145, 77, 0.25)`, // Orange theme
                            backdropFilter: 'blur(15px)',
                            WebkitBackdropFilter: 'blur(15px)',
                            border: `1px solid rgba(255, 145, 77, 0.4)`, // Orange border
                            boxShadow: '0 8px 32px rgba(255, 145, 77, 0.2), inset 0 1px 0 rgba(255, 145, 77, 0.3)', // Orange shadow
                            zIndex: 3,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: `rgba(255, 145, 77, 0.4)`, // Orange hover
                              transform: isMobile ? 'none' : 'scale(1.05)',
                              boxShadow: '0 8px 32px rgba(255, 145, 77, 0.35), inset 0 1px 0 rgba(255, 145, 77, 0.4)', // Enhanced orange glow
                            },
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'linear-gradient(135deg, rgba(255,145,77,0.3) 0%, rgba(255,145,77,0.1) 100%)', // Orange gradient
                              borderRadius: 'inherit',
                              zIndex: -1
                            }
                          }}
                        >
                          {isFavorited ? (
                            <FavoriteIcon sx={{ 
                              fontSize: isMobile ? 18 : isTablet ? 20 : 22,
                              color: '#c0392b', // Deeper red for better contrast against orange
                              transition: 'all 0.3s ease'
                            }} />
                          ) : (
                            <FavoriteBorderIcon sx={{ 
                              fontSize: isMobile ? 18 : isTablet ? 20 : 22,
                              color: 'white', // Keep white for good contrast
                              transition: 'all 0.3s ease'
                            }} />
                          )}
                        </IconButton>
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
                          {/* Name with Age */}
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
                              mb: 0.75
                            }}
                          >
                            {helper.name}
                            {helperAge && (
                              <Box component="span" sx={{ color: brandColors.primary }}>
                                , {helperAge}
                              </Box>
                            )}
                          </Typography>
                          
                          {/* Country with Flag */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
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
                          
                          {/* Skills Row */}
                          {helper.skills && helper.skills.length > 0 && (
                            <Box sx={{ 
                              display: 'flex', 
                              gap: 0.5, 
                              flexWrap: 'wrap',
                              mb: 0.5
                            }}>
                            {helper.skills.slice(0, 4).map((skill, idx) => {
                              const IconComponent = skillIcons[skill];
                              if (!IconComponent) return null;
                              
                              return (
                                <Tooltip 
                                  key={idx} 
                                  title={skill} 
                                  arrow
                                  placement="top"
                                  enterTouchDelay={0}
                                  leaveTouchDelay={1500}
                                  disableFocusListener={isMobile}
                                  disableHoverListener={isMobile}
                                  PopperProps={{
                                    sx: {
                                      '& .MuiTooltip-tooltip': {
                                        backgroundColor: brandColors.secondary,
                                        color: '#FFFFFF',
                                        fontSize: isMobile ? '0.7rem' : '0.75rem',
                                        padding: '6px 8px',
                                        borderRadius: '6px',
                                      },
                                      '& .MuiTooltip-arrow': {
                                        color: brandColors.secondary,
                                      },
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: isMobile ? 22 : isTablet ? 24 : 26,
                                      height: isMobile ? 22 : isTablet ? 24 : 26,
                                      borderRadius: '6px',
                                      backgroundColor: `${brandColors.primary}15`,
                                      color: brandColors.primary,
                                      border: `1px solid ${brandColors.primary}30`,
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        backgroundColor: `${brandColors.primary}25`,
                                        transform: isMobile ? 'none' : 'scale(1.1)',
                                        borderColor: `${brandColors.primary}50`,
                                      },
                                    }}
                                  >
                                    <IconComponent sx={{ 
                                      fontSize: isMobile ? 14 : isTablet ? 15 : 16 
                                    }} />
                                  </Box>
                                </Tooltip>
                              );
                            })}
                            {helper.skills.length > 4 && (
                              <Tooltip 
                                title={`+${helper.skills.length - 4} more skills`}
                                arrow
                                placement="top"
                                PopperProps={{
                                  sx: {
                                    '& .MuiTooltip-tooltip': {
                                      backgroundColor: brandColors.secondary,
                                      color: '#FFFFFF',
                                      fontSize: isMobile ? '0.7rem' : '0.75rem',
                                      padding: '6px 8px',
                                      borderRadius: '6px',
                                    },
                                    '& .MuiTooltip-arrow': {
                                      color: brandColors.secondary,
                                    },
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: isMobile ? 22 : isTablet ? 24 : 26,
                                    height: isMobile ? 22 : isTablet ? 24 : 26,
                                    borderRadius: '6px',
                                    backgroundColor: `${brandColors.textSecondary}15`,
                                    color: brandColors.textSecondary,
                                    border: `1px solid ${brandColors.textSecondary}30`,
                                    fontSize: isMobile ? '0.7rem' : '0.75rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  +{helper.skills.length - 4}
                                </Box>
                              </Tooltip>
                            )}
                            </Box>
                          )}
                          
                          {/* Monthly Salary */}
                          {helper.salary && (
                            <Typography variant="body2" sx={{ 
                              fontFamily: professionalFonts.secondary,
                              color: brandColors.secondary, 
                              fontSize: styles.bodyFontSize,
                              fontWeight: 700,
                              letterSpacing: '0.01em'
                            }}>
                              <Box component="span" sx={{ 
                                color: '#25D366',
                                fontSize: isMobile ? '1.3rem' : isTablet ? '1.5rem' : '1.7rem',
                                fontWeight: 800
                              }}>
                                ${helper.salary}
                              </Box>
                              /month
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
              })
              )}
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
            className="inline-flex items-center px-8 py-4 bg-primary-orange text-white font-semibold rounded-full hover:bg-primary-orange-dark hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-orange/30"
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