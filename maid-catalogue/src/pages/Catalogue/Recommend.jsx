import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Modal,
  Skeleton
} from '@mui/material';
import RecommendIcon from '@mui/icons-material/Recommend';
import StarIcon from '@mui/icons-material/Star';
import ExploreIcon from '@mui/icons-material/Explore';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API_CONFIG from '../../config/api.js';
import MaidCardVariation1 from '../../components/Catalogue/variations/MaidCardVariation1';
import Header from '../../components/common/Header';
import logoBlack from '../../assets/logoBlack.png';

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

export default function Recommended() {
  const [recommendedMaids, setRecommendedMaids] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);
  const [favoriteHelpers, setFavoriteHelpers] = useState([]);
  const [allHelpers, setAllHelpers] = useState([]); // Combined recommended + favorites
  const [selectedMaids, setSelectedMaids] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedMaid, setSelectedMaid] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchAllData = async () => {
      console.log('🚀 Recommend page useEffect triggered');
      console.log('📍 Current location:', location.pathname + location.search);
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      console.log('🔑 Token from URL:', token ? 'exists' : 'not found');

      try {
        // 1️⃣ Check if user is logged in first
        console.log('🔐 Checking authentication...');
        const authRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.PROFILE), {
          credentials: 'include',
        });
        
        console.log('📡 Auth response status:', authRes.status);
        
        if (authRes.ok) {
          const authData = await authRes.json();
          console.log('✅ Auth data:', authData);
          setIsAuthenticated(true);
          
          // Check if user has role 131 (customer)
          if (authData.user && authData.user.role === 131) {
            console.log('👤 User is authenticated as customer (role 131)');
          } else {
            console.log('⚠️ User is not a customer, role:', authData.user?.role);
          }

          // 2️⃣ If authenticated, fetch user's personal recommendations (ignore token)
          console.log('🔐 User is authenticated, fetching personal recommendations...');
          const recRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.USER.RECOMMENDED), {
            credentials: 'include',
          });
          
          console.log('📡 Personal recommendations response status:', recRes.status);
          
          if (recRes.ok) {
            const recData = await recRes.json();
            console.log('✅ Authenticated user recommendations:', recData);
            console.log('📊 Number of recommendations:', recData.length);
            setRecommendedMaids(recData);
          } else {
            console.error('❌ Failed to fetch authenticated user recommendations:', recRes.status);
            const errorText = await recRes.text();
            console.error('📄 Error response:', errorText);
            setRecommendedMaids([]);
          }

          // 3️⃣ Fetch user favorites if authenticated
          console.log('❤️ Fetching user favorites...');
          const favRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.USER.FAVORITES), {
            credentials: 'include',
          });
          
          console.log('📡 Favorites response status:', favRes.status);
          
          if (favRes.ok) {
            const favData = await favRes.json();
            if (Array.isArray(favData)) {
              // Store complete maid objects for display
              setFavoriteHelpers(favData);
              // Extract maid IDs for heart state management
              const favoriteIds = favData.map(maid => maid.id);
              console.log('✅ User favorites loaded:', favoriteIds.length, 'favorites');
              setUserFavorites(favoriteIds);
            } else {
              setFavoriteHelpers([]);
              setUserFavorites([]);
            }
          } else if (favRes.status === 401) {
            // User not authenticated, set empty favorites
            setFavoriteHelpers([]);
            setUserFavorites([]);
            console.log('❌ User not authenticated, no favorites');
          } else {
            console.error('❌ Failed to fetch favorites:', favRes.status);
            setFavoriteHelpers([]);
            setUserFavorites([]);
          }
        } else {
          console.log('❌ User is not authenticated');
          setIsAuthenticated(false); // not logged in
          setUserFavorites([]);
          setFavoriteHelpers([]);
          
          // 4️⃣ If not authenticated and has token, fetch anonymous recommendations
          if (token) {
            console.log('👤 User not authenticated, fetching anonymous recommendations with token...');
            const fetchURL = API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.USER.RECOMMENDED}/${token}`);
            console.log('🌐 Fetching from:', fetchURL);
            
            const recRes = await fetch(fetchURL, {
              credentials: 'include',
            });
            
            console.log('📡 Anonymous recommendations response status:', recRes.status);
            
            if (recRes.ok) {
              const recData = await recRes.json();
              console.log('✅ Anonymous recommendations:', recData);
              console.log('📊 Number of recommendations:', recData.length);
              setRecommendedMaids(recData);
            } else {
              console.error('❌ Failed to fetch anonymous recommendations:', recRes.status);
              const errorText = await recRes.text();
              console.error('📄 Error response:', errorText);
              setRecommendedMaids([]);
            }
          } else {
            console.log('❌ No token and user not authenticated, setting empty recommendations');
            setRecommendedMaids([]);
          }
        }
      } catch (err) {
        console.error('Error loading recommended page:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [location, isAuthenticated]);

  // Combine recommended maids and favorite helpers into one array
  useEffect(() => {
    const combined = [];

    // Add recommended maids first
    if (recommendedMaids.length > 0) {
      combined.push(...recommendedMaids);
    }

    // Add favorite helpers that aren't already in recommendations
    if (favoriteHelpers.length > 0) {
      const recommendedIds = new Set(recommendedMaids.map(maid => maid.id));
      const uniqueFavorites = favoriteHelpers.filter(fav => !recommendedIds.has(fav.id));
      combined.push(...uniqueFavorites);
    }

    console.log('🔄 Combined helpers:', combined.length, 'total helpers');
    console.log('   - Recommended:', recommendedMaids.length);
    console.log('   - Unique favorites:', favoriteHelpers.filter(fav => !recommendedMaids.some(rec => rec.id === fav.id)).length);

    setAllHelpers(combined);
  }, [recommendedMaids, favoriteHelpers]);

  // Handle maid selection
  const handleMaidSelection = (maidId, isSelected) => {
    setSelectedMaids(prev => {
      if (isSelected) {
        return [...prev, maidId];
      } else {
        return prev.filter(id => id !== maidId);
      }
    });
  };

  // Generate profile link for a maid
  const generateProfileLink = (maidId) => {
    // Use appropriate base URL based on environment
    const baseUrl = import.meta.env.DEV ? 'http://localhost:5173' : 'https://yikiat.com';
    return `${baseUrl}/maid/${maidId}`;
  };

  // Handle bulk WhatsApp contact for selected helpers
  const handleBulkContact = () => {
    if (!isAuthenticated) {
      // Could show a login prompt here if needed
      return;
    }

    if (selectedMaids.length === 0) return;

    // Get selected maid details from all helpers (recommended + favorites)
    const selectedMaidDetails = allHelpers.filter(maid => selectedMaids.includes(maid.id));

    // Generate WhatsApp message
    let message = `Hi! I'm interested in the following recommended helpers:\n\n`;

    selectedMaidDetails.forEach((maid, index) => {
      const profileLink = generateProfileLink(maid.id);
      message += `${index + 1}. ${maid.name} (ID: ${maid.id})\n`;
      message += `   View Profile: ${profileLink}\n\n`;
    });

    message += `Could you provide more information about their availability and arrange interviews? Thank you!`;

    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/88270086?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Auto-show login prompt for non-authenticated users with recommendation token
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    // If there's a recommendation token and user is not authenticated, show login prompt
    if (token && !isAuthenticated && recommendedMaids.length > 0) {
      // Set a small delay to ensure the page has loaded
      const timer = setTimeout(() => {
        setShowLoginPrompt(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [location, isAuthenticated, recommendedMaids.length]);


  // Handle login navigation
  const handleLogin = () => {
    const currentUrl = window.location.href;
    // Store current URL in localStorage to redirect back after login
    localStorage.setItem('redirectAfterLogin', currentUrl);
    navigate('/login');
  };

  // Handle signup navigation
  const handleSignup = () => {
    const currentUrl = window.location.href;
    // Store current URL in localStorage to redirect back after signup
    localStorage.setItem('redirectAfterLogin', currentUrl);
    navigate('/signup');
  };

  // Handle cancel - close modal
  const handleCancel = () => {
    setShowLoginPrompt(false);
    setSelectedMaid(null);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <Header />
        <Box sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${brandColors.background} 0%, ${brandColors.surface} 100%)`,
          pb: 4
        }}>
          <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 3 }, px: { xs: 0, md: 3 } }}>
            {/* Main Content */}
            <Box sx={{ flexGrow: 1, mt: { xs: 12, md: 14 } }}>
              {/* Results Container */}
              <Box sx={{
                background: brandColors.surface,
                borderRadius: 3,
                px: { xs: 2, md: 3 },
                py: { xs: 2, md: 3 },
                boxShadow: '0 4px 20px rgba(12, 25, 27, 0.08)',
                border: `1px solid ${brandColors.border}`
              }}>
                {/* Results Header */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', md: 'center' },
                  gap: { xs: 2, md: 0 },
                  mb: 3,
                  pb: 3,
                  borderBottom: `2px solid ${brandColors.border}`
                }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <RecommendIcon sx={{ color: brandColors.primary, fontSize: '1.5rem' }} />
                      <Typography variant="h4" sx={{
                        fontWeight: 700,
                        color: brandColors.text,
                        fontSize: { xs: '1.5rem', md: '2rem' }
                      }}>
                        Your Recommended Helpers
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{
                      color: brandColors.textSecondary,
                      fontSize: '1rem',
                      ml: { xs: 0, md: 5 }
                    }}>
                      Personalized suggestions based on your preferences
                    </Typography>
                  </Box>

                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    {/* Contact Selected Button - Desktop Only */}
                    <div className="hidden lg:flex flex-shrink-0">
                      {selectedMaids.length > 0 && (
                        <Button
                          onClick={handleBulkContact}
                          startIcon={<WhatsAppIcon />}
                          variant="contained"
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            fontWeight: 600,
                            textTransform: 'none',
                            padding: { xs: '6px 12px', sm: '6px 16px' },
                            minHeight: '36px',
                            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #128C7E 0%, #075E54 100%)',
                              boxShadow: '0 6px 16px rgba(37, 211, 102, 0.4)',
                              transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          Schedule Interview ({selectedMaids.length} {selectedMaids.length === 1 ? 'helper' : 'helpers'})
                        </Button>
                      )}
                    </div>
                  </Box>
                </Box>

                {/* Maid Cards Grid */}
                {loading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div key={index} className="w-full h-full p-0.5 sm:p-2 lg:p-3">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ height: '474px' }}>
                          {/* Image skeleton */}
                          <Box
                            sx={{
                              width: '100%',
                              height: '240px',
                              bgcolor: 'grey.200'
                            }}
                          />

                          {/* Content skeleton */}
                          <div className="p-3 space-y-2">
                            {/* Name */}
                            <Box sx={{ height: '24px', bgcolor: 'grey.200', borderRadius: 1 }} />

                            {/* Country & Age */}
                            <Box sx={{ height: '16px', bgcolor: 'grey.100', borderRadius: 1, width: '60%' }} />

                            {/* Skills */}
                            <div className="space-y-1">
                              <Box sx={{ height: '14px', bgcolor: 'grey.100', borderRadius: 1, width: '90%' }} />
                              <Box sx={{ height: '14px', bgcolor: 'grey.100', borderRadius: 1, width: '70%' }} />
                            </div>

                            {/* Salary */}
                            <Box sx={{ height: '20px', bgcolor: 'grey.200', borderRadius: 1, width: '50%' }} />

                            {/* Buttons */}
                            <div className="pt-2 space-y-1">
                              <Box sx={{ height: '32px', bgcolor: 'grey.100', borderRadius: 1 }} />
                              <Box sx={{ height: '32px', bgcolor: 'grey.100', borderRadius: 1 }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : allHelpers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
                    {allHelpers.map((maid) => (
                      <div key={maid.id} className="w-full">
                        <MaidCardVariation1
                          maid={maid}
                          isAuthenticated={isAuthenticated}
                          userFavorites={userFavorites}
                          isSelected={selectedMaids.includes(maid.id)}
                          onSelectionChange={handleMaidSelection}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Box sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 2
                  }}>
                    {/* Empty State */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 3
                    }}>
                      {/* Empty Icon */}
                      <Box sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${brandColors.primary}20 0%, ${brandColors.primaryLight}20 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `3px solid ${brandColors.primary}30`
                      }}>
                        <RecommendIcon sx={{
                          fontSize: '3rem',
                          color: brandColors.primary,
                          opacity: 0.7
                        }} />
                      </Box>

                      {/* Empty State Text */}
                      <Box>
                        <Typography variant="h5" sx={{
                          mb: 2,
                          color: brandColors.text,
                          fontWeight: 600
                        }}>
                          No Recommendations Available
                        </Typography>
                        <Typography variant="body1" sx={{
                          color: brandColors.textSecondary,
                          mb: 4,
                          maxWidth: 450,
                          lineHeight: 1.6
                        }}>
                          We don't have personalized recommendations ready for you yet. Browse our catalogue to discover amazing helpers or contact us for assistance.
                        </Typography>
                      </Box>

                      {/* Action Buttons */}
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                          component={Link}
                          to="/catalogue"
                          variant="contained"
                          size="large"
                          startIcon={<ExploreIcon />}
                          sx={{
                            background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%)`,
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem',
                            boxShadow: '0 4px 20px rgba(255, 145, 77, 0.3)',
                            '&:hover': {
                              background: `linear-gradient(135deg, ${brandColors.primaryDark} 0%, ${brandColors.primary} 100%)`,
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 25px rgba(255, 145, 77, 0.4)',
                            }
                          }}
                        >
                          Browse All Helpers
                        </Button>

                        <Button
                          onClick={() => {
                            const message = "Hi, I'd like to learn more about your premium domestic helper services. Could you help me find suitable matches?";
                            window.open(`https://wa.me/88270086?text=${encodeURIComponent(message)}`, '_blank');
                          }}
                          variant="outlined"
                          size="large"
                          sx={{
                            borderColor: brandColors.success,
                            color: brandColors.success,
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem',
                            borderWidth: 2,
                            '&:hover': {
                              borderColor: brandColors.success,
                              backgroundColor: `${brandColors.success}08`,
                              borderWidth: 2,
                            }
                          }}
                        >
                          Contact Us
                        </Button>
                      </Stack>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>


          </Container>
        </Box>

        {/* Floating Contact Selected Button - Mobile Only */}
        {selectedMaids.length > 0 && (
          <div className="lg:hidden fixed bottom-6 left-6 sm:left-1/2 sm:-translate-x-1/2 z-50">
            <Fade in={selectedMaids.length > 0} timeout={300}>
              <Button
                onClick={handleBulkContact}
                startIcon={<WhatsAppIcon />}
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  fontSize: { xs: '0.75rem', sm: '0.9rem' },
                  fontWeight: 600,
                  textTransform: 'none',
                  padding: '10px 20px',
                  minHeight: '56px',
                  minWidth: '180px',
                  maxWidth: '280px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #128C7E 0%, #075E54 100%)',
                    boxShadow: '0 12px 32px rgba(37, 211, 102, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                    boxShadow: '0 6px 16px rgba(37, 211, 102, 0.3)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Schedule Interview ({selectedMaids.length} {selectedMaids.length === 1 ? 'helper' : 'helpers'})
              </Button>
            </Fade>
          </div>
        )}
      </div>

      {/* Login Prompt Modal */}
      <Modal
        open={showLoginPrompt}
        onClose={handleCancel}
        aria-labelledby="login-prompt-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box sx={{
          background: brandColors.surface,
          borderRadius: 3,
          p: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: `1px solid ${brandColors.border}`
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 600,
            color: brandColors.text,
            mb: 2
          }}>
            View Clear Images
          </Typography>
          
          <Typography variant="body1" sx={{ 
            color: brandColors.textSecondary,
            mb: 3
          }}>
            {selectedMaid 
              ? `To see ${selectedMaid.name}'s clear photo and full details, please sign in or create an account.`
              : "You have personalized maid recommendations! Sign in or create an account to view clear photos and full details."
            }
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 2,
            mt: 3
          }}>
            <Button
              variant="contained"
              onClick={handleLogin}
              sx={{
                background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%)`,
                color: 'white',
                py: 1.5,
                '&:hover': {
                  background: `linear-gradient(135deg, ${brandColors.primaryDark} 0%, ${brandColors.primary} 100%)`,
                }
              }}
            >
              Sign In
            </Button>
            
            <Button
              variant="outlined"
              onClick={handleSignup}
              sx={{
                borderColor: brandColors.primary,
                color: brandColors.primary,
                py: 1.5,
                '&:hover': {
                  borderColor: brandColors.primaryDark,
                  background: `${brandColors.primary}10`,
                }
              }}
            >
              Create Account
            </Button>
            
            <Button
              variant="text"
              onClick={handleCancel}
              sx={{
                color: brandColors.textSecondary,
                '&:hover': {
                  background: `${brandColors.textSecondary}10`,
                }
              }}
            >
              Continue with Blurred Images
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
