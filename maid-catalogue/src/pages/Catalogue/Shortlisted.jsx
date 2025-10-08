import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  Fade,
  Modal,
  Skeleton
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ExploreIcon from '@mui/icons-material/Explore';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API_CONFIG from '../../config/api.js';
import MaidCardVariation1 from '../../components/Catalogue/variations/MaidCardVariation1';
import MaidCardSkeleton from '../../components/Catalogue/MaidCardSkeleton';
import FilterSidebar from '../../components/Catalogue/FilterSidebar';
import Header from '../../components/common/Header';

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

export default function Shortlisted() {
  const [recommendedMaids, setRecommendedMaids] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);
  const [favoriteHelpers, setFavoriteHelpers] = useState([]);
  const [allHelpers, setAllHelpers] = useState([]); // Combined recommended + favorites
  const [selectedMaids, setSelectedMaids] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedMaid, setSelectedMaid] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [salaryRange, setSalaryRange] = useState([400, 1000]);
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [skillsets, setSkillsets] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [types, setTypes] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchAllData = async () => {
      console.log('🚀 Shortlisted page useEffect triggered');
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
        console.error('Error loading shortlisted page:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [location, isAuthenticated]);

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

  // Show only favorite helpers (no recommendations)
  useEffect(() => {
    console.log('🔄 Setting helpers to favorites only:', favoriteHelpers.length, 'favorites');
    console.log('   - Favorite helpers:', favoriteHelpers);
    
    // Only show favorite helpers, no recommendations
    setAllHelpers(favoriteHelpers);
  }, [favoriteHelpers]);

  // Filter logic for combined helpers
  const filteredHelpers = allHelpers.filter((maid) => {
    const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(maid.country);
    const salaryMatch = maid.salary >= salaryRange[0] && maid.salary <= salaryRange[1];
    const age = calculateAge(maid.DOB);
    const ageInRange = age >= ageRange[0] && age <= ageRange[1];
    const skillMatch = skillsets.length === 0 || skillsets.some((s) => maid.skills.includes(s));
    const languageMatch = languages.length === 0 || languages.some((l) => maid.languages.includes(l));
    const typeMatch = types.length === 0 || types.some((t) => maid.type.includes(t));
    return countryMatch && salaryMatch && ageInRange && skillMatch && languageMatch && typeMatch;
  });

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
    const baseUrl = import.meta.env.DEV ? 'http://localhost:5173' : 'https://easyhiresg.com';
    return `${baseUrl}/maid/${maidId}`;
  };

  // Handle bulk WhatsApp contact for selected helpers
  const handleBulkContact = () => {
    if (!isAuthenticated) {
      // Could show a login prompt here if needed
      return;
    }

    if (selectedMaids.length === 0) return;

    // Get selected maid details from filtered helpers
    const selectedMaidDetails = filteredHelpers.filter(maid => selectedMaids.includes(maid.id));

    // Generate WhatsApp message
    let message = `Hi! I'm interested in the following helpers from my shortlist:\n\n`;

    selectedMaidDetails.forEach((maid, index) => {
      const profileLink = generateProfileLink(maid.id);
      message += `${index + 1}. ${maid.name} (ID: ${maid.id})\n`;
      message += `   View Profile: ${profileLink}\n\n`;
    });

    message += `Could you provide more information about their availability and arrange interviews? Thank you!`;

    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/6588270086?text=${encodeURIComponent(message)}`;
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
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="w-full px-2 sm:px-4 pt-2 md:pt-3 flex-1 flex flex-col">
        {/* Navigation Header */}
        <Header />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 mt-[104px] flex-1 min-h-0 bg-white">
          {/* Sidebar with Filters */}
          <div className="flex-shrink-0 w-full lg:w-80 lg:sticky lg:top-[120px] lg:self-start mb-4 lg:mb-0 lg:h-fit bg-white">
            <FilterSidebar
              selectedCountries={selectedCountries}
              setSelectedCountries={setSelectedCountries}
              skillsets={skillsets}
              setSkillsets={setSkillsets}
              languages={languages}
              setLanguages={setLanguages}
              types={types}
              setTypes={setTypes}
              defaultSalaryRange={salaryRange}
              defaultAgeRange={ageRange}
              onSalaryChange={setSalaryRange}
              onAgeChange={setAgeRange}
            />
          </div>

          {/* Available Helper Section */}
          <div className="flex-1 flex flex-col min-h-0 bg-white relative">
            {/* Gap Filler - Fills space between navbar and Available Helper header */}
            <div className="lg:sticky lg:top-[96px] bg-white h-2 lg:z-20 border-b-0"></div>

            {/* Full Background Coverage - Prevents any content bleeding */}
            <div className="absolute inset-0 bg-white z-0"></div>

            {/* Available Helper Header - Sticky with Higher Z-Index */}
            <div className="lg:sticky lg:top-[104px] lg:z-30 bg-white shadow-sm border-b border-gray-200 px-4 lg:px-0 py-3 relative">
              <div className="flex justify-between items-center gap-3">
                {/* Available Helper Title - Left Side */}
                <div className="flex items-center gap-3">
                  <StarIcon sx={{ color: brandColors.primary, fontSize: '1.5rem' }} />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Your Favorites ({filteredHelpers.length})
                  </h2>
                </div>

                {/* Contact Selected Button - Right Side (Desktop Only) */}
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
              </div>
            </div>

            {/* Maid Cards Grid - Scrollable Container */}
            <div className="flex-1 overflow-y-auto lg:px-0 pb-4 pt-4 relative z-10">
            {loading ? (
              <Fade in={loading} timeout={300}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(355px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="p-1.5 sm:p-2 lg:p-3">
                      <MaidCardSkeleton />
                    </div>
                  ))}
                </div>
              </Fade>
            ) : filteredHelpers.length > 0 ? (
              <Fade in={!loading} timeout={300}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(355px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {filteredHelpers.map((maid) => (
                    <div key={maid.id} className="p-1.5 sm:p-2 lg:p-3">
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
              </Fade>
            ) : allHelpers.length > 0 ? (
              <Fade in={!loading} timeout={300}>
                <div className="text-center py-12">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    No helpers match your filters
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              </Fade>
            ) : (
              <Fade in={!loading} timeout={300}>
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-6">
                    {/* Empty Icon */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center border-4 border-orange-300">
                      <StarIcon sx={{
                        fontSize: '3rem',
                        color: brandColors.primary,
                        opacity: 0.7
                      }} />
                    </div>

                    {/* Empty State Text */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                        No Favorites Yet
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                        You haven't added any helpers to your favorites yet. Browse our catalogue and click the heart icon to add helpers to your favorites.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
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
                    </div>
                  </div>
                </div>
              </Fade>
            )}
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}
