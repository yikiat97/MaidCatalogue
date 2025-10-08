import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  Fade
} from '@mui/material';
import RecommendIcon from '@mui/icons-material/Recommend';
import ExploreIcon from '@mui/icons-material/Explore';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API_CONFIG from '../../config/api.js';
import MaidCardVariation1 from '../../components/Catalogue/variations/MaidCardVariation1';
import MaidCardSkeleton from '../../components/Catalogue/MaidCardSkeleton';
import FilterSidebar from '../../components/Catalogue/FilterSidebar';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';

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
  const [topMaids, setTopMaids] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [selectedMaids, setSelectedMaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [tokenRecommendations, setTokenRecommendations] = useState([]);

  // Use AuthContext for authentication state
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Filter states
  const [salaryRange, setSalaryRange] = useState([400, 1000]);
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [skillsets, setSkillsets] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [types, setTypes] = useState([]);

  // Function to fetch recommendations by token from backend
  const fetchRecommendationsByToken = async (token) => {
    try {
      const response = await fetch(API_CONFIG.buildUrl(`${API_CONFIG.ENDPOINTS.USER.RECOMMENDED}/${token}`), {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 [DEBUG] Token recommendations from backend:', data);
        return Array.isArray(data) ? data : [];
      } else {
        console.error('Failed to fetch recommendations by token:', response.status);
        return [];
      }
    } catch (error) {
      console.error('Error fetching recommendations by token:', error);
      return [];
    }
  };

  // Function to save token in cookie
  const saveTokenInCookie = (token) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 days
    document.cookie = `recommendation_token=${token}; expires=${expires.toUTCString()}; path=/`;
  };

  // Function to get token from cookie
  const getTokenFromCookie = () => {
    const name = 'recommendation_token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  };

  useEffect(() => {
    // Don't fetch data if authentication is still loading
    if (authLoading) {
      console.log('🔍 [DEBUG] Auth still loading, waiting...');
      return;
    }

    const fetchAllData = async (retry = false) => {
      if (retry) {
        console.log('🔍 [DEBUG] Retrying data fetch, attempt:', retryCount + 1);
      } else {
        console.log('🔍 [DEBUG] Starting to fetch data for Recommend page...');
        setError(null); // Clear any previous errors
      }

      console.log('🔍 [DEBUG] AuthContext state:', { isAuthenticated, user, authLoading });

      // Check for token in URL parameters
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');
      
      if (token) {
        console.log('🔍 [DEBUG] Token found in URL:', token);
        saveTokenInCookie(token);
        
        // Fetch recommendations from backend using token
        const tokenMaids = await fetchRecommendationsByToken(token);
        console.log('🔍 [DEBUG] Fetched recommendations from backend:', tokenMaids);
        
        if (tokenMaids.length > 0) {
          setTokenRecommendations(tokenMaids);
          setTopMaids(tokenMaids);
          
          // If user is authenticated, associate the recommendations (optional)
          if (isAuthenticated) {
            try {
              const callbackRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.CALLBACK), {
                method: 'POST',
                credentials: 'include',
              });
              
              if (callbackRes.ok) {
                console.log('🔍 [DEBUG] Successfully associated recommendations with user');
                // Clear the token from URL and cookie after successful association
                navigate('/recommend', { replace: true });
                document.cookie = 'recommendation_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              }
            } catch (err) {
              console.error('Error associating recommendations:', err);
            }
          }
          // Note: If user is not authenticated, they can still view the recommendations
          // The token will remain in cookie for later association if they choose to login
        } else {
          console.error('🔍 [DEBUG] No recommendations found for token');
          setError('No recommendations found for this token');
        }
        
        setLoading(false);
        return;
      }

      try {
        // Fetch user favorites if authenticated
        if (isAuthenticated) {
          try {
            console.log('🔍 [DEBUG] User is authenticated, fetching user favorites...');
            const favRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.USER.FAVORITES), {
              credentials: 'include',
            });

            if (favRes.ok) {
              const favData = await favRes.json();
              console.log('🔍 [DEBUG] Favorites data:', favData);
              if (Array.isArray(favData)) {
                const favoriteIds = favData.map(maid => maid.id);
                setUserFavorites(favoriteIds);
              } else {
                setUserFavorites([]);
              }
            } else {
              console.log('🔍 [DEBUG] Failed to fetch favorites, status:', favRes.status);
              setUserFavorites([]);
            }
          } catch (err) {
            console.error('Error fetching favorites:', err);
            setUserFavorites([]);
          }
        } else {
          console.log('🔍 [DEBUG] User not authenticated, skipping favorites');
          setUserFavorites([]);
        }

        // Fetch user-specific recommendations (requires authentication)
        if (isAuthenticated) {
          console.log('🔍 [DEBUG] Fetching user-specific recommendations...');
          const recommendationsUrl = API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.USER.RECOMMENDED);
          console.log('🔍 [DEBUG] Recommendations URL:', recommendationsUrl);

          const recommendationsRes = await fetch(recommendationsUrl, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          console.log('🔍 [DEBUG] Recommendations response status:', recommendationsRes.status);

          if (recommendationsRes.ok) {
            const contentType = recommendationsRes.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error(`Expected JSON response but got: ${contentType}`);
            }

            const recommendationsData = await recommendationsRes.json();
            console.log('🔍 [DEBUG] Recommendations response data:', recommendationsData);
            console.log('🔍 [DEBUG] Recommendations data type:', typeof recommendationsData);
            console.log('🔍 [DEBUG] Is recommendations data an array?', Array.isArray(recommendationsData));

            // Handle different response structures
            let maidsArray = [];
            if (Array.isArray(recommendationsData)) {
              console.log('🔍 [DEBUG] Setting recommendations directly (array format)');
              maidsArray = recommendationsData;
            } else if (recommendationsData && Array.isArray(recommendationsData.maids)) {
              console.log('🔍 [DEBUG] Setting recommendations from nested object format');
              maidsArray = recommendationsData.maids;
            } else if (recommendationsData && Array.isArray(recommendationsData.data)) {
              console.log('🔍 [DEBUG] Setting recommendations from data property');
              maidsArray = recommendationsData.data;
            } else if (recommendationsData && recommendationsData.success === false) {
              throw new Error(recommendationsData.message || 'API returned unsuccessful response');
            } else {
              console.warn('🔍 [DEBUG] Unexpected response format for recommendations:', recommendationsData);
              maidsArray = [];
            }

            // Validate maid objects
            const validMaids = maidsArray.filter(maid => {
              const isValid = maid && typeof maid === 'object' && maid.id && maid.name;
              if (!isValid) {
                console.warn('🔍 [DEBUG] Invalid maid object:', maid);
              }
              return isValid;
            });

            console.log(`🔍 [DEBUG] Valid recommendations: ${validMaids.length}/${maidsArray.length}`);
            setTopMaids(validMaids);
            setError(null);
            setRetryCount(0); // Reset retry count on success
          } else if (recommendationsRes.status >= 500) {
            // Server error - might be temporary, can retry
            const errorMessage = `Server error (${recommendationsRes.status}). This might be temporary.`;
            console.error('🔍 [DEBUG] Server error:', errorMessage);
            throw new Error(errorMessage);
          } else {
            // Client error - likely permanent, don't retry
            const errorText = await recommendationsRes.text().catch(() => 'Unable to read error response');
            const errorMessage = `Failed to fetch recommendations (${recommendationsRes.status}): ${errorText}`;
            console.error('🔍 [DEBUG] Client error:', errorMessage);
            setError(errorMessage);
            setTopMaids([]);
          }
        } else {
          console.log('🔍 [DEBUG] User not authenticated, cannot fetch recommendations');
          setTopMaids([]);
        }
      } catch (error) {
        console.error('🔍 [DEBUG] Network error loading recommendations:', error);
        const errorMessage = error.message || 'Network error occurred while fetching data';

        // Check if we should retry (max 3 attempts)
        if (retryCount < 2 && (error.message.includes('Server error') || error.message.includes('fetch'))) {
          console.log('🔍 [DEBUG] Will retry after error:', errorMessage);
          setRetryCount(prev => prev + 1);
          setError(`${errorMessage} (Retrying...)`);

          // Retry after a delay
          setTimeout(() => {
            fetchAllData(true);
          }, (retryCount + 1) * 2000); // 2s, 4s, 6s delays
          return;
        }

        setError(errorMessage);
        setTopMaids([]);
      } finally {
        setLoading(false);
        console.log('🔍 [DEBUG] Finished loading data');
      }
    };

    fetchAllData();
  }, [isAuthenticated, authLoading, user]);

  // Manual retry function
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(0);

    // Re-run the effect by calling fetchAllData directly
    const fetchData = async () => {
      if (authLoading) return;

      const fetchAllData = async () => {
        console.log('🔍 [DEBUG] Manual retry - Starting to fetch data for Recommend page...');
        setError(null);

        try {
          // Fetch user favorites if authenticated
          if (isAuthenticated) {
            try {
              const favRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.USER.FAVORITES), {
                credentials: 'include',
              });

              if (favRes.ok) {
                const favData = await favRes.json();
                if (Array.isArray(favData)) {
                  const favoriteIds = favData.map(maid => maid.id);
                  setUserFavorites(favoriteIds);
                } else {
                  setUserFavorites([]);
                }
              } else {
                setUserFavorites([]);
              }
            } catch (err) {
              console.error('Error fetching favorites:', err);
              setUserFavorites([]);
            }
          } else {
            setUserFavorites([]);
          }

        } catch (error) {
          console.error('Manual retry error:', error);
          setError(error.message || 'Network error occurred while fetching data');
          setTopMaids([]);
        } finally {
          setLoading(false);
        }
      };

      await fetchAllData();
    };

    fetchData();
  };

  // Handle token association after login
  useEffect(() => {
    const handleTokenAssociation = async () => {
      const token = getTokenFromCookie();
      if (token && isAuthenticated && !authLoading) {
        console.log('🔍 [DEBUG] User logged in with token, fetching and associating recommendations...');
        
        try {
          // Fetch recommendations using the token
          const tokenMaids = await fetchRecommendationsByToken(token);
          if (tokenMaids.length > 0) {
            setTokenRecommendations(tokenMaids);
            setTopMaids(tokenMaids);
            
            // Associate the recommendations with the user
            const callbackRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.CALLBACK), {
              method: 'POST',
              credentials: 'include',
            });
            
            if (callbackRes.ok) {
              console.log('🔍 [DEBUG] Successfully associated recommendations with user');
              // Clear the token from cookie after successful association
              document.cookie = 'recommendation_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              // Refresh the page to show user's personal recommendations
              window.location.reload();
            }
          }
        } catch (err) {
          console.error('Error associating recommendations:', err);
        }
      }
    };

    handleTokenAssociation();
  }, [isAuthenticated, authLoading]);

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

  // Filter logic for top maids
  const filteredTopMaids = React.useMemo(() => {
    console.log('🔍 [FILTER] Starting to filter top maids...');
    console.log('🔍 [FILTER] Total top maids before filtering:', topMaids.length);
    console.log('🔍 [FILTER] Filter criteria:', {
      selectedCountries,
      salaryRange,
      ageRange,
      skillsets,
      languages,
      types
    });

    const filtered = topMaids.filter((maid, index) => {
      // Ensure maid object is valid
      if (!maid || typeof maid !== 'object') {
        console.warn(`🔍 [FILTER] Invalid maid object at index ${index}:`, maid);
        return false;
      }

      // Country filter - be more permissive with country matching
      const countryMatch = selectedCountries.length === 0 ||
        (maid.country && selectedCountries.includes(maid.country)) ||
        (maid.nationality && selectedCountries.includes(maid.nationality));

      // Salary filter - handle missing or invalid salary values
      const salary = parseFloat(maid.salary) || 0;
      const salaryMatch = salary === 0 || (salary >= salaryRange[0] && salary <= salaryRange[1]);

      // Age filter - handle missing DOB gracefully
      const age = calculateAge(maid.DOB);
      const ageInRange = !age || (age >= ageRange[0] && age <= ageRange[1]);

      // Skills filter - handle different skill formats (string, array, comma-separated)
      let maidSkills = [];
      if (Array.isArray(maid.skills)) {
        maidSkills = maid.skills;
      } else if (typeof maid.skills === 'string') {
        maidSkills = maid.skills.split(',').map(s => s.trim());
      }
      const skillMatch = skillsets.length === 0 ||
        maidSkills.length === 0 ||
        skillsets.some((s) => maidSkills.some(skill => skill.toLowerCase().includes(s.toLowerCase())));

      // Languages filter - handle different language formats
      let maidLanguages = [];
      if (Array.isArray(maid.languages)) {
        maidLanguages = maid.languages;
      } else if (typeof maid.languages === 'string') {
        maidLanguages = maid.languages.split(',').map(l => l.trim());
      }
      const languageMatch = languages.length === 0 ||
        maidLanguages.length === 0 ||
        languages.some((l) => maidLanguages.some(lang => lang.toLowerCase().includes(l.toLowerCase())));

      // Type filter - handle different type formats
      let maidTypes = [];
      if (Array.isArray(maid.type)) {
        maidTypes = maid.type;
      } else if (typeof maid.type === 'string') {
        maidTypes = maid.type.split(',').map(t => t.trim());
      }
      const typeMatch = types.length === 0 ||
        maidTypes.length === 0 ||
        types.some((t) => maidTypes.some(type => type.toLowerCase().includes(t.toLowerCase())));

      const passes = countryMatch && salaryMatch && ageInRange && skillMatch && languageMatch && typeMatch;

      // Log detailed filtering info for debugging (first 5 maids and failed ones)
      if (index < 5 || !passes) {
        console.log(`🔍 [FILTER] Maid ${maid.id || maid.name || index}:`, {
          name: maid.name,
          country: maid.country,
          nationality: maid.nationality,
          salary: maid.salary,
          parsedSalary: salary,
          age,
          skills: maid.skills,
          parsedSkills: maidSkills,
          languages: maid.languages,
          parsedLanguages: maidLanguages,
          type: maid.type,
          parsedTypes: maidTypes,
          filters: {
            countryMatch,
            salaryMatch,
            ageInRange,
            skillMatch,
            languageMatch,
            typeMatch
          },
          passes
        });
      }

      return passes;
    });

    console.log('🔍 [FILTER] Filtered maids count:', filtered.length);

    // Log filter impact summary
    if (topMaids.length > 0) {
      const filterImpact = {
        original: topMaids.length,
        filtered: filtered.length,
        removed: topMaids.length - filtered.length,
        removalRate: Math.round(((topMaids.length - filtered.length) / topMaids.length) * 100)
      };

      console.log('🔍 [FILTER] Filter Impact:', filterImpact);

      // Warn if filters are too restrictive
      if (filterImpact.removalRate > 80 && filtered.length === 0) {
        console.warn('🔍 [FILTER] ⚠️ Filters may be too restrictive - removed >80% of results');
      }
    }

    return filtered;
  }, [topMaids, selectedCountries, salaryRange, ageRange, skillsets, languages, types]);

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
    if (selectedMaids.length === 0) return;

    // Get selected maid details from filtered maids
    const selectedMaidDetails = filteredTopMaids.filter(maid => selectedMaids.includes(maid.id));

    // Generate WhatsApp message
    let message = `Hi! I'm interested in the following ${isAuthenticated ? 'recommended' : 'selected'} helpers:\n\n`;

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
                  <RecommendIcon sx={{ color: brandColors.primary, fontSize: '1.5rem' }} />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    {tokenRecommendations.length > 0 
                      ? (isAuthenticated ? 'Recommended for You' : 'Recommended Helpers') 
                      : 'Your Personal Recommendations'} ({filteredTopMaids.length})
                  </h2>
                </div>
                
                {/* Optional login prompt for token-based recommendations */}
                {tokenRecommendations.length > 0 && !isAuthenticated && (
                  <div className="text-sm text-blue-600 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Viewing recommended helpers</span>
                        <span className="text-gray-600 ml-2">• You can browse without logging in</span>
                      </div>
                      <Link 
                        to="/login" 
                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
                      >
                        Login to Save
                      </Link>
                    </div>
                  </div>
                )}

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
            {(loading || authLoading) ? (
              <Fade in={loading || authLoading} timeout={300}>
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
            ) : filteredTopMaids.length > 0 ? (
              <Fade in={!loading && !authLoading} timeout={300}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(355px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {filteredTopMaids.map((maid) => (
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
            ) : topMaids.length > 0 ? (
              <Fade in={!loading && !authLoading} timeout={300}>
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
              <Fade in={!loading && !authLoading} timeout={300}>
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-6">
                    {/* Icon - Different for error vs empty state */}
                    {error ? (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center border-4 border-red-300">
                        <ExploreIcon sx={{
                          fontSize: '3rem',
                          color: '#dc2626',
                          opacity: 0.7
                        }} />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center border-4 border-orange-300">
                        <RecommendIcon sx={{
                          fontSize: '3rem',
                          color: brandColors.primary,
                          opacity: 0.7
                        }} />
                      </div>
                    )}

                    {/* Error or Empty State Text */}
                    <div>
                      {error ? (
                        <>
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                            Unable to Load Recommendations
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto mb-2">
                            {error.includes('Network error') || error.includes('fetch')
                              ? "There seems to be a connection issue. Please check your internet connection and try again."
                              : "We encountered an issue while loading your personal recommendations."
                            }
                          </p>
                          <p className="text-xs text-gray-500 max-w-lg mx-auto">
                            Error details: {error}
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                            No Personal Recommendations Yet
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                            We don't have personalized recommendations for you yet. Browse our catalogue to discover amazing helpers and we'll learn your preferences.
                          </p>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {error && (
                        <Button
                          onClick={handleRetry}
                          variant="outlined"
                          size="large"
                          sx={{
                            borderColor: brandColors.primary,
                            color: brandColors.primary,
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&:hover': {
                              borderColor: brandColors.primaryDark,
                              backgroundColor: `${brandColors.primary}10`,
                              transform: 'translateY(-2px)',
                            }
                          }}
                        >
                          Try Again
                        </Button>
                      )}
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
    </div>
  );
}
