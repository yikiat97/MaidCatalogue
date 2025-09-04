import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CardMedia,
  Stack,
  Box, 
  Chip,
  IconButton,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import maidPic from '../../assets/maidPic.jpg';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PersonIcon from '@mui/icons-material/Person';
import HeightIcon from '@mui/icons-material/Height';
import LockIcon from '@mui/icons-material/Lock';
// Skill icons
import KitchenIcon from '@mui/icons-material/Kitchen';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CribIcon from '@mui/icons-material/Crib';
import ElderlyIcon from '@mui/icons-material/Elderly';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LoginPromptModal from './LoginPromptModal';
import MaidDetailsPopup from './MaidDetailsPopup';

import Tooltip from '@mui/material/Tooltip';
import API_CONFIG from '../../config/api.js';

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
  Babysitting: CribIcon,
  'Elderly Care': ElderlyIcon,
  'Dog(s)': PetsIcon,
  'Cat(s)': PetsIcon,
  Caregiving: FavoriteIcon,
};

export default function MaidCard({ maid, isAuthenticated, isSelected = false, onSelectionChange }) {
  console.log(maid)
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 0-599px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg')); // 600-1199px
  
  // Remove unused favorites state since we replaced with selection
  // const [isFavorited, setIsFavorited] = useState(
  //   Array.isArray(userFavorites) && userFavorites.includes(maid.id)
  // );
  
  // Add image loading state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

  // Remove unused favorites effect since we replaced with selection
  // useEffect(() => {
  //   setIsFavorited(Array.isArray(userFavorites) && userFavorites.includes(maid.id));
  // }, [userFavorites, maid.id]);

  // Reset image loading state when maid changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [maid.id]);

  // Secure blur protection for unauthenticated users
  useEffect(() => {
    const protectBlur = () => {
      // Find all images in this specific maid card
      const cardElement = document.querySelector(`[data-maid-id="${maid.id}"]`);
      if (!cardElement) return;

      const images = cardElement.querySelectorAll('img');
      images.forEach(img => {
        // Skip flag images - don't apply protection to them
        if (img.alt && img.alt.includes('flag')) {
          return;
        }
        
        if (isAuthenticated) {
          // Remove blur for authenticated users
          img.style.filter = 'none';
          img.style.transform = 'none';
          img.style.userSelect = 'auto';
          img.style.webkitUserSelect = 'auto';
          img.style.mozUserSelect = 'auto';
          img.style.msUserSelect = 'auto';
          img.style.pointerEvents = 'auto';
        } else {
          // Apply blur for unauthenticated users
          if (!img.style.filter || !img.style.filter.includes('blur')) {
            img.style.filter = 'blur(12px)';
            img.style.transform = 'scale(1.1)';
          }

          // Prevent context menu
          img.addEventListener('contextmenu', (e) => e.preventDefault());

          // Prevent drag and drop
          img.addEventListener('dragstart', (e) => e.preventDefault());

          // Prevent right-click save
          img.addEventListener('mousedown', (e) => {
            if (e.button === 2) e.preventDefault();
          });

          // Add additional CSS properties for better protection
          img.style.userSelect = 'none';
          img.style.webkitUserSelect = 'none';
          img.style.mozUserSelect = 'none';
          img.style.msUserSelect = 'none';
          img.style.pointerEvents = 'auto';

          // Prevent keyboard shortcuts
          img.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
              e.preventDefault();
            }
          });
        }
      });
    };

    // Run protection immediately and set up interval
    protectBlur();
    const interval = setInterval(protectBlur, 500);

    // Set up mutation observer to watch for DOM changes
    const observer = new MutationObserver(protectBlur);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [isAuthenticated, maid.id]);

  // Additional effect to handle authentication changes immediately
  useEffect(() => {
    if (isAuthenticated) {
      // Immediately remove blur when user becomes authenticated
      const cardElement = document.querySelector(`[data-maid-id="${maid.id}"]`);
      if (cardElement) {
        const images = cardElement.querySelectorAll('img');
        images.forEach(img => {
          // Skip flag images - don't apply any styling to them
          if (img.alt && img.alt.includes('flag')) {
            return;
          }
          
          img.style.filter = 'none';
          img.style.transform = 'none';
          img.style.userSelect = 'auto';
          img.style.webkitUserSelect = 'auto';
          img.style.mozUserSelect = 'auto';
          img.style.msUserSelect = 'auto';
          img.style.pointerEvents = 'auto';
        });
      }
    }
  }, [isAuthenticated, maid.id]);


  // Image optimization function
  const getOptimizedImageUrl = (originalUrl) => {
    if (!originalUrl) return maidPic;
    
    // If using a CDN like CloudFront, you can add optimization parameters
    // For now, we'll use the original URL but add lazy loading
    const finalUrl = originalUrl.startsWith('http') ? originalUrl : API_CONFIG.buildImageUrl(originalUrl);
    console.log('Image URL for', maid.name, ':', finalUrl);
    return finalUrl;
  };

  const toggleSelection = () => {
    if (onSelectionChange) {
      onSelectionChange(maid.id, !isSelected);
    }
  };

  const handleView = () => {
    setShowDetailsPopup(true);
  };

  const displayLabel = maid.type.includes("Transfer")
    ? "Transfer"
    : maid.type.includes("New/Fresh")
    ? "New/Fresh"
    : "Experienced";



  // Function to calculate age from DOB
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

  // Function to get country flag URL (using flagcdn.com API)
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
      // Add more country mappings as needed
    };
    
    const countryCode = countryCodeMap[country] || 'un'; // 'un' for unknown/default
    return `https://flagcdn.com/${countryCode}.svg`;
  };

  const maidAge = calculateAge(maid.DOB); // Calculate age from DOB

  // Responsive dimensions and styles - Portrait layout with proper button spacing
  const getResponsiveStyles = () => {
    if (isMobile) {
      return {
        cardHeight: 450,
        imageHeight: 180,
        maxImageHeight: 180,
        chipFontSize: '0.65rem',
        chipHeight: '20px',
        nameFontSize: '1rem',
        bodyFontSize: '0.8rem',
        contentPadding: 1.4,
        spacing: 1,
        flagSize: { width: 16, height: 12 },
        iconSize: 14,
        buttonHeight: 36,
        buttonPadding: '8px'
      };
    } else if (isTablet) {
      return {
        cardHeight: 520,
        imageHeight: 220,
        maxImageHeight: 220,
        chipFontSize: '0.7rem',
        chipHeight: '22px',
        nameFontSize: '1.1rem',
        bodyFontSize: '0.85rem',
        contentPadding: 1.6,
        spacing: 1.25,
        flagSize: { width: 18, height: 13 },
        iconSize: 15,
        buttonHeight: 40,
        buttonPadding: '10px'
      };
    } else {
      return {
        cardHeight: 560,
        imageHeight: 260,
        maxImageHeight: 260,
        chipFontSize: '0.75rem',
        chipHeight: '24px',
        nameFontSize: '1.2rem',
        bodyFontSize: '0.9rem',
        contentPadding: 1.6,
        spacing: 1.5,
        flagSize: { width: 20, height: 15 },
        iconSize: 16,
        buttonHeight: 42,
        buttonPadding: '12px'
      };
    }
  };

  const styles = getResponsiveStyles();

  return (
    <>
      {/* Global CSS for Image Protection */}
      {!isAuthenticated && (
        <style>
          {`
            [data-maid-id="${maid.id}"] img {
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
         data-maid-id={maid.id}
         sx={{
        width: '100%',
        height: styles.cardHeight,
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
        maxHeight: styles.maxImageHeight,
        flexShrink: 0
      }}>
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={styles.imageHeight}
            sx={{ bgcolor: 'grey.200' }}
          />
        )}
        
        {/* Error fallback */}
        {imageError && (
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
            image={getOptimizedImageUrl(maid.imageUrl)}
            alt={maid.name}
            loading="lazy" // Add lazy loading
            className={!isAuthenticated ? 'secure-blur' : ''}
            sx={{
              width: '100%',
              height: styles.imageHeight,
              maxHeight: styles.maxImageHeight,
              objectFit: 'cover',
              filter: isAuthenticated ? 'none' : 'blur(12px)',
              transform: isAuthenticated ? 'none' : 'scale(1.1)',
              transition: 'all 0.3s ease',
              opacity: imageLoaded ? 1 : 0, // Use opacity instead of display
            }}

            onLoad={() => {
              console.log('Image loaded for:', maid.name);
              setImageLoaded(true);
            }}
            onError={(e) => {
              console.log('Image error for:', maid.name, e);
              setImageError(true);
              setImageLoaded(true);
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
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(12, 25, 27, 0.95)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }
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
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#ffa366',
                  textShadow: '0 2px 8px rgba(255, 163, 102, 0.3)'
                }
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
            WebkitBackdropFilter: 'blur(15px)', // Safari support
            color: brandColors.text,
            fontFamily: professionalFonts.accent,
            fontWeight: 700,
            fontSize: styles.chipFontSize,
            height: styles.chipHeight,
            letterSpacing: '0.02em',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
            border: '1px solid rgba(255,255,255,0.3)',
            zIndex: 3,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
              borderRadius: 'inherit',
              zIndex: -1
            }
          }}
        />
        
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
              mb: 1.5
            }}
          >
            {maid.name}
          </Typography>
          
          {/* Country with Flag */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.25 }}>
            <img 
              src={getCountryFlag(maid.country)} 
              alt={`${maid.country} flag`}
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
              {maid.country}
            </Typography>
          </Box>
          
          {/* Age Row */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 0.75
          }}>
            {/* Age */}
            {maidAge && (
              <Typography variant="body2" sx={{ 
                fontFamily: professionalFonts.secondary,
                color: brandColors.primary, 
                fontSize: styles.bodyFontSize,
                fontWeight: 600,
                letterSpacing: '0.01em'
              }}>
                {maidAge} years old
              </Typography>
            )}
          </Box>
          
          {/* Skills Row */}
          {maid.skills && maid.skills.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              gap: 0.5, 
              flexWrap: 'wrap',
              mb: 0.75
            }}>
            {maid.skills.slice(0, 5).map((skill, idx) => {
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
            {maid.skills.length > 5 && (
              <Tooltip 
                title={`+${maid.skills.length - 5} more skills`}
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
                  +{maid.skills.length - 5}
                </Box>
              </Tooltip>
            )}
            </Box>
          )}
          
          {/* Monthly Salary */}
          {maid.salary && (
            <Typography variant="body2" sx={{ 
              fontFamily: professionalFonts.secondary,
              color: brandColors.secondary, 
              fontSize: styles.bodyFontSize,
              fontWeight: 700,
              letterSpacing: '0.01em'
            }}>
              <Box component="span" sx={{ 
                color: '#25D366',
                fontSize: isMobile ? '1rem' : isTablet ? '1.1rem' : '1.2rem',
                fontWeight: 800
              }}>
                ${maid.salary}
              </Box>
              /month
            </Typography>
          )}
        </Box>
        
        {/* Bottom Section - Toggle Button and Action Button */}
        <Box sx={{ mt: 'auto', pt: 2 }}>
          {/* Contact Toggle Button */}
          <Box sx={{ mb: 1.5 }}>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSelection();
              }}
              variant="outlined"
              sx={{
                width: '100%',
                fontFamily: professionalFonts.accent,
                background: isSelected 
                  ? `linear-gradient(135deg, #25D366 0%, #128C7E 100%)`
                  : 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                color: isSelected ? '#FFFFFF' : brandColors.textSecondary,
                border: isSelected 
                  ? '2px solid #25D366'
                  : `2px solid rgba(255, 255, 255, 0.3)`,
                borderRadius: isMobile ? '8px' : '10px',
                fontSize: isMobile ? '0.75rem' : '0.8rem',
                fontWeight: 600,
                textTransform: 'none',
                padding: isMobile ? '8px 12px' : '10px 16px',
                minHeight: isMobile ? '36px' : '40px',
                letterSpacing: '0.02em',
                boxShadow: isSelected 
                  ? '0 4px 16px rgba(37, 211, 102, 0.25)'
                  : '0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: isSelected 
                    ? `linear-gradient(135deg, #128C7E 0%, #075E54 100%)`
                    : 'rgba(255, 255, 255, 0.4)',
                  transform: isMobile ? 'none' : 'translateY(-1px)',
                  boxShadow: isSelected
                    ? '0 6px 20px rgba(37, 211, 102, 0.35)'
                    : '0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)',
                  border: isSelected 
                    ? '2px solid #25D366'
                    : `2px solid rgba(255, 255, 255, 0.5)`,
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
              }}
            >
{isSelected ? 'Added to Contact' : 'Add to Contact'}
            </Button>
          </Box>
          
          {/* View Details Button */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleView();
            }}
            variant="contained"
            sx={{
              width: '100%',
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
      
      {/* Login Prompt Modal */}
      <LoginPromptModal
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      />
      
      {/* Maid Details Popup */}
      <MaidDetailsPopup
        open={showDetailsPopup}
        onClose={() => setShowDetailsPopup(false)}
        maid={maid}
        isAuthenticated={isAuthenticated}
      />
    </Card>
    </>
  );
}