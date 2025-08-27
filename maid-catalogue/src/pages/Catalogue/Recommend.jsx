import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Paper, useTheme, useMediaQuery, Modal, Button } from '@mui/material';
import MaidCard from '../../components/Catalogue/MaidCard';
import NavBar from '../../components/Catalogue/NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import logoBlack from '../../assets/logoBlack.png';
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

export default function Recommended() {
  const [recommendedMaids, setRecommendedMaids] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedMaid, setSelectedMaid] = useState(null);
  const [recommendationAssociated, setRecommendationAssociated] = useState(false);
  const [isAssociating, setIsAssociating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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

          // 2️⃣ If authenticated AND has token, use the token to fetch recommendations AND associate with user
          if (token) {
            console.log('🔐 User is authenticated with token, fetching recommendations using token...');
            
            // First, call auth callback to associate the recommendation with the user
            console.log('🔗 Associating recommendation token with authenticated user...');
            setIsAssociating(true);
            try {
              const callbackRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.CALLBACK), {
                method: 'POST',
                credentials: 'include',
              });
              
              if (callbackRes.ok) {
                const callbackData = await callbackRes.json();
                console.log('✅ Recommendation successfully associated with user:', callbackData);
                setRecommendationAssociated(true);
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                  setRecommendationAssociated(false);
                }, 5000);
                
                // Check if callback wants to redirect (though this shouldn't happen for authenticated users)
                if (callbackData.redirectTo) {
                  console.log('🔄 Callback requested redirect to:', callbackData.redirectTo);
                  // For authenticated users, we usually don't redirect, but log it
                }
              } else {
                console.log('⚠️ Auth callback failed, but continuing with token-based fetch');
              }
            } catch (err) {
              console.error('❌ Error calling auth callback:', err);
            } finally {
              setIsAssociating(false);
            }
            
            // Now fetch recommendations using the token
            const fetchURL = API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.USER.RECOMMENDED}/${token}`);
            console.log('🌐 Fetching from:', fetchURL);
            
            const recRes = await fetch(fetchURL, {
              credentials: 'include',
            });
            
            console.log('📡 Token-based recommendations response status:', recRes.status);
            
            if (recRes.ok) {
              const recData = await recRes.json();
              console.log('✅ Token-based recommendations:', recData);
              console.log('📊 Number of recommendations:', recData.length);
              setRecommendedMaids(recData);
              
              // Show success message that recommendations were associated
              console.log('🎉 Recommendations successfully associated with your account!');
              
              // Optionally, you could also fetch personal recommendations here to show updated list
              // But for now, we'll show the token-based recommendations
            } else {
              console.error('❌ Failed to fetch token-based recommendations:', recRes.status);
              const errorText = await recRes.text();
              console.error('📄 Error response:', errorText);
              
              // If token-based fetch fails, try personal recommendations as fallback
              console.log('🔄 Trying personal recommendations as fallback...');
              const fallbackRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.USER.RECOMMENDED), {
                credentials: 'include',
              });
              
              if (fallbackRes.ok) {
                const fallbackData = await fallbackRes.json();
                console.log('✅ Fallback to personal recommendations successful:', fallbackData);
                setRecommendedMaids(fallbackData);
              } else {
                console.error('❌ Fallback also failed:', fallbackRes.status);
                setRecommendedMaids([]);
              }
            }
          } else {
            // 3️⃣ If authenticated but no token, fetch user's personal recommendations
            console.log('🔐 User is authenticated but no token, fetching personal recommendations...');
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
          }

          // 4️⃣ Fetch user favorites if authenticated
          console.log('❤️ Fetching user favorites...');
          const favRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.USER.FAVORITES), {
            credentials: 'include',
          });
          
          console.log('📡 Favorites response status:', favRes.status);
          
          if (favRes.ok) {
            const favData = await favRes.json();
            // Extract maid IDs from the response
            const favoriteIds = Array.isArray(favData) ? favData.map(maid => maid.id) : [];
            console.log('✅ User favorites loaded:', favoriteIds.length, 'favorites');
            setUserFavorites(favoriteIds);
          } else if (favRes.status === 401) {
            // User not authenticated, set empty favorites
            setUserFavorites([]);
            console.log('❌ User not authenticated, no favorites');
          } else {
            console.error('❌ Failed to fetch favorites:', favRes.status);
            setUserFavorites([]);
          }
        } else {
          console.log('❌ User is not authenticated');
          setIsAuthenticated(false); // not logged in
          setUserFavorites([]);
          
          // 5️⃣ If not authenticated and has token, fetch anonymous recommendations
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
              
              // Show user-friendly error message
              console.log('❌ Token-based recommendations failed, showing empty state');
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
      }
    };

    fetchAllData();
  }, [location, isAuthenticated]);

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

  // Handle maid card click - show login prompt if not authenticated
  const handleMaidCardClick = (maid) => {
    if (!isAuthenticated) {
      setSelectedMaid(maid);
      setShowLoginPrompt(true);
    }
  };

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
                height: isMobile ? '120px' : '160px',
                filter: 'drop-shadow(0 4px 12px rgba(255, 145, 77, 0.3))',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  filter: 'drop-shadow(0 6px 16px rgba(255, 145, 77, 0.4))',
                }
              }} 
            />
            <Box>
              <Typography 
                variant={isMobile ? "h3" : "h2"} 
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
                Recommended Maids
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: brandColors.textSecondary,
                  fontWeight: 500,
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                Personalized suggestions based on your preferences
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Navigation Bar */}
          <Box sx={{ mb: 3 }}>
            <NavBar isAuthenticated={isAuthenticated} />
          </Box>

          {/* Results Grid */}
          <Box sx={{ 
            background: brandColors.surface,
            borderRadius: 3,
            p: { xs: 2, md: 3 },
            boxShadow: '0 4px 20px rgba(12, 25, 27, 0.08)',
            border: `1px solid ${brandColors.border}`
          }}>
            {/* Results Header */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3,
              pb: 2,
              borderBottom: `2px solid ${brandColors.border}`
            }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 600,
                color: brandColors.text
              }}>
                Recommended Maids
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${brandColors.primary}15 0%, ${brandColors.primaryLight}15 100%)`,
                border: `1px solid ${brandColors.primary}30`
              }}>
                <Typography variant="body2" sx={{ 
                  color: brandColors.primary,
                  fontWeight: 600
                }}>
                  {recommendedMaids.length} recommendations
                </Typography>
              </Box>
            </Box>

            {/* Success Message for Associated Recommendations */}
            {isAssociating && (
              <Box sx={{ 
                mb: 3,
                p: 2,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${brandColors.primary}15 0%, ${brandColors.primaryLight}25 100%)`,
                border: `1px solid ${brandColors.primary}30`,
                textAlign: 'center'
              }}>
                <Typography variant="body1" sx={{ 
                  color: brandColors.primary,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}>
                  🔄 Associating recommendations with your account...
                </Typography>
              </Box>
            )}

            {recommendationAssociated && (
              <Box sx={{ 
                mb: 3,
                p: 2,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${brandColors.success}15 0%, ${brandColors.success}25 100%)`,
                border: `1px solid ${brandColors.success}30`,
                textAlign: 'center'
              }}>
                <Typography variant="body1" sx={{ 
                  color: brandColors.success,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}>
                  ✅ Recommendations successfully added to your account!
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: brandColors.success,
                  mt: 0.5,
                  opacity: 0.8
                }}>
                  These recommendations are now saved and will appear in your personal recommendations.
                </Typography>
                {/* <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    // Refresh the page to show personal recommendations
                    window.location.reload();
                  }}
                  sx={{
                    mt: 1,
                    borderColor: brandColors.success,
                    color: brandColors.success,
                    '&:hover': {
                      borderColor: brandColors.success,
                      backgroundColor: `${brandColors.success}10`,
                    }
                  }}
                >
                  View Personal Recommendations
                </Button> */}
              </Box>
            )}

            {/* Maid Cards Grid */}
            {recommendedMaids.length > 0 ? (
              <Grid container spacing={4} justifyContent="flex-start">
                {recommendedMaids.map((maid) => (
                  <Grid item xs={5} md={3} key={maid.id}>
                    <MaidCard
                      maid={maid}
                      isAuthenticated={isAuthenticated}
                      userFavorites={userFavorites}
                      onCardClick={() => handleMaidCardClick(maid)}
                      showBlurredImage={!isAuthenticated}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                color: brandColors.textSecondary
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: brandColors.text }}>
                  No recommendations available
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {isAuthenticated 
                    ? "You don't have any recommendations yet. Please contact an administrator to create recommendations for you."
                    : "Complete your profile preferences to get personalized recommendations"
                  }
                </Typography>
                {isAuthenticated && (
                  <Typography variant="body2" sx={{ color: brandColors.primary }}>
                    You can also browse all available maids in the catalogue.
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Container>

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
    </Box>
  );
}
