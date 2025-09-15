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
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Skeleton,
  Tooltip
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import LanguageIcon from '@mui/icons-material/Language';
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
};

/**
 * Variation 2: Vertical Photo-Emphasis Layout
 * Features: Large image top, content below, visual-first approach
 * Accessibility: Keyboard navigation, proper focus management, semantic structure
 */
export default function MaidCardVariation2({ 
  maid, 
  isAuthenticated, 
  isSelected = false, 
  onSelectionChange,
  ...props 
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // State management
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

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
        throw new Error(`Failed to update favorites: ${response.status}`);
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

  const handleWhatsAppContact = () => {
    const message = `Hi, I'm interested in maid ${maid.name} (ID: ${maid.id}).`;
    window.open(`https://wa.me/88270086?text=${encodeURIComponent(message)}`, '_blank');
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

  // Responsive heights
  const cardHeight = isMobile ? 380 : isTablet ? 420 : 460;
  const imageHeight = isMobile ? 220 : isTablet ? 260 : 300;

  return (
    <>
      <Card 
        data-maid-id={maid.id}
        role="article"
        aria-label={`Maid profile for ${maid.name} from ${maid.country}`}
        sx={{
          width: '100%',
          height: cardHeight,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(12, 25, 27, 0.15)',
          position: 'relative',
          background: brandColors.surface,
          border: `1px solid ${brandColors.border}`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(12, 25, 27, 0.2)',
          },
          '&:focus-within': {
            outline: `3px solid ${brandColors.primary}`,
            outlineOffset: '2px',
          }
        }}
        {...props}
      >
        {/* Image Section - Top */}
        <Box sx={{ 
          position: 'relative', 
          height: imageHeight,
          overflow: 'hidden',
          flexShrink: 0
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
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.100',
                color: 'grey.500'
              }}
            >
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.300', mb: 1 }}>
                <PersonIcon fontSize="large" />
              </Avatar>
              <Typography variant="caption">No image available</Typography>
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
              filter: isAuthenticated ? 'none' : 'blur(12px)',
              opacity: imageLoaded ? 1 : 0,
              transition: 'all 0.3s ease',
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
          
          {/* Gradient Overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: `linear-gradient(to top, rgba(12, 25, 27, 0.7) 0%, transparent 100%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Top-left Status Badge */}
          <Chip
            label={displayLabel}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              color: brandColors.text,
              fontSize: '0.75rem',
              fontWeight: 700,
              height: '24px',
              zIndex: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          />

          {/* Top-right Favorite Button */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              color: isFavorited ? '#e91e63' : 'grey.600',
              zIndex: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#e91e63',
                transform: 'scale(1.05)',
              }
            }}
          >
            {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>

          {/* Salary Overlay - Bottom Right */}
          {maid.salary && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                background: 'rgba(37, 211, 102, 0.95)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: '12px',
                zIndex: 3,
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
              }}
            >
              <Typography variant="body2" sx={{ 
                fontSize: '0.9rem',
                fontWeight: 800,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                ${maid.salary}/month
              </Typography>
            </Box>
          )}

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
                gap: 1,
                zIndex: 4,
                background: 'rgba(12, 25, 27, 0.9)',
                borderRadius: '16px',
                p: 3,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <Typography variant="h3" sx={{ color: 'white' }}>🔒</Typography>
              <Typography variant="body2" sx={{ 
                color: 'white', 
                fontWeight: 600,
                textAlign: 'center'
              }}>
                Sign in to view
              </Typography>
            </Box>
          )}
        </Box>

        {/* Content Section - Bottom */}
        <CardContent 
          sx={{ 
            p: 3,
            pb: '16px !important',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Top Content */}
          <Box>
            {/* Name and Country */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Typography 
                  variant="h5" 
                  component="h3"
                  sx={{ 
                    fontWeight: 700,
                    fontSize: isMobile ? '1.2rem' : '1.4rem',
                    color: brandColors.text,
                    lineHeight: 1.2,
                    flex: 1
                  }}
                >
                  {maid.name}
                </Typography>
                <img 
                  src={getCountryFlag(maid.country)} 
                  alt={`${maid.country} flag`}
                  style={{ 
                    width: 28, 
                    height: 21, 
                    flexShrink: 0
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" sx={{ 
                  color: brandColors.textSecondary, 
                  fontSize: '1rem',
                  fontWeight: 500
                }}>
                  From {maid.country}
                </Typography>
                {maidAge && (
                  <>
                    <Box sx={{ 
                      width: '2px', 
                      height: '16px', 
                      backgroundColor: brandColors.border 
                    }} />
                    <Typography variant="body1" sx={{ 
                      color: brandColors.textSecondary, 
                      fontSize: '1rem',
                      fontWeight: 500
                    }}>
                      {maidAge} years old
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
            
            {/* Physical Stats */}
            {(maid.height || maid.weight) && (
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={3}>
                  {maid.height && (
                    <Box>
                      <Typography variant="caption" sx={{ 
                        color: brandColors.textSecondary,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Height
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: brandColors.text,
                        fontWeight: 700,
                        fontSize: '1rem'
                      }}>
                        {maid.height} cm
                      </Typography>
                    </Box>
                  )}
                  {maid.weight && (
                    <Box>
                      <Typography variant="caption" sx={{ 
                        color: brandColors.textSecondary,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Weight
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: brandColors.text,
                        fontWeight: 700,
                        fontSize: '1rem'
                      }}>
                        {maid.weight} kg
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            )}
            
            {/* Skills */}
            {maid.skills && maid.skills.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ 
                  color: brandColors.textSecondary,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  mb: 1,
                  display: 'block'
                }}>
                  Skills & Services
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {maid.skills.map((skill, idx) => {
                    const skillEmoji = skillIcons[skill];
                    return (
                      <Chip
                        key={idx}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {skillEmoji && (
                              <span role="img" aria-label={skill} style={{ fontSize: '14px' }}>
                                {skillEmoji}
                              </span>
                            )}
                            <span>{skill}</span>
                          </Box>
                        }
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: brandColors.primary,
                          color: brandColors.primary,
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          '&:hover': {
                            backgroundColor: `${brandColors.primary}10`,
                          }
                        }}
                      />
                    );
                  })}
                </Stack>
              </Box>
            )}
            
            {/* Languages */}
            {maid.languages && maid.languages.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LanguageIcon sx={{ color: brandColors.textSecondary, fontSize: '18px' }} />
                  <Typography variant="caption" sx={{ 
                    color: brandColors.textSecondary,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Languages
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ 
                  color: brandColors.text,
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}>
                  {maid.languages.join(', ')}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Divider sx={{ my: 2, borderColor: brandColors.border }} />
          
          {/* Bottom Actions */}
          <Stack direction="row" spacing={1}>
            {/* Select Button */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                toggleSelection();
              }}
              variant={isSelected ? "contained" : "outlined"}
              size="medium"
              fullWidth
              aria-label={isSelected ? 'Deselect maid' : 'Select maid'}
              sx={{
                fontSize: '0.85rem',
                fontWeight: 600,
                borderRadius: '12px',
                py: 1.2,
                backgroundColor: isSelected ? brandColors.primary : 'transparent',
                borderColor: brandColors.primary,
                color: isSelected ? 'white' : brandColors.primary,
                '&:hover': {
                  backgroundColor: isSelected ? brandColors.primaryDark : `${brandColors.primary}15`,
                  borderColor: brandColors.primary,
                  transform: 'translateY(-1px)',
                }
              }}
            >
              {isSelected ? 'Selected ✓' : 'Select'}
            </Button>
            
            {/* Action Buttons */}
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleWhatsAppContact();
              }}
              aria-label={`Contact ${maid.name} via WhatsApp`}
              sx={{
                color: brandColors.success,
                border: `2px solid ${brandColors.success}`,
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: `${brandColors.success}15`,
                  transform: 'translateY(-1px)',
                }
              }}
            >
              <WhatsAppIcon />
            </IconButton>
            
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setShowDetailsPopup(true);
              }}
              aria-label={`View detailed profile of ${maid.name}`}
              sx={{
                color: brandColors.secondary,
                border: `2px solid ${brandColors.secondary}`,
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: `${brandColors.secondary}15`,
                  transform: 'translateY(-1px)',
                }
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
      
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