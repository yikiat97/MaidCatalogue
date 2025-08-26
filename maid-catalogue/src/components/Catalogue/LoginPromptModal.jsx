import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';

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

export default function LoginPromptModal({ open, onClose }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    // Mark that user has seen the welcome modal
    localStorage.setItem('hasSeenWelcomeModal', 'true');
    onClose();
  };

  const handleLogin = () => {
    // Mark that user has seen the welcome modal
    localStorage.setItem('hasSeenWelcomeModal', 'true');
    onClose();
    navigate('/login');
  };

  const handleSignup = () => {
    // Mark that user has seen the welcome modal
    localStorage.setItem('hasSeenWelcomeModal', 'true');
    onClose();
    navigate('/signup');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          background: `linear-gradient(135deg, ${brandColors.surface} 0%, ${brandColors.background} 100%)`,
          border: `2px solid ${brandColors.border}`,
          boxShadow: '0 20px 60px rgba(12, 25, 27, 0.3)',
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        p: 3, 
        pb: 1,
        textAlign: 'center',
        position: 'relative'
      }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: brandColors.textSecondary,
            '&:hover': {
              backgroundColor: brandColors.border,
              color: brandColors.text
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2
        }}>
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryLight} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(255, 145, 77, 0.3)',
            mb: 1
          }}>
            <LockIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            color: brandColors.text,
            textAlign: 'center',
            fontSize: isMobile ? '1.5rem' : '2rem'
          }}>
            Welcome to Maid Catalogue
          </Typography>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 3, pt: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          {/* <Typography variant="body1" sx={{ 
            color: brandColors.textSecondary,
            fontSize: isMobile ? '0.9rem' : '1rem',
            lineHeight: 1.6,
            mb: 2
          }}>
            To view clear, unblurred maid photos and access full profiles, 
            please create an account or sign in to your existing account.
          </Typography> */}
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 2,
            mt: 3
          }}>
            <Box sx={{
              p: 2,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${brandColors.primary}10 0%, ${brandColors.primaryLight}10 100%)`,
              border: `1px solid ${brandColors.primary}30`,
              textAlign: 'left'
            }}>
              <Typography variant="subtitle1" sx={{ 
                fontWeight: 600, 
                color: brandColors.primary,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <PersonAddIcon fontSize="small" />
                New Users / Existing Users
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
              Please login/sign up to see our helper's information,  browse maid profiles and save to your favorites.
              </Typography>
            </Box>
            
            {/* <Box sx={{
              p: 2,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${brandColors.secondary}10 0%, ${brandColors.secondaryLight}10 100%)`,
              border: `1px solid ${brandColors.secondary}30`,
              textAlign: 'left'
            }}>
              <Typography variant="subtitle1" sx={{ 
                fontWeight: 600, 
                color: brandColors.secondary,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <LoginIcon fontSize="small" />
                Existing Users
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                Sign in to access your saved favorites and continue browsing with full access.
              </Typography>
            </Box> */}
          </Box>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ 
        p: 3, 
        pt: 1,
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2
      }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          fullWidth={isMobile}
          sx={{
            borderColor: brandColors.border,
            color: brandColors.textSecondary,
            '&:hover': {
              borderColor: brandColors.text,
              backgroundColor: brandColors.background
            }
          }}
        >
          Continue Browsing
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSignup}
          fullWidth={isMobile}
          startIcon={<PersonAddIcon />}
          sx={{
            background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryLight} 100%)`,
            color: 'white',
            fontWeight: 600,
            '&:hover': {
              background: `linear-gradient(135deg, ${brandColors.primaryDark} 0%, ${brandColors.primary} 100%)`,
              transform: 'translateY(-1px)',
              boxShadow: '0 8px 25px rgba(255, 145, 77, 0.4)'
            }
          }}
        >
          Create Account
        </Button>
        
        <Button
          variant="contained"
          onClick={handleLogin}
          fullWidth={isMobile}
          startIcon={<LoginIcon />}
          sx={{
            background: `linear-gradient(135deg, ${brandColors.secondary} 0%, ${brandColors.secondaryLight} 100%)`,
            color: 'white',
            fontWeight: 600,
            '&:hover': {
              background: `linear-gradient(135deg, ${brandColors.secondaryDark} 0%, ${brandColors.secondary} 100%)`,
              transform: 'translateY(-1px)',
              boxShadow: '0 8px 25px rgba(12, 25, 27, 0.4)'
            }
          }}
        >
          Sign In
        </Button>
      </DialogActions>
    </Dialog>
  );
} 