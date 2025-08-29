import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Paper,
  Typography,
  Button as MuiButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import {
  WorkOutline as WorkIcon,
  ArrowRightOutlined as ArrowRightIcon,
  Close as CloseIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelperFinderCard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for user inputs
  const [experience, setExperience] = useState('');
  const [nationality, setNationality] = useState('');
  const [experienceError, setExperienceError] = useState(false);
  const [nationalityError, setNationalityError] = useState(false);
  
  // State for modal
  const [showPricingModal, setShowPricingModal] = useState(false);

  const experienceOptions = [
    { value: 'New Helper', label: 'New Helper' },
    { value: 'Experienced Helper', label: 'Experienced Helper' }
  ];

  const nationalityOptions = [
    { value: 'Philippines', label: 'Philippines' },
    { value: 'Indonesia', label: 'Indonesia' },
    { value: 'Myanmar', label: 'Myanmar' }
  ];

  // Pricing logic (restored from PricingBreakdownCard)
  const getPricingData = () => {
    const isNew = experience === 'New Helper' || experience === 'New/Fresh' || experience === '';
    
    const pricingData = {
      Myanmar: {
        new: {
          total: 695,
          breakdown: [
            { item: 'Work Permit Application & Issuance', cost: 70 },
            { item: 'Administrative cost', cost: 80 },
            { item: 'Safety awareness course', cost: 75 },
            { item: 'Medical check up', cost: 80 },
            { item: 'Transportation', cost: 140 },
            { item: 'Air Ticket', cost: 250 },
            { item: 'Agency Fee', cost: 'WAIVED', isWaived: true }
          ]
        },
        experienced: {
          total: 998,
          breakdown: [
            { item: 'Work Permit Application & Issuance', cost: 70 },
            { item: 'Administrative cost', cost: 80 },
            { item: 'Medical check up', cost: 80 },
            { item: 'Transportation', cost: 140 },
            { item: 'Air Ticket', cost: 250 },
            { item: 'Agency Fee', cost: 378 }
          ]
        }
      },
      Indonesia: {
        new: {
          total: 1323,
          breakdown: [
            { item: 'Work Permit Application & Issuance', cost: 70 },
            { item: 'Administrative cost', cost: 80 },
            { item: 'Safety awareness course', cost: 75 },
            { item: 'Medical check up', cost: 80 },
            { item: 'Transportation', cost: 140 },
            { item: 'Air Ticket', cost: 250 },
            { item: 'Overseas processing fee', cost: 250 },
            { item: 'Agency Fee', cost: 378 }
          ]
        },
        experienced: {
          total: 1248,
          breakdown: [
            { item: 'Work Permit Application & Issuance', cost: 70 },
            { item: 'Administrative cost', cost: 80 },
            { item: 'Medical check up', cost: 80 },
            { item: 'Transportation', cost: 140 },
            { item: 'Air Ticket', cost: 250 },
            { item: 'Overseas processing fee', cost: 250 },
            { item: 'Agency Fee', cost: 378 }
          ]
        }
      },
      Philippines: {
        new: {
          total: 1993,
          breakdown: [
            { item: 'Work Permit Application & Issuance', cost: 70 },
            { item: 'Administrative cost', cost: 80 },
            { item: 'Safety awareness course', cost: 75 },
            { item: 'Medical check up', cost: 80 },
            { item: 'Transportation', cost: 140 },
            { item: 'Air Ticket', cost: 250 },
            { item: 'POEA/Document fee', cost: 700 },
            { item: 'Agency Fee', cost: 598 }
          ]
        },
        experienced: {
          total: 1918,
          breakdown: [
            { item: 'Work Permit Application & Issuance', cost: 70 },
            { item: 'Administrative cost', cost: 80 },
            { item: 'Medical check up', cost: 80 },
            { item: 'Transportation', cost: 140 },
            { item: 'Air Ticket', cost: 250 },
            { item: 'POEA/Document fee', cost: 700 },
            { item: 'Agency Fee', cost: 598 }
          ]
        }
      }
    };

    const selectedNationality = nationality || 'Myanmar';
    const packageType = isNew ? 'new' : 'experienced';
    
    return pricingData[selectedNationality]?.[packageType] || pricingData.Myanmar.new;
  };


  // Clear errors when selections are made
  useEffect(() => {
    if (nationality && experience) {
      setExperienceError(false);
      setNationalityError(false);
    }
  }, [nationality, experience]);

  const handleViewCatalogue = () => {
    const params = new URLSearchParams();
    if (experience) params.append('experience', experience);
    if (nationality) params.append('nationality', nationality);
    
    const queryString = params.toString();
    navigate(`/Catalogue${queryString ? `?${queryString}` : ''}`);
  };

  const pricing = getPricingData();

  // PricingBreakdownModal Component
  const PricingBreakdownModal = () => (
    <Dialog
      open={showPricingModal}
      onClose={() => setShowPricingModal(false)}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : 3,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 105, 13, 0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          }
        }
      }}
    >
      <DialogTitle sx={{ 
        p: 3, 
        pb: 1,
        position: 'relative'
      }}>
        <IconButton
          onClick={() => setShowPricingModal(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#5a6c6f',
            '&:hover': {
              backgroundColor: 'rgba(255, 105, 13, 0.1)',
              color: '#ff690d'
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
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff690d 0%, #ff914d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(255, 105, 13, 0.3)',
            mb: 1
          }}>
            <ReceiptIcon sx={{ fontSize: 30, color: 'white' }} />
          </Box>
          
          <Typography variant="h5" sx={{ 
            fontWeight: 700,
            color: '#0c191b',
            textAlign: 'center',
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            Package Cost Breakdown
          </Typography>
          
          <Typography 
            variant="body2" 
            color="#5a6c6f"
            sx={{ 
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              textAlign: 'center'
            }}
          >
            {nationality && experience ? `${experience} from ${nationality}` : 'Complete breakdown of all costs'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 1 }}>
        <Box sx={{ mb: 3 }}>
          {pricing.breakdown.map((item, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                py: { xs: 1, sm: 1.25 },
                px: { xs: 1.5, sm: 2 },
                mb: 1,
                borderRadius: '8px',
                backgroundColor: index % 2 === 0 ? 'rgba(255, 105, 13, 0.02)' : 'rgba(0,0,0,0.01)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.85rem' }, 
                  color: '#5a6c6f',
                  fontWeight: 500,
                  lineHeight: 1.3,
                  flex: 1,
                  pr: 2
                }}
              >
                {item.item}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.85rem' }, 
                  fontWeight: 700,
                  color: item.isWaived ? '#4caf50' : '#0c191b',
                  fontFamily: 'monospace',
                  minWidth: '60px',
                  textAlign: 'right'
                }}
              >
                {item.isWaived ? 'WAIVED' : `$${item.cost}.00`}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Total */}
        <Box sx={{ 
          p: { xs: 2, sm: 2.5 },
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 105, 13, 0.08)',
          border: '2px solid rgba(255, 105, 13, 0.2)'
        }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem' }, 
                color: '#0c191b',
                fontWeight: 700,
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            >
              Total Package Cost
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: { xs: '1.4rem', sm: '1.6rem' }, 
                fontWeight: 800,
                color: '#ff690d',
                fontFamily: 'monospace',
                letterSpacing: '-0.02em'
              }}
            >
              ${pricing.total}.00
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        pt: 1
      }}>
        <MuiButton
          onClick={() => setShowPricingModal(false)}
          variant="contained"
          fullWidth
          sx={{
            py: { xs: 1.25, sm: 1.5 },
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ff690d 0%, #ff914d 100%)',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            fontWeight: 600,
            textTransform: 'none',
            fontFamily: 'Inter, system-ui, sans-serif',
            '&:hover': {
              background: 'linear-gradient(135deg, #e55a0a 0%, #ff690d 100%)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Close
        </MuiButton>
      </DialogActions>
    </Dialog>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Paper 
        elevation={0}
        sx={{
          width: { xs: '100%', sm: '90%', lg: '70%' },
          mx: 'auto',
          p: { xs: 2, lg: 5 },
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
        <Box textAlign="center" mb={{ xs: 2, lg: 3 }}>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color="#0c191b"
            mb={{ xs: 0.5, lg: 1 }}
            sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.025em',
              fontSize: { xs: '1.25rem', lg: '1.75rem' }
            }}
          >
            Find Your Perfect Helper
          </Typography>
          
          <Typography 
            variant="body2" 
            color="#5a6c6f"
            sx={{ fontSize: { xs: '0.8rem', lg: '1rem' } }}
          >
            Choose your preferences to see instant pricing
          </Typography>
        </Box>

        {/* Two-Column Layout */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 3, md: 4, lg: 6 },
          alignItems: 'start'
        }}>
          
          {/* Left Column - Helper Finder */}
          <Box>
            {/* Section Header */}
           

            {/* Experience Selection */}
            <Box sx={{ mb: { xs: 2.5, lg: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, lg: 1.5 } }}>
                <WorkIcon sx={{ color: experienceError ? '#d32f2f' : '#ff690d', fontSize: { xs: '1rem', lg: '1.1rem' }, mr: 0.75 }} />
                <Typography 
                  variant="body2" 
                  fontWeight={600}
                  color={experienceError ? '#d32f2f' : '#5a6c6f'}
                  sx={{ fontSize: { xs: '0.8rem', lg: '0.875rem' } }}
                >
                  Helper Experience *
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: { xs: 1, lg: 1.5 } }}>
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
                      py: { xs: 1, lg: 1.25 },
                      borderRadius: '12px',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: { xs: '0.75rem', lg: '0.85rem' },
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
            </Box>

            {/* Nationality Selection */}
            <Box sx={{ mb: { xs: 1.5, lg: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, lg: 1.5 } }}>
                <MapPin size={16} color={nationalityError ? '#d32f2f' : '#ff690d'} style={{ marginRight: 6 }} />
                <Typography 
                  variant="body2" 
                  fontWeight={600}
                  color={nationalityError ? '#d32f2f' : '#5a6c6f'}
                  sx={{ fontSize: { xs: '0.8rem', lg: '0.875rem' } }}
                >
                  Helper's Nationality *
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: { xs: 0.75, lg: 1 } }}>
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
                      py: { xs: 1, lg: 1.25 },
                      borderRadius: '12px',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: { xs: '0.7rem', lg: '0.8rem' },
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
            </Box>

          </Box>

          {/* Right Column - Pricing Breakdown */}
          <Box>
            {/* Section Header */}
            <Box sx={{ mb: { xs: 2, lg: 3 } }}>
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                color="#0c191b"
                sx={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: { xs: '1rem', lg: '1.25rem' },
                  mb: { xs: 1, lg: 1.5 }
                }}
              >
                Package Cost Breakdown
              </Typography>
            
            </Box>

            {/* Conditional Pricing Display */}
            {experience && nationality ? (
              <>
                {/* Compact Cost Summary */}
                <Box sx={{ mb: { xs: 2, lg: 3 } }}>
                  <Box
                    onClick={() => setShowPricingModal(true)}
                    sx={{
                      p: { xs: 2, lg: 2.5 },
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 105, 13, 0.05)',
                      border: '2px solid rgba(255, 105, 13, 0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 105, 13, 0.1)',
                        borderColor: 'rgba(255, 105, 13, 0.3)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(255, 105, 13, 0.2)'
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mb: 1
                    }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontSize: { xs: '0.9rem', lg: '1rem' }, 
                          color: '#0c191b',
                          fontWeight: 700,
                          fontFamily: 'Inter, system-ui, sans-serif'
                        }}
                      >
                        Total Package Cost
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontSize: { xs: '1.25rem', lg: '1.4rem' }, 
                          fontWeight: 800,
                          color: '#ff690d',
                          fontFamily: 'monospace',
                          letterSpacing: '-0.02em'
                        }}
                      >
                        ${pricing.total}.00
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <Typography 
                        variant="body2" 
                        color="#5a6c6f"
                        sx={{ 
                          fontSize: { xs: '0.75rem', lg: '0.8rem' },
                          fontWeight: 500
                        }}
                      >
                        {pricing.breakdown.length} items included
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="#ff690d"
                        sx={{ 
                          fontSize: { xs: '0.75rem', lg: '0.8rem' }, 
                          fontWeight: 600,
                          fontFamily: 'Inter, system-ui, sans-serif',
                          textDecoration: 'underline',
                          textUnderlineOffset: '3px'
                        }}
                      >
                        View Breakdown →
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </>
            ) : (
              /* Placeholder when selections are incomplete */
              <Box sx={{ mb: { xs: 2, lg: 3 } }}>
                <Box
                  sx={{
                    p: { xs: 2, lg: 2.5 },
                    borderRadius: '12px',
                    backgroundColor: 'rgba(90, 108, 111, 0.05)',
                    border: '2px dashed rgba(90, 108, 111, 0.2)',
                    textAlign: 'center'
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontSize: { xs: '0.85rem', lg: '0.95rem' }, 
                      color: '#5a6c6f',
                      fontWeight: 600,
                      fontFamily: 'Inter, system-ui, sans-serif',
                      mb: 0.5
                    }}
                  >
                    Select your preferences above
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="#5a6c6f"
                    sx={{ 
                      fontSize: { xs: '0.75rem', lg: '0.8rem' },
                      fontWeight: 400,
                      opacity: 0.8
                    }}
                  >
                    Choose helper experience and nationality to see pricing
                  </Typography>
                </Box>
              </Box>
            )}

            {/* View Catalogue Button */}
            <Box>
              <MuiButton
                onClick={handleViewCatalogue}
                fullWidth
                variant="contained"
                size="large"
                endIcon={<ArrowRightIcon sx={{ fontSize: { xs: '0.9rem', lg: '1rem' } }} />}
                sx={{
                  py: { xs: 1, lg: 1.25 },
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ff690d 0%, #ff914d 100%)',
                  boxShadow: '0 4px 16px rgba(255, 105, 13, 0.25)',
                  fontSize: { xs: '0.85rem', lg: '0.9rem' },
                  fontWeight: 700,
                  textTransform: 'none',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  letterSpacing: '-0.025em',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e55a0a 0%, #ff690d 100%)',
                    boxShadow: '0 6px 20px rgba(255, 105, 13, 0.35)',
                    transform: 'translateY(-1px)'
                  },
                  '&:active': {
                    transform: 'translateY(0px)'
                  }
                }}
              >
                Find Helper
              </MuiButton>
            </Box>
          </Box>

        </Box>
      </Paper>
      
      {/* Pricing Breakdown Modal */}
      <PricingBreakdownModal />
    </motion.div>
  );
};

export default HelperFinderCard;