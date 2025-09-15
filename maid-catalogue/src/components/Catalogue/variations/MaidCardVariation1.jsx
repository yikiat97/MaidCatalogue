import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Box,
  Chip,
  IconButton,
  Avatar,
  useTheme,
  useMediaQuery,
  Skeleton,
  Tooltip
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import maidPic from '../../../assets/maidPic.jpg';
import API_CONFIG from '../../../config/api.js';
import { getCountryFlag } from '../../../utils/flagUtils';
import MaidDetailsPopup from '../MaidDetailsPopup';
import LoginPromptModal from '../LoginPromptModal';

// Brand colors
const brandColors = {
  primary: '#ff914d',
  secondary: '#0c191b',
  primaryLight: '#ffa366',
  primaryDark: '#e67e22',
  background: '#fafafa',
  surface: '#ffffff',
  text: '#0c191b',
  textSecondary: '#5a6c6f',
  border: '#e0e0e0',
  success: '#25D366',
};

// Skill icons mapping
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

/**
 * Variation 1: Compact Horizontal Layout
 * Features: Side-by-side image and content, minimal space usage
 * Accessibility: High contrast, clear hierarchy, keyboard navigation
 */
export default function MaidCardVariation1({
  maid,
  isAuthenticated,
  userFavorites = [],
  isSelected = false,
  onSelectionChange,
  ...props
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State management
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isFavorited, setIsFavorited] = useState(
    Array.isArray(userFavorites) && userFavorites.includes(maid.id)
  );
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  // Initialize and update favorites state based on userFavorites prop
  useEffect(() => {
    setIsFavorited(Array.isArray(userFavorites) && userFavorites.includes(maid.id));
  }, [userFavorites, maid.id]);

  // Calculate age from DOB
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

  const maidAge = calculateAge(maid.DOB);

  // Image optimization function
  const getOptimizedImageUrl = (originalUrl) => {
    if (!originalUrl) return maidPic;
    if (originalUrl.startsWith('http')) return originalUrl;
    return API_CONFIG.buildImageUrl(originalUrl);
  };

  // Event handlers
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


  const displayLabel = maid.type?.includes("Transfer")
    ? "Transfer"
    : maid.type?.includes("New/Fresh")
    ? "New/Fresh"
    : "Experienced";

  // Reset image loading state when maid changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [maid.id]);

  return (
    <>
      <Card 
        data-maid-id={maid.id}
        role="article"
        aria-label={`Maid profile for ${maid.name} from ${maid.country}`}
        sx={{
          width: '100%',
          height: isMobile ? 220 : 200,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(12, 25, 27, 0.12)',
          position: 'relative',
          background: brandColors.surface,
          border: `1px solid ${brandColors.border}`,
          display: 'flex',
          flexDirection: 'row',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(12, 25, 27, 0.18)',
          },
          '&:focus-within': {
            outline: `2px solid ${brandColors.primary}`,
            outlineOffset: '2px',
          }
        }}
        {...props}
      >
        {/* Image Section - Left side */}
        <Box sx={{ 
          position: 'relative', 
          width: isMobile ? '120px' : '140px',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          {/* Loading skeleton */}
          {!imageLoaded && !imageError && (
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height="100%"
              sx={{ bgcolor: 'grey.200' }}
            />
          )}
          
          {/* Error fallback */}
          {imageError && (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.100',
                color: 'grey.500'
              }}
            >
              <Avatar sx={{ width: 60, height: 60, bgcolor: 'grey.300' }}>
                {maid.name?.charAt(0)}
              </Avatar>
            </Box>
          )}
          
          <CardMedia
            component="img"
            image={getOptimizedImageUrl(maid.imageUrl)}
            alt={`Profile photo of ${maid.name}`}
            loading="lazy"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: isAuthenticated ? 'none' : 'blur(8px)',
              opacity: imageLoaded ? 1 : 0,
              transition: 'all 0.3s ease',
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
          
          {/* Status Badge */}
          <Chip
            label={displayLabel}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              background: 'rgba(255, 255, 255, 0.9)',
              color: brandColors.text,
              fontSize: '0.7rem',
              fontWeight: 700,
              height: '20px',
              zIndex: 2,
            }}
          />

          {/* Lock Icon for Unauthenticated Users */}
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
                zIndex: 3,
                color: 'white',
                textAlign: 'center'
              }}
            >
              <Typography variant="h4">🔒</Typography>
              <Typography variant="caption" sx={{ 
                color: 'white', 
                fontWeight: 600,
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                fontSize: '0.7rem'
              }}>
                Sign In
              </Typography>
            </Box>
          )}
        </Box>

        {/* Content Section - Right side */}
        <CardContent 
          sx={{ 
            p: 2,
            pb: '8px !important',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: 0 // Allow content to shrink
          }}
        >
          {/* Top Content */}
          <Box>
            {/* Name and Flag */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              mb: 0.5
            }}>
              <Typography 
                variant="h6" 
                component="h3"
                sx={{ 
                  fontWeight: 700,
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  color: brandColors.text,
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1
                }}
              >
                {maid.name}
              </Typography>
              <img 
                src={getCountryFlag(maid.country)} 
                alt={`${maid.country} flag`}
                style={{ 
                  width: 20, 
                  height: 15, 
                  flexShrink: 0
                }}
              />
              
              {/* Favorite Button */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite();
                }}
                disabled={isFavoriteLoading}
                size="small"
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                sx={{
                  color: isFavorited ? '#e91e63' : 'grey.400',
                  opacity: isFavoriteLoading ? 0.6 : 1,
                  cursor: isFavoriteLoading ? 'not-allowed' : 'pointer',
                  '&:hover:not(:disabled)': {
                    color: '#e91e63',
                    backgroundColor: 'rgba(233, 30, 99, 0.04)',
                  },
                  '&:disabled': {
                    color: isFavorited ? '#e91e63' : 'grey.400',
                    opacity: 0.6
                  }
                }}
              >
                {isFavorited ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              </IconButton>
            </Box>
            
            {/* Country and Age */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="body2" sx={{ 
                color: brandColors.textSecondary, 
                fontSize: '0.8rem',
                fontWeight: 500
              }}>
                {maid.country}
              </Typography>
              {maidAge && (
                <>
                  <Box sx={{ 
                    width: '1px', 
                    height: '12px', 
                    backgroundColor: brandColors.border 
                  }} />
                  <Typography variant="body2" sx={{ 
                    color: brandColors.textSecondary, 
                    fontSize: '0.8rem',
                    fontWeight: 500
                  }}>
                    {maidAge}yo
                  </Typography>
                </>
              )}
            </Box>
            
            {/* Skills Row */}
            {maid.skills && maid.skills.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 0.3, 
                flexWrap: 'nowrap',
                overflow: 'hidden',
                mb: 0.5
              }}>
                {maid.skills.slice(0, 4).map((skill, idx) => {
                  const skillEmoji = skillIcons[skill];
                  if (!skillEmoji) return null;
                  
                  return (
                    <Tooltip key={idx} title={skill} arrow placement="top">
                      <Box
                        role="img"
                        aria-label={skill}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 20,
                          height: 20,
                          borderRadius: '4px',
                          backgroundColor: `${brandColors.primary}15`,
                          fontSize: '12px',
                          flexShrink: 0,
                        }}
                      >
                        {skillEmoji}
                      </Box>
                    </Tooltip>
                  );
                })}
                {maid.skills.length > 4 && (
                  <Typography variant="caption" sx={{ 
                    color: brandColors.textSecondary,
                    alignSelf: 'center',
                    ml: 0.5,
                    fontSize: '0.7rem'
                  }}>
                    +{maid.skills.length - 4}
                  </Typography>
                )}
              </Box>
            )}

            {/* Salary */}
            {maid.salary && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <Typography variant="body2" sx={{ 
                  color: brandColors.success, 
                  fontSize: '1rem',
                  fontWeight: 800
                }}>
                  ${maid.salary}/month
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Bottom Actions */}
          <Box sx={{ 
            display: 'flex',
            gap: 1,
            alignItems: 'center'
          }}>
            {/* Select Button */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                toggleSelection();
              }}
              variant={isSelected ? "contained" : "outlined"}
              size="small"
              aria-label={isSelected ? 'Deselect maid' : 'Select maid'}
              sx={{
                minWidth: 'auto',
                px: 2,
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '8px',
                backgroundColor: isSelected ? brandColors.primary : 'transparent',
                borderColor: brandColors.primary,
                color: isSelected ? 'white' : brandColors.primary,
                '&:hover': {
                  backgroundColor: isSelected ? brandColors.primaryDark : `${brandColors.primary}10`,
                  borderColor: brandColors.primary,
                }
              }}
            >
              {isSelected ? 'Selected' : 'Select'}
            </Button>
            
            {/* View Details Button */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetailsPopup(true);
              }}
              variant="contained"
              size="small"
              aria-label={`View detailed profile of ${maid.name}`}
              sx={{
                minWidth: 'auto',
                px: 2,
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '8px',
                backgroundColor: brandColors.secondary,
                color: 'white',
                '&:hover': {
                  backgroundColor: '#1a2a2d',
                }
              }}
            >
              Details
            </Button>
          </Box>
        </CardContent>
      </Card>
      
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
    </>
  );
}