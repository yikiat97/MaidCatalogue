import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CardMedia,
  Stack,
  Box, 
  Chip,
  IconButton,
  Divider,
  Avatar
} from '@mui/material';
import maidPic from '../assets/maidPic.jpg';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import InfoIcon from '@mui/icons-material/Info';

// Skill icons
import KitchenIcon from '@mui/icons-material/Kitchen';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CribIcon from '@mui/icons-material/Crib';
import ElderlyIcon from '@mui/icons-material/Elderly';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Tooltip from '@mui/material/Tooltip';

export default function MaidCard({ userFavorites, maid, isAuthenticated }) {
  console.log(maid)
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(
    userFavorites.includes(maid.id)
  );

  useEffect(() => {
    setIsFavorited(userFavorites.includes(maid.id));
  }, [userFavorites, maid.id]);

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }

    const maidId = maid.id;

    if (isFavorited) {
      fetch(`http://localhost:3000/api/user/RemoveFavorites/${maidId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to remove favorite');
          return res.json();
        })
        .then((data) => {
          console.log('Maid removed from favorites:', data);
          setIsFavorited(false);
        })
        .catch((err) => console.error(err));
    } else {
      fetch('http://localhost:3000/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maidId }),
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to add favorite');
          return res.json();
        })
        .then((data) => {
          console.log('Maid added to favorites:', data);
          setIsFavorited(true);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleView = () => {
    navigate(`/maid/${maid.id}`);
  };

  const displayLabel = maid.type.includes("Transfer")
    ? "Transfer"
    : maid.type.includes("New/Fresh")
    ? "New/Fresh"
    : "Experienced";

  const getChipColor = (type) => {
    switch(type) {
      case "Transfer": return { bg: '#FF6B6B', text: '#FFFFFF' };
      case "New/Fresh": return { bg: '#4ECDC4', text: '#FFFFFF' };
      case "Experienced": return { bg: '#45B7D1', text: '#FFFFFF' };
      default: return { bg: '#95A5A6', text: '#FFFFFF' };
    }
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

  const chipColor = getChipColor(displayLabel);

  return (
    <Card  
      sx={{
        width: 320,
        maxWidth: 170,
        height: 450,
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        background: '#FFFFFF',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      {/* Image Container with Overlay */}
      <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
        <CardMedia
          component="img"
          image={maid.imageUrl ? `http://localhost:3000${maid.imageUrl}` : maidPic}
          alt={maid.name}
          sx={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            filter: isAuthenticated ? 'none' : 'blur(12px)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
          onClick={handleView}
        />
        
        {/* Overlay gradient */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
        
        {/* Status Badge */}
        <Chip
          label={displayLabel}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: chipColor.bg,
            color: chipColor.text,
            fontWeight: 600,
            fontSize: '0.7rem',
            height: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
        
        {/* Favorite Button */}
        <IconButton
          onClick={toggleFavorite}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            padding: '6px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {isFavorited ? (
            <FavoriteIcon sx={{ color: '#E74C3C', fontSize: 20 }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: '#E74C3C', fontSize: 20 }} />
          )}
        </IconButton>
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2, pb: 1.5 }}>
        {/* Name and ID */}
        <Box sx={{ mb: 1.5 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              fontSize: '1rem',
              color: '#2C3E50',
              mb: 0.25,
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              '&:hover': { color: '#3498DB' }
            }}
            onClick={handleView}
          >
            {maid.name}
          </Typography>
          <Typography variant="caption" sx={{ color: '#7F8C8D', fontSize: '0.75rem' }}>
            ID: {maid.id}
          </Typography>
        </Box>

        {/* Location and Experience */}
        <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 14, color: '#E74C3C' }} />
            <Typography variant="body2" sx={{ color: '#34495E', fontSize: '0.8rem' }}>
              {maid.country}
            </Typography>
          </Box>
          {/* {maid.experience && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <WorkIcon sx={{ fontSize: 14, color: '#3498DB' }} />
              <Typography variant="body2" sx={{ color: '#34495E', fontSize: '0.8rem' }}>
                {maid.experience} years
              </Typography>
            </Box>
          )} */}
        </Stack>

        {/* Skills Section */}
        <Box sx={{ mb: 1.5 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#7F8C8D', 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontSize: '0.65rem',
              mb: 0.75,
              display: 'block'
            }}
          >
            Skills
          </Typography>
          <Stack 
            direction="row" 
            sx={{ 
              flexWrap: 'wrap', 
              gap: 0.5,
              minHeight: 28,
            }}
          >
            {maid.skills.slice(0, 5).map((skill, idx) => {
              const IconComponent = skillIcons[skill];
              if (!IconComponent) return null;

              return (
                <Tooltip title={skill} key={idx} arrow>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#ECF0F1',
                      color: '#34495E',
                      borderRadius: '6px',
                      width: 28,
                      height: 28,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#3498DB',
                        color: '#FFFFFF',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <IconComponent sx={{ fontSize: 16 }} />
                  </Box>
                </Tooltip>
              );
            })}
            {maid.skills.length > 5 && (
              <Tooltip title={`+${maid.skills.length - 5} more skills`} arrow>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#BDC3C7',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    width: 28,
                    height: 28,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}
                >
                  +{maid.skills.length - 5}
                </Box>
              </Tooltip>
            )}
          </Stack>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Salary */}
          <Box>
            <Typography variant="caption" sx={{ color: '#7F8C8D', fontSize: '0.65rem' }}>
              Monthly Salary
            </Typography>
            <Typography
              variant="h6"
              sx={{ 
                fontWeight: 700,
                color: '#27AE60',
                fontSize: '1.1rem',
                lineHeight: 1.2,
              }}
            >
              ${maid.salary}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="View Details" arrow>
              <IconButton
                onClick={handleView}
                size="small"
                sx={{
                  backgroundColor: '#ECF0F1',
                  color: '#34495E',
                  '&:hover': {
                    backgroundColor: '#3498DB',
                    color: '#FFFFFF',
                  },
                }}
              >
                <InfoIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Contact via WhatsApp" arrow>
              <IconButton
                onClick={() => {
                  const message = `Hi, I'm interested in maid ID ${maid.id}.`;
                  window.open(`https://wa.me/88270086?text=${encodeURIComponent(message)}`, '_blank');
                }}
                size="small"
                sx={{
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#128C7E',
                  },
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}