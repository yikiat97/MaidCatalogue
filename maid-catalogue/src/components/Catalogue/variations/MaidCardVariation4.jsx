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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import LanguageIcon from '@mui/icons-material/Language';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
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


/**
 * Variation 4: Minimal List Item Layout
 * Features: Clean list-style, text-heavy, scannable format
 * Accessibility: High readability, clear semantic markup, compact display
 */
export default function MaidCardVariation4({ 
  maid, 
  isAuthenticated, 
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
    window.open(`https://wa.me/6588270086?text=${encodeURIComponent(message)}`, '_blank');
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

  // Compact Info Display Component
  const InfoDisplay = ({ icon, value, color = brandColors.textSecondary }) => {
    if (!value) return null;
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {icon}
        <Typography variant="body2" sx={{
          color,
          fontSize: '0.8rem',
          fontWeight: 500,
          lineHeight: 1.2
        }}>
          {value}
        </Typography>
      </Box>
    );
  };

  return (
    <>
      <Card 
        data-maid-id={maid.id}
        role="article"
        aria-label={`List view of maid profile for ${maid.name} from ${maid.country}`}
        sx={{
          width: '100%',
          height: isMobile ? 120 : 140,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(12, 25, 27, 0.06)',
          position: 'relative',
          background: brandColors.surface,
          border: `1px solid ${brandColors.border}`,
          display: 'flex',
          flexDirection: 'row',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(12, 25, 27, 0.12)',
            borderColor: `${brandColors.primary}40`,
            transform: 'translateY(-1px)',
          },
          '&:focus-within': {
            outline: `2px solid ${brandColors.primary}`,
            outlineOffset: '1px',
          }
        }}
        onClick={() => setShowDetailsPopup(true)}
        {...props}
      >
        {/* Image Section - Left */}
        <Box sx={{ 
          position: 'relative', 
          width: isMobile ? 80 : 100,
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
              <PersonIcon fontSize="large" />
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
              filter: isAuthenticated ? 'none' : 'blur(6px)',
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
            label={displayLabel.charAt(0)}
            size="small"
            sx={{
              position: 'absolute',
              top: 6,
              left: 6,
              background: brandColors.primary,
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: 700,
              height: '18px',
              width: '18px',
              minWidth: '18px',
              borderRadius: '50%',
              zIndex: 2,
              '& .MuiChip-label': {
                px: 0
              }
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
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(12, 25, 27, 0.8)',
                borderRadius: '50%',
                width: 28,
                height: 28,
                zIndex: 3,
                fontSize: '12px'
              }}
            >
              🔒
            </Box>
          )}
        </Box>

        {/* Content Section - Center */}
        <CardContent 
          sx={{ 
            p: isMobile ? 1.5 : 2,
            pb: `${isMobile ? 1.5 : 2}px !important`,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: 0 // Allow content to shrink
          }}
        >
          {/* Top Row - Name and Location */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
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
              
              {/* Country Flag */}
              <img 
                src={getCountryFlag(maid.country)} 
                alt={`${maid.country} flag`}
                style={{ 
                  width: 18, 
                  height: 13, 
                  flexShrink: 0
                }}
              />
            </Box>
            
            {/* Info Row */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: isMobile ? 1 : 1.5, 
              flexWrap: 'wrap'
            }}>
              <InfoDisplay 
                icon={<LocationOnIcon sx={{ fontSize: '14px', color: brandColors.textSecondary }} />}
                value={maid.country}
              />
              
              {maidAge && (
                <InfoDisplay 
                  icon={<PersonIcon sx={{ fontSize: '14px', color: brandColors.textSecondary }} />}
                  value={`${maidAge}yo`}
                />
              )}
              
              {maid.salary && (
                <InfoDisplay 
                  icon={<AttachMoneyIcon sx={{ fontSize: '14px', color: brandColors.success }} />}
                  value={`$${maid.salary}/mo`}
                  color={brandColors.success}
                />
              )}
            </Box>
          </Box>

          {/* Bottom Row - Skills and Languages */}
          <Box sx={{ mt: 0.5 }}>
            {/* Skills */}
            {maid.skills && maid.skills.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                <WorkIcon sx={{ fontSize: '12px', color: brandColors.textSecondary }} />
                <Typography variant="caption" sx={{
                  color: brandColors.textSecondary,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1
                }}>
                  {maid.skills.slice(0, 3).join(', ')}
                  {maid.skills.length > 3 && ` (+${maid.skills.length - 3})`}
                </Typography>
              </Box>
            )}
            
            {/* Languages */}
            {maid.languages && maid.languages.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LanguageIcon sx={{ fontSize: '12px', color: brandColors.textSecondary }} />
                <Typography variant="caption" sx={{
                  color: brandColors.textSecondary,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1
                }}>
                  {maid.languages.slice(0, 2).join(', ')}
                  {maid.languages.length > 2 && ` (+${maid.languages.length - 2})`}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>

        {/* Actions Section - Right */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: isMobile ? 1 : 1.5,
          borderLeft: `1px solid ${brandColors.border}`,
          backgroundColor: `${brandColors.background}80`,
          minWidth: isMobile ? 60 : 80
        }}>
          {/* Favorite Button */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            size="small"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            sx={{
              color: isFavorited ? '#e91e63' : 'grey.400',
              padding: 0.5,
              '&:hover': {
                color: '#e91e63',
                backgroundColor: 'rgba(233, 30, 99, 0.04)',
              }
            }}
          >
            {isFavorited ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>

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
              minWidth: isMobile ? 36 : 48,
              height: isMobile ? 24 : 28,
              fontSize: '0.65rem',
              fontWeight: 600,
              borderRadius: '6px',
              px: isMobile ? 0.5 : 1,
              backgroundColor: isSelected ? brandColors.primary : 'transparent',
              borderColor: brandColors.primary,
              color: isSelected ? 'white' : brandColors.primary,
              '&:hover': {
                backgroundColor: isSelected ? brandColors.primaryDark : `${brandColors.primary}15`,
                borderColor: brandColors.primary,
              }
            }}
          >
            {isSelected ? '✓' : 'Select'}
          </Button>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleWhatsAppContact();
              }}
              size="small"
              aria-label={`Contact ${maid.name} via WhatsApp`}
              sx={{
                color: brandColors.success,
                padding: 0.5,
                '&:hover': {
                  backgroundColor: `${brandColors.success}15`,
                }
              }}
            >
              <WhatsAppIcon sx={{ fontSize: '16px' }} />
            </IconButton>
            
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setShowDetailsPopup(true);
              }}
              size="small"
              aria-label={`View detailed profile of ${maid.name}`}
              sx={{
                color: brandColors.secondary,
                padding: 0.5,
                '&:hover': {
                  backgroundColor: `${brandColors.secondary}15`,
                }
              }}
            >
              <VisibilityIcon sx={{ fontSize: '16px' }} />
            </IconButton>
          </Box>
        </Box>
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