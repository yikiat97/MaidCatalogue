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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import maidPic from '../../assets/maidPic.jpg';
import LoginPromptModal from './LoginPromptModal';
import MaidDetailsPopup from './MaidDetailsPopup';

import Tooltip from '@mui/material/Tooltip';
import API_CONFIG from '../../config/api.js';
import { getCountryFlag } from '../../utils/flagUtils';

// Emoji Icon Component for consistent styling
const EmojiIcon = ({ children, sx = {}, fontSize = '1em', ...props }) => (
  <span 
    style={{ 
      fontSize, 
      lineHeight: 1, 
      display: 'inline-block',
      userSelect: 'none',
      ...sx 
    }} 
    {...props}
  >
    {children}
  </span>
);

// Optimized CardMedia Component with simplified image handling
const OptimizedCardMedia = ({ imageUrl, alt, isAuthenticated, sx, onLoad, onError, ...props }) => {
  return (
    <CardMedia
      component="img"
      src={imageUrl}
      alt={alt}
      loading="lazy"
      onLoad={onLoad}
      onError={onError}
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'all 0.3s ease',
        filter: isAuthenticated ? 'none' : 'blur(12px)',
        transform: isAuthenticated ? 'none' : 'scale(1.1)',
        ...sx
      }}
      {...props}
    />
  );
};

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

// Skill icons mapping with emojis
const skillIcons = {
  Cooking: '👩‍🍳',
  Housekeeping: '🧹',
  Childcare: '👶',
  Babysitting: '🍼',
  'Elderly Care': '🧓',
  'Dog(s)': '🐕',
  'Cat(s)': '🐱',
  Caregiving: '💝',
};

export default function MaidCard({ maid, isAuthenticated, userFavorites = [], isSelected = false, onSelectionChange }) {
  console.log(maid)
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 0-599px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg')); // 600-1199px
  const isVerySmall = useMediaQuery('(max-width:400px)'); // 0-400px
  
  // Add image loading state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [isFavorited, setIsFavorited] = useState(
    Array.isArray(userFavorites) && userFavorites.includes(maid.id)
  );
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  // Initialize and update favorites state based on userFavorites prop
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

  const toggleSelection = () => {
    if (onSelectionChange) {
      onSelectionChange(maid.id, !isSelected);
    }
  };

  const toggleFavorite = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    // Prevent multiple simultaneous requests
    if (isFavoriteLoading) {
      return;
    }

    setIsFavoriteLoading(true);
    const previousFavoritedState = isFavorited;

    try {
      // Optimistically update UI
      setIsFavorited(!isFavorited);

      // Determine HTTP method and endpoint based on current state
      const method = previousFavoritedState ? 'DELETE' : 'POST';
      let apiUrl;
      let requestOptions;

      if (previousFavoritedState) {
        // DELETE: Use catalogue endpoint with maid ID in URL path (no request body)
        apiUrl = API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.CATALOGUE.USER_FAVORITES}/${maid.id}`);
        requestOptions = {
          method: 'DELETE',
          credentials: 'include'
        };
      } else {
        // POST: Use user endpoint with maid ID in request body  
        apiUrl = API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.USER.FAVORITES);
        requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ maidId: maid.id })
        };
      }

      // Make API call with proper HTTP method and endpoint
      const response = await fetch(apiUrl, requestOptions);

      if (!response.ok) {
        // Provide more specific error messages based on status code
        let errorMessage = `Failed to update favorites: ${response.status}`;
        if (response.status === 401) {
          errorMessage = 'Authentication required. Please log in again.';
          setShowLoginPrompt(true);
        } else if (response.status === 400) {
          errorMessage = 'Invalid request. Please try again.';
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }

      // API call successful - the optimistic update was correct
      const action = previousFavoritedState ? 'removed from' : 'added to';
      console.log(`Maid ${maid.name} ${action} favorites`);
      
    } catch (error) {
      console.error('Error updating favorites:', error);
      
      // Revert the optimistic update on error
      setIsFavorited(previousFavoritedState);
      
      // You could show a toast notification here for better UX
      // showToast(error.message || 'Failed to update favorites. Please try again.');
      
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleView = () => {
    setShowDetailsPopup(true);
  };

  const displayLabel = maid.type && maid.type.includes("Transfer")
    ? "Transfer"
    : maid.type && maid.type.includes("New/Fresh")
    ? "New/Fresh"
    : maid.type
    ? "Experienced"
    : "Top Pick";



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


  const maidAge = calculateAge(maid.DOB); // Calculate age from DOB

  // Responsive dimensions and styles - Flexible layout for better space utilization
  const getResponsiveStyles = () => {
    if (isVerySmall) {
      return {
        cardHeight: 474,
        chipFontSize: '0.65rem',
        chipHeight: '20px',
        nameFontSize: '1rem',
        bodyFontSize: '0.8rem',
        contentPadding: 1.2,
        spacing: 1,
        flagSize: { width: 16, height: 12 },
        iconSize: 14,
        buttonHeight: 30,
        buttonPadding: '8px'
      };
    } else if (isMobile) {
      return {
        cardHeight: 474,
        chipFontSize: '0.65rem',
        chipHeight: '20px',
        nameFontSize: '1rem',
        bodyFontSize: '0.8rem',
        contentPadding: 1.2,
        spacing: 1,
        flagSize: { width: 16, height: 12 },
        iconSize: 14,
        buttonHeight: 30,
        buttonPadding: '8px'
      };
    } else if (isTablet) {
      return {
        cardHeight: 548,
        chipFontSize: '0.7rem',
        chipHeight: '22px',
        nameFontSize: '1.1rem',
        bodyFontSize: '0.85rem',
        contentPadding: 1.4,
        spacing: 1.25,
        flagSize: { width: 18, height: 13 },
        iconSize: 15,
        buttonHeight: 33,
        buttonPadding: '10px'
      };
    } else {
      return {
        cardHeight: 592,
        chipFontSize: '0.75rem',
        chipHeight: '24px',
        nameFontSize: '1.2rem',
        bodyFontSize: '0.9rem',
        contentPadding: 1.4,
        spacing: 1.5,
        flagSize: { width: 20, height: 15 },
        iconSize: 16,
        buttonHeight: 35,
        buttonPadding: '12px'
      };
    }
  };

  const styles = getResponsiveStyles();

  // Calculate dynamic skill icon sizes based on available space and skill count
  const calculateSkillIconSize = (skillCount) => {
    if (!skillCount || skillCount === 0) return styles.iconSize;
    
    // Base container width estimation (card content width minus padding)
    const baseWidth = isMobile ? 280 : isTablet ? 320 : 360;
    const gapSize = 4; // 0.5 * 8px spacing
    const totalGapWidth = (skillCount - 1) * gapSize;
    const availableWidth = baseWidth - totalGapWidth;
    const calculatedSize = Math.floor(availableWidth / skillCount);
    
    // Define min/max sizes based on breakpoint
    const minSize = isMobile ? 18 : isTablet ? 19 : 20;
    const maxSize = isMobile ? 28 : isTablet ? 30 : 32;
    
    return Math.max(minSize, Math.min(maxSize, calculatedSize));
  };

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
        borderRadius: isMobile ? '6px' : isTablet ? '8px' : '10px',
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
      {/* Image Container with Overlay - Flexible height */}
      <Box sx={{ 
        position: 'relative', 
        overflow: 'hidden', 
        flex: 1,
        minHeight: isMobile ? 240 : isTablet ? 270 : 300,
        flexShrink: 0
      }}>
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height="100%"
            sx={{ 
              bgcolor: 'grey.200',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          />
        )}
        
        {/* Error fallback */}
        {imageError && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.100',
              color: 'grey.500'
            }}
          >
            <EmojiIcon fontSize="60px" sx={{ color: 'grey.400' }}>
              👤
            </EmojiIcon>
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
          <OptimizedCardMedia
            imageUrl={getOptimizedImageUrl(maid.imageUrl)}
            alt={maid.name}
            isAuthenticated={isAuthenticated}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: imageLoaded ? 1 : 0,
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
              <EmojiIcon fontSize="30px" sx={{ color: 'white' }}>
                🔒
              </EmojiIcon>
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

        {/* Heart Favorite Icon - top right */}
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite();
          }}
          disabled={isFavoriteLoading}
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
            opacity: isFavoriteLoading ? 0.6 : 1,
            cursor: isFavoriteLoading ? 'not-allowed' : 'pointer',
            '&:hover:not(:disabled)': {
              background: `rgba(255, 145, 77, 0.4)`, // Orange hover
              transform: isMobile ? 'none' : 'scale(1.05)',
              boxShadow: '0 8px 32px rgba(255, 145, 77, 0.35), inset 0 1px 0 rgba(255, 145, 77, 0.4)', // Enhanced orange glow
            },
            '&:disabled': {
              background: `rgba(255, 145, 77, 0.15)`, // Dimmed when disabled
              border: `1px solid rgba(255, 145, 77, 0.2)`, // Dimmed border
              boxShadow: '0 4px 16px rgba(255, 145, 77, 0.1), inset 0 1px 0 rgba(255, 145, 77, 0.1)', // Dimmed shadow
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
          {isFavoriteLoading ? (
            <EmojiIcon 
              fontSize={isMobile ? '18px' : isTablet ? '20px' : '22px'}
              sx={{
                transition: 'all 0.3s ease',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}
            >
              ⏳
            </EmojiIcon>
          ) : isFavorited ? (
            <EmojiIcon 
              fontSize={isMobile ? '18px' : isTablet ? '20px' : '22px'}
              sx={{
                transition: 'all 0.3s ease',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
              }}
            >
              ❤️
            </EmojiIcon>
          ) : (
            <EmojiIcon 
              fontSize={isMobile ? '18px' : isTablet ? '20px' : '22px'}
              sx={{
                transition: 'all 0.3s ease',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
              }}
            >
              🤍
            </EmojiIcon>
          )}
        </IconButton>
        
      </Box>

      {/* Content - Minimalist Layout */}
      <CardContent 
        sx={{ 
          p: styles.contentPadding * 1.2, 
          pb: 0.5,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}
      >
        {/* Top Section - Name and Country */}
        <Box>
          {/* Name with Flag */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'nowrap', 
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.25,
            minWidth: 0,
            gap: 0.75
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: professionalFonts.primary,
                fontWeight: 700,
                fontSize: styles.nameFontSize,
                color: brandColors.text,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                mr: 1
              }}
            >
              {maid.name}
            </Typography>
            <img 
              src={getCountryFlag(maid.country)} 
              alt={`${maid.country} flag`}
              style={{ 
                width: styles.flagSize.width * 1.44, 
                height: styles.flagSize.height * 1.44, 
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                flexShrink: 0
              }}
            />
          </Box>
          
          {/* Country */}
          <Box sx={{ mb: 1.5 }}>
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
          
          {/* Physical Stats Row - Age, Height, Weight */}
          <Box sx={{
            display: 'flex',
            gap: isMobile ? 0.5 : 0.75,
            mb: 1.25,
            alignItems: 'center',
            flexWrap: 'nowrap'
          }}>
            {maidAge && (
              <>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: professionalFonts.secondary,
                    color: brandColors.textSecondary, 
                    fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem',
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                    whiteSpace: 'nowrap',
                    pl: 0, pr: isMobile ? 0.4 : 0.5
                  }}
                >
                  {maidAge}yr
                </Typography>
                {(maid.height && maid.height > 0) || (maid.weight && maid.weight > 0) ? (
                  <Box sx={{
                    width: '2px',
                    height: '16px',
                    backgroundColor: brandColors.textSecondary,
                    opacity: 1,
                    borderRadius: '1px'
                  }} />
                ) : null}
              </>
            )}
            {maid.height && maid.height > 0 && (
              <>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: professionalFonts.secondary,
                    color: brandColors.textSecondary, 
                    fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem',
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                    whiteSpace: 'nowrap',
                    pl: 0, pr: isMobile ? 0.4 : 0.5
                  }}
                >
                  {maid.height}cm
                </Typography>
                {maid.weight && maid.weight > 0 && (
                  <Box sx={{
                    width: '2px',
                    height: '16px',
                    backgroundColor: brandColors.textSecondary,
                    opacity: 1,
                    borderRadius: '1px'
                  }} />
                )}
              </>
            )}
            {maid.weight && maid.weight > 0 && (
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: professionalFonts.secondary,
                  color: brandColors.textSecondary, 
                  fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                  pl: 0, pr: isMobile ? 0.4 : 0.5
                }}
              >
                {maid.weight}kg
              </Typography>
            )}
          </Box>
          
          {/* Skills Row - Single Row Display */}
          {maid.skills && maid.skills.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              gap: 0.5, 
              flexWrap: 'nowrap',
              mb: 1.25,
              overflow: 'hidden',
              width: '100%'
            }}>
              {maid.skills.map((skill, idx) => {
                const skillEmoji = skillIcons[skill];
                if (!skillEmoji) return null;
                
                const dynamicIconSize = calculateSkillIconSize(maid.skills.length);
                
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
                        width: dynamicIconSize,
                        height: dynamicIconSize,
                        borderRadius: '4px',
                        backgroundColor: `${brandColors.primary}15`,
                        color: brandColors.primary,
                        border: `1px solid ${brandColors.primary}30`,
                        transition: 'all 0.2s ease',
                        flexShrink: 0,
                        '&:hover': {
                          backgroundColor: `${brandColors.primary}25`,
                          transform: isMobile ? 'none' : 'scale(1.05)',
                          borderColor: `${brandColors.primary}50`,
                        },
                      }}
                    >
                      <EmojiIcon 
                        fontSize={`${Math.max(10, dynamicIconSize * 0.65)}px`}
                      >
                        {skillEmoji}
                      </EmojiIcon>
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          )}
          
          {/* Divider between Skills and Salary */}
          {maid.skills && maid.skills.length > 0 && maid.salary && (
            <Divider
              sx={{
                my: isMobile ? 1.5 : isTablet ? 1.75 : 2,
                mx: isMobile ? 1 : isTablet ? 1.5 : 2,
                borderColor: brandColors.border,
                opacity: 0.6
              }}
            />
          )}
          
          {/* Monthly Salary */}
          {maid.salary && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                  ${maid.salary}
                </Box>
                /month
              </Typography>
              
              {/* Salary Info Tooltip */}
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
                      fontSize: isMobile ? '0.7rem' : '0.75rem',
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
                <HelpOutlineIcon 
                  sx={{ 
                    fontSize: isMobile ? 14 : isTablet ? 15 : 16,
                    color: brandColors.textSecondary,
                    cursor: 'pointer',
                    opacity: 0.7,
                    '&:hover': {
                      opacity: 1,
                      color: brandColors.primary
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
              </Tooltip>
            </Box>
          )}
        </Box>
        
        {/* Bottom Section - Side by Side Buttons */}
        <Box sx={{ 
          mt: isMobile ? 1.5 : isTablet ? 2 : 2.5,
          pt: 0,
          display: 'flex',
          gap: 1,
          alignItems: 'stretch'
        }}>
          {/* Contact Toggle Button */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSelection();
            }}
            variant="outlined"
            sx={{
              flex: 1,
              fontFamily: professionalFonts.accent,
              background: isSelected 
                ? `linear-gradient(135deg, #6B7280 0%, #4B5563 100%)`
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              color: isSelected ? '#FFFFFF' : brandColors.textSecondary,
              border: isSelected 
                ? '2px solid #6B7280'
                : `2px solid rgba(255, 255, 255, 0.3)`,
              borderRadius: isMobile ? '8px' : '12px',
              fontSize: isMobile ? '0.7rem' : '0.75rem',
              fontWeight: 600,
              textTransform: 'none',
              padding: isMobile ? '8px 6px' : '10px 12px',
              minHeight: `${styles.buttonHeight}px`,
              letterSpacing: '0.02em',
              boxShadow: isSelected 
                ? '0 4px 16px rgba(107, 114, 128, 0.25)'
                : '0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: isSelected 
                  ? `linear-gradient(135deg, #4B5563 0%, #374151 100%)`
                  : 'rgba(255, 255, 255, 0.4)',
                transform: isMobile ? 'none' : 'translateY(-1px)',
                boxShadow: isSelected
                  ? '0 6px 20px rgba(107, 114, 128, 0.35)'
                  : '0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)',
                border: isSelected 
                  ? '2px solid #6B7280'
                  : `2px solid rgba(255, 255, 255, 0.5)`,
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
          
          {/* View Details Button */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleView();
            }}
            variant="contained"
            sx={{
              flex: 1,
              fontFamily: professionalFonts.accent,
              background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%)`,
              color: '#FFFFFF',
              borderRadius: isMobile ? '10px' : '14px',
              fontSize: isVerySmall ? '0.6rem' : isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem',
              fontWeight: 600,
              textTransform: 'none',
              padding: isMobile ? '8px 6px' : '10px 12px',
              minHeight: `${styles.buttonHeight}px`,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
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