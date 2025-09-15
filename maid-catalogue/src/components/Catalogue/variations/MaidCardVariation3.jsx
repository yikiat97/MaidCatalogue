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
  Grid,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Skeleton,
  Tooltip,
  Paper
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import LanguageIcon from '@mui/icons-material/Language';
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CakeIcon from '@mui/icons-material/Cake';
import HeightIcon from '@mui/icons-material/Height';
import FitnessIcon from '@mui/icons-material/FitnessCenter';
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
 * Variation 3: Information Grid Layout
 * Features: Grid-based data presentation, comprehensive info display
 * Accessibility: Screen reader optimized, semantic structure, high data density
 */
export default function MaidCardVariation3({ 
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

  // Responsive card height
  const cardHeight = isMobile ? 500 : isTablet ? 550 : 600;

  // Info Item Component for consistent styling
  const InfoItem = ({ icon, label, value, fullWidth = false }) => {
    if (!value) return null;
    
    return (
      <Paper 
        elevation={0}
        sx={{
          p: 1.5,
          backgroundColor: `${brandColors.primary}08`,
          border: `1px solid ${brandColors.primary}20`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minHeight: '56px',
          gridColumn: fullWidth ? 'span 2' : 'auto'
        }}
      >
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            backgroundColor: `${brandColors.primary}15`,
            borderRadius: '8px',
            color: brandColors.primary,
            flexShrink: 0
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="caption" sx={{
            color: brandColors.textSecondary,
            fontSize: '0.7rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'block',
            lineHeight: 1
          }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{
            color: brandColors.text,
            fontSize: '0.85rem',
            fontWeight: 600,
            lineHeight: 1.2,
            mt: 0.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: fullWidth ? 'normal' : 'nowrap'
          }}>
            {value}
          </Typography>
        </Box>
      </Paper>
    );
  };

  return (
    <>
      <Card 
        data-maid-id={maid.id}
        role="article"
        aria-label={`Comprehensive maid profile for ${maid.name} from ${maid.country}`}
        sx={{
          width: '100%',
          height: cardHeight,
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(12, 25, 27, 0.12)',
          position: 'relative',
          background: brandColors.surface,
          border: `1px solid ${brandColors.border}`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 16px 40px rgba(12, 25, 27, 0.18)',
          },
          '&:focus-within': {
            outline: `3px solid ${brandColors.primary}`,
            outlineOffset: '2px',
          }
        }}
        {...props}
      >
        {/* Header Section with Image and Basic Info */}
        <Box sx={{ display: 'flex', p: 3, pb: 2 }}>
          {/* Image */}
          <Box sx={{ 
            position: 'relative', 
            width: isMobile ? 100 : 120,
            height: isMobile ? 100 : 120,
            flexShrink: 0,
            mr: 2
          }}>
            {/* Loading skeleton */}
            {!imageLoaded && !imageError && (
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height="100%"
                sx={{ bgcolor: 'grey.200', borderRadius: '16px' }}
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
                  borderRadius: '16px',
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
                borderRadius: '16px',
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
            
            {/* Status Badge on Image */}
            <Chip
              label={displayLabel}
              size="small"
              sx={{
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                background: brandColors.primary,
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                height: '20px',
                zIndex: 2,
                boxShadow: '0 2px 8px rgba(255, 145, 77, 0.3)',
              }}
            />

            {/* Lock Icon for Unauthenticated Users */}
            {!isAuthenticated && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(12, 25, 27, 0.8)',
                  borderRadius: '16px',
                  zIndex: 3,
                  color: 'white'
                }}
              >
                <Typography variant="h4">🔒</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                  Sign In
                </Typography>
              </Box>
            )}
          </Box>

          {/* Name and Basic Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
              <Typography 
                variant="h5" 
                component="h3"
                sx={{ 
                  fontWeight: 700,
                  fontSize: isMobile ? '1.1rem' : '1.3rem',
                  color: brandColors.text,
                  lineHeight: 1.2,
                  flex: 1,
                  mr: 1
                }}
              >
                {maid.name}
              </Typography>
              
              {/* Favorite Button */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite();
                }}
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                size="small"
                sx={{
                  color: isFavorited ? '#e91e63' : 'grey.400',
                  '&:hover': {
                    color: '#e91e63',
                    backgroundColor: 'rgba(233, 30, 99, 0.04)',
                  }
                }}
              >
                {isFavorited ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              </IconButton>
            </Box>

            {/* Country with Flag */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <img 
                src={getCountryFlag(maid.country)} 
                alt={`${maid.country} flag`}
                style={{ width: 24, height: 18 }}
              />
              <Typography variant="body1" sx={{ 
                color: brandColors.textSecondary, 
                fontSize: '0.95rem',
                fontWeight: 500
              }}>
                {maid.country}
              </Typography>
            </Box>

            {/* Salary - Prominent Display */}
            {maid.salary && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                background: `linear-gradient(135deg, ${brandColors.success}15 0%, ${brandColors.success}05 100%)`,
                border: `1px solid ${brandColors.success}30`,
                borderRadius: '12px',
                px: 2,
                py: 1,
                mt: 1
              }}>
                <AttachMoneyIcon sx={{ color: brandColors.success, fontSize: '18px' }} />
                <Typography variant="body1" sx={{ 
                  color: brandColors.success, 
                  fontSize: '1.1rem',
                  fontWeight: 800
                }}>
                  ${maid.salary}/month
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Information Grid */}
        <CardContent sx={{ p: 3, pt: 1, pb: 2, flex: 1 }}>
          <Typography variant="h6" sx={{
            fontSize: '1rem',
            fontWeight: 700,
            color: brandColors.text,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <WorkIcon sx={{ fontSize: '18px', color: brandColors.primary }} />
            Profile Information
          </Typography>

          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <InfoItem 
                icon={<CakeIcon fontSize="small" />}
                label="Age"
                value={maidAge ? `${maidAge} years` : 'Not specified'}
              />
            </Grid>
            <Grid item xs={6}>
              <InfoItem 
                icon={<HeightIcon fontSize="small" />}
                label="Height"
                value={maid.height ? `${maid.height} cm` : 'Not specified'}
              />
            </Grid>
            <Grid item xs={6}>
              <InfoItem 
                icon={<FitnessIcon fontSize="small" />}
                label="Weight"
                value={maid.weight ? `${maid.weight} kg` : 'Not specified'}
              />
            </Grid>
            <Grid item xs={6}>
              <InfoItem 
                icon={<HomeIcon fontSize="small" />}
                label="Status"
                value={maid.isEmployed ? 'Employed' : 'Available'}
              />
            </Grid>
          </Grid>

          {/* Skills Section */}
          {maid.skills && maid.skills.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: brandColors.text,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <WorkIcon sx={{ fontSize: '16px', color: brandColors.primary }} />
                Skills & Services
              </Typography>
              <Paper 
                elevation={0}
                sx={{
                  p: 1.5,
                  backgroundColor: `${brandColors.primary}08`,
                  border: `1px solid ${brandColors.primary}20`,
                  borderRadius: '12px'
                }}
              >
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                  {maid.skills.map((skill, idx) => {
                    const skillEmoji = skillIcons[skill];
                    return (
                      <Chip
                        key={idx}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            {skillEmoji && (
                              <span role="img" aria-label={skill} style={{ fontSize: '12px' }}>
                                {skillEmoji}
                              </span>
                            )}
                            <span style={{ fontSize: '0.75rem' }}>{skill}</span>
                          </Box>
                        }
                        size="small"
                        sx={{
                          backgroundColor: 'white',
                          border: `1px solid ${brandColors.primary}30`,
                          color: brandColors.primary,
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          height: '24px',
                          '&:hover': {
                            backgroundColor: `${brandColors.primary}10`,
                          }
                        }}
                      />
                    );
                  })}
                </Stack>
              </Paper>
            </Box>
          )}

          {/* Languages */}
          {maid.languages && maid.languages.length > 0 && (
            <InfoItem 
              icon={<LanguageIcon fontSize="small" />}
              label="Languages"
              value={maid.languages.join(', ')}
              fullWidth={true}
            />
          )}
        </CardContent>

        {/* Action Buttons */}
        <Box sx={{ p: 3, pt: 0 }}>
          <Stack direction="row" spacing={1}>
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
              {isSelected ? 'Selected ✓' : 'Select Maid'}
            </Button>
            
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
                width: 48,
                height: 48,
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
                width: 48,
                height: 48,
                '&:hover': {
                  backgroundColor: `${brandColors.secondary}15`,
                  transform: 'translateY(-1px)',
                }
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Stack>
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