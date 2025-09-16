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

    // Get selected maid details
    const selectedMaidDetails = topMaids.filter(maid => selectedMaids.includes(maid.id));

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
                        Top Recommended Helpers
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{
                      color: brandColors.textSecondary,
                      fontSize: '1rem',
                      ml: { xs: 0, md: 5 }
                    }}>
                      Our most popular and highly rated helpers
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
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="w-full">
                        <MaidCardSkeleton />
                      </div>
                    ))}
                  </div>
                ) : topMaids.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
                    {topMaids.map((maid) => (
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
                          No Top Helpers Available
                        </Typography>
                        <Typography variant="body1" sx={{
                          color: brandColors.textSecondary,
                          mb: 4,
                          maxWidth: 450,
                          lineHeight: 1.6
                        }}>
                          We don't have top recommended helpers available right now. Browse our catalogue to discover amazing helpers or contact us for assistance.
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

    </>
  );
}
