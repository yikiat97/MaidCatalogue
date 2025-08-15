
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import RecommendIcon from '@mui/icons-material/Recommend';
import logoBlack from '../../assets/logoBlack.png';
import API_CONFIG from '../../config/api.js';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

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

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  backgroundColor: brandColors.surface,
  borderBottom: `1px solid ${brandColors.border}`,
  boxShadow: '0 2px 8px rgba(12, 25, 27, 0.1)',
  padding: '0 24px',
  minHeight: '70px',
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  color: active ? brandColors.primary : brandColors.text,
  backgroundColor: active ? alpha(brandColors.primary, 0.1) : 'transparent',
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '0.95rem',
  padding: '10px 20px',
  margin: '0 4px',
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: active ? `2px solid ${brandColors.primary}` : '2px solid transparent',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: alpha(brandColors.primary, 0.08),
    color: brandColors.primary,
    transform: 'translateY(-1px)',
    boxShadow: `0 2px 8px ${alpha(brandColors.primary, 0.2)}`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${alpha(brandColors.primary, 0.1)}, transparent)`,
    transition: 'left 0.5s',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

const AuthButton = styled(Button)(({ variant }) => ({
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '0.95rem',
  padding: variant === 'contained' ? '10px 20px' : '8px 16px',
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  ...(variant === 'contained' ? {
    background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryLight} 100%)`,
    color: 'white',
    boxShadow: `0 2px 8px ${alpha(brandColors.primary, 0.3)}`,
    '&:hover': {
      background: `linear-gradient(135deg, ${brandColors.primaryDark} 0%, ${brandColors.primary} 100%)`,
      boxShadow: `0 4px 12px ${alpha(brandColors.primary, 0.4)}`,
      transform: 'translateY(-1px)',
    }
  } : {
    color: brandColors.text,
    border: `2px solid ${brandColors.border}`,
    '&:hover': {
      backgroundColor: alpha(brandColors.primary, 0.08),
      borderColor: brandColors.primary,
      color: brandColors.primary,
      transform: 'translateY(-1px)',
    }
  })
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  '& img': {
    height: '40px',
    filter: 'drop-shadow(0 1px 4px rgba(255, 145, 77, 0.2))',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      filter: 'drop-shadow(0 2px 8px rgba(255, 145, 77, 0.3))',
    }
  }
});

const NavIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '18px',
  height: '18px',
  marginRight: '8px',
  transition: 'all 0.3s ease',
});

export default function NavBar({ isAuthenticated, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

  const handleLogout = async () => {
    try {
      const res = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.LOGOUT), {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        // Call the parent's logout handler if provided
        if (onLogout) {
          onLogout();
        } else {
          // Fallback: redirect to login
          navigate('/login');
        }
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { path: '/catalogue', label: 'Search', icon: <SearchIcon /> },
    { path: '/shortlisted', label: 'Shortlisted', icon: <FavoriteIcon /> },
    { path: '/', label: 'Pricing', icon: <HomeIcon /> },
    { path: '/Recommend', label: 'Recommendation', icon: <RecommendIcon /> },
  ];

return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: '0 2px 8px rgba(12, 25, 27, 0.1)',
        bgcolor: brandColors.surface,
        borderBottom: `1px solid ${brandColors.border}`,
        zIndex: 1200,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
        <StyledToolbar variant="dense" disableGutters>
          {/* Logo Section */}
          <LogoContainer>
            <img 
              src={logoBlack} 
              alt="MaidCatalogue Logo" 
              onClick={() => navigate('/catalogue')}
              style={{ cursor: 'pointer' }}
            />
          </LogoContainer>

          {/* Desktop Navigation */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center',
            gap: 1,
            mx: 4
          }}>
            {navItems.map((item) => (
              <NavButton
                key={item.path}
                onClick={() => navigate(item.path)}
                active={isActive(item.path)}
                startIcon={
                  <NavIcon>
                    {React.cloneElement(item.icon, {
                      sx: { 
                        fontSize: '16px',
                        color: isActive(item.path) ? brandColors.primary : brandColors.textSecondary
                      }
                    })}
                  </NavIcon>
                }
              >
                {item.label}
              </NavButton>
            ))}
          </Box>

          {/* Desktop Auth Section */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center',
            gap: 2
          }}>
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => navigate('/profile')}
                  sx={{
                    color: brandColors.primary,
                    backgroundColor: alpha(brandColors.primary, 0.1),
                    width: 40,
                    height: 40,
                    border: `1px solid ${alpha(brandColors.primary, 0.2)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: alpha(brandColors.primary, 0.2),
                      transform: 'scale(1.05)',
                      boxShadow: `0 2px 8px ${alpha(brandColors.primary, 0.2)}`,
                    }
                  }}
                >
                  <AccountCircleRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <AuthButton 
                  variant="outlined" 
                  onClick={handleLogout}
                  sx={{
                    color: brandColors.error,
                    borderColor: brandColors.error,
                    '&:hover': {
                      backgroundColor: brandColors.error,
                      color: 'white',
                      borderColor: brandColors.error,
                    }
                  }}
                >
                  Sign out
                </AuthButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AuthButton variant="text" href='/login'>
                  Sign in
                </AuthButton>
                <AuthButton variant="contained" href='/signup'>
                  Sign up
                </AuthButton>
              </Box>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            {isAuthenticated && (
              <IconButton
                onClick={() => navigate('/profile')}
                sx={{
                  color: brandColors.primary,
                  backgroundColor: alpha(brandColors.primary, 0.1),
                  width: 40,
                  height: 40,
                  border: `1px solid ${alpha(brandColors.primary, 0.2)}`,
                  '&:hover': {
                    backgroundColor: alpha(brandColors.primary, 0.2),
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <AccountCircleRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            )}
            <IconButton 
              onClick={toggleDrawer(true)}
              sx={{
                color: brandColors.text,
                backgroundColor: alpha(brandColors.text, 0.05),
                width: 40,
                height: 40,
                border: `1px solid ${alpha(brandColors.border, 0.3)}`,
                '&:hover': {
                  backgroundColor: alpha(brandColors.primary, 0.1),
                  color: brandColors.primary,
                  borderColor: brandColors.primary,
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Mobile Drawer */}
          <Drawer
            anchor="top"
            open={open}
            onClose={toggleDrawer(false)}
            PaperProps={{
              sx: {
                top: '70px', // Fixed navbar height
                background: brandColors.surface,
                borderBottom: `1px solid ${brandColors.border}`,
                boxShadow: '0 4px 16px rgba(12, 25, 27, 0.15)',
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              {/* Close Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <IconButton 
                  onClick={toggleDrawer(false)}
                  sx={{
                    color: brandColors.text,
                    backgroundColor: alpha(brandColors.text, 0.05),
                    border: `1px solid ${alpha(brandColors.border, 0.3)}`,
                    '&:hover': {
                      backgroundColor: alpha(brandColors.primary, 0.1),
                      color: brandColors.primary,
                      borderColor: brandColors.primary,
                    }
                  }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </Box>

              {/* Mobile Navigation Items */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      toggleDrawer(false)();
                    }}
                    startIcon={
                      <NavIcon>
                        {React.cloneElement(item.icon, {
                          sx: { 
                            fontSize: '18px',
                            color: isActive(item.path) ? brandColors.primary : brandColors.textSecondary
                          }
                        })}
                      </NavIcon>
                    }
                    sx={{
                      justifyContent: 'flex-start',
                      color: isActive(item.path) ? brandColors.primary : brandColors.text,
                      backgroundColor: isActive(item.path) ? alpha(brandColors.primary, 0.1) : 'transparent',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      py: 2,
                      px: 3,
                      textTransform: 'none',
                      border: isActive(item.path) ? `2px solid ${brandColors.primary}` : '2px solid transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: alpha(brandColors.primary, 0.08),
                        color: brandColors.primary,
                        transform: 'translateX(4px)',
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              <Divider sx={{ my: 3, borderColor: alpha(brandColors.border, 0.5) }} />

              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <AuthButton 
                    variant="outlined" 
                    fullWidth
                    onClick={() => {
                      handleLogout();
                      toggleDrawer(false)();
                    }}
                    sx={{
                      color: brandColors.error,
                      borderColor: brandColors.error,
                      '&:hover': {
                        backgroundColor: brandColors.error,
                        color: 'white',
                        borderColor: brandColors.error,
                      }
                    }}
                  >
                    Sign Out
                  </AuthButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <AuthButton 
                    variant="outlined" 
                    fullWidth 
                    href='/login'
                  >
                    Sign in
                  </AuthButton>
                  <AuthButton 
                    variant="contained" 
                    fullWidth 
                    href='/signup'
                  >
                    Sign Up
                  </AuthButton>
                </Box>
              )}
            </Box>
          </Drawer>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}

