
import React, { useState } from 'react';
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
import logoBlack from '../assets/logoBlack.png';


const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function NavBar({isAuthenticated}) {
    const [open, setOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleLogout =  () => {

      try {
        const res = fetch('http://localhost:3000/api/auth/logout', {
          method : 'POST',
          credentials: 'include', // Send cookies
        });
console.log(res)
        if (res.ok) {
          window.location.href = '/login';
        } 
      } catch (err) {
        console.error(err);
        alert("error")
        // window.location.href = '/login';
      }
    
    
    };

return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
        width: { xs: '100%', md: '80%' },
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense"   
        sx={{
            minHeight: 70, // Make the navbar taller (default is 64)
            left:0,
            px: 2, // Horizontal padding
            }} disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <img src={logoBlack} alt="Sitemark Logo" style={{ height: 40, marginRight: 8 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
                variant="text"
                size="small"
                onClick={() => navigate('/')}
                sx={{
                color: '#151515cc',
                borderBottom: isActive('/') ? '2px solid rgb(212, 180, 22)' : 'none',
                borderRadius: 0,
                }}
            >
                Search
            </Button>
            <Button
                variant="text"
                size="small"
                onClick={() => navigate('/shortlisted')}
                sx={{
                color: '#151515cc',
                borderBottom: isActive('/shortlisted') ? '2px solid rgb(212, 180, 22)' : 'none',
                borderRadius: 0,
                }}
            >
                Shortlisted
            </Button>
            <Button
                variant="text"
                size="small"
                onClick={() => navigate('/pricing')}
                sx={{
                color: '#151515cc',
                borderBottom: isActive('/pricing') ? '2px solid rgb(212, 180, 22)' : 'none',
                borderRadius: 0,
                }}
            >
                Pricing
            </Button>
            <Button
                variant="text"
                size="small"
                onClick={() => navigate('/recommendation')}
                sx={{
                color: '#151515cc',
                borderBottom: isActive('/recommendation') ? '2px solid rgb(212, 180, 22)' : 'none',
                borderRadius: 0,
                }}
            >
                Recommendation
            </Button>
            </Box>

          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
          {isAuthenticated
            ?     
            <div>  
            <AccountCircleRoundedIcon style={{ color: "#151515cc", width:40 }} onClick={() => navigate('/profile')}/>      
            <Button color="primary" variant="contained" size="small" onClick={handleLogout}>
              Sign out
            </Button>
</div>
            :
            <div>
            <Button color="primary" variant="text" size="small" href='/login'>
              Sign in
            </Button>
            <Button color="primary" variant="contained" size="small" href='/signup'>
              Sign up
            </Button>
            </div>
            }
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <AccountCircleRoundedIcon size="medium" style={{ color: "#151515cc", marginTop: 9}} onClick={() => navigate('/profile')} />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem                 
                    onClick={() => navigate('/')}
                    sx={{
                    color: isActive('/') ? 'rgb(212, 180, 22)' : '#151515cc',
                    borderRadius: 0,
                    }}>Search
                </MenuItem>
                <MenuItem
                    onClick={() => navigate('/shortlisted')}
                    sx={{
                    color: isActive('/shortlisted') ? 'rgb(212, 180, 22)' : '#151515cc',
                    borderRadius: 0,
                    }}>Shortlisted
                </MenuItem>
                <MenuItem>Pricing</MenuItem>
                <MenuItem>Recomendation</MenuItem>
                <Divider sx={{ my: 3 }} />

                {isAuthenticated
                ?                 
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth>
                    Sign Out
                  </Button>
                </MenuItem>
                :                
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth href='/login'>
                    Sign in
                  </Button>
                  <Button color="primary" variant="outlined" fullWidth href='/signup'>
                    Sign Up
                  </Button>
                </MenuItem>
                }
 
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}

