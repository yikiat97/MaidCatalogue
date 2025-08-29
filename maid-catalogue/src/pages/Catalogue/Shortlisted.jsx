import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, Avatar, Chip, useTheme, useMediaQuery } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import maidPic from '../../assets/maidPic.jpg';
import API_CONFIG from '../../config/api.js';
import MaidCard from '../../components/Catalogue/MaidCard';
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

export default function Favorites() {
  const [favoriteMaids, setFavoriteMaids] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.PROFILE), {
          credentials: 'include',
        });

        if (res.ok) {
          const userData = await res.json();
          setIsAuthenticated(true);
          setUserId(userData.id);
          
          // Fetch user's favorites
          const favRes = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.CATALOGUE.USER_FAVORITES), {
            credentials: 'include',
          });
          
          if (favRes.ok) {
            const favoritesData = await favRes.json();
            setFavoriteMaids(favoritesData);
          }
        } else {
          setIsAuthenticated(false);
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setFavoriteMaids([]);
    // Redirect to login or home page
    window.location.href = '/login';
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
                My Shortlisted Maids
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: brandColors.textSecondary,
                  fontWeight: 500,
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                Your carefully selected domestic helpers
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Navigation Bar */}
          <Box sx={{ mb: 3 }}>
            <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
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
                Shortlisted Maids
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
                  {favoriteMaids.length} shortlisted
                </Typography>
              </Box>
            </Box>

            {/* Maid Cards Grid */}
            {favoriteMaids.length > 0 ? (
              <Grid container spacing={3} justifyContent="flex-start">
                {favoriteMaids.map((maid) => (
                  <Grid item xs={5} md={3} key={maid.id}>
                    <MaidCard 
                      userFavorites={favoriteMaids.map(m => m.id)} 
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
                  No shortlisted maids yet
                </Typography>
                <Typography variant="body1">
                  Start browsing our catalogue to find your perfect domestic helper
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
