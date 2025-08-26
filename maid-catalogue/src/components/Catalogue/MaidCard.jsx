import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import LoginPromptModal from './LoginPromptModal';

// Skill icons
import KitchenIcon from '@mui/icons-material/Kitchen';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CribIcon from '@mui/icons-material/Crib';
import ElderlyIcon from '@mui/icons-material/Elderly';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
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

export default function MaidCard({ userFavorites = [], maid, isAuthenticated }) {
  console.log(maid)
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 0-599px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600-899px
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // 900px+
  
  const [isFavorited, setIsFavorited] = useState(
    Array.isArray(userFavorites) && userFavorites.includes(maid.id)
  );
  
  // Add image loading state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    setIsFavorited(Array.isArray(userFavorites) && userFavorites.includes(maid.id));
  }, [userFavorites, maid.id]);

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

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      // Show login prompt or redirect to login
      return;
    }

    const maidId = maid.id;
    
    if (isFavorited) {
      // Remove from favorites
      fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.CATALOGUE.USER_FAVORITES}/${maidId}`), {
        method: 'DELETE',
        credentials: 'include',
      })
        .then((res) => {
          if (res.ok) {
            setIsFavorited(false);
          }
        })
        .catch((err) => {
          console.error('Error removing from favorites:', err);
        });
    } else {
      // Add to favorites
      fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.CATALOGUE.USER_FAVORITES}/${maidId}`), {
        method: 'POST',
        credentials: 'include',
      })
        .then((res) => {
          if (res.ok) {
            setIsFavorited(true);
          }
        })
        .catch((err) => {
          console.error('Error adding to favorites:', err);
        });
    }
  };

  const handleView = () => {
    navigate(`/maid/${maid.id}`);
  };

  const displayLabel = maid.type.includes("Transfer")
    ? "Transfer"
    : maid.type.includes("New/Fresh")
    ? "New/Fresh"
    : "Experienced";

  const getChipColor = (type) => {
    switch(type) {
      case "Transfer": return { bg: brandColors.primary, text: '#FFFFFF' };
      case "New/Fresh": return { bg: brandColors.success, text: '#FFFFFF' };
      case "Experienced": return { bg: brandColors.warning, text: '#FFFFFF' };
      default: return { bg: brandColors.textSecondary, text: '#FFFFFF' };
    }
  };

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

  const chipColor = getChipColor(displayLabel);
  const maidAge = calculateAge(maid.DOB); // Calculate age from DOB

  // Responsive dimensions and styles
  const getResponsiveStyles = () => {
    if (isMobile) {
      return {
        cardHeight: 320, // Reduced height for mobile
        imageHeight: 140, // Increased image height for more portrait look
        chipFontSize: '0.5rem',
        chipHeight: '14px',
        nameFontSize: '0.7rem',
        captionFontSize: '0.55rem',
        bodyFontSize: '0.55rem',
        salaryFontSize: '0.75rem',
        iconSize: 9,
        skillIconSize: 9, // Smaller skill icons
        skillBoxSize: 16, // Smaller skill boxes
        buttonPadding: '2px 6px',
        contentPadding: 0.75, // Reduced padding
        spacing: 0.4, // Tighter spacing
        flagSize: { width: 10, height: 7 },
        maxSkills: 2 // Show fewer skills on mobile
      };
    } else if (isTablet) {
      return {
        cardHeight: 420, // Reduced height for tablet
        imageHeight: 220, // Increased image height for more portrait look
        chipFontSize: '0.65rem',
        chipHeight: '20px',
        nameFontSize: '0.9rem',
        captionFontSize: '0.68rem',
        bodyFontSize: '0.68rem',
        salaryFontSize: '1rem',
        iconSize: 12,
        skillIconSize: 14,
        skillBoxSize: 24,
        buttonPadding: '4px 12px',
        contentPadding: 1.5,
        spacing: 1,
        flagSize: { width: 16, height: 12 },
        maxSkills: 4
      };
    } else {
      return {
        cardHeight: 500, // Reduced height for more compact layout
        imageHeight: 260, // Increased image height for more portrait look
        chipFontSize: '0.7rem',
        chipHeight: '24px',
        nameFontSize: '1rem', // Slightly smaller name
        captionFontSize: '0.75rem',
        bodyFontSize: '0.75rem',
        salaryFontSize: '1.1rem', // Slightly smaller salary
        iconSize: 14,
        skillIconSize: 16, // Smaller skill icons
        skillBoxSize: 28, // Smaller skill boxes
        buttonPadding: '6px 16px', // Smaller button
        contentPadding: 2, // Reduced padding
        spacing: 1.5, // Reduced spacing
        flagSize: { width: 20, height: 15 },
        maxSkills: 5 // Show fewer skills
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
        width: '100%', // Always 100% width
        maxWidth: '100%', // Always 100% max width
        height: styles.cardHeight,
        borderRadius: isMobile ? '12px' : '16px',
        overflow: 'hidden',
        boxShadow: isMobile ? 'none' : '0 4px 16px rgba(12, 25, 27, 0.12)',
        position: 'relative',
        background: brandColors.surface,
        border: `1px solid ${brandColors.border}`,
        filter: !isAuthenticated ? 'grayscale(20%)' : 'none',
        // Responsive sizing that works with grid
        ...(isMobile && {
          maxWidth: '160px', // Smaller width for mobile 2-column layout
          minWidth: '140px'  // Minimum width on mobile
        }),
        ...(isTablet && {
          maxWidth: '280px', // Maximum width on tablet
          minWidth: '250px'  // Minimum width on tablet
        }),
        ...(!isMobile && !isTablet && {
          maxWidth: '320px', // Maximum width on desktop (3 columns)
          minWidth: '280px'  // Minimum width on desktop
        })
      }}
    >
      {/* Image Container with Overlay */}
      <Box sx={{ 
        position: 'relative', 
        overflow: 'hidden', 
        height: styles.imageHeight,
        // Fixed dimensions for mobile consistency
        ...(isMobile && {
          width: '140px',
          height: '120px',
          flexShrink: 0
        })
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
          title={!isAuthenticated ? "Click to view details (photos will remain blurred)" : "Click to view details"}
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
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              pointerEvents: 'none',
              zIndex: 1
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
                border: '2px solid rgba(255, 255, 255, 0.2)'
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
                fontSize: '0.8rem'
              }}
            >
              Photos Blurred
            </Typography>
          </Box>
        )}

        
        
        {/* Status Badge - moved to left top */}
        <Chip
          label={displayLabel}
          size="small"
          sx={{
            position: 'absolute',
            top: isMobile ? 8 : 12,
            left: isMobile ? 8 : 12,
            background: `linear-gradient(135deg, ${chipColor.bg} 0%, ${chipColor.bg}80 100%)`,
            color: chipColor.text,
            fontFamily: professionalFonts.accent,
            fontWeight: 700,
            fontSize: styles.chipFontSize,
            height: styles.chipHeight,
            letterSpacing: '0.02em',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.2)',
            zIndex: 3
          }}
        />
        
        {/* Favorite Button - moved to right top */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
          sx={{
            position: 'absolute',
            top: isMobile ? 8 : 12,
            right: isMobile ? 8 : 12,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: isMobile ? '6px' : '8px',
            width: isMobile ? 32 : 36,
            height: isMobile ? 32 : 36,
            border: `1px solid ${brandColors.border}`,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              transform: isMobile ? 'none' : 'scale(1.1)',
              boxShadow: '0 4px 12px rgba(255, 145, 77, 0.3)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {isFavorited ? (
            <FavoriteIcon sx={{ color: brandColors.error, fontSize: isMobile ? 18 : 20 }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: brandColors.error, fontSize: isMobile ? 18 : 20 }} />
          )}
        </IconButton>
      </Box>

      {/* Content - No longer clickable */}
      <CardContent 
        sx={{ 
          p: styles.contentPadding * 0.8, 
          pb: styles.contentPadding * 0.6,
        }}
      >
                  {/* Name only */}
          <Box sx={{ mb: styles.spacing * 0.6 }}>
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
              }}
            >
              {maid.name}
            </Typography>
            
            {/* Login Hint for Unauthenticated Users */}
            {/* {!isAuthenticated && (
              <Typography
                variant="caption"
                sx={{
                  color: brandColors.warning,
                  fontStyle: 'italic',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  textAlign: 'center',
                  mt: 0.5
                }}
              >
                Login to see unblurred photos
              </Typography>
            )} */}
        </Box>

        {/* Country Flag, Age, and Physical Stats */}
        <Stack 
          direction="row" 
          spacing={isMobile ? 0.5 : 1} 
          sx={{ mb: styles.spacing * 0.7, alignItems: 'center', flexWrap: 'wrap', gap: 0.3 }}
        >
          {/* Country with Flag */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
              fontWeight: 600,
              letterSpacing: '0.01em'
            }}>
              {isMobile ? maid.country.substring(0, 2) : maid.country}
            </Typography>
          </Box>
          
          {/* Age */}
          {maidAge && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon sx={{ fontSize: styles.iconSize, color: brandColors.primary }} />
              <Typography variant="body2" sx={{ 
                fontFamily: professionalFonts.secondary,
                color: brandColors.textSecondary, 
                fontSize: styles.bodyFontSize,
                fontWeight: 600
              }}>
                {maidAge}y
              </Typography>
            </Box>
          )}
          
          {/* Height and Weight - Show only on tablet and desktop, or conditionally on mobile */}
          {(maid.height || maid.weight) && !isMobile && (
            <>
              {maid.height && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <HeightIcon sx={{ fontSize: styles.iconSize, color: brandColors.warning }} />
                  <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: styles.bodyFontSize, fontWeight: 600 }}>
                    {maid.height}cm
                  </Typography>
                </Box>
              )}
              
              {maid.weight && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: styles.bodyFontSize, fontWeight: 600 }}>
                    {maid.weight}kg
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Stack>

        {/* Mobile Height/Weight Row - Only show if space allows */}
        {isMobile && (maid.height || maid.weight) && (
          <Stack direction="row" spacing={0.5} sx={{ mb: styles.spacing * 0.7, alignItems: 'center' }}>
            {maid.height && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <HeightIcon sx={{ fontSize: styles.iconSize, color: brandColors.warning }} />
                <Typography variant="body2" sx={{ 
                  fontFamily: professionalFonts.secondary,
                  color: brandColors.textSecondary, 
                  fontSize: styles.bodyFontSize,
                  fontWeight: 600
                }}>
                  {maid.height}cm
                </Typography>
              </Box>
            )}
            
            {maid.weight && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" sx={{ 
                  fontFamily: professionalFonts.secondary,
                  color: brandColors.textSecondary, 
                  fontSize: styles.bodyFontSize, 
                  fontWeight: 600 
                }}>
                  {maid.weight}kg
                </Typography>
              </Box>
            )}
          </Stack>
        )}

        {/* Skills Section */}
        <Box sx={{ mb: styles.spacing * 0.8 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              fontFamily: professionalFonts.accent,
              color: brandColors.textSecondary, 
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: isMobile ? '0.5rem' : '0.6rem',
              mb: 0.3,
              display: 'block'
            }}
          >
            Skills
          </Typography>
          <Stack 
            direction="row" 
            sx={{ 
              flexWrap: 'wrap', 
              gap: isMobile ? 0.2 : 0.4, // Even tighter gap
              minHeight: styles.skillBoxSize,
              overflow: 'hidden', // Prevent overflow
            }}
          >
            {maid.skills.slice(0, styles.maxSkills).map((skill, idx) => {
              const IconComponent = skillIcons[skill];
              if (!IconComponent) return null;

              return (
                <Tooltip title={skill} key={idx} arrow>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `${brandColors.primary}10`,
                      color: brandColors.primary,
                      borderRadius: isMobile ? '6px' : '8px',
                      width: styles.skillBoxSize,
                      height: styles.skillBoxSize,
                      flexShrink: 0, // Prevent shrinking
                      transition: 'all 0.2s ease',
                      border: `1px solid ${brandColors.primary}20`,
                      '&:hover': {
                        backgroundColor: brandColors.primary,
                        color: '#FFFFFF',
                        transform: isMobile ? 'none' : 'scale(1.1)',
                        boxShadow: `0 4px 12px ${brandColors.primary}40`,
                      },
                    }}
                  >
                    <IconComponent sx={{ fontSize: styles.skillIconSize }} />
                  </Box>
                </Tooltip>
              );
            })}
            {maid.skills.length > styles.maxSkills && (
              <Tooltip title={`+${maid.skills.length - styles.maxSkills} more skills`} arrow>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: brandColors.textSecondary,
                    color: '#FFFFFF',
                    borderRadius: isMobile ? '6px' : '8px',
                    width: styles.skillBoxSize,
                    height: styles.skillBoxSize,
                    fontSize: isMobile ? '0.6rem' : '0.7rem',
                    fontWeight: 700,
                    flexShrink: 0, // Prevent shrinking
                    border: `1px solid ${brandColors.textSecondary}20`,
                  }}
                >
                  +{maid.skills.length - styles.maxSkills}
                </Box>
              </Tooltip>
            )}
          </Stack>
        </Box>

        <Divider sx={{ 
          my: styles.spacing * 0.6,
          borderColor: brandColors.border,
          opacity: 0.6
        }} />

        {/* Bottom Section - Updated Layout */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 0.7 : 1.2 }}>
          {/* Salary and Compare Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Salary with Info Tooltip */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box>
                <Typography variant="caption" sx={{ 
                  fontFamily: professionalFonts.accent,
                  color: brandColors.textSecondary, 
                  fontSize: styles.captionFontSize,
                  fontWeight: 600,
                  letterSpacing: '0.02em'
                }}>
                  Monthly Salary
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontFamily: professionalFonts.primary,
                      fontWeight: 800,
                      color: brandColors.success,
                      fontSize: styles.salaryFontSize,
                      lineHeight: 1.2,
                      letterSpacing: '-0.01em'
                    }}
                  >
                    ${maid.salary}
                  </Typography>
                                     <Tooltip 
                     title="Total salary = Basic salary + off day compensation"
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
                          maxWidth: isMobile ? '260px' : '320px',
                          padding: isMobile ? '8px' : '12px',
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
                    <InfoOutlinedIcon 
                      sx={{ 
                        fontSize: isMobile ? 14 : 16, 
                        color: brandColors.textSecondary,
                        cursor: 'help',
                        '&:hover': {
                          color: brandColors.primary,
                        }
                      }} 
                    />
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            {/* Compare Button */}
            {/* <Tooltip 
              title={
                <Box sx={{ p: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Add to Compare
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Compare this maid with others
                  </Typography>
                </Box>
              }
              arrow
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
                    maxWidth: isMobile ? '180px' : '240px',
                    padding: isMobile ? '6px 8px' : '8px 12px',
                    borderRadius: '6px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    border: `1px solid ${brandColors.border}`,
                  },
                  '& .MuiTooltip-arrow': {
                    color: brandColors.secondary,
                  },
                },
              }}
            >
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isAuthenticated) {
                    setShowLoginPrompt(true);
                  } else {
                    console.log('Added to compare:', maid.id);
                  }
                }}
                size="small"
                sx={{
                  backgroundColor: brandColors.warning,
                  color: '#FFFFFF',
                  width: isMobile ? 32 : 36,
                  height: isMobile ? 32 : 36,
                  border: `1px solid ${brandColors.warning}20`,
                  '&:hover': {
                    backgroundColor: brandColors.warning,
                    transform: isMobile ? 'none' : 'scale(1.05)',
                    boxShadow: `0 4px 12px ${brandColors.warning}40`,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <CompareArrowsIcon sx={{ fontSize: isMobile ? 16 : 18 }} />
              </IconButton>
            </Tooltip> */}
          </Box>

          {/* Action Buttons Row */}
          <Box sx={{ 
            display: 'flex', 
            gap: 0.7, 
            mt: 0.3,
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            {/* WhatsApp Button - Left/Top */}
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isAuthenticated) {
                  setShowLoginPrompt(true);
                } else {
                  const message = `Hi, I'm interested in maid ${maid.name} (ID: ${maid.id}) Link: ${API_CONFIG.BASE_URL}/maid/${maid.id}.`;
                  window.open(`https://wa.me/88270086?text=${encodeURIComponent(message)}`, '_blank');
                }
              }}
              startIcon={<WhatsAppIcon sx={{ fontSize: isMobile ? 10 : 14 }} />}
              variant="contained"
              size="small"
              sx={{
                fontFamily: professionalFonts.accent,
                background: `linear-gradient(135deg, #25D366 0%, #128C7E 100%)`,
                color: '#FFFFFF',
                borderRadius: isMobile ? '10px' : '16px',
                fontSize: isMobile ? '0.6rem' : '0.7rem',
                fontWeight: 600,
                textTransform: 'none',
                padding: isMobile ? '3px 6px' : '6px 12px',
                minHeight: isMobile ? '28px' : '32px',
                flex: isMobile ? 'none' : 1,
                width: isMobile ? '100%' : 'auto',
                letterSpacing: '0.02em',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                '&:hover': {
                  background: `linear-gradient(135deg, #128C7E 0%, #075E54 100%)`,
                  boxShadow: '0 6px 16px rgba(37, 211, 102, 0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Contact
            </Button>

            {/* View Details Button - Right/Bottom */}
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleView(); // Allow all users to view details
              }}
              variant="outlined"
              size="small"
              sx={{
                fontFamily: professionalFonts.accent,
                color: brandColors.primary,
                borderColor: brandColors.primary,
                borderRadius: isMobile ? '10px' : '16px',
                fontSize: isMobile ? '0.6rem' : '0.7rem',
                fontWeight: 600,
                textTransform: 'none',
                padding: isMobile ? '3px 6px' : '6px 12px',
                minHeight: isMobile ? '28px' : '32px',
                flex: isMobile ? 'none' : 1,
                width: isMobile ? '100%' : 'auto',
                '&:hover': {
                  backgroundColor: brandColors.primary,
                  color: '#FFFFFF',
                  borderColor: brandColors.primary,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(255, 145, 77, 0.3)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>
      </CardContent>
      
      {/* Login Prompt Modal */}
      <LoginPromptModal
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      />
    </Card>
    </>
  );
}