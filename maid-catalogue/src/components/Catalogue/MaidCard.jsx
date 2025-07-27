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
  useMediaQuery
} from '@mui/material';
import maidPic from '../../assets/maidPic.jpg';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PersonIcon from '@mui/icons-material/Person';
import HeightIcon from '@mui/icons-material/Height';

// Skill icons
import KitchenIcon from '@mui/icons-material/Kitchen';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CribIcon from '@mui/icons-material/Crib';
import ElderlyIcon from '@mui/icons-material/Elderly';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Tooltip from '@mui/material/Tooltip';

// Professional font imports
const professionalFonts = {
  primary: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  secondary: "'Source Sans Pro', 'Roboto', 'Arial', sans-serif",
  accent: "'Poppins', 'Inter', 'system-ui', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace"
};

export default function MaidCard({ userFavorites, maid, isAuthenticated }) {
  console.log(maid)
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 0-599px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600-899px
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // 900px+
  
  const [isFavorited, setIsFavorited] = useState(
    userFavorites.includes(maid.id)
  );

  useEffect(() => {
    setIsFavorited(userFavorites.includes(maid.id));
  }, [userFavorites, maid.id]);

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }

    const maidId = maid.id;

    if (isFavorited) {
      fetch(`http://localhost:3000/api/user/RemoveFavorites/${maidId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to remove favorite');
          return res.json();
        })
        .then((data) => {
          console.log('Maid removed from favorites:', data);
          setIsFavorited(false);
        })
        .catch((err) => console.error(err));
    } else {
      fetch('http://localhost:3000/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maidId }),
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to add favorite');
          return res.json();
        })
        .then((data) => {
          console.log('Maid added to favorites:', data);
          setIsFavorited(true);
        })
        .catch((err) => console.error(err));
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
      case "Transfer": return { bg: '#FF6B6B', text: '#FFFFFF' };
      case "New/Fresh": return { bg: '#4ECDC4', text: '#FFFFFF' };
      case "Experienced": return { bg: '#45B7D1', text: '#FFFFFF' };
      default: return { bg: '#95A5A6', text: '#FFFFFF' };
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
    return `https://flagcdn.com/32x24/${countryCode}.png`;
  };

  const chipColor = getChipColor(displayLabel);
  const maidAge = calculateAge(maid.DOB); // Calculate age from DOB

  // Responsive dimensions and styles
  const getResponsiveStyles = () => {
    if (isMobile) {
      return {
        cardWidth: '100%',
        cardMaxWidth: 240, // Smaller mobile card
        cardHeight: 380, // Reduced height after removing ID
        imageHeight: 140, // Smaller image
        chipFontSize: '0.6rem',
        chipHeight: '18px',
        nameFontSize: '0.85rem',
        captionFontSize: '0.65rem',
        bodyFontSize: '0.65rem',
        salaryFontSize: '0.9rem',
        iconSize: 11,
        skillIconSize: 12, // Smaller skill icons
        skillBoxSize: 20, // Smaller skill boxes
        buttonPadding: '4px 10px',
        contentPadding: 1.25, // Reduced padding
        spacing: 0.75, // Tighter spacing
        flagSize: { width: 14, height: 10 },
        maxSkills: 3 // Show fewer skills
      };
    } else if (isTablet) {
      return {
        cardWidth: 320,
        cardMaxWidth: 320,
        cardHeight: 450, // Reduced height
        imageHeight: 160,
        chipFontSize: '0.68rem',
        chipHeight: '22px',
        nameFontSize: '0.95rem',
        captionFontSize: '0.72rem',
        bodyFontSize: '0.73rem',
        salaryFontSize: '1.05rem',
        iconSize: 13,
        skillIconSize: 15,
        skillBoxSize: 26,
        buttonPadding: '5px 14px',
        contentPadding: 1.75,
        spacing: 1.25,
        flagSize: { width: 18, height: 13 },
        maxSkills: 4
      };
    } else {
      return {
        cardWidth: 360, // Bigger desktop card
        cardMaxWidth: 360,
        cardHeight: 520, // Taller for more content
        imageHeight: 200, // Larger image
        chipFontSize: '0.75rem',
        chipHeight: '26px',
        nameFontSize: '1.1rem', // Larger name
        captionFontSize: '0.8rem',
        bodyFontSize: '0.8rem',
        salaryFontSize: '1.2rem', // Larger salary
        iconSize: 15,
        skillIconSize: 18, // Larger skill icons
        skillBoxSize: 32, // Larger skill boxes
        buttonPadding: '8px 20px', // Larger button
        contentPadding: 2.25, // More padding
        spacing: 1.75, // More spacing
        flagSize: { width: 22, height: 16 },
        maxSkills: 6 // Show more skills
      };
    }
  };

  const styles = getResponsiveStyles();

  return (
    <Card  
      sx={{
        width: styles.cardWidth,
        maxWidth: styles.cardMaxWidth,
        height: styles.cardHeight,
        borderRadius: isMobile ? '8px' : '12px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isMobile ? '0 1px 4px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        background: '#FFFFFF',
        '&:hover': {
          transform: isMobile ? 'none' : 'translateY(-4px)',
          boxShadow: isMobile ? '0 2px 8px rgba(0, 0, 0, 0.15)' : '0 8px 16px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      {/* Image Container with Overlay */}
      <Box sx={{ position: 'relative', overflow: 'hidden', height: styles.imageHeight }}>
        <CardMedia
          component="img"
          image={maid.imageUrl ? `http://localhost:3000${maid.imageUrl}` : maidPic}
          alt={maid.name}
          sx={{
            width: '100%',
            height: styles.imageHeight,
            objectFit: 'cover',
            filter: isAuthenticated ? 'none' : 'blur(12px)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: isMobile ? 'none' : 'scale(1.05)',
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleView();
          }}
        />
        
        {/* Overlay gradient */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
        
        {/* Status Badge - moved to left top */}
        <Chip
          label={displayLabel}
          size="small"
          sx={{
            position: 'absolute',
            top: isMobile ? 6 : 8,
            left: isMobile ? 6 : 8,
            backgroundColor: chipColor.bg,
            color: chipColor.text,
            fontFamily: professionalFonts.accent,
            fontWeight: 600,
            fontSize: styles.chipFontSize,
            height: styles.chipHeight,
            letterSpacing: '0.01em',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
            top: isMobile ? 6 : 8,
            right: isMobile ? 6 : 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            padding: isMobile ? '4px' : '6px',
            width: isMobile ? 28 : 32,
            height: isMobile ? 28 : 32,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              transform: isMobile ? 'none' : 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {isFavorited ? (
            <FavoriteIcon sx={{ color: '#E74C3C', fontSize: isMobile ? 16 : 20 }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: '#E74C3C', fontSize: isMobile ? 16 : 20 }} />
          )}
        </IconButton>
      </Box>

      {/* Content - Made entire content area clickable */}
      <CardContent 
        sx={{ 
          p: styles.contentPadding, 
          pb: styles.contentPadding - 0.5,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: isMobile ? 'transparent' : 'rgba(52, 152, 219, 0.02)',
          }
        }}
        onClick={handleView}
      >
        /* Name only */
        <Box sx={{ mb: styles.spacing }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: professionalFonts.primary,
              fontWeight: 600,
              fontSize: styles.nameFontSize,
              color: '#2C3E50',
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              '&:hover': { 
                color: '#3498DB',
                transition: 'color 0.2s ease'
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleView();
            }}
          >
            {maid.name}
          </Typography>
        </Box>

        {/* Country Flag, Age, and Physical Stats */}
        <Stack 
          direction="row" 
          spacing={isMobile ? 1 : 1.5} 
          sx={{ mb: styles.spacing, alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}
        >
          {/* Country with Flag */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <img 
              src={getCountryFlag(maid.country)} 
              alt={`${maid.country} flag`}
              style={{ 
                width: styles.flagSize.width, 
                height: styles.flagSize.height, 
                borderRadius: '2px',
                objectFit: 'cover'
              }}
            />
            <Typography variant="body2" sx={{ 
              fontFamily: professionalFonts.secondary,
              color: '#34495E', 
              fontSize: styles.bodyFontSize,
              fontWeight: 500,
              letterSpacing: '0.01em'
            }}>
              {isMobile ? maid.country.substring(0, 2) : maid.country}
            </Typography>
          </Box>
          
          {/* Age */}
          {maidAge && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon sx={{ fontSize: styles.iconSize, color: '#9B59B6' }} />
              <Typography variant="body2" sx={{ 
                fontFamily: professionalFonts.secondary,
                color: '#34495E', 
                fontSize: styles.bodyFontSize,
                fontWeight: 500
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
                  <HeightIcon sx={{ fontSize: styles.iconSize, color: '#F39C12' }} />
                  <Typography variant="body2" sx={{ color: '#34495E', fontSize: styles.bodyFontSize }}>
                    {maid.height}cm
                  </Typography>
                </Box>
              )}
              
              {maid.weight && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ color: '#7F8C8D', fontSize: styles.bodyFontSize, fontWeight: 500 }}>
                    {maid.weight}kg
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Stack>

        {/* Mobile Height/Weight Row - Only show if space allows */}
        {isMobile && (maid.height || maid.weight) && (
          <Stack direction="row" spacing={1} sx={{ mb: styles.spacing, alignItems: 'center' }}>
            {maid.height && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <HeightIcon sx={{ fontSize: styles.iconSize, color: '#F39C12' }} />
                <Typography variant="body2" sx={{ 
                  fontFamily: professionalFonts.secondary,
                  color: '#34495E', 
                  fontSize: styles.bodyFontSize,
                  fontWeight: 500
                }}>
                  {maid.height}cm
                </Typography>
              </Box>
            )}
            
            {maid.weight && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" sx={{ 
                  fontFamily: professionalFonts.secondary,
                  color: '#7F8C8D', 
                  fontSize: styles.bodyFontSize, 
                  fontWeight: 500 
                }}>
                  {maid.weight}kg
                </Typography>
              </Box>
            )}
          </Stack>
        )}

        {/* Skills Section */}
        <Box sx={{ mb: styles.spacing }}>
          <Typography 
            variant="caption" 
            sx={{ 
              fontFamily: professionalFonts.accent,
              color: '#7F8C8D', 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: isMobile ? '0.55rem' : '0.65rem',
              mb: 0.5,
              display: 'block'
            }}
          >
            Skills
          </Typography>
          <Stack 
            direction="row" 
            sx={{ 
              flexWrap: 'wrap', 
              gap: isMobile ? 0.25 : 0.5, // Tighter gap on mobile
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
                      backgroundColor: '#ECF0F1',
                      color: '#34495E',
                      borderRadius: isMobile ? '4px' : '6px',
                      width: styles.skillBoxSize,
                      height: styles.skillBoxSize,
                      flexShrink: 0, // Prevent shrinking
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#3498DB',
                        color: '#FFFFFF',
                        transform: isMobile ? 'none' : 'scale(1.1)',
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
                    backgroundColor: '#BDC3C7',
                    color: '#FFFFFF',
                    borderRadius: isMobile ? '4px' : '6px',
                    width: styles.skillBoxSize,
                    height: styles.skillBoxSize,
                    fontSize: isMobile ? '0.6rem' : '0.7rem',
                    fontWeight: 600,
                    flexShrink: 0, // Prevent shrinking
                  }}
                >
                  +{maid.skills.length - styles.maxSkills}
                </Box>
              </Tooltip>
            )}
          </Stack>
        </Box>

        <Divider sx={{ my: styles.spacing }} />

        {/* Bottom Section - Updated Layout */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1 : 1.5 }}>
          {/* Salary and Compare Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Salary with Info Tooltip */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box>
                <Typography variant="caption" sx={{ 
                  fontFamily: professionalFonts.accent,
                  color: '#7F8C8D', 
                  fontSize: styles.captionFontSize,
                  fontWeight: 500,
                  letterSpacing: '0.02em'
                }}>
                  Monthly Salary
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontFamily: professionalFonts.primary,
                      fontWeight: 700,
                      color: '#27AE60',
                      fontSize: styles.salaryFontSize,
                      lineHeight: 1.2,
                      letterSpacing: '-0.01em'
                    }}
                  >
                    ${maid.salary}
                  </Typography>
                  <Tooltip 
                    title={`Salary + Loan = Full Salary: $${maid.salary} + $${maid.loan || 0} = $${(maid.salary || 0) + (maid.loan || 0)}`} 
                    arrow
                    placement="top"
                  >
                    <InfoOutlinedIcon 
                      sx={{ 
                        fontSize: isMobile ? 14 : 16, 
                        color: '#7F8C8D',
                        cursor: 'help',
                        '&:hover': {
                          color: '#3498DB',
                        }
                      }} 
                    />
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            {/* Compare Button */}
            <Tooltip title="Add to Compare" arrow>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Added to compare:', maid.id);
                }}
                size="small"
                sx={{
                  backgroundColor: '#F39C12',
                  color: '#FFFFFF',
                  width: isMobile ? 28 : 32,
                  height: isMobile ? 28 : 32,
                  '&:hover': {
                    backgroundColor: '#E67E22',
                    transform: isMobile ? 'none' : 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <CompareArrowsIcon sx={{ fontSize: isMobile ? 14 : 16 }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* WhatsApp Button at Bottom with Rounded Border */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                const message = `Hi, I'm interested in maid ID ${maid.id}.`;
                window.open(`https://wa.me/88270086?text=${encodeURIComponent(message)}`, '_blank');
              }}
              startIcon={<WhatsAppIcon sx={{ fontSize: isMobile ? 16 : 18 }} />}
              variant="contained"
              fullWidth={isMobile}
              sx={{
                fontFamily: professionalFonts.accent,
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                borderRadius: isMobile ? '16px' : '20px',
                fontSize: isMobile ? '0.7rem' : '0.75rem',
                fontWeight: 600,
                textTransform: 'none',
                padding: styles.buttonPadding,
                minWidth: isMobile ? 'auto' : 'auto',
                width: isMobile ? '100%' : 'auto',
                letterSpacing: '0.02em',
                '&:hover': {
                  backgroundColor: '#128C7E',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Contact
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}