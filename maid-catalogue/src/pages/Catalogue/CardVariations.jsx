import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  ButtonGroup,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import InfoIcon from '@mui/icons-material/Info';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CompareIcon from '@mui/icons-material/Compare';
import {
  MaidCardVariation1,
  MaidCardVariation2,
  MaidCardVariation3,
  MaidCardVariation4,
  MaidCardVariation5,
  MaidCardVariation6,
  VARIATIONS_METADATA
} from '../../components/Catalogue/variations';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

// Brand colors
const brandColors = {
  primary: '#ff914d',
  secondary: '#0c191b',
  primaryLight: '#ffa366',
  primaryDark: '#e67e22',
  background: '#fafafa',
  surface: '#ffffff',
  text: '#0c191b',
  textSecondary: '#5a6c6f',
  border: '#e0e0e0'
};

// Mock maid data for demonstration
const mockMaidData = {
  id: 'DEMO_001',
  name: 'Maria Santos',
  country: 'Philippines',
  salary: 650,
  DOB: '1992-03-15',
  height: 158,
  weight: 52,
  skills: ['Cooking', 'Housekeeping', 'Childcare', 'Elderly Care'],
  languages: ['English', 'Filipino', 'Mandarin'],
  type: ['Experienced'],
  imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=400&fit=crop&crop=face',
  isEmployed: false,
  isActive: true,
  Religion: 'Christian',
  maritalStatus: 'Single',
  NumChildren: 0
};

// Component mapping
const VARIATION_COMPONENTS = {
  MaidCardVariation1,
  MaidCardVariation2,
  MaidCardVariation3,
  MaidCardVariation4,
  MaidCardVariation5,
  MaidCardVariation6
};

/**
 * Card Variations Showcase Page
 * Displays all 6 maid card variations with interactive controls
 * Features: Variation switcher, comparison mode, accessibility testing
 */
export default function CardVariations() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [currentVariation, setCurrentVariation] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([1, 2]);
  const [isSelected, setIsSelected] = useState(false);
  const [showAccessibilityInfo, setShowAccessibilityInfo] = useState(false);

  // Get the current variation component
  const getCurrentVariationComponent = (variationId) => {
    const metadata = VARIATIONS_METADATA.find(v => v.id === variationId);
    if (!metadata) return null;
    
    const Component = VARIATION_COMPONENTS[metadata.component];
    return Component;
  };

  // Handle selection change
  const handleSelectionChange = (maidId, selected) => {
    setIsSelected(selected);
  };

  // Toggle comparison selection
  const toggleComparisonSelection = (variationId) => {
    if (selectedForComparison.includes(variationId)) {
      setSelectedForComparison(prev => prev.filter(id => id !== variationId));
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison(prev => [...prev, variationId]);
    }
  };

  const currentMetadata = VARIATIONS_METADATA.find(v => v.id === currentVariation);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: brandColors.background }}>
      <Header />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton
              onClick={() => navigate('/catalogue')}
              aria-label="Back to catalogue"
              sx={{
                color: brandColors.primary,
                backgroundColor: `${brandColors.primary}10`,
                '&:hover': {
                  backgroundColor: `${brandColors.primary}20`,
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <Typography variant="h3" component="h1" sx={{
              fontWeight: 700,
              color: brandColors.text,
              fontSize: { xs: '1.8rem', md: '2.5rem' }
            }}>
              Maid Card Variations
            </Typography>
          </Box>
          
          <Typography variant="h6" sx={{
            color: brandColors.textSecondary,
            mb: 3,
            maxWidth: '800px'
          }}>
            Explore 6 different card layouts optimized for accessibility, comprehensive data display, 
            and various use cases. Each variation combines Material-UI and shadcn/ui with WCAG compliance.
          </Typography>

          {/* Quick Info Alert */}
          <Alert 
            severity="info" 
            icon={<InfoIcon />}
            sx={{ 
              mb: 3, 
              backgroundColor: `${brandColors.primary}10`,
              borderColor: `${brandColors.primary}30`,
              '& .MuiAlert-icon': {
                color: brandColors.primary
              }
            }}
          >
            <Typography variant="body2">
              All variations include authentication-aware content protection, responsive design, 
              and comprehensive accessibility features. Toggle authentication status to see privacy controls.
            </Typography>
          </Alert>
        </Box>

        {/* Controls Section */}
        <Paper elevation={0} sx={{ 
          p: 3, 
          mb: 4, 
          border: `1px solid ${brandColors.border}`,
          borderRadius: '16px'
        }}>
          <Grid container spacing={3} alignItems="center">
            {/* Variation Selector */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ 
                fontWeight: 600, 
                color: brandColors.text, 
                mb: 1 
              }}>
                Card Variation
              </Typography>
              <ButtonGroup 
                variant="outlined" 
                size="small"
                sx={{ 
                  flexWrap: 'wrap',
                  gap: 0.5,
                  '& .MuiButtonGroup-grouped': {
                    border: `1px solid ${brandColors.primary}40 !important`,
                    '&.Mui-selected, &:hover': {
                      backgroundColor: `${brandColors.primary}15`,
                      borderColor: `${brandColors.primary} !important`,
                      color: brandColors.primary
                    }
                  }
                }}
              >
                {VARIATIONS_METADATA.map((variation) => {
                  const icons = {
                    1: <ViewModuleIcon fontSize="small" />,
                    2: <ViewComfyIcon fontSize="small" />,
                    3: <ViewListIcon fontSize="small" />,
                    4: <ViewAgendaIcon fontSize="small" />,
                    5: <DashboardIcon fontSize="small" />,
                    6: <InfoIcon fontSize="small" />
                  };
                  
                  return (
                    <Button
                      key={variation.id}
                      onClick={() => setCurrentVariation(variation.id)}
                      startIcon={icons[variation.id]}
                      className={currentVariation === variation.id ? 'Mui-selected' : ''}
                      sx={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        px: 2,
                        py: 1,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {variation.name}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </Grid>

            {/* Controls */}
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: { md: 'flex-end' } }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isAuthenticated}
                      onChange={(e) => setIsAuthenticated(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Authenticated View"
                  sx={{ 
                    '& .MuiFormControlLabel-label': { 
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: brandColors.text
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={compareMode}
                      onChange={(e) => setCompareMode(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Compare Mode"
                  sx={{ 
                    '& .MuiFormControlLabel-label': { 
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: brandColors.text
                    }
                  }}
                />

                <Tooltip title="Accessibility Information">
                  <IconButton
                    onClick={() => setShowAccessibilityInfo(!showAccessibilityInfo)}
                    sx={{
                      color: showAccessibilityInfo ? brandColors.primary : brandColors.textSecondary,
                      backgroundColor: showAccessibilityInfo ? `${brandColors.primary}10` : 'transparent',
                      '&:hover': {
                        backgroundColor: `${brandColors.primary}15`,
                        color: brandColors.primary
                      }
                    }}
                  >
                    <AccessibilityIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Accessibility Information Panel */}
        {showAccessibilityInfo && (
          <Accordion 
            expanded={showAccessibilityInfo} 
            sx={{ 
              mb: 4,
              border: `1px solid ${brandColors.border}`,
              borderRadius: '12px !important',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              onClick={() => setShowAccessibilityInfo(!showAccessibilityInfo)}
              sx={{
                backgroundColor: `${brandColors.primary}08`,
                borderRadius: '12px 12px 0 0'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessibilityIcon sx={{ color: brandColors.primary }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.text }}>
                  Accessibility Features
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: brandColors.text }}>
                    WCAG Compliance
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: brandColors.textSecondary }}>
                    <li>AA level color contrast ratios</li>
                    <li>Keyboard navigation support</li>
                    <li>Screen reader optimization</li>
                    <li>Focus management and indicators</li>
                    <li>Semantic HTML structure</li>
                  </ul>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: brandColors.text }}>
                    Interactive Features
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: brandColors.textSecondary }}>
                    <li>ARIA labels and descriptions</li>
                    <li>Keyboard shortcuts (Tab, Enter, Space)</li>
                    <li>Progressive disclosure patterns</li>
                    <li>Touch-friendly tap targets (44px+)</li>
                    <li>Reduced motion support</li>
                  </ul>
                </Grid>
              </Grid>
              
              {currentMetadata && (
                <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${brandColors.border}` }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: brandColors.text }}>
                    Current Variation: {currentMetadata.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandColors.textSecondary }}>
                    {currentMetadata.accessibility}
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Main Content */}
        {!compareMode ? (
          // Single Variation View
          <Grid container spacing={4}>
            {/* Card Display */}
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ 
                p: 4, 
                borderRadius: '20px',
                background: `linear-gradient(135deg, ${brandColors.surface} 0%, ${brandColors.background} 100%)`,
                border: `1px solid ${brandColors.border}`
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '400px',
                  px: 2
                }}>
                  {(() => {
                    const Component = getCurrentVariationComponent(currentVariation);
                    if (!Component) return <Typography>Variation not found</Typography>;
                    
                    return (
                      <Box sx={{ width: '100%', maxWidth: '400px' }}>
                        <Component
                          maid={mockMaidData}
                          isAuthenticated={isAuthenticated}
                          isSelected={isSelected}
                          onSelectionChange={handleSelectionChange}
                        />
                      </Box>
                    );
                  })()}
                </Box>
              </Paper>
            </Grid>

            {/* Information Panel */}
            <Grid item xs={12} md={4}>
              {currentMetadata && (
                <Card sx={{ 
                  borderRadius: '16px',
                  border: `1px solid ${brandColors.border}`,
                  height: 'fit-content'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 700, 
                      color: brandColors.text,
                      mb: 1
                    }}>
                      {currentMetadata.name}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ 
                      color: brandColors.textSecondary,
                      mb: 3,
                      lineHeight: 1.6
                    }}>
                      {currentMetadata.description}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 700, 
                        color: brandColors.text,
                        mb: 1
                      }}>
                        Key Features
                      </Typography>
                      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        {currentMetadata.features.map((feature, idx) => (
                          <Chip
                            key={idx}
                            label={feature}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: brandColors.primary,
                              color: brandColors.primary,
                              fontSize: '0.75rem',
                              '&:hover': {
                                backgroundColor: `${brandColors.primary}10`,
                              }
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 700, 
                        color: brandColors.text,
                        mb: 1
                      }}>
                        Best For
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: brandColors.textSecondary 
                      }}>
                        {currentMetadata.bestFor}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 700, 
                        color: brandColors.text,
                        mb: 1
                      }}>
                        Accessibility
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: brandColors.textSecondary 
                      }}>
                        {currentMetadata.accessibility}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        ) : (
          // Comparison Mode
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                color: brandColors.text,
                mb: 1
              }}>
                Compare Variations
              </Typography>
              <Typography variant="body1" sx={{ 
                color: brandColors.textSecondary,
                mb: 2
              }}>
                Select up to 3 variations to compare side by side
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {VARIATIONS_METADATA.map((variation) => (
                  <Button
                    key={variation.id}
                    onClick={() => toggleComparisonSelection(variation.id)}
                    variant={selectedForComparison.includes(variation.id) ? "contained" : "outlined"}
                    size="small"
                    startIcon={<CompareIcon />}
                    disabled={!selectedForComparison.includes(variation.id) && selectedForComparison.length >= 3}
                    sx={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderColor: brandColors.primary,
                      color: selectedForComparison.includes(variation.id) ? 'white' : brandColors.primary,
                      backgroundColor: selectedForComparison.includes(variation.id) ? brandColors.primary : 'transparent',
                      '&:hover': {
                        backgroundColor: selectedForComparison.includes(variation.id) 
                          ? brandColors.primaryDark 
                          : `${brandColors.primary}15`,
                      }
                    }}
                  >
                    {variation.name}
                  </Button>
                ))}
              </Stack>
            </Box>

            <Grid container spacing={3}>
              {selectedForComparison.map((variationId) => {
                const Component = getCurrentVariationComponent(variationId);
                const metadata = VARIATIONS_METADATA.find(v => v.id === variationId);
                
                if (!Component || !metadata) return null;

                return (
                  <Grid item xs={12} md={6} lg={4} key={variationId}>
                    <Paper elevation={2} sx={{ 
                      borderRadius: '16px',
                      border: `1px solid ${brandColors.border}`,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        backgroundColor: brandColors.primary,
                        color: 'white',
                        p: 2,
                        textAlign: 'center'
                      }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {metadata.name}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {metadata.description}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ p: 3 }}>
                        <Component
                          maid={mockMaidData}
                          isAuthenticated={isAuthenticated}
                          isSelected={isSelected}
                          onSelectionChange={handleSelectionChange}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  );
}