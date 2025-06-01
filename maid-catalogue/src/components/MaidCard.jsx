import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, Typography, Button, CardMedia,Stack,Box, Chip } from '@mui/material';
import maidPic from '../assets/maidPic.jpg';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIconFull from '@mui/icons-material/Favorite';
// import maidPic from '../assets/logoBlack.png';

import KitchenIcon from '@mui/icons-material/Kitchen'; // Cooking
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'; // Housekeeping
import ChildCareIcon from '@mui/icons-material/ChildCare'; // Childcare
import CribIcon from '@mui/icons-material/Crib'; // Babysitting
import ElderlyIcon from '@mui/icons-material/Elderly'; // Elderly Care
import PetsIcon from '@mui/icons-material/Pets'; // Dog(s), Cat(s)
import FavoriteIcon from '@mui/icons-material/Favorite'; // Caregiving
import Tooltip from '@mui/material/Tooltip';

export default function MaidCard({ maid , isShortlisted}) {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => {
  setIsFavorited((prev) => !prev);
  console.log(`Maid ${maid.id} favorite toggled!`);
    };

  const handleView = () => {
    navigate(`/maid/${maid.id}`);
  };

  const skillIcons = {
    Cooking: KitchenIcon,
    Housekeeping: CleaningServicesIcon,
    Childcare: ChildCareIcon,
    Babysitting: CribIcon,
    'Elderly Care': ElderlyIcon,
    'Dog(s)': PetsIcon,
    'Cat(s)': PetsIcon,
    Caregiving: FavoriteIcon,
    };

  return (
    <Card  
        sx={{
        width: '100%',
        height: 460,
        borderRadius: '13px', 
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
        transform: 'translateY(-4px)', // move up 4px
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // shadow on hover
        cursor: 'pointer', // pointer cursor on hover
        },
    }} >
        <CardMedia
        component="img"
        height="200"
        image={maid.photoUrl || maidPic}
        alt={maid.name}
        sx={{
            width: {
            xs: '163px',     // full width for extra small (mobile)
            sm: '150px',    //  150px width for small screens
            md: '300px',   //   200px width for medium and up
            },
            objectFit: 'cover',
        }}
        onClick={handleView}
        />
      <Box sx={{
            paddingTop: 2,
            paddingLeft: 2,
            paddingRight: 2,
            }}
            onClick={handleView}>

            <Box style={{ width: 131, height:52}}>
                <Typography variant="body2" style={{fontSize:'18px'}}>{maid.name}</Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
            {maid.type.map((t, idx) => {
                let displayLabel;
                if (t === "Transfer" || t === "New/Fresh") {
                displayLabel = t;
                } else {
                displayLabel = "Experienced";
                }

                return (
                <Chip
                    key={idx}
                    label={displayLabel}
                    variant="outlined"
                    size="small"
                    sx={{
                    backgroundColor: 'rgb(212, 180, 22)',
                    color: 'white',
                    borderColor: 'rgb(212, 180, 22)',
                    fontSize: '0.65rem',
                    height: '20px',
                    }}
                />
                );
            })}
            </Stack>

        <Typography variant="body2" color="text.secondary">
          Skill Set:
        </Typography>
        <Stack direction="row" sx={{ mb: 1, flexWrap: 'wrap', gap:1,
        width: {
            xs: '128px',    // full width for extra small (mobile)
            sm: '150px',   // 150px width for small screens
            md: '250px',   // 200px width for medium and up
            },
        height:52 }}>
        {maid.skills.map((skill, idx) => {
            const IconComponent = skillIcons[skill];
            if (!IconComponent) return null; // skip if no icon for skill

            return (
            <Tooltip title={skill} key={idx}>
                <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgb(212, 180, 22)',
                    color: 'white',
                    borderRadius: '50%',
                    width: 26,
                    height: 26,
                }}
                >
                <IconComponent fontSize="small" />
                </Box>
            </Tooltip>
            );
        })}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Country: {maid.country}
        </Typography>
          <Typography
            color="success.main"
            sx={{ fontWeight: 'bold' , color:'rgb(120, 101, 6)', mt:1}}
          >
            ${maid.salary}
          </Typography>
        </Box>
        <Box display="flex"  alignItems="center" justifyContent={{ xs: 'center', md: 'center' }}>
              {/* WhatsApp button */}
            <WhatsAppIcon                 
                sx={{cursor: 'pointer',fontSize: 30}}
                variant="contained"
                color="success"
                onClick={() => {
                  const message = `Hi, I'm interested in maid ID ${maid.id}.`;
                  window.open(`https://wa.me/88270086?text=${encodeURIComponent(message)}`, '_blank');
                }}
            >
                WhatsApp
            </WhatsAppIcon>

              {/* Favorite (heart) icon */}
                {isFavorited ? (
                <FavoriteIcon
                    sx={{
                    cursor: 'pointer',
                    fontSize: 30,
                    color: 'error.main',
                    }}
                    onClick={toggleFavorite}
                />
                ) : (
                <FavoriteBorderIcon
                    sx={{
                    cursor: 'pointer',
                    fontSize: 30,
                    color: 'error.main',
                    '&:hover': { color: 'error.dark' },
                    }}
                    onClick={toggleFavorite}
                />
                )}
          </Box>
    </Card>
  );
  
}




