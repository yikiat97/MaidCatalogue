import { useState ,useEffect} from 'react';
import { Container, Typography, Grid, Button, Collapse , Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import MaidCard from '../../components/Catalogue/MaidCard';
import FilterBar from '../../components/Catalogue/FilterBar';
import NavBar from '../../components/Catalogue/NavBar';
import LoginPromptModal from '../../components/Catalogue/LoginPromptModal';
import logoBlack from '../../assets/logoBlack.png';
import { useMaidContext } from '../../context/maidList';
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

export default function Catalogue() {
  const [maids, setMaids] = useState([]);
  const [salaryRange, setSalaryRange] = useState([400, 1000]);
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [skillsets, setSkillsets] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [types, setTypes] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  
  const { maidList, setMaidList } = useMaidContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Function to check authentication
    const checkAuth = async () => {
      try {
        const res = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.PROFILE), {
          credentials: 'include',
        });

        if (res.ok) {
          setIsAuthenticated(true);
          // Hide welcome modal when user is authenticated
          setShowWelcomeModal(false);
          // Clear the welcome modal flag when user logs in
          localStorage.removeItem('hasSeenWelcomeModal');

          fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.CATALOGUE.USER_FAVORITES), {
            credentials: 'include',
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error('Failed to fetch favorites');
              }
              return res.json();
            })
            .then((data) => {
              // Extract maid IDs from the response
              const favoriteIds = Array.isArray(data) ? data.map(maid => maid.id) : [];
              setUserFavorites(favoriteIds);
            })
            .catch((err) => {
              console.error(err);
              setUserFavorites([]);
            });
        } else {
          setIsAuthenticated(false);
          // Check if user has already seen the welcome modal
          const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeModal');
          if (!hasSeenWelcome) {
            setShowWelcomeModal(true);
          }
        }
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
        // Check if user has already seen the welcome modal
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeModal');
        if (!hasSeenWelcome) {
          setShowWelcomeModal(true);
        }
      }
    };

    // Function to get all maids with pagination and caching
    const fetchMaids = async (page = 1, append = false) => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '20', // Show 20 maids per page for better performance
        });

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
        console.error('Error fetching maids:', err);
      }
    };

    // Call both functions independently
    checkAuth();
    fetchMaids();
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
    setUserFavorites([]);
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

  // Function to reset welcome modal for testing
  const resetWelcomeModal = () => {
    localStorage.removeItem('hasSeenWelcomeModal');
    setShowWelcomeModal(true);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${brandColors.background} 0%, ${brandColors.surface} 100%)`,
      pb: 4
    }}>
      <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 3 } }}>
        {/* Main Content */}
        <Box sx={{ 
          display: { xs: 'block', lg: 'flex' },
          gap: { xs: 3, lg: 4 },
          alignItems: 'flex-start',
          mt: { xs: 9, md: 10 }
        }}>
          {/* Sidebar with Filters */}
          <Box sx={{ 
            flexShrink: 0, 
            width: { xs: '100%', lg: 320 },
            mb: { xs: 3, lg: 0 },
            mt: { xs: '20px', lg: '20px'},
          }}>
            <Paper sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(12, 25, 27, 0.12)',
              border: `1px solid ${brandColors.border}`,
              background: brandColors.surface
            }}>
              <Box sx={{ 
                p: 3,
                background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryLight} 100%)`,
                color: 'white'
                
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Refine Search
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {filteredMaids.length} maids found
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <FilterBar 
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
              </Box>
            </Paper>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ flexGrow: 1 }}>
            {/* Navigation Bar */}
            <Box sx={{ mb: 3 }}>
              <NavBar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
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
                  Available Maids
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2
                }}>
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
                      {filteredMaids.length} results
                    </Typography>
                  </Box>
                  
                  {!isAuthenticated && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={resetWelcomeModal}
                      sx={{
                        fontSize: '0.7rem',
                        py: 0.5,
                        px: 1,
                        minWidth: 'auto',
                        color: brandColors.warning,
                        borderColor: brandColors.warning,
                        '&:hover': {
                          backgroundColor: brandColors.warning,
                          color: 'white',
                        }
                      }}
                    >
                      Reset Welcome
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Maid Cards Grid */}
              {filteredMaids.length > 0 ? (
                <Grid container spacing={4} justifyContent="center">
                  {filteredMaids.map((maid) => (
                    <Grid 
                      item 
                      xs={6}
                      md={4} 
                      key={maid.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start'
                      }}
                    >
                      <MaidCard 
                        userFavorites={userFavorites} 
                        maid={maid} 
                        isAuthenticated={isAuthenticated} 
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
                    No maids found
                  </Typography>
                  <Typography variant="body1">
                    Try adjusting your filters to see more results
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
      
      {/* Welcome Modal for Unauthenticated Users */}
      <LoginPromptModal
        open={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />
    </Box>
  );
}


