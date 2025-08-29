import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Paper,
  Typography,
  Button as MuiButton
} from '@mui/material';
import {
  WorkOutline as WorkIcon
} from '@mui/icons-material';
import { Search, MapPin } from 'lucide-react';

const HelperSearchCard = ({ onShowPricing }) => {
  const [experience, setExperience] = useState('');
  const [nationality, setNationality] = useState('');
  const [experienceError, setExperienceError] = useState(false);
  const [nationalityError, setNationalityError] = useState(false);

  const experienceOptions = [
    { value: 'New Helper', label: 'New Helper' },
    { value: 'Experienced Helper', label: 'Experienced Helper' }
  ];

  const nationalityOptions = [
    { value: 'Philippines', label: 'Philippines' },
    { value: 'Indonesia', label: 'Indonesia' },
    { value: 'Myanmar', label: 'Myanmar' }
  ];

  // Auto-update pricing when both fields are selected
  useEffect(() => {
    if (nationality && experience && onShowPricing) {
      // Reset errors when both fields are filled
      setExperienceError(false);
      setNationalityError(false);
      onShowPricing(nationality, experience);
    }
  }, [nationality, experience, onShowPricing]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Paper 
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: { xs: 360, lg: 'none' },
          mx: 'auto',
          p: { xs: 2, lg: 4 },
          borderRadius: { xs: '20px', lg: '24px' },
          background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 105, 13, 0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: { xs: '3px', lg: '4px' },
            background: 'linear-gradient(90deg, #ff690d 0%, #ff914d 50%, #ffa366 100%)'
          }
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={{ xs: 1.5, lg: 3 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          >
            <Box 
              sx={{
                width: { xs: 32, lg: 56 },
                height: { xs: 32, lg: 56 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff690d 0%, #ff914d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: { xs: 1, lg: 2 },
                boxShadow: { xs: '0 3px 8px rgba(255, 105, 13, 0.2)', lg: '0 8px 16px rgba(255, 105, 13, 0.3)' }
              }}
            >
              <Search size={16} color="white" />
            </Box>
          </motion.div>
          
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            color="#0c191b"
            mb={{ xs: 0.25, lg: 1 }}
            sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.025em',
              fontSize: { xs: '1rem', lg: '1.5rem' }
            }}
          >
            Find Your Perfect Helper
          </Typography>
          
          <Typography 
            variant="body2" 
            color="#5a6c6f"
            sx={{ fontSize: { xs: '0.7rem', lg: '0.9rem' }, display: { xs: 'none', sm: 'block', lg: 'block' } }}
          >
            Choose your preferences to see instant pricing
          </Typography>
        </Box>

        {/* Form Fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, lg: 3 } }}>
          {/* Experience Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, lg: 2 } }}>
                <WorkIcon sx={{ color: experienceError ? '#d32f2f' : '#ff690d', fontSize: { xs: '1rem', lg: '1.2rem' }, mr: 0.5 }} />
                <Typography 
                  variant="body2" 
                  fontWeight={600}
                  color={experienceError ? '#d32f2f' : '#5a6c6f'}
                  sx={{ fontSize: { xs: '0.75rem', lg: '0.875rem' } }}
                >
                  Helper Experience *
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: { xs: 1, lg: 2 } }}>
                {experienceOptions.map((option) => (
                  <MuiButton
                    key={option.value}
                    onClick={() => {
                      setExperience(option.value);
                      if (experienceError) setExperienceError(false);
                    }}
                    variant={experience === option.value ? "contained" : "outlined"}
                    sx={{
                      flex: 1,
                      py: { xs: 1, lg: 1.5 },
                      borderRadius: '12px',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: { xs: '0.75rem', lg: '0.95rem' },
                      borderWidth: '2px',
                      ...(experience === option.value ? {
                        background: 'linear-gradient(135deg, #ff690d 0%, #ff914d 100%)',
                        color: 'white',
                        borderColor: '#ff690d',
                        boxShadow: '0 4px 12px rgba(255, 105, 13, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #e55a0a 0%, #ff690d 100%)',
                          borderColor: '#e55a0a'
                        }
                      } : {
                        color: experienceError ? '#d32f2f' : '#5a6c6f',
                        borderColor: experienceError ? '#d32f2f' : 'rgba(0,0,0,0.12)',
                        backgroundColor: 'white',
                        '&:hover': {
                          borderColor: experienceError ? '#d32f2f' : '#ff690d',
                          backgroundColor: 'rgba(255, 105, 13, 0.04)'
                        }
                      })
                    }}
                  >
                    {option.label}
                  </MuiButton>
                ))}
              </Box>
              {experienceError && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                  Please select helper experience
                </Typography>
              )}
            </Box>
          </motion.div>

          {/* Nationality Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, lg: 2 } }}>
                <MapPin size={16} color={nationalityError ? '#d32f2f' : '#ff690d'} style={{ marginRight: 4 }} />
                <Typography 
                  variant="body2" 
                  fontWeight={600}
                  color={nationalityError ? '#d32f2f' : '#5a6c6f'}
                  sx={{ fontSize: { xs: '0.75rem', lg: '0.875rem' } }}
                >
                  Helper's Nationality *
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: { xs: 1, lg: 1.5 } }}>
                {nationalityOptions.map((option) => (
                  <MuiButton
                    key={option.value}
                    onClick={() => {
                      setNationality(option.value);
                      if (nationalityError) setNationalityError(false);
                    }}
                    variant={nationality === option.value ? "contained" : "outlined"}
                    sx={{
                      flex: 1,
                      py: { xs: 1, lg: 1.5 },
                      borderRadius: '12px',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: { xs: '0.7rem', lg: '0.9rem' },
                      borderWidth: '2px',
                      ...(nationality === option.value ? {
                        background: 'linear-gradient(135deg, #ff690d 0%, #ff914d 100%)',
                        color: 'white',
                        borderColor: '#ff690d',
                        boxShadow: '0 4px 12px rgba(255, 105, 13, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #e55a0a 0%, #ff690d 100%)',
                          borderColor: '#e55a0a'
                        }
                      } : {
                        color: nationalityError ? '#d32f2f' : '#5a6c6f',
                        borderColor: nationalityError ? '#d32f2f' : 'rgba(0,0,0,0.12)',
                        backgroundColor: 'white',
                        '&:hover': {
                          borderColor: nationalityError ? '#d32f2f' : '#ff690d',
                          backgroundColor: 'rgba(255, 105, 13, 0.04)'
                        }
                      })
                    }}
                  >
                    {option.label}
                  </MuiButton>
                ))}
              </Box>
              {nationalityError && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                  Please select helper's nationality
                </Typography>
              )}
            </Box>
          </motion.div>


        </Box>
      </Paper>
    </motion.div>
  );
};

export default HelperSearchCard;