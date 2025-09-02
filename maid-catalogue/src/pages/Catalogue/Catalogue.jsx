import { useState, useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MaidCard from '../../components/Catalogue/MaidCard';
import FilterSidebar from '../../components/Catalogue/FilterSidebar';
import Header from '../../components/common/Header';
import LoginPromptModal from '../../components/Catalogue/LoginPromptModal';
import { useMaidContext } from '../../context/maidList';
import API_CONFIG from '../../config/api.js';
import { createMockApiResponse } from '../../data/mockMaids.js';

// Brand colors removed since Reset Welcome button is no longer used

export default function Catalogue() {
  const [maids, setMaids] = useState([]);
  const [salaryRange, setSalaryRange] = useState([400, 1000]);
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [skillsets, setSkillsets] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedMaids, setSelectedMaids] = useState([]);
  
  const { setMaidList } = useMaidContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  // Ref to store timeout for welcome modal delay
  const welcomeModalTimeoutRef = useRef(null);
  

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

          // Note: Favorites functionality removed in favor of selection system
          // If needed in the future, favorites can be re-implemented alongside selection
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

    // Function to get all maids with pagination and caching
    const fetchMaids = async (page = 1, append = false) => {
      try {

        const res = await fetch(API_CONFIG.buildUrlWithParams(API_CONFIG.ENDPOINTS.CATALOGUE.MAIDS, {
          page: page.toString(),
          limit: '20'
        }), {
          credentials: 'include',
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch maids');
        }
        
        const data = await res.json();
        console.log('Fetched maids:', data);
        
        if (append) {
          setMaids(prev => [...prev, ...data.maids]);
          setMaidList(prev => [...prev, ...data.maids]);
        } else {
          setMaids(data.maids);
          setMaidList(data.maids);
        }
      } catch (err) {
        console.error('Error fetching maids from API:', err);
        console.warn('🔄 Using fallback mock data for maid catalogue');
        
        // Use mock data as fallback when API fails
        const mockData = createMockApiResponse();
        
        if (append) {
          setMaids(prev => [...prev, ...mockData.maids]);
          setMaidList(prev => [...prev, ...mockData.maids]);
        } else {
          setMaids(mockData.maids);
          setMaidList(mockData.maids);
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

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedMaids([]); // Clear selections on logout
    // Redirect to login or home page
    window.location.href = '/login';
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
      const topSkills = maid.skills.slice(0, 3).join(', '); // Get top 3 skills
      message += `${index + 1}. ${maid.name} (ID: ${maid.id}) - ${maid.country}, ${calculateAge(maid.DOB)}y, ${topSkills}\n`;
    });
    
    message += `\nCould you provide more information about their availability and arrange interviews? Thank you!`;
    
    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/88270086?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Note: resetWelcomeModal function removed as it's no longer needed

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="w-full px-2 sm:px-4 pt-2 md:pt-3 flex-1 flex flex-col">
        {/* Navigation Header */}
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        
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
            <div className="sticky top-[96px] bg-white h-2 z-20 border-b-0"></div>
            
            {/* Full Background Coverage - Prevents any content bleeding */}
            <div className="absolute inset-0 bg-white z-0"></div>
            
            {/* Available Helper Header - Sticky with Higher Z-Index */}
            <div className="sticky top-[104px] z-30 bg-white shadow-sm border-b border-gray-200 px-4 lg:px-0 py-3 relative">
              <div className="flex justify-between items-center gap-3">
                {/* Available Helper Title - Left Side */}
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Available Helper
                  </h2>
                </div>
                
                {/* Contact Selected Button - Right Side */}
                <div className="flex-shrink-0">
                  {selectedMaids.length > 0 && (
                    <Button
                      onClick={handleBulkContact}
                      startIcon={<WhatsAppIcon />}
                      variant="contained"
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        color: '#FFFFFF',
                        borderRadius: '20px',
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
                      Contact Selected ({selectedMaids.length})
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Maid Cards Grid - Scrollable Container */}
            <div className="flex-1 overflow-y-auto lg:px-0 pb-4 pt-4 relative z-10">
              {filteredMaids.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7">
                  {filteredMaids.map((maid) => (
                    <div key={maid.id} className="w-full h-full p-1.5 sm:p-2 lg:p-3">
                      <MaidCard 
                        maid={maid} 
                        isAuthenticated={isAuthenticated}
                        isSelected={selectedMaids.includes(maid.id)}
                        onSelectionChange={handleMaidSelection}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    No maids found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Try adjusting your filters to see more results
                  </p>
                </div>
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
    </div>
  );
}


