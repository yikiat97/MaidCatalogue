import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Stack, 
  Chip, 
  Card, 
  CardContent, 
  Grid, 
  Divider,
  Avatar,
  IconButton,
  Paper,
  Rating,
  useTheme,
  useMediaQuery
} from '@mui/material';
import maidPic from '../../assets/maidPic.jpg';
import NavBar from '../../components/Catalogue/NavBar';
import logoBlack from '../../assets/logoBlack.png';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import HeightIcon from '@mui/icons-material/Height';
import ScaleIcon from '@mui/icons-material/Scale';
import SchoolIcon from '@mui/icons-material/School';
import ChurchIcon from '@mui/icons-material/Church';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

export default function MaidDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [maid, setMaid] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // Secure blur protection for unauthenticated users
  useEffect(() => {
    if (isAuthenticated === true) return; // Skip protection for authenticated users

    const protectBlur = () => {
      const blurredImages = document.querySelectorAll('.secure-blur');
      blurredImages.forEach(img => {
        // Ensure blur is always applied
        if (!img.style.filter || !img.style.filter.includes('blur')) {
          img.style.filter = 'blur(10px)';
          img.style.transform = 'scale(1.1)';
        }
        
        // Prevent context menu
        img.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Prevent drag and drop
        img.addEventListener('dragstart', (e) => e.preventDefault());
      });
    };

    // Run protection immediately and set up interval
    protectBlur();
    const interval = setInterval(protectBlur, 1000);

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
  }, [isAuthenticated, id]);

  // Get country flag
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

  // Get languages based on available ratings
  const getLanguages = (maid) => {
    const languages = [];
    
    // Always include English if there's a rating
    if (maid.maidDetails?.englishRating && maid.maidDetails.englishRating > 0) {
      languages.push('English');
    }
    
    // Include Chinese if there's a rating
    if (maid.maidDetails?.chineseRating && maid.maidDetails.chineseRating > 0) {
      languages.push('Chinese');
    }
    
    // Include Dialect if there's a rating
    if (maid.maidDetails?.dialectRating && maid.maidDetails.dialectRating > 0) {
      languages.push('Dialect');
    }
    
    // If no languages found, add a default based on country
    if (languages.length === 0) {
      const countryLanguages = {
        'Philippines': ['English', 'Tagalog'],
        'Indonesia': ['Indonesian', 'English'],
        'Myanmar': ['Burmese', 'English'],
        'India': ['English', 'Hindi'],
        'Bangladesh': ['Bengali', 'English'],
        'Sri Lanka': ['Sinhala', 'English'],
        'Cambodia': ['Khmer', 'English'],
        'Vietnam': ['Vietnamese', 'English'],
        'Thailand': ['Thai', 'English'],
        'Malaysia': ['Malay', 'English'],
      };
      
      const defaultLanguages = countryLanguages[maid.country] || ['English'];
      languages.push(...defaultLanguages);
    }
    
    return languages;
  };

  // Get language rating
  const getLanguageRating = (maid, language) => {
    switch (language.toLowerCase()) {
      case 'english':
        return maid.maidDetails?.englishRating || 0;
      case 'chinese':
        return maid.maidDetails?.chineseRating || 0;
      case 'dialect':
        return maid.maidDetails?.dialectRating || 0;
      default:
        return 0;
    }
  };

  // Check if maid has any language ratings
  const hasLanguageRatings = (maid) => {
    const englishRating = maid.maidDetails?.englishRating || 0;
    const chineseRating = maid.maidDetails?.chineseRating || 0;
    const dialectRating = maid.maidDetails?.dialectRating || 0;
    
    return englishRating > 0 || chineseRating > 0 || dialectRating > 0;
  };

  // Format employment duration
  const formatEmploymentDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);
    
    if (diffYears > 0) {
      const remainingMonths = diffMonths % 12;
      return `${diffYears} year${diffYears > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    } else if (diffMonths > 0) {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
  };

  useEffect(() => {
    const fetchMaid = async () => {
      try {
        // First try to fetch with credentials (for authenticated users)
        let response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.CATALOGUE.MAIDS}/${id}`), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          // If 401, try without credentials (for unauthenticated users)
          setIsAuthenticated(false);
          response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.CATALOGUE.MAIDS}/${id}`), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            // No credentials for unauthenticated users
          });
        } else {
          //console.log(response);
          //setIsAuthenticated(true);
        }

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setMaid(data);
        } else {
          console.error('Failed to fetch maid:', response.status);
        }
      } catch (error) {
        console.error('Error fetching maid:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaid();
  }, [id, navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.PROFILE), {
          credentials: 'include',
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
      }
    };

    // Only check auth if we haven't already determined it from the maid fetch
    if (maid && isAuthenticated === null) {
      checkAuth();
    }
  }, [maid, isAuthenticated]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorited) {
        const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.CATALOGUE.USER_FAVORITES}/${id}`), {
          method: 'DELETE',
          credentials: 'include',
        });
        if (response.ok) {
          setIsFavorited(false);
        }
      } else {
        const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.CATALOGUE.USER_FAVORITES}/${id}`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ maidId: id }),
          credentials: 'include',
        });
        if (response.ok) {
          setIsFavorited(true);
        }
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsFavorited(false);
    // Redirect to login or home page
    window.location.href = '/login';
  };

  if (loading) return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${brandColors.background} 0%, ${brandColors.surface} 100%)`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Typography variant="h6" sx={{ color: brandColors.text }}>
        Loading...
      </Typography>
    </Box>
  );

  if (!maid) return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${brandColors.background} 0%, ${brandColors.surface} 100%)`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Typography variant="h6" sx={{ color: brandColors.text }}>
        Maid not found
      </Typography>
    </Box>
  );

  const maidAge = calculateAge(maid.DOB);
  const displayTypes = maid.type || [];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${brandColors.background} 0%, ${brandColors.surface} 100%)`,
      pb: 4
    }}>
      <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 3 } }}>
        {/* Header Section */}
        <Box sx={{ 
          mt: { xs: 9, md: 10 },
          mb: { xs: 3, md: 4 },
          textAlign: 'center',
          background: `linear-gradient(135deg, ${brandColors.surface} 0%, ${brandColors.background} 100%)`,
          borderRadius: 3,
          p: { xs: 4, md: 5 },
          boxShadow: '0 4px 20px rgba(12, 25, 27, 0.08)',
          border: `1px solid ${brandColors.border}`
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 3, md: 4 }
          }}>
            <img 
              src={logoBlack} 
              alt="Logo" 
              style={{ 
                width: 'auto',
                height: isMobile ? '80px' : '120px',
                filter: 'drop-shadow(0 4px 12px rgba(255, 145, 77, 0.3))',
                transition: 'all 0.3s ease'
              }} 
            />
            <Box>
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                sx={{ 
                  fontWeight: 700,
                  color: brandColors.text,
                  mb: 1,
                  background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(255, 145, 77, 0.1)'
                }}
              >
                Maid Profile Details
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: brandColors.textSecondary,
                  fontWeight: 500,
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                Comprehensive information about {maid.name}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Navigation Bar */}
          <Box sx={{ mb: 3 }}>
            <NavBar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
          </Box>

          {/* Back Button */}
          <Box sx={{ mb: 3 }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)} 
              sx={{ 
                fontFamily: "'Poppins', 'Inter', 'system-ui', sans-serif",
                fontWeight: 600,
                borderRadius: 2,
                borderColor: brandColors.primary,
                color: brandColors.primary,
                '&:hover': {
                  backgroundColor: `${brandColors.primary}10`,
                  borderColor: brandColors.primaryDark
                }
              }}
            >
              Back to Search
            </Button>
          </Box>

          {/* Main Content Container */}
          <Box sx={{ 
            background: brandColors.surface,
            borderRadius: 3,
            p: { xs: 2, md: 3 },
            boxShadow: '0 4px 20px rgba(12, 25, 27, 0.08)',
            border: `1px solid ${brandColors.border}`
          }}>
            {/* Main Content */}
            <Grid container spacing={4}>
              {/* Left Side - Image and Actions */}
              <Grid item xs={12} md={5} lg={4}>
                <Box sx={{ position: 'sticky', top: 20 }}>
                                     {/* Profile Image */}
                   <Box sx={{ position: 'relative', mb: 3 }}>
                     <img
                       src={maid.imageUrl ? API_CONFIG.buildImageUrl(maid.imageUrl) : maidPic}
                       alt={maid.name}
                       className={isAuthenticated !== true ? 'secure-blur' : ''}
                       style={{ 
                         width: '350px', 
                         height: 'auto',
                         borderRadius: 12,
                         objectFit: 'cover',
                         filter: isAuthenticated === true ? 'none' : 'blur(10px)',
                         transition: 'filter 0.3s ease'
                       }}
                     />
                     
                     {/* Login Prompt for Unauthenticated Users */}
                     {isAuthenticated !== true && (
                       <Box
                         sx={{
                           position: 'absolute',
                           top: '50%',
                           left: '50%',
                           transform: 'translate(-50%, -50%)',
                           backgroundColor: 'rgba(0, 0, 0, 0.8)',
                           color: 'white',
                           padding: 2,
                           borderRadius: 2,
                           textAlign: 'center',
                           zIndex: 10,
                           pointerEvents: 'none',
                         }}
                       >
                         <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                           Login to View Clear Image
                         </Typography>
                         <Typography variant="caption" sx={{ opacity: 0.8 }}>
                           Sign up or log in to see the full profile
                         </Typography>
                       </Box>
                     )}
                    
                    {/* Status Badge */}
                    {displayTypes.length > 0 && (
                      <Chip
                        label={displayTypes[0]}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          background: `linear-gradient(135deg, ${brandColors.success} 0%, ${brandColors.success}80 100%)`,
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}
                      />
                    )}

                                         {/* Favorite Button */}
                     <IconButton
                       onClick={toggleFavorite}
                       sx={{
                         position: 'absolute',
                         top: 16,
                         right: 16,
                         backgroundColor: 'rgba(255, 255, 255, 0.9)',
                         backdropFilter: 'blur(10px)',
                         border: '2px solid rgba(255,255,255,0.8)',
                         boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                         '&:hover': {
                           backgroundColor: 'rgba(255, 255, 255, 1)',
                           transform: 'scale(1.1)',
                           boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                         },
                       }}
                     >
                       {isAuthenticated === true ? (
                         isFavorited ? (
                           <FavoriteIcon sx={{ color: brandColors.error }} />
                         ) : (
                           <FavoriteBorderIcon sx={{ color: brandColors.error }} />
                         )
                       ) : (
                         <FavoriteBorderIcon sx={{ color: brandColors.textSecondary }} />
                       )}
                     </IconButton>
                  </Box>

                                     {/* Action Buttons */}
                   <Stack spacing={2} sx={{ mb: 3 }}>
                     {isAuthenticated === true ? (
                       <>
                         <Button
                           variant="contained"
                           size="large"
                           fullWidth
                           startIcon={<WhatsAppIcon />}
                           onClick={() => {
                             const message = `Hi, I'm interested in maid ${maid.name} (ID: ${maid.id}).`;
                             window.open(`https://wa.me/88270086?text=${encodeURIComponent(message)}`, '_blank');
                           }}
                           sx={{
                             background: `linear-gradient(135deg, #25D366 0%, #128C7E 100%)`,
                             fontWeight: 700,
                             borderRadius: 2,
                             py: 1.5,
                             boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                             '&:hover': {
                               background: `linear-gradient(135deg, #128C7E 0%, #075E54 100%)`,
                               boxShadow: '0 6px 16px rgba(37, 211, 102, 0.4)',
                               transform: 'translateY(-1px)'
                             },
                           }}
                         >
                           Contact via WhatsApp
                         </Button>

                         <Button
                           variant="outlined"
                           size="large"
                           fullWidth
                           sx={{
                             fontWeight: 700,
                             borderRadius: 2,
                             py: 1.5,
                             borderColor: brandColors.primary,
                             color: brandColors.primary,
                             borderWidth: 2,
                             '&:hover': {
                               backgroundColor: `${brandColors.primary}10`,
                               borderColor: brandColors.primaryDark,
                               transform: 'translateY(-1px)'
                             },
                           }}
                         >
                           Request Interview
                         </Button>
                       </>
                     ) : (
                       <>
                         <Button
                           variant="contained"
                           size="large"
                           fullWidth
                           onClick={() => navigate('/login')}
                           sx={{
                             background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%)`,
                             fontWeight: 700,
                             borderRadius: 2,
                             py: 1.5,
                             boxShadow: '0 4px 12px rgba(255, 145, 77, 0.3)',
                             '&:hover': {
                               background: `linear-gradient(135deg, ${brandColors.primaryDark} 0%, ${brandColors.primary} 100%)`,
                               boxShadow: '0 6px 16px rgba(255, 145, 77, 0.4)',
                               transform: 'translateY(-1px)'
                             },
                           }}
                         >
                           Login to View Full Profile
                         </Button>

                         <Button
                           variant="outlined"
                           size="large"
                           fullWidth
                           onClick={() => navigate('/signup')}
                           sx={{
                             fontWeight: 700,
                             borderRadius: 2,
                             py: 1.5,
                             borderColor: brandColors.primary,
                             color: brandColors.primary,
                             borderWidth: 2,
                             '&:hover': {
                               backgroundColor: `${brandColors.primary}10`,
                               borderColor: brandColors.primaryDark,
                               transform: 'translateY(-1px)'
                             },
                           }}
                         >
                           Sign Up
                         </Button>
                       </>
                     )}
                   </Stack>

                  {/* Description Card - Only on Desktop */}
                  {!isMobile && maid.maidDetails?.description && (
                    <Card sx={{ 
                      borderRadius: 3, 
                      mb: 3,
                      boxShadow: '0 4px 20px rgba(12, 25, 27, 0.08)',
                      border: `1px solid ${brandColors.border}`
                    }}>
                      <CardContent>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            mb: 2,
                            color: brandColors.text,
                            fontSize: '1.1rem'
                          }}
                        >
                          About {maid.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            lineHeight: 1.6,
                            color: brandColors.textSecondary
                          }}
                        >
                          {maid.maidDetails.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}

                  {/* Quick Info Card - Only on Desktop */}
                  {!isMobile && (
                    <Card sx={{ 
                      borderRadius: 3, 
                      backgroundColor: `${brandColors.background}`,
                      boxShadow: '0 4px 20px rgba(12, 25, 27, 0.08)',
                      border: `1px solid ${brandColors.border}`
                    }}>
                      <CardContent>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            mb: 2,
                            color: brandColors.text,
                            fontSize: '1.1rem'
                          }}
                        >
                          Quick Facts
                        </Typography>
                        
                        <Stack spacing={1.5}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                              Experience Level
                            </Typography>
                            <Chip 
                              label={displayTypes[0] || 'Experienced'} 
                              size="small"
                              sx={{ 
                                background: `linear-gradient(135deg, ${brandColors.success} 0%, ${brandColors.success}80 100%)`,
                                color: '#FFFFFF',
                                fontWeight: 700
                              }}
                            />
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                              Rest Days/Month
                            </Typography>
                            <Typography sx={{ fontWeight: 600 }}>
                              {maid.maidDetails?.restDay || 'N/A'} days
                            </Typography>
                          </Box>



                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                              Availability
                            </Typography>
                            <Chip 
                              label={maid.isEmployed ? 'Employed' : 'Available'} 
                              size="small"
                              sx={{ 
                                background: maid.isEmployed 
                                  ? `linear-gradient(135deg, ${brandColors.warning} 0%, ${brandColors.warning}80 100%)`
                                  : `linear-gradient(135deg, ${brandColors.success} 0%, ${brandColors.success}80 100%)`,
                                color: '#FFFFFF',
                                fontWeight: 700
                              }}
                            />
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              </Grid>

              {/* Right Side - Details */}
              <Grid item xs={12} md={7} lg={8}>
                {/* Header Section */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 700,
                        color: brandColors.text,
                        fontSize: { xs: '2rem', md: '2.5rem' }
                      }}
                    >
                      {maid.name}
                    </Typography>
                    {maidAge && (
                      <Chip 
                        label={`${maidAge} years old`}
                        sx={{ 
                          backgroundColor: `${brandColors.primary}15`,
                          color: brandColors.primary,
                          fontWeight: 600,
                          border: `1px solid ${brandColors.primary}30`
                        }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <img 
                      src={getCountryFlag(maid.country)} 
                      alt={`${maid.country} flag`}
                      style={{ 
                        width: 24, 
                        height: 18, 
                        borderRadius: '2px'
                      }}
                    />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: brandColors.textSecondary,
                        fontWeight: 500
                      }}
                    >
                      From {maid.country}
                    </Typography>
                  </Box>

                  {/* Type Tags */}
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {displayTypes.map((type, idx) => (
                      <Chip
                        key={idx}
                        label={type}
                        variant="outlined"
                        sx={{
                          borderColor: brandColors.warning,
                          color: brandColors.warning,
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: brandColors.warning,
                            color: '#FFFFFF',
                          }
                        }}
                      />
                    ))}
                  </Stack>

                  {/* Salary Section */}
                  <Card sx={{ 
                    backgroundColor: `${brandColors.primary}08`, 
                    borderRadius: 3, 
                    mb: 4,
                    border: `1px solid ${brandColors.primary}20`
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: brandColors.textSecondary,
                              mb: 0.5
                            }}
                          >
                            Monthly Salary
                          </Typography>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              fontWeight: 700,
                              color: brandColors.primary
                            }}
                          >
                            ${maid.salary}
                          </Typography>
                        </Box>
                        {maid.loan && (
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: brandColors.textSecondary,
                                mb: 0.5
                              }}
                            >
                              Loan Amount
                            </Typography>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 600,
                                color: brandColors.warning
                              }}
                            >
                              ${maid.loan}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* Skills Section */}
                <Card sx={{ 
                  mb: 4, 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(12, 25, 27, 0.08)',
                  border: `1px solid ${brandColors.border}`
                }}>
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        mb: 2,
                        color: brandColors.text
                      }}
                    >
                      Skills & Expertise
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {maid.skills.map((skill, idx) => (
                        <Chip
                          key={idx}
                          label={skill}
                          sx={{
                            background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryLight} 100%)`,
                            color: '#FFFFFF',
                            fontWeight: 600,
                            '&:hover': {
                              background: `linear-gradient(135deg, ${brandColors.primaryDark} 0%, ${brandColors.primary} 100%)`,
                              transform: 'translateY(-1px)'
                            }
                          }}
                        />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card sx={{ 
                  mb: 4, 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(12, 25, 27, 0.08)',
                  border: `1px solid ${brandColors.border}`
                }}>
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        mb: 3,
                        color: brandColors.text
                      }}
                    >
                      Personal Information
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <HeightIcon sx={{ color: brandColors.primary }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                              Height
                            </Typography>
                            <Typography sx={{ fontWeight: 600 }}>
                              {maid.height} cm
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <ScaleIcon sx={{ color: brandColors.primary }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                              Weight
                            </Typography>
                            <Typography sx={{ fontWeight: 600 }}>
                              {maid.weight} kg
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <PersonIcon sx={{ color: brandColors.primary }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                              Marital Status
                            </Typography>
                            <Typography sx={{ fontWeight: 600 }}>
                              {maid.maritalStatus}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <FamilyRestroomIcon sx={{ color: brandColors.primary }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                              Number of Children
                            </Typography>
                            <Typography sx={{ fontWeight: 600 }}>
                              {maid.NumChildren}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <ChurchIcon sx={{ color: brandColors.primary }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                              Religion
                            </Typography>
                            <Typography sx={{ fontWeight: 600 }}>
                              {maid.Religion}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <SchoolIcon sx={{ color: brandColors.primary }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                              Education
                            </Typography>
                            <Typography sx={{ fontWeight: 600 }}>
                              {maid.maidDetails?.highestEducation || 'Not specified'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Language Proficiency - Only show if maid has language ratings */}
                {hasLanguageRatings(maid) && (
                  <Card sx={{ 
                    mb: 4, 
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(12, 25, 27, 0.08)',
                    border: `1px solid ${brandColors.border}`
                  }}>
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          mb: 2,
                          color: brandColors.text
                        }}
                      >
                        Language Proficiency
                      </Typography>
                      
                      <Grid container spacing={2}>
                        {getLanguages(maid).map((language, idx) => {
                          const rating = getLanguageRating(maid, language);
                          return (
                            <Grid item xs={12} sm={6} key={idx}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ fontWeight: 600 }}>
                                  {language}
                                </Typography>
                                {rating > 0 ? (
                                  <Rating 
                                    value={rating} 
                                    readOnly 
                                    size="small"
                                    icon={<StarIcon fontSize="inherit" />}
                                  />
                                ) : (
                                  <Chip 
                                    label="Basic" 
                                    size="small" 
                                    sx={{ 
                                      background: `linear-gradient(135deg, ${brandColors.warning} 0%, ${brandColors.warning}80 100%)`,
                                      color: '#FFFFFF',
                                      fontWeight: 700
                                    }} 
                                  />
                                )}
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </CardContent>
                  </Card>
                )}

                {/* Employment History */}
                {maid.employmentDetails && maid.employmentDetails.length > 0 && (
                  <Card sx={{ 
                    mb: 4, 
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(12, 25, 27, 0.08)',
                    border: `1px solid ${brandColors.border}`
                  }}>
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          mb: 3,
                          color: brandColors.text
                        }}
                      >
                        Employment History
                      </Typography>
                      
                      {maid.employmentDetails.map((employment, idx) => (
                        <Card key={idx} variant="outlined" sx={{ 
                          mb: 2, 
                          borderRadius: 2,
                          border: `1px solid ${brandColors.border}`,
                          backgroundColor: `${brandColors.background}`
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                              <Box>
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    fontWeight: 700,
                                    color: brandColors.text,
                                    textTransform: 'capitalize'
                                  }}
                                >
                                  {employment.country}
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: brandColors.textSecondary
                                  }}
                                >
                                  {formatEmploymentDuration(employment.startDate, employment.endDate)}
                                </Typography>
                              </Box>
                              <Chip 
                                label={`Family of ${employment.noOfFamilyMember}`}
                                size="small"
                                sx={{ 
                                  background: `linear-gradient(135deg, ${brandColors.primary}15 0%, ${brandColors.primaryLight}15 100%)`,
                                  color: brandColors.primary,
                                  fontWeight: 600,
                                  border: `1px solid ${brandColors.primary}30`
                                }}
                              />
                            </Box>
                            
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                mb: 1,
                                fontWeight: 600
                              }}
                            >
                              Main Responsibilities: {employment.mainJobScope}
                            </Typography>
                            
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: brandColors.textSecondary,
                                mb: 1
                              }}
                            >
                              {employment.employerDescription}
                            </Typography>
                            
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: brandColors.warning,
                                fontStyle: 'italic'
                              }}
                            >
                              Reason for leaving: {employment.reasonOfLeaving}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Additional Details - Mobile Only */}
                {isMobile && maid.maidDetails?.description && (
                  <Card sx={{ 
                    mb: 4, 
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(12, 25, 27, 0.08)',
                    border: `1px solid ${brandColors.border}`
                  }}>
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          mb: 2,
                          color: brandColors.text
                        }}
                      >
                        About {maid.name}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          lineHeight: 1.6,
                          color: brandColors.textSecondary
                        }}
                      >
                        {maid.maidDetails.description}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {/* Additional Information - Reduced for Desktop */}
                <Card sx={{ 
                  mb: 4, 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(12, 25, 27, 0.08)',
                  border: `1px solid ${brandColors.border}`
                }}>
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        mb: 3,
                        color: brandColors.text
                      }}
                    >
                      {isMobile ? 'Additional Information' : 'Work Preferences'}
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {!isMobile && (
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <AccessTimeIcon sx={{ color: brandColors.primary }} />
                            <Box>
                              <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                                Rest Days per Month
                              </Typography>
                              <Typography sx={{ fontWeight: 600 }}>
                                {maid.maidDetails?.restDay || 'Not specified'} days
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                      
                      {isMobile && (
                        <>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <AccessTimeIcon sx={{ color: brandColors.primary }} />
                              <Box>
                                <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                                  Rest Days per Month
                                </Typography>
                                <Typography sx={{ fontWeight: 600 }}>
                                  {maid.maidDetails?.restDay || 'Not specified'} days
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <WorkIcon sx={{ color: brandColors.primary }} />
                              <Box>
                                <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                                  Availability
                                </Typography>
                                <Typography sx={{ fontWeight: 600 }}>
                                  {maid.isEmployed ? 'Currently Employed' : 'Available'}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}