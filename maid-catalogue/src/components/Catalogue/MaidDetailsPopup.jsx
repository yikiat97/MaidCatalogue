import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  Grid,
  Divider,
  IconButton,
  Rating,
  Tooltip,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PersonIcon from '@mui/icons-material/Person';
import HeightIcon from '@mui/icons-material/Height';
import ScaleIcon from '@mui/icons-material/Scale';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import ChurchIcon from '@mui/icons-material/Church';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import LockIcon from '@mui/icons-material/Lock';
import maidPic from '../../assets/maidPic.jpg';
import API_CONFIG from '../../config/api.js';

// Skill icons
import KitchenIcon from '@mui/icons-material/Kitchen';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CribIcon from '@mui/icons-material/Crib';
import ElderlyIcon from '@mui/icons-material/Elderly';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';

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

export default function MaidDetailsPopup({ open, onClose, maid, isAuthenticated }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset image loading state when maid changes
  useEffect(() => {
    if (open && maid) {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [open, maid]);

  // Secure blur protection for unauthenticated users
  useEffect(() => {
    if (!open || !maid || isAuthenticated === true) return;

    const protectBlur = () => {
      const popupImages = document.querySelectorAll(`[data-popup-id="${maid.id}"] img:not([alt*="flag"])`);
      popupImages.forEach(img => {
        if (!img.style.filter || !img.style.filter.includes('blur')) {
          img.style.filter = 'blur(12px)';
          img.style.transform = 'scale(1.1)';
        }
        
        // Prevent context menu and drag
        img.addEventListener('contextmenu', (e) => e.preventDefault());
        img.addEventListener('dragstart', (e) => e.preventDefault());
        img.style.userSelect = 'none';
        img.style.webkitUserSelect = 'none';
        img.style.mozUserSelect = 'none';
        img.style.msUserSelect = 'none';
      });
    };

    protectBlur();
    const interval = setInterval(protectBlur, 500);

    return () => {
      clearInterval(interval);
    };
  }, [open, isAuthenticated, maid]);

  if (!maid) return null;

  // Helper functions
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
    };
    
    const countryCode = countryCodeMap[country] || 'un';
    return `https://flagcdn.com/${countryCode}.svg`;
  };

  const getOptimizedImageUrl = (originalUrl) => {
    if (!originalUrl) return maidPic;
    return originalUrl.startsWith('http') ? originalUrl : API_CONFIG.buildImageUrl(originalUrl);
  };

  const displayLabel = maid.type?.includes("Transfer") 
    ? "Transfer"
    : maid.type?.includes("New/Fresh")
    ? "New/Fresh"
    : "Experienced";

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

  const getLanguages = (maid) => {
    const languages = [];
    
    if (maid.maidDetails?.englishRating && maid.maidDetails.englishRating > 0) {
      languages.push({ name: 'English', rating: maid.maidDetails.englishRating });
    }
    
    if (maid.maidDetails?.chineseRating && maid.maidDetails.chineseRating > 0) {
      languages.push({ name: 'Chinese', rating: maid.maidDetails.chineseRating });
    }
    
    if (maid.maidDetails?.dialectRating && maid.maidDetails.dialectRating > 0) {
      languages.push({ name: 'Dialect', rating: maid.maidDetails.dialectRating });
    }
    
    return languages;
  };

  const maidAge = calculateAge(maid.DOB);
  const languages = getLanguages(maid);

  const handleClose = () => {
    onClose();
  };


  const handleWhatsAppContact = () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/login');
      return;
    }
    
    const message = `Hi, I'm interested in maid ${maid.name} (ID: ${maid.id}).`;
    window.open(`https://wa.me/88270086?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      data-popup-id={maid.id}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : isTablet ? 2 : 3,
          background: `linear-gradient(135deg, ${brandColors.surface} 0%, ${brandColors.background} 100%)`,
          border: `2px solid ${brandColors.border}`,
          boxShadow: isMobile ? 'none' : isTablet ? '0 12px 40px rgba(12, 25, 27, 0.2)' : '0 20px 60px rgba(12, 25, 27, 0.3)',
          maxHeight: isMobile ? '100vh' : isTablet ? '95vh' : '90vh',
          margin: isMobile ? 0 : isTablet ? 1 : 2,
          width: isMobile ? '100%' : isTablet ? 'calc(100% - 16px)' : 'auto'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        p: isMobile ? 2 : isTablet ? 2.5 : 3, 
        pb: 1,
        position: 'relative',
        borderBottom: `1px solid ${brandColors.border}`
      }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: brandColors.textSecondary,
            '&:hover': {
              backgroundColor: brandColors.border,
              color: brandColors.text
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2,
          pr: 5
        }}>
          <img 
            src={getCountryFlag(maid.country)} 
            alt={`${maid.country} flag`}
            style={{ 
              width: isMobile ? 20 : isTablet ? 22 : 24, 
              height: isMobile ? 15 : isTablet ? 16 : 18, 
              borderRadius: '3px',
              border: `1px solid ${brandColors.border}`
            }}
          />
          <Box>
            <Typography 
              variant={isMobile ? "h5" : isTablet ? "h4" : "h4"} 
              sx={{ 
                fontFamily: professionalFonts.primary,
                fontWeight: 700,
                color: brandColors.text,
                lineHeight: 1.2,
                fontSize: isMobile ? '1.25rem' : isTablet ? '1.5rem' : '1.75rem'
              }}
            >
              {maid.name}
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: brandColors.textSecondary,
                fontWeight: 500
              }}
            >
              From {maid.country} {maidAge && `• ${maidAge} years old`}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ 
        p: isMobile ? 2 : isTablet ? 2.5 : 3,
        overflow: 'auto'
      }}>
        {/* Profile Image Section */}
        <Box sx={{ 
          position: 'relative', 
          mb: 3,
          display: 'flex',
          justifyContent: 'center'
        }}>
            {!imageLoaded && !imageError && (
              <Skeleton 
                variant="rectangular" 
                width={isMobile ? "100%" : isTablet ? 350 : 400} 
                height={isMobile ? 300 : isTablet ? 350 : 420}
                sx={{ 
                  bgcolor: 'grey.200',
                  borderRadius: 2
                }}
              />
            )}
              
            {imageError && (
              <Box
                sx={{
                  width: isMobile ? '100%' : isTablet ? 350 : 400,
                  height: isMobile ? 300 : isTablet ? 350 : 420,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'grey.100',
                  color: 'grey.500',
                  borderRadius: 2
                }}
              >
                <PersonIcon sx={{ fontSize: 60, color: 'grey.400', mb: 1 }} />
                <Typography variant="body2">No image available</Typography>
              </Box>
            )}
              
            <img
              src={getOptimizedImageUrl(maid.imageUrl)}
              alt={maid.name}
              loading="lazy"
              style={{ 
                width: isMobile ? '100%' : isTablet ? 350 : 400, 
                height: isMobile ? 300 : isTablet ? 350 : 420,
                borderRadius: 12,
                objectFit: 'cover',
                filter: isAuthenticated ? 'none' : 'blur(12px)',
                transform: isAuthenticated ? 'none' : 'scale(1.1)',
                transition: 'all 0.3s ease',
                opacity: imageLoaded ? 1 : 0,
                position: imageError ? 'absolute' : 'static',
                top: imageError ? '-9999px' : 'auto'
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
              sx={{
                position: 'absolute',
                top: 12,
                left: isMobile ? 12 : isTablet ? 'calc(50% - 175px + 12px)' : 'calc(50% - 200px + 12px)',
                background: `linear-gradient(135deg, ${brandColors.success} 0%, ${brandColors.success}80 100%)`,
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.75rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.3)'
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
                  zIndex: 2
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'rgba(12, 25, 27, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <LockIcon sx={{ fontSize: 25, color: 'white' }} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    textAlign: 'center',
                    fontSize: '0.75rem'
                  }}
                >
                  Sign in to view
                </Typography>
              </Box>
            )}
        </Box>

        {/* Salary Card */}
        <Box sx={{ 
          background: `linear-gradient(135deg, ${brandColors.primary}08 0%, ${brandColors.primaryLight}08 100%)`,
          borderRadius: 2, 
          p: 3,
          mb: 3,
          border: `1px solid ${brandColors.primary}20`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: brandColors.textSecondary,
                mb: 0.5,
                fontFamily: professionalFonts.accent,
                fontWeight: 600
              }}
            >
              Monthly Salary
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800,
                color: brandColors.primary,
                fontFamily: professionalFonts.primary
              }}
            >
              ${maid.salary}
            </Typography>
          </Box>
          {maid.loan && (
            <Box sx={{ textAlign: isMobile ? 'left' : 'right' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: brandColors.textSecondary,
                  mb: 0.5,
                  fontFamily: professionalFonts.accent,
                  fontWeight: 600
                }}
              >
                Loan Amount
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: brandColors.warning,
                  fontWeight: 700
                }}
              >
                ${maid.loan}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Skills */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: professionalFonts.primary,
              color: brandColors.text, 
              fontWeight: 700,
              mb: 2,
              fontSize: '1.2rem'
            }}
          >
            Skills & Expertise
          </Typography>
          <Stack 
            direction="row" 
            sx={{ 
              flexWrap: 'wrap', 
              gap: 1.5,
              justifyContent: isMobile ? 'flex-start' : 'flex-start'
            }}
          >
            {(maid.skills || []).map((skill, idx) => {
              const IconComponent = skillIcons[skill];
              return (
                <Tooltip title={skill} key={idx} arrow>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: `${brandColors.primary}15`,
                      color: brandColors.primary,
                      borderRadius: 3,
                      px: 2,
                      py: 1,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      border: `1px solid ${brandColors.primary}30`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: `${brandColors.primary}25`,
                        transform: 'translateY(-1px)'
                      },
                    }}
                  >
                    {IconComponent && <IconComponent sx={{ fontSize: 18 }} />}
                    {skill}
                  </Box>
                </Tooltip>
              );
            })}
          </Stack>
        </Box>

        {/* Languages - Only show if available */}
        {languages.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: professionalFonts.primary,
                color: brandColors.text, 
                fontWeight: 700,
                mb: 2,
                fontSize: '1.2rem'
              }}
            >
              Language Proficiency
            </Typography>
            <Grid container spacing={2}>
              {languages.map((language, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    backgroundColor: `${brandColors.background}`,
                    borderRadius: 2,
                    p: 2,
                    border: `1px solid ${brandColors.border}`
                  }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                      {language.name}
                    </Typography>
                    <Rating 
                      value={language.rating} 
                      readOnly 
                      size="small"
                      icon={<StarIcon fontSize="inherit" />}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Personal Information */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            mb: 3,
            color: brandColors.text,
            fontFamily: professionalFonts.primary,
            fontSize: '1.1rem'
          }}
        >
          Personal Information
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              backgroundColor: `${brandColors.background}`,
              borderRadius: 2,
              p: 2,
              border: `1px solid ${brandColors.border}`,
              height: '100%'
            }}>
              <HeightIcon sx={{ color: brandColors.primary, fontSize: 24 }} />
              <Box>
                <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.8rem' }}>
                  Height
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {maid.height}cm
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              backgroundColor: `${brandColors.background}`,
              borderRadius: 2,
              p: 2,
              border: `1px solid ${brandColors.border}`,
              height: '100%'
            }}>
              <ScaleIcon sx={{ color: brandColors.primary, fontSize: 24 }} />
              <Box>
                <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.8rem' }}>
                  Weight
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {maid.weight}kg
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              backgroundColor: `${brandColors.background}`,
              borderRadius: 2,
              p: 2,
              border: `1px solid ${brandColors.border}`,
              height: '100%'
            }}>
              <PersonIcon sx={{ color: brandColors.primary, fontSize: 24 }} />
              <Box>
                <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.8rem' }}>
                  Marital Status
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {maid.maritalStatus}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              backgroundColor: `${brandColors.background}`,
              borderRadius: 2,
              p: 2,
              border: `1px solid ${brandColors.border}`,
              height: '100%'
            }}>
              <FamilyRestroomIcon sx={{ color: brandColors.primary, fontSize: 24 }} />
              <Box>
                <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.8rem' }}>
                  Children
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {maid.NumChildren}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              backgroundColor: `${brandColors.background}`,
              borderRadius: 2,
              p: 2,
              border: `1px solid ${brandColors.border}`,
              height: '100%'
            }}>
              <ChurchIcon sx={{ color: brandColors.primary, fontSize: 24 }} />
              <Box>
                <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.8rem' }}>
                  Religion
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {maid.Religion}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              backgroundColor: `${brandColors.background}`,
              borderRadius: 2,
              p: 2,
              border: `1px solid ${brandColors.border}`,
              height: '100%'
            }}>
              <SchoolIcon sx={{ color: brandColors.primary, fontSize: 24 }} />
              <Box>
                <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.8rem' }}>
                  Education
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {maid.maidDetails?.highestEducation || 'Not specified'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Description */}
        {maid.maidDetails?.description && (
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                color: brandColors.text,
                fontFamily: professionalFonts.primary,
                fontSize: '1.2rem'
              }}
            >
              About {maid.name}
            </Typography>
            <Box sx={{
              backgroundColor: `${brandColors.background}`,
              borderRadius: 2,
              p: 3,
              border: `1px solid ${brandColors.border}`
            }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  lineHeight: 1.7,
                  color: brandColors.textSecondary,
                  fontSize: '1rem'
                }}
              >
                {maid.maidDetails.description}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Work Information */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            mb: 2,
            color: brandColors.text,
            fontFamily: professionalFonts.primary,
            fontSize: '1.2rem'
          }}
        >
          Work Information
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              backgroundColor: `${brandColors.background}`,
              borderRadius: 2,
              p: 2,
              border: `1px solid ${brandColors.border}`,
              height: '100%'
            }}>
              <Box>
                <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.8rem' }}>
                  Rest Days per Month
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {maid.maidDetails?.restDay || 'N/A'} days
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              backgroundColor: `${brandColors.background}`,
              borderRadius: 2,
              p: 2,
              border: `1px solid ${brandColors.border}`,
              height: '100%'
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ color: brandColors.textSecondary, fontSize: '0.8rem' }}>
                  Availability Status
                </Typography>
                <Chip 
                  label={maid.isEmployed ? 'Currently Employed' : 'Available Now'} 
                  size="medium"
                  sx={{ 
                    background: maid.isEmployed 
                      ? `linear-gradient(135deg, ${brandColors.warning} 0%, ${brandColors.warning}80 100%)`
                      : `linear-gradient(135deg, ${brandColors.success} 0%, ${brandColors.success}80 100%)`,
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    alignSelf: 'flex-start'
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ 
        p: isMobile ? 2 : isTablet ? 2.5 : 3, 
        pt: 1.5,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 1.5 : isTablet ? 2 : 2,
        borderTop: `1px solid ${brandColors.border}`
      }}>
        
        <Button
          variant="contained"
          onClick={handleWhatsAppContact}
          fullWidth={isMobile}
          startIcon={<WhatsAppIcon />}
          sx={{
            fontFamily: professionalFonts.accent,
            background: isAuthenticated 
              ? `linear-gradient(135deg, #25D366 0%, #128C7E 100%)`
              : `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%)`,
            color: 'white',
            fontWeight: 700,
            '&:hover': {
              background: isAuthenticated 
                ? `linear-gradient(135deg, #128C7E 0%, #075E54 100%)`
                : `linear-gradient(135deg, ${brandColors.primaryDark} 0%, ${brandColors.primary} 100%)`,
              transform: 'translateY(-1px)',
              boxShadow: isAuthenticated
                ? '0 6px 16px rgba(37, 211, 102, 0.4)'
                : '0 6px 16px rgba(255, 145, 77, 0.4)'
            }
          }}
        >
          {isAuthenticated ? 'Contact via WhatsApp' : 'Sign in to Contact'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}