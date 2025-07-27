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

// Professional fonts
const professionalFonts = {
  primary: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  secondary: "'Source Sans Pro', 'Roboto', 'Arial', sans-serif",
  accent: "'Poppins', 'Inter', 'system-ui', sans-serif"
};

export default function MaidDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [maid, setMaid] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    return `https://flagcdn.com/32x24/${countryCode}.png`;
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
        const response = await fetch(`http://localhost:3000/api/maids/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          setIsAuthenticated(false);
          navigate('/login');
          return;
        }

        const data = await response.json();
        console.log(data);
        setMaid(data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching maid:', error);
        navigate('/error');
      } finally {
        setLoading(false);
      }
    };

    fetchMaid();
  }, [id, navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/auth/profile', {
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

    checkAuth();
  }, []);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorited) {
        const response = await fetch(`http://localhost:3000/api/user/RemoveFavorites/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (response.ok) {
          setIsFavorited(false);
        }
      } else {
        const response = await fetch('http://localhost:3000/api/user/favorites', {
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

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Typography variant="h6" sx={{ fontFamily: professionalFonts.primary }}>Loading...</Typography>
    </Box>
  );

  if (!maid) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Typography variant="h6" sx={{ fontFamily: professionalFonts.primary }}>Maid not found</Typography>
    </Box>
  );

  const maidAge = calculateAge(maid.DOB);
  const displayTypes = maid.type || [];

  return (
    <div>
      {/* Header with Logo */}
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: '100%', md: 250 },
          mr: { md: 2 },
        }}
      >
        <Box sx={{ textAlign: 'center', p: 0, mt: { xs: '20%', md: 0 } }}>
          <img src={logoBlack} alt="Logo" style={{ width: '100%', maxWidth: '200px' }} />
        </Box>
      </Box>

      <NavBar isAuthenticated={isAuthenticated} />

      <Container maxWidth="xl" sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Back Button */}
        <Box sx={{ width: '100%', maxWidth: '1400px' }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)} 
            sx={{ 
              mb: 3,
              fontFamily: professionalFonts.accent,
              borderRadius: '8px'
            }}
          >
            ← Back to Search
          </Button>
        </Box>

        {/* Main Content Container */}
        <Box sx={{ width: '100%', maxWidth: '1400px' }}>
          {/* Main Content */}
          <Grid container spacing={4}>
          {/* Left Side - Image and Actions */}
          <Grid item xs={12} md={5} lg={4}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              {/* Profile Image */}
              <Box sx={{ position: 'relative', mb: 3 }}>
                <img
                  src={maid.imageUrl ? `http://localhost:3000${maid.imageUrl}` : maidPic}
                  alt={maid.name}
                  style={{ 
                    width: '100%', 
                    height: isMobile ? '400px' : '500px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    filter: isAuthenticated ? 'none' : 'blur(10px)',
                    transition: 'filter 0.3s ease'
                  }}
                />
                
                {/* Status Badge */}
                {displayTypes.length > 0 && (
                  <Chip
                    label={displayTypes[0]}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      backgroundColor: '#4ECDC4',
                      color: '#FFFFFF',
                      fontFamily: professionalFonts.accent,
                      fontWeight: 600,
                      fontSize: '0.75rem'
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
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {isFavorited ? (
                    <FavoriteIcon sx={{ color: '#E74C3C' }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ color: '#E74C3C' }} />
                  )}
                </IconButton>
              </Box>

              {/* Action Buttons */}
              <Stack spacing={2} sx={{ mb: 3 }}>
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
                    backgroundColor: '#25D366',
                    fontFamily: professionalFonts.accent,
                    fontWeight: 600,
                    borderRadius: '12px',
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: '#128C7E',
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
                    fontFamily: professionalFonts.accent,
                    fontWeight: 600,
                    borderRadius: '12px',
                    py: 1.5,
                    borderColor: '#3498DB',
                    color: '#3498DB',
                    '&:hover': {
                      backgroundColor: '#3498DB',
                      color: '#FFFFFF',
                    },
                  }}
                >
                  Request Interview
                </Button>
              </Stack>

              {/* Description Card - Only on Desktop */}
              {!isMobile && maid.maidDetails?.description && (
                <Card sx={{ borderRadius: '12px', mb: 3 }}>
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: professionalFonts.primary,
                        fontWeight: 600,
                        mb: 2,
                        color: '#2C3E50',
                        fontSize: '1.1rem'
                      }}
                    >
                      About {maid.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: professionalFonts.secondary,
                        lineHeight: 1.6,
                        color: '#495057'
                      }}
                    >
                      {maid.maidDetails.description}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* Quick Info Card - Only on Desktop */}
              {!isMobile && (
                <Card sx={{ borderRadius: '12px', backgroundColor: '#F8F9FA' }}>
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: professionalFonts.primary,
                        fontWeight: 600,
                        mb: 2,
                        color: '#2C3E50',
                        fontSize: '1.1rem'
                      }}
                    >
                      Quick Facts
                    </Typography>
                    
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#6C757D', fontFamily: professionalFonts.secondary }}>
                          Experience Level
                        </Typography>
                        <Chip 
                          label={displayTypes[0] || 'Experienced'} 
                          size="small"
                          sx={{ backgroundColor: '#4ECDC4', color: '#FFFFFF', fontFamily: professionalFonts.accent }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#6C757D', fontFamily: professionalFonts.secondary }}>
                          Rest Days/Month
                        </Typography>
                        <Typography sx={{ fontFamily: professionalFonts.primary, fontWeight: 500 }}>
                          {maid.maidDetails?.restDay || 'N/A'} days
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#6C757D', fontFamily: professionalFonts.secondary }}>
                          English Level
                        </Typography>
                        <Rating 
                          value={maid.maidDetails?.englishRating || 0} 
                          readOnly 
                          size="small"
                          icon={<StarIcon fontSize="inherit" />}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#6C757D', fontFamily: professionalFonts.secondary }}>
                          Availability
                        </Typography>
                        <Chip 
                          label={maid.isEmployed ? 'Employed' : 'Available'} 
                          size="small"
                          sx={{ 
                            backgroundColor: maid.isEmployed ? '#E67E22' : '#27AE60', 
                            color: '#FFFFFF',
                            fontFamily: professionalFonts.accent
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
                    fontFamily: professionalFonts.primary,
                    fontWeight: 700,
                    color: '#2C3E50',
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  {maid.name}
                </Typography>
                {maidAge && (
                  <Chip 
                    label={`${maidAge} years old`}
                    sx={{ 
                      backgroundColor: '#F8F9FA',
                      color: '#495057',
                      fontFamily: professionalFonts.secondary,
                      fontWeight: 500
                    }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <img 
                  src={getCountryFlag(maid.country)} 
                  alt={`${maid.country} flag`}
                  style={{ width: 24, height: 18, borderRadius: '2px' }}
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: professionalFonts.secondary,
                    color: '#6C757D',
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
                      fontFamily: professionalFonts.accent,
                      borderColor: '#F39C12',
                      color: '#F39C12',
                      '&:hover': {
                        backgroundColor: '#F39C12',
                        color: '#FFFFFF',
                      }
                    }}
                  />
                ))}
              </Stack>

              {/* Salary Section */}
              <Card sx={{ backgroundColor: '#F8F9FA', borderRadius: '12px', mb: 4 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: professionalFonts.secondary,
                          color: '#6C757D',
                          mb: 0.5
                        }}
                      >
                        Monthly Salary
                      </Typography>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontFamily: professionalFonts.primary,
                          fontWeight: 700,
                          color: '#27AE60'
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
                            fontFamily: professionalFonts.secondary,
                            color: '#6C757D',
                            mb: 0.5
                          }}
                        >
                          Loan Amount
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontFamily: professionalFonts.primary,
                            fontWeight: 600,
                            color: '#E67E22'
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
            <Card sx={{ mb: 4, borderRadius: '12px' }}>
              <CardContent>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: professionalFonts.primary,
                    fontWeight: 600,
                    mb: 2,
                    color: '#2C3E50'
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
                        backgroundColor: '#3498DB',
                        color: '#FFFFFF',
                        fontFamily: professionalFonts.secondary,
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: '#2980B9',
                        }
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card sx={{ mb: 4, borderRadius: '12px' }}>
              <CardContent>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: professionalFonts.primary,
                    fontWeight: 600,
                    mb: 3,
                    color: '#2C3E50'
                  }}
                >
                  Personal Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <HeightIcon sx={{ color: '#3498DB' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#6C757D', fontFamily: professionalFonts.secondary }}>
                          Height
                        </Typography>
                        <Typography sx={{ fontFamily: professionalFonts.primary, fontWeight: 500 }}>
                          {maid.height} cm
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <ScaleIcon sx={{ color: '#3498DB' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#6C757D', fontFamily: professionalFonts.secondary }}>
                          Weight
                        </Typography>
                        <Typography sx={{ fontFamily: professionalFonts.primary, fontWeight: 500 }}>
                          {maid.weight} kg
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <PersonIcon sx={{ color: '#3498DB' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#6C757D', fontFamily: professionalFonts.secondary }}>
                          Marital Status
                        </Typography>
                        <Typography sx={{ fontFamily: professionalFonts.primary, fontWeight: 500 }}>
                          {maid.maritalStatus}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <FamilyRestroomIcon sx={{ color: '#3498DB' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#6C757D', fontFamily: professionalFonts.secondary }}>
                          Number of Children
                        </Typography>
                        <Typography sx={{ fontFamily: professionalFonts.primary, fontWeight: 500 }}>
                          {maid.NumChildren}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <ChurchIcon sx={{ color: '#3498DB' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#6C757D', fontFamily: professionalFonts.secondary }}>
                          Religion
                        </Typography>
                        <Typography sx={{ fontFamily: professionalFonts.primary, fontWeight: 500 }}>
                          {maid.Religion}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <SchoolIcon sx={{ color: '#3498DB' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#6C757D', fontFamily: professionalFonts.secondary }}>
                          Education
                        </Typography>
                        <Typography sx={{ fontFamily: professionalFonts.primary, fontWeight: 500 }}>
                          {maid.maidDetails?.highestEducation || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Language Proficiency */}
            <Card sx={{ mb: 4, borderRadius: '12px' }}>
              <CardContent>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: professionalFonts.primary,
                    fontWeight: 600,
                    mb: 2,
                    color: '#2C3E50'
                  }}
                >
                  Language Proficiency
                </Typography>
                
                <Grid container spacing={2}>
                  {maid.languages.map((language, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontFamily: professionalFonts.secondary, fontWeight: 500 }}>
                          {language}
                        </Typography>
                        <Chip 
                          label="Fluent" 
                          size="small" 
                          sx={{ 
                            backgroundColor: '#27AE60', 
                            color: '#FFFFFF',
                            fontFamily: professionalFonts.accent
                          }} 
                        />
                      </Box>
                    </Grid>
                  ))}
                  
                  {maid.maidDetails?.englishRating && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontFamily: professionalFonts.secondary, fontWeight: 500 }}>
                          English Rating
                        </Typography>
                        <Rating 
                          value={maid.maidDetails.englishRating} 
                          readOnly 
                          size="small"
                          icon={<StarIcon fontSize="inherit" />}
                        />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Employment History */}
            {maid.employmentDetails && maid.employmentDetails.length > 0 && (
              <Card sx={{ mb: 4, borderRadius: '12px' }}>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: professionalFonts.primary,
                      fontWeight: 600,
                      mb: 3,
                      color: '#2C3E50'
                    }}
                  >
                    Employment History
                  </Typography>
                  
                  {maid.employmentDetails.map((employment, idx) => (
                    <Card key={idx} variant="outlined" sx={{ mb: 2, borderRadius: '8px' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Box>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontFamily: professionalFonts.primary,
                                fontWeight: 600,
                                color: '#2C3E50',
                                textTransform: 'capitalize'
                              }}
                            >
                              {employment.country}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#6C757D',
                                fontFamily: professionalFonts.secondary
                              }}
                            >
                              {formatEmploymentDuration(employment.startDate, employment.endDate)}
                            </Typography>
                          </Box>
                          <Chip 
                            label={`Family of ${employment.noOfFamilyMember}`}
                            size="small"
                            sx={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
                          />
                        </Box>
                        
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontFamily: professionalFonts.secondary,
                            mb: 1,
                            fontWeight: 500
                          }}
                        >
                          Main Responsibilities: {employment.mainJobScope}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#6C757D',
                            fontFamily: professionalFonts.secondary,
                            mb: 1
                          }}
                        >
                          {employment.employerDescription}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#E67E22',
                            fontFamily: professionalFonts.secondary,
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
              <Card sx={{ mb: 4, borderRadius: '12px' }}>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: professionalFonts.primary,
                      fontWeight: 600,
                      mb: 2,
                      color: '#2C3E50'
                    }}
                  >
                    About {maid.name}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: professionalFonts.secondary,
                      lineHeight: 1.6,
                      color: '#495057'
                    }}
                  >
                    {maid.maidDetails.description}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Additional Information - Reduced for Desktop */}
            <Card sx={{ mb: 4, borderRadius: '12px' }}>
              <CardContent>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: professionalFonts.primary,
                    fontWeight: 600,
                    mb: 3,
                    color: '#2C3E50'
                  }}
                >
                  {isMobile ? 'Additional Information' : 'Work Preferences'}
                </Typography>
                
                <Grid container spacing={2}>
                  {!isMobile && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <AccessTimeIcon sx={{ color: '#3498DB' }} />
                        <Box>
                          <Typography variant="body2" sx={{ color: '#6C757D', fontFamily: professionalFonts.secondary }}>
                            Rest Days per Month
                          </Typography>
                          <Typography sx={{ fontFamily: professionalFonts.primary, fontWeight: 500 }}>
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
                          <AccessTimeIcon sx={{ color: '#3498DB' }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: '#6C757D', fontFamily: professionalFonts.secondary }}>
                              Rest Days per Month
                            </Typography>
                            <Typography sx={{ fontFamily: professionalFonts.primary, fontWeight: 500 }}>
                              {maid.maidDetails?.restDay || 'Not specified'} days
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <WorkIcon sx={{ color: '#3498DB' }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: '#6C757D', fontFamily: professionalFonts.secondary }}>
                              Availability
                            </Typography>
                            <Typography sx={{ fontFamily: professionalFonts.primary, fontWeight: 500 }}>
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
      </Container>
    </div>
  );
}