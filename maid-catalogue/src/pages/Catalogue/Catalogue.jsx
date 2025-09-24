import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Skeleton, Fade, Alert } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import RefreshIcon from '@mui/icons-material/Refresh';
import MaidCard from '../../components/Catalogue/MaidCard';
import MaidCardVerticalSkeleton from '../../components/Catalogue/MaidCardVerticalSkeleton';
import FilterSidebar from '../../components/Catalogue/FilterSidebar';
import Header from '../../components/common/Header';
import LoginPromptModal from '../../components/Catalogue/LoginPromptModal';
import { useMaidContext } from '../../context/maidList';
import API_CONFIG from '../../config/api.js';

// Brand colors removed since Reset Welcome button is no longer used

export default function Catalogue() {
  const [maids, setMaids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salaryRange, setSalaryRange] = useState([400, 1000]);
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [skillsets, setSkillsets] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedMaids, setSelectedMaids] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  
  const { setMaidList } = useMaidContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [searchParams] = useSearchParams();
  
  // Ref to store timeout for welcome modal delay
  const welcomeModalTimeoutRef = useRef(null);
  

  // Function to get all maids with pagination and caching
  const fetchMaids = async (page = 1, append = false) => {
    if (!append) {
      setIsLoading(true);
      setError(null);
    }
    
    try {
      const res = await fetch(API_CONFIG.buildUrlWithParams(API_CONFIG.ENDPOINTS.CATALOGUE.MAIDS, {
        page: page.toString(),
        limit: '1000'
      }), {
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error(`Failed to load helpers (${res.status}: ${res.statusText})`);
      }
      
      // Check if response is JSON before parsing
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await res.text();
        console.error('Non-JSON response received:', textResponse.substring(0, 200));
        throw new Error(`Expected JSON response but received ${contentType || 'unknown content type'}`);
      }
      
      const data = await res.json();
      console.log('Fetched maids:', data);
      
      if (append) {
        setMaids(prev => [...prev, ...data.maids]);
        setMaidList(prev => [...prev, ...data.maids]);
      } else {
        setMaids(data.maids || []);
        setMaidList(data.maids || []);
      }
    } catch (err) {
      console.error('Error fetching maids from API:', err);
      setError(err.message);
      if (!append) {
        setMaids([]);
        setMaidList([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Function to check authentication
    const checkAuth = async () => {
      try {
        const res = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.PROFILE), {
          credentials: 'include',
        });

        if (res.ok) {
          setIsAuthenticated(true);
          // Clear any pending welcome modal timeout
          if (welcomeModalTimeoutRef.current) {
            clearTimeout(welcomeModalTimeoutRef.current);
            welcomeModalTimeoutRef.current = null;
          }
          // Hide welcome modal when user is authenticated
          setShowWelcomeModal(false);
          // Clear the welcome modal flag when user logs in
          localStorage.removeItem('hasSeenWelcomeModal');

          // Fetch user favorites
          try {
            const favRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.USER.FAVORITES), {
              credentials: 'include',
            });
            
            console.log('🔍 Favorites API Response:', {
              status: favRes.status,
              ok: favRes.ok
            });
            
            if (favRes.ok) {
              const favData = await favRes.json();
              console.log('🔍 Raw Favorites Data:', favData);
              
              if (Array.isArray(favData)) {
                const favoriteIds = favData.map(maid => maid.id);
                console.log('🔍 Processed Favorite IDs:', favoriteIds);
                setUserFavorites(favoriteIds);
              } else {
                console.log('🔍 Favorites data is not an array:', favData);
                setUserFavorites([]);
              }
            } else {
              console.log('🔍 Favorites API failed with status:', favRes.status);
              setUserFavorites([]);
            }
          } catch (err) {
            console.error('Error fetching favorites:', err);
            setUserFavorites([]);
          }
        } else {
          setIsAuthenticated(false);
          // Check if user has already seen the welcome modal
          const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeModal');
          if (!hasSeenWelcome) {
            // Add 5-second delay before showing welcome modal
            welcomeModalTimeoutRef.current = setTimeout(() => {
              setShowWelcomeModal(true);
            }, 15000);
          }
        }
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
        // Check if user has already seen the welcome modal
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeModal');
        if (!hasSeenWelcome) {
          // Add 5-second delay before showing welcome modal
          welcomeModalTimeoutRef.current = setTimeout(() => {
            setShowWelcomeModal(true);
          }, 5000);
        }
      }
    };

    // Call both functions independently
    checkAuth();
    fetchMaids();
    
    // Cleanup function to clear timeout on unmount
    return () => {
      if (welcomeModalTimeoutRef.current) {
        clearTimeout(welcomeModalTimeoutRef.current);
        welcomeModalTimeoutRef.current = null;
      }
    };
  }, []);

  // Handle authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear the welcome modal flag when user logs out
      localStorage.removeItem('hasSeenWelcomeModal');
    }
  }, [isAuthenticated]);

  // Handle URL parameters for filtering
  useEffect(() => {
    const country = searchParams.get('country');
    const type = searchParams.get('type');
    
    if (country) {
      setSelectedCountries([country]);
    }
    
    if (type) {
      setTypes([type]);
    }
  }, [searchParams]);

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedMaids([]); // Clear selections on logout
    // Redirect to home page
    window.location.href = '/';
  };

  // Handle retry API call
  const handleRetry = () => {
    fetchMaids();
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

  // Filter logic
  const filteredMaids = maids.filter((maid) => {
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
      setShowWelcomeModal(true);
      return;
    }

    if (selectedMaids.length === 0) return;

    // Get selected maid details
    const selectedMaidDetails = filteredMaids.filter(maid => selectedMaids.includes(maid.id));
    
    // Generate WhatsApp message
    let message = `Hi! I'm interested in the following domestic helpers:\n\n`;
    
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
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Available Helper
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
              {/* Loading State */}
              {isLoading && (
                <Fade in={isLoading} timeout={300}>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5">
                    {Array.from({ length: 20 }).map((_, index) => (
                      <div key={index} className="w-full h-full p-1.5 sm:p-2 lg:p-3">
                        <MaidCardVerticalSkeleton />
                      </div>
                    ))}
                  </div>
                </Fade>
              )}

              {/* Error State */}
              {!isLoading && error && (
                <Fade in={!isLoading && !!error} timeout={300}>
                  <div className="text-center py-12">
                    <Alert 
                      severity="error" 
                      variant="outlined"
                      sx={{ 
                        maxWidth: 500, 
                        margin: '0 auto',
                        '& .MuiAlert-message': {
                          textAlign: 'center',
                          width: '100%'
                        }
                      }}
                      action={
                        <Button 
                          color="inherit" 
                          size="small" 
                          onClick={handleRetry}
                          startIcon={<RefreshIcon />}
                          disabled={isLoading}
                        >
                          Retry
                        </Button>
                      }
                    >
                      <div>
                        <strong>Failed to load helpers</strong>
                        <br />
                        <span className="text-sm opacity-80">{error}</span>
                      </div>
                    </Alert>
                  </div>
                </Fade>
              )}

              {/* Data State - Show maids */}
              {!isLoading && !error && filteredMaids.length > 0 && (
                <Fade in={!isLoading && !error} timeout={300}>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5">
                    {filteredMaids.map((maid) => (
                      <div key={maid.id} className="w-full h-full p-1.5 sm:p-2 lg:p-3">
                        <MaidCard 
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
              )}

              {/* Empty State - No maids found */}
              {!isLoading && !error && filteredMaids.length === 0 && maids.length > 0 && (
                <Fade in={!isLoading && !error} timeout={300}>
                  <div className="text-center py-12">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                      No helpers match your filters
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Try adjusting your filters to see more results
                    </p>
                  </div>
                </Fade>
              )}

              {/* No Data State - API returned no maids */}
              {!isLoading && !error && maids.length === 0 && (
                <Fade in={!isLoading && !error} timeout={300}>
                  <div className="text-center py-12">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                      No helpers available
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Check back later for new listings
                    </p>
                  </div>
                </Fade>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Welcome Modal for Unauthenticated Users */}
      <LoginPromptModal
        open={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />
      
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


