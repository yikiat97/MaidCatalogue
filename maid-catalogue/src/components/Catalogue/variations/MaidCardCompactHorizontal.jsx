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
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import maidPic from '../../../assets/maidPic.jpg';
import API_CONFIG from '../../../config/api.js';
import { getCountryFlag } from '../../../utils/flagUtils';
import MaidDetailsPopup from '../MaidDetailsPopup';

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
  Laundry: '👕',
  'Pet Care': '🐾',
  Gardening: '🌱',
  'Car Washing': '🚗',
};

/**
 * Compact Horizontal Maid Card for List Views
 * Optimized for Shortlisted and Recommended pages
 * Features: Full-width horizontal layout, essential info, quick actions
 */
export default function MaidCardCompactHorizontal({ 
  maid, 
  isAuthenticated, 
  userFavorites = [],
  onCardClick,
  showBlurredImage = false,
  ...props 
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Initialize favorites state
  useEffect(() => {
    setIsFavorited(userFavorites.includes(maid.id));
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

  // Get display label based on availability
  const getDisplayLabel = () => {
    if (maid.availability === 'Available') return 'Available';
    if (maid.availability === 'Unavailable') return 'Unavailable';
    if (maid.availability === 'Pending') return 'Interview';
    return 'Available';
  };

  const displayLabel = getDisplayLabel();
  const labelColor = displayLabel === 'Available' ? brandColors.success : 
                    displayLabel === 'Unavailable' ? '#e74c3c' : brandColors.warning;

  // Event handlers
  const toggleFavorite = async () => {
    if (!isAuthenticated) return;
    
    const previousFavoritedState = isFavorited;
    
    try {
      // Optimistically update UI
      setIsFavorited(!isFavorited);
      
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
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ maidId: maid.id })
        };
      }

      const response = await fetch(apiUrl, requestOptions);

      if (!response.ok) {
        // Provide more specific error messages
        let errorMessage = `Failed to update favorites: ${response.status}`;
        if (response.status === 401) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (response.status === 400) {
          errorMessage = 'Invalid request. Please try again.';
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }

      // API call successful
      const action = previousFavoritedState ? 'removed from' : 'added to';
      console.log(`Maid ${maid.name} ${action} favorites`);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert the optimistic update on error
      setIsFavorited(previousFavoritedState);
    }
  };

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    const message = `Hi, I'm interested in ${maid.name} (ID: ${maid.id}). Could you please provide more details?`;
    window.open(`https://wa.me/6588270086?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (onCardClick) {
      onCardClick(maid);
    } else {
      setShowDetailsPopup(true);
    }
  };

  const handleCardClick = () => {
    if (!isAuthenticated && showBlurredImage) {
      handleViewDetails();
    }
  };

  return (
    <>
      <Card
        elevation={2}
        onClick={handleCardClick}
        sx={{
          display: 'flex',
          width: '100%',
          height: isMobile ? 'auto' : '140px',
          flexDirection: isMobile ? 'column' : 'row',
          cursor: (!isAuthenticated && showBlurredImage) ? 'pointer' : 'default',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: `1px solid ${brandColors.border}`,
          borderRadius: 2,
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(12, 25, 27, 0.12)',
            borderColor: `${brandColors.primary}30`,
          },
          '&:focus-within': {
            outline: `2px solid ${brandColors.primary}`,
            outlineOffset: 2,
          }
        }}
        {...props}
      >
        {/* Image Section */}
        <Box sx={{ 
          position: 'relative', 
          width: isMobile ? '100%' : '140px',
          height: isMobile ? '200px' : '140px',
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
              filter: (!isAuthenticated || showBlurredImage) ? 'blur(8px)' : 'none',
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
              background: 'rgba(255, 255, 255, 0.95)',
              color: labelColor,
              fontSize: '0.7rem',
              fontWeight: 700,
              height: '24px',
              border: `1px solid ${labelColor}30`,
              zIndex: 2,
            }}
          />

          {/* Lock Icon for Unauthenticated Users */}
          {(!isAuthenticated || showBlurredImage) && (
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
                {isMobile ? 'Tap to View' : 'Click to View'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Content Section */}
        <CardContent 
          sx={{ 
            p: isMobile ? 2 : 1.5,
            pb: `${isMobile ? 2 : 1.5}px !important`,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: 0
          }}
        >
          {/* Top Content Row */}
          <Box sx={{ flex: 1 }}>
            {/* Name and Flag Row */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 1
            }}>
              <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography 
                    variant="h6" 
                    component="h3"
                    sx={{ 
                      fontWeight: 700,
                      fontSize: isMobile ? '1.1rem' : '1rem',
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
                </Box>
                
                {/* Country and Age */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
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
                        width: '2px', 
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
                  {maid.salary && (
                    <>
                      <Box sx={{ 
                        width: '2px', 
                        height: '12px', 
                        backgroundColor: brandColors.border 
                      }} />
                      <Typography variant="body2" sx={{ 
                        color: brandColors.primary, 
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        ${maid.salary}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'row' : 'column',
                gap: 0.5,
                alignItems: 'center'
              }}>
                {/* Favorite Button */}
                {isAuthenticated && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite();
                    }}
                    size="small"
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    sx={{
                      color: isFavorited ? '#e91e63' : 'grey.400',
                      width: 32,
                      height: 32,
                      '&:hover': {
                        color: '#e91e63',
                        backgroundColor: 'rgba(233, 30, 99, 0.08)',
                      }
                    }}
                  >
                    {isFavorited ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                  </IconButton>
                )}

                {/* WhatsApp Button */}
                <Tooltip title="Contact via WhatsApp" arrow placement="top">
                  <IconButton
                    onClick={handleWhatsAppClick}
                    size="small"
                    aria-label="Contact via WhatsApp"
                    sx={{
                      color: brandColors.success,
                      width: 32,
                      height: 32,
                      '&:hover': {
                        backgroundColor: 'rgba(37, 211, 102, 0.08)',
                      }
                    }}
                  >
                    <WhatsAppIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {/* View Details Button */}
                <Tooltip title="View full details" arrow placement="top">
                  <IconButton
                    onClick={handleViewDetails}
                    size="small"
                    aria-label="View full details"
                    sx={{
                      color: brandColors.primary,
                      width: 32,
                      height: 32,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 145, 77, 0.08)',
                      }
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            {/* Skills Row */}
            {maid.skills && maid.skills.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 0.5, 
                flexWrap: 'wrap',
                overflow: 'hidden',
                mb: 1
              }}>
                {maid.skills.slice(0, isMobile ? 6 : 5).map((skill, idx) => {
                  const skillEmoji = skillIcons[skill];
                  if (!skillEmoji) return null;
                  
                  return (
                    <Tooltip key={idx} title={skill} arrow placement="top">
                      <Chip
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <span style={{ fontSize: '12px' }}>{skillEmoji}</span>
                            <span style={{ fontSize: '0.7rem' }}>{skill}</span>
                          </Box>
                        }
                        size="small"
                        variant="outlined"
                        sx={{
                          height: 24,
                          backgroundColor: `${brandColors.primary}08`,
                          borderColor: `${brandColors.primary}30`,
                          color: brandColors.text,
                          '&:hover': {
                            backgroundColor: `${brandColors.primary}15`,
                          }
                        }}
                      />
                    </Tooltip>
                  );
                })}
                {maid.skills.length > (isMobile ? 6 : 5) && (
                  <Chip 
                    label={`+${maid.skills.length - (isMobile ? 6 : 5)}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 24,
                      backgroundColor: `${brandColors.textSecondary}08`,
                      borderColor: `${brandColors.textSecondary}30`,
                      color: brandColors.textSecondary,
                      fontSize: '0.7rem'
                    }}
                  />
                )}
              </Box>
            )}

            {/* Experience */}
            {maid.workExperience && (
              <Typography variant="body2" sx={{ 
                color: brandColors.textSecondary,
                fontSize: '0.75rem',
                lineHeight: 1.3
              }}>
                {maid.workExperience.slice(0, isMobile ? 100 : 80)}
                {maid.workExperience.length > (isMobile ? 100 : 80) && '...'}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Details Popup Modal */}
      <MaidDetailsPopup
        open={showDetailsPopup}
        onClose={() => setShowDetailsPopup(false)}
        maid={maid}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}