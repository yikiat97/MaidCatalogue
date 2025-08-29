import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Paper,
  Typography,
  Button as MuiButton,
  Chip,
  Collapse,
  IconButton
} from '@mui/material';
import {
  ArrowRightOutlined as ArrowRightIcon,
  LocalOfferOutlined as PriceTagIcon,
  ExpandMoreOutlined as ExpandMoreIcon,
  ExpandLessOutlined as ExpandLessIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PricingBreakdownCard = ({ nationality = '', experience = '', isMobileCompact = false }) => {
  const navigate = useNavigate();
  const [showFullBreakdown, setShowFullBreakdown] = useState(false);
  const [isCompactCollapsed, setIsCompactCollapsed] = useState(isMobileCompact);

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

  const handleViewCatalogue = () => {
    const params = new URLSearchParams();
    if (experience) params.append('experience', experience);
    if (nationality) params.append('nationality', nationality);
    
    const queryString = params.toString();
    navigate(`/Catalogue${queryString ? `?${queryString}` : ''}`);
  };

  const pricing = getPricingData();
  
  const essentialItems = pricing.breakdown.slice(0, 3); // Show first 3 items
  const additionalItems = pricing.breakdown.slice(3);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Paper 
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: { xs: isMobileCompact ? 360 : 440, lg: 'none' },
          height: { lg: 'fit-content' },
          maxHeight: { lg: '70vh' },
          mx: 'auto',
          p: { xs: isMobileCompact ? 2 : 3, lg: 2.5 },
          borderRadius: { xs: '20px', lg: '20px' },
          background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 105, 13, 0.1)',
          boxShadow: '0 15px 35px rgba(0,0,0,0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #ff690d 0%, #ff914d 50%, #ffa366 100%)'
          }
        }}
      >
        {/* Compact Header */}
        <Box mb={{ xs: isMobileCompact ? 1 : 1.5, lg: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1, lg: 1.5 }, 
              mb: { xs: isMobileCompact ? 0.5 : 1, lg: 1.5 },
              cursor: isMobileCompact ? 'pointer' : 'default'
            }}
            onClick={isMobileCompact ? () => setIsCompactCollapsed(!isCompactCollapsed) : undefined}
          >
            <Box 
              sx={{
                width: { xs: isMobileCompact ? 32 : 36, lg: 36 },
                height: { xs: isMobileCompact ? 32 : 36, lg: 36 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff690d 0%, #ff914d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(255, 105, 13, 0.25)'
              }}
            >
              <PriceTagIcon sx={{ color: 'white', fontSize: { xs: isMobileCompact ? '1rem' : '1.1rem', lg: '1.1rem' } }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                color="#0c191b"
                sx={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  letterSpacing: '-0.025em',
                  fontSize: { xs: isMobileCompact ? '0.9rem' : '1rem', lg: '1rem' },
                  lineHeight: 1.2
                }}
              >
                {isMobileCompact && isCompactCollapsed ? `$${pricing.total}.00` : 'Package Cost Breakdown'}
              </Typography>
              {isMobileCompact && isCompactCollapsed && (
                <Typography 
                  variant="caption" 
                  color="#5a6c6f"
                  sx={{ fontSize: '0.65rem' }}
                >
                  Tap to expand details
                </Typography>
              )}
            </Box>
            {isMobileCompact && (
              <Box sx={{ ml: 'auto' }}>
                {isCompactCollapsed ? (
                  <ExpandMoreIcon sx={{ fontSize: '1.2rem', color: '#ff690d' }} />
                ) : (
                  <ExpandLessIcon sx={{ fontSize: '1.2rem', color: '#ff690d' }} />
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Compact Cost Breakdown */}
        <Collapse in={!isMobileCompact || !isCompactCollapsed}>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Box sx={{ mb: { xs: 1, lg: 1.5 } }}>
            <Typography 
              variant="subtitle2" 
              fontWeight="600" 
              color="#0c191b"
              sx={{ fontSize: { xs: '0.8rem', lg: '0.9rem' } }}
            >
              Cost Breakdown
            </Typography>
          </Box>
          
          {/* Essential Items - Calculation Format */}
          <Box sx={{ mb: { xs: 0.5, lg: 1 } }}>
            {essentialItems.map((item, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: { xs: 0.5, lg: 0.75 },
                  px: 0,
                  borderBottom: index < essentialItems.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none'
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.75rem', lg: '0.8rem' }, 
                    color: '#5a6c6f',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    flex: 1,
                    pr: { xs: 1.5, lg: 2 }
                  }}
                >
                  {item.item}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.75rem', lg: '0.8rem' }, 
                    fontWeight: 600,
                    color: item.isWaived ? '#4caf50' : '#0c191b',
                    fontFamily: 'monospace',
                    minWidth: { xs: '50px', lg: '60px' },
                    textAlign: 'right'
                  }}
                >
                  {item.isWaived ? '$0.00' : `$${item.cost}.00`}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Additional Items (Collapsible) - Calculation Format */}
          <Collapse in={showFullBreakdown}>
            <Box sx={{ mb: { xs: 0.5, lg: 1 } }}>
              {additionalItems.map((item, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: { xs: 0.5, lg: 0.75 },
                    px: 0,
                    borderBottom: index < additionalItems.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: { xs: '0.75rem', lg: '0.8rem' }, 
                      color: '#5a6c6f',
                      fontWeight: 500,
                      lineHeight: 1.3,
                      flex: 1,
                      pr: { xs: 1.5, lg: 2 }
                    }}
                  >
                    {item.item}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: { xs: '0.75rem', lg: '0.8rem' }, 
                      fontWeight: 600,
                      color: item.isWaived ? '#4caf50' : '#0c191b',
                      fontFamily: 'monospace',
                      minWidth: { xs: '50px', lg: '60px' },
                      textAlign: 'right'
                    }}
                  >
                    {item.isWaived ? '$0.00' : `$${item.cost}.00`}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Collapse>

          {additionalItems.length > 0 && !showFullBreakdown && (
            <Box
              onClick={() => setShowFullBreakdown(true)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                mt: { xs: 0.5, lg: 1 },
                py: { xs: 0.75, lg: 1 },
                px: { xs: 1.5, lg: 2 },
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 105, 13, 0.05)',
                border: '1px solid rgba(255, 105, 13, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 105, 13, 0.1)',
                  borderColor: 'rgba(255, 105, 13, 0.3)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <Typography 
                variant="caption" 
                color="#ff690d" 
                sx={{ 
                  fontSize: { xs: '0.7rem', lg: '0.75rem' }, 
                  fontWeight: 600,
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              >
                +{additionalItems.length} more items
              </Typography>
              <ExpandMoreIcon sx={{ fontSize: { xs: '0.9rem', lg: '1rem' }, color: '#ff690d' }} />
            </Box>
          )}
          
          {additionalItems.length > 0 && showFullBreakdown && (
            <Box
              onClick={() => setShowFullBreakdown(false)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                mt: { xs: 0.5, lg: 1 },
                py: { xs: 0.75, lg: 1 },
                px: { xs: 1.5, lg: 2 },
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 105, 13, 0.05)',
                border: '1px solid rgba(255, 105, 13, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 105, 13, 0.1)',
                  borderColor: 'rgba(255, 105, 13, 0.3)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <Typography 
                variant="caption" 
                color="#ff690d" 
                sx={{ 
                  fontSize: { xs: '0.7rem', lg: '0.75rem' }, 
                  fontWeight: 600,
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              >
                Show less
              </Typography>
              <ExpandLessIcon sx={{ fontSize: { xs: '0.9rem', lg: '1rem' }, color: '#ff690d' }} />
            </Box>
          )}
          
          {/* Calculation Total */}
          <Box sx={{ 
            mt: { xs: 1.5, lg: 2 }, 
            pt: { xs: 1.5, lg: 2 }, 
            borderTop: '2px solid rgba(255, 105, 13, 0.3)'
          }}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                py: { xs: 0.75, lg: 1 }
              }}
            >
              <Typography 
                variant="h6" 
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
                  fontSize: { xs: '1.15rem', lg: '1.25rem' }, 
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
          </Box>
        </Collapse>

        {/* Action Button */}
        <Collapse in={!isMobileCompact || !isCompactCollapsed}>
          <Box sx={{ 
            mt: { xs: 1.5, lg: 2 },
            pt: { xs: 1.5, lg: 2 },
            borderTop: '1px solid rgba(0,0,0,0.06)'
          }}>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <MuiButton
              onClick={handleViewCatalogue}
              fullWidth
              variant="contained"
              size="medium"
              endIcon={<ArrowRightIcon sx={{ fontSize: { xs: '0.9rem', lg: '1rem' } }} />}
              sx={{
                py: { xs: 0.85, lg: 0.75 },
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ff690d 0%, #ff914d 100%)',
                boxShadow: '0 4px 16px rgba(255, 105, 13, 0.25)',
                fontSize: { xs: '0.8rem', lg: '0.8rem' },
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
              View Catalogue
            </MuiButton>
          </motion.div>
          </Box>
        </Collapse>
      </Paper>
    </motion.div>
  );
};

export default PricingBreakdownCard;