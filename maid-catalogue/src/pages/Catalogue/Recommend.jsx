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
import { Link } from 'react-router-dom';
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

export default function Recommended() {
  const [topMaids, setTopMaids] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);
  const [selectedMaids, setSelectedMaids] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [salaryRange, setSalaryRange] = useState([400, 1000]);
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [skillsets, setSkillsets] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [types, setTypes] = useState([]);


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Check authentication status
        const authRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.PROFILE), {
          credentials: 'include',
        });

        if (authRes.ok) {
          setIsAuthenticated(true);

          // Fetch user favorites if authenticated
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
          setIsAuthenticated(false);
          setUserFavorites([]);
        }

        // 2. Fetch top maids (public data - no authentication required)
        const topMaidsRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.CATALOGUE.TOP_MAIDS), {
          credentials: 'include',
        });

        if (topMaidsRes.ok) {
          const topMaidsData = await topMaidsRes.json();
          setTopMaids(topMaidsData);
        } else {
          console.error('Failed to fetch top maids:', topMaidsRes.status);
          setTopMaids([]);
        }
      } catch (error) {
        console.error('Error loading top maids:', error);
        setTopMaids([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

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
  const filteredTopMaids = topMaids.filter((maid) => {
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

    // Get selected maid details from filtered maids
    const selectedMaidDetails = filteredTopMaids.filter(maid => selectedMaids.includes(maid.id));

    // Generate WhatsApp message
    let message = `Hi! I'm interested in the following top recommended helpers:\n\n`;

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
                  <RecommendIcon sx={{ color: brandColors.primary, fontSize: '1.5rem' }} />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Top Recommended Helpers
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
            ) : filteredTopMaids.length > 0 ? (
              <Fade in={!loading} timeout={300}>
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
                      <RecommendIcon sx={{
                        fontSize: '3rem',
                        color: brandColors.primary,
                        opacity: 0.7
                      }} />
                    </div>

                    {/* Empty State Text */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                        No Top Helpers Available
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                        We don't have top recommended helpers available right now. Browse our catalogue to discover amazing helpers.
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
    </div>
  );
}
