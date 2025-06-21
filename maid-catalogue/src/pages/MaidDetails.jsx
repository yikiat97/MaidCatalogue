import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container, Typography, Button, Box,Stack, Chip } from '@mui/material';
import maidPic from '../assets/maidPic.jpg';
import NavBar from '../components/NavBar';
import logoBlack from '../assets/logoBlack.png';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useMaidContext } from '../context/maidList';




export default function MaidDetails() {
  const { maidList } = useMaidContext(); // ✅ the correct value
  console.log(maidList)
  const { id } = useParams();
  const maid = maidList.find((m) => m.id === parseInt(id));
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://18.140.119.246:3000/api/auth/profile', {
          credentials: 'include', // Send cookies
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (!maid) return <Typography>Maid not found</Typography>;

  

  return (
    <div>
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: '100%', md: 250 },
          mr: { md: 2 },
        }}
      >
        {/* Logo on top of filter bar */}
        <Box sx={{ textAlign: 'center', p: 0, mt:{ xs: '20%', md:0} }}>
          <img src={logoBlack} alt="Logo" style={{ width: '100%', maxWidth: '200px' }} />
        </Box>
    
      </Box>

      <NavBar  isAuthenticated={isAuthenticated}></NavBar>

    <Container sx={{ mt: 4 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
        <Box>
          <img
            src={`http://18.140.119.246:3000${maid.imageUrl}` || maidPic}
            alt={maid.name}
            style={{ width: '340px', height:'430px',borderRadius: 8 }}
            sx={{objectFit: 'cover',
            filter: isAuthenticated ? 'none' : 'blur(10px)',
            transition: 'filter 0.3s ease'}}
          />

          <Box display="flex" gap={2} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} mt={2}>
              {/* WhatsApp button */}
              <Button
                variant="contained"
                color="success"
                startIcon={<WhatsAppIcon />}
                onClick={() => {
                  const message = `Hi, I'm interested in maid ID ${maid.id}.`;
                  window.open(`https://wa.me/88270086?text=${encodeURIComponent(message)}`, '_blank');
                }}
              >
                WhatsApp
              </Button>

              {/* Favorite (heart) icon */}
              <FavoriteBorderIcon
                sx={{
                  cursor: 'pointer',
                  fontSize: 30,
                  color: 'error.main',
                  '&:hover': { color: 'error.dark' },
                }}
                onClick={() => {
                  // Save to favorites logic here
                  console.log(`Maid ${maid.id} added to favorites!`);
                }}
              />
          </Box>
        </Box>
        
        <Box sx={{ ml:{xs:0, md:5}  }}>
          <Typography variant="h4" gutterBottom>
            {maid.name}, {maid.age}
            <Typography>From - {maid.country}</Typography>
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
          {maid.type.map((s, idx) => (
            <Button
              key={idx}
              variant="outlined"
              size="small"
              sx={{
                textTransform: 'none',  // Keep normal text case
                cursor: 'default',      // Show default cursor
                pointerEvents: 'none',  // Fully disable pointer events
                color: 'rgb(106, 90, 11)',                       // text color
                borderColor: 'rgb(150, 130, 32)',     // border color
            
              }}
            >
              {s}
            </Button>
          ))}
        </Stack>
          
          <Typography sx={{ mt: 4 }}>Expected Salary:</Typography>
          <Typography
            variant="h6"
            color="success.main"
            sx={{ fontWeight: 'bold' , color:'rgb(120, 101, 6)'}}
          >
            ${maid.salary}
          </Typography>
          <Typography sx={{ mt: 4 }}>Skill Set:</Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
            {maid.skills.map((t, idx) => (
              <Chip
                key={idx}
                label={t}
                variant="outlined"
                size="small"
                sx={{
                backgroundColor:'rgb(212, 180, 22)',
                color: 'white',                       // text color
                borderColor: 'rgb(212, 180, 22)',     // border color
            
              }}
              />
            ))}
          </Stack>
          <Typography sx={{ mt: 6 }}>Description:</Typography>
          <Typography >More detailed info about this maid can go here More detailed info about this maid can go here More detailed info about this maid can go here More detailed info about this maid can go here
            More detailed info about this maid can go here More detailed info about this maid can go here More detailed info about this maid can go here More detailed info about this maid can go here
            More detailed info about this maid can go here More detailed info about this maid can go here More detailed info about this maid can go here More detailed info about this maid can go here
            More detailed info about this maid can go here More detailed info about this maid can go here More detailed info about this maid can go here More detailed info about this maid can go here
            More detailed info about this maid can go here More detailed info about this maid can go here More detailed info about this maid can go here More detailed info about this maid can go here
          </Typography>
        </Box>
      </Box>
      {/* Bottom two-section layout */}
<Box
  display="flex"
  flexDirection={{ xs: 'column', md: 'row' }}
  gap={4}
  mt={4}
>
  {/* Left side: Language proficiency and resume */}
  <Box flex={1}>
    <Typography variant="h6" gutterBottom>
      Language Proficiency
    </Typography>
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 2 }}>
      {maid.languages.map((lang, idx) => (
        <Chip
          key={idx}
          label={lang}
          color="primary"
          variant="outlined"
          size="small"
        />
      ))}
    </Stack>

    <Typography variant="h6" gutterBottom>
      Resume
    </Typography>
    <Typography>
      {/* You can replace this with a link or download button if needed */}
      Resume details or link to download the resume.
    </Typography>
  </Box>

  {/* Right side: Personal details */}
  <Box flex={1}>
    <Typography variant="h6" gutterBottom>
      Personal Details
    </Typography>
    <Typography>Height/Weight: 160cm / 50kg</Typography>
    <Typography>Preference for Rest Day: 2 days/month</Typography>
    <Typography>Marital Status: Single</Typography>
    <Typography>Highest Education: Secondary School</Typography>
    <Typography>Religion: Christianity</Typography>
  </Box>
</Box>
    </Container>
    </div>
  );
}
