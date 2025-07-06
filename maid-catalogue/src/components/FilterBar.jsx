import { 
  Stack, 
  Typography, 
  Slider, 
  Chip, 
  Box, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Paper, 
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  IconButton,
  Collapse,
  Divider,
  Badge
} from '@mui/material';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PublicIcon from '@mui/icons-material/Public';
import StarIcon from '@mui/icons-material/Star';
import TranslateIcon from '@mui/icons-material/Translate';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';

const skillsetOptions = ['Cooking', 'Housekeeping', 'Childcare', 'Babysitting', 'Elderly Care', 'Dog(s)', 'Cat(s)', 'Caregiving'];
const languageOptions = ['English', 'Mandarin', 'Malay', 'Tamil'];
const typeOptions = ['New/Fresh', 'Transfer', 'Ex-Singapore', 'Ex-Hongkong', 'Ex-Taiwan', 'Ex-Middle East'];
const countryOptions = ['Philippines', 'Indonesia', 'Myanmar'];

export default function FilterBar({
  salaryRange, setSalaryRange,
  selectedCountries, setSelectedCountries,
  skillsets, setSkillsets,
  languages, setLanguages,
  // ageRange, setAgeRange,
  types, setTypes
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    salary: true,
    countries: true,
    skills: true,
    languages: true,
    age: true,
    experience: true
  });

  // Calculate active filters count
  const activeFiltersCount = 
    (salaryRange[0] !== 400 || salaryRange[1] !== 1000 ? 1 : 0) +
    selectedCountries.length +
    skillsets.length +
    languages.length +
    //(ageRange[0] !== 18 || ageRange[1] !== 60 ? 1 : 0) +
    types.length;

  const handleToggle = (setter, value) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    setSalaryRange([400, 1000]);
    setSelectedCountries([]);
    setSkillsets([]);
    setLanguages([]);
    // setAgeRange([18, 60]);
    setTypes([]);
  };

  const FilterSection = ({ title, icon, section, children }) => (
    <Box sx={{ mb: 2 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 1.5,
          cursor: 'pointer',
          '&:hover': { opacity: 0.8 }
        }}
        onClick={() => handleSectionToggle(section)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600,
              color: '#2C3E50',
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            {title}
          </Typography>
        </Box>
        <IconButton size="small">
          <ExpandMoreIcon 
            sx={{ 
              transform: expandedSections[section] ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s'
            }} 
          />
        </IconButton>
      </Box>
      <Collapse in={expandedSections[section]}>
        <Box sx={{ pl: { xs: 0, sm: 1 } }}>
          {children}
        </Box>
      </Collapse>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );

  const filterContent = (
    <>
      {/* Header for desktop */}
      {!isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2C3E50' }}>
            Filters
          </Typography>
          {activeFiltersCount > 0 && (
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={clearAllFilters}
              sx={{ color: '#E74C3C' }}
            >
              Clear All ({activeFiltersCount})
            </Button>
          )}
        </Box>
      )}

      {/* Salary Range */}
      <FilterSection 
        title="Salary Range" 
        icon={<AttachMoneyIcon sx={{ color: '#27AE60' }} />}
        section="salary"
      >
        <Box sx={{ px: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              ${salaryRange[0]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${salaryRange[1]}
            </Typography>
          </Box>
          <Slider
            value={salaryRange}
            onChange={(e, newValue) => setSalaryRange(newValue)}
            valueLabelDisplay="auto"
            min={400}
            max={1000}
            sx={{ 
              color: '#27AE60',
              '& .MuiSlider-thumb': {
                backgroundColor: '#27AE60',
                '&:hover': {
                  boxShadow: '0 0 0 8px rgba(39, 174, 96, 0.16)'
                }
              }
            }}
          />
        </Box>
      </FilterSection>

      {/* Countries */}
      <FilterSection 
        title="Countries" 
        icon={<PublicIcon sx={{ color: '#3498DB' }} />}
        section="countries"
      >
        <Grid container spacing={1}>
          {countryOptions.map((country) => (
            <Grid item xs={12} sm={6} md={12} key={country}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedCountries.includes(country)}
                    onChange={() => handleToggle(setSelectedCountries, country)}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      color: '#3498DB',
                      '&.Mui-checked': { color: '#3498DB' },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    {country}
                  </Typography>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Grid>
          ))}
        </Grid>
      </FilterSection>

      {/* Skillsets */}
      <FilterSection 
        title="Skillsets" 
        icon={<StarIcon sx={{ color: '#F39C12' }} />}
        section="skills"
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {skillsetOptions.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              clickable
              size={isMobile ? "small" : "medium"}
              onClick={() => handleToggle(setSkillsets, skill)}
              variant={skillsets.includes(skill) ? "filled" : "outlined"}
              sx={{
                backgroundColor: skillsets.includes(skill) ? '#F39C12' : 'transparent',
                color: skillsets.includes(skill) ? 'white' : '#34495E',
                borderColor: '#F39C12',
                '&:hover': {
                  backgroundColor: skillsets.includes(skill) ? '#E67E22' : 'rgba(243, 156, 18, 0.08)',
                  borderColor: '#E67E22',
                },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            />
          ))}
        </Box>
      </FilterSection>

      {/* Languages */}
      <FilterSection 
        title="Languages" 
        icon={<TranslateIcon sx={{ color: '#9B59B6' }} />}
        section="languages"
      >
        <Grid container spacing={1}>
          {languageOptions.map((lang) => (
            <Grid item xs={6} sm={6} md={12} key={lang}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={languages.includes(lang)}
                    onChange={() => handleToggle(setLanguages, lang)}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      color: '#9B59B6',
                      '&.Mui-checked': { color: '#9B59B6' },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    {lang}
                  </Typography>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Grid>
          ))}
        </Grid>
      </FilterSection>

      {/* Age Range */}
      <FilterSection 
        title="Age Range" 
        icon={<PersonIcon sx={{ color: '#E74C3C' }} />}
        section="age"
      >
        <Box sx={{ px: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            {/* <Typography variant="body2" color="text.secondary">
              {ageRange[0]} years
            </Typography> */}
            {/* <Typography variant="body2" color="text.secondary">
              {ageRange[1]} years
            </Typography> */}
          </Box>
          {/* <Slider
            value={ageRange}
            onChange={(e, newValue) => setAgeRange(newValue)}
            valueLabelDisplay="auto"
            min={18}
            max={60}
            sx={{ 
              color: '#E74C3C',
              '& .MuiSlider-thumb': {
                backgroundColor: '#E74C3C',
                '&:hover': {
                  boxShadow: '0 0 0 8px rgba(231, 76, 60, 0.16)'
                }
              }
            }}
          /> */}
        </Box>
      </FilterSection>

      {/* Experience Types */}
      <FilterSection 
        title="Experience Type" 
        icon={<WorkIcon sx={{ color: '#16A085' }} />}
        section="experience"
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {typeOptions.map((type) => (
            <Button
              key={type}
              size={isMobile ? "small" : "medium"}
              variant={types.includes(type) ? "contained" : "outlined"}
              onClick={() => handleToggle(setTypes, type)}
              sx={{
                color: types.includes(type) ? 'white' : '#16A085',
                backgroundColor: types.includes(type) ? '#16A085' : 'transparent',
                borderColor: '#16A085',
                textTransform: 'none',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                py: { xs: 0.5, sm: 1 },
                px: { xs: 1, sm: 2 },
                '&:hover': {
                  borderColor: '#16A085',
                  backgroundColor: types.includes(type) ? '#138D75' : 'rgba(22, 160, 133, 0.08)',
                },
              }}
            >
              {type}
            </Button>
          ))}
        </Box>
      </FilterSection>
    </>
  );

  // Mobile view with collapsible drawer
  if (isMobile) {
    return (
      <>
        {/* Mobile Filter Toggle Button */}
        <Box sx={{ mb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{
              backgroundColor: '#34495E',
              color: 'white',
              py: 1.5,
              '&:hover': {
                backgroundColor: '#2C3E50',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge badgeContent={activeFiltersCount} color="error" />
              )}
            </Box>
          </Button>
        </Box>

        {/* Mobile Filter Content */}
        <Collapse in={mobileOpen}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              borderRadius: 2, 
              mb: 3,
              backgroundColor: '#FAFAFA'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                Filters
              </Typography>
              {activeFiltersCount > 0 && (
                <Button
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={clearAllFilters}
                  sx={{ color: '#E74C3C', fontSize: '0.75rem' }}
                >
                  Clear ({activeFiltersCount})
                </Button>
              )}
            </Box>
            {filterContent}
          </Paper>
        </Collapse>
      </>
    );
  }

  // Desktop/Tablet view
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: 3, 
        mb: 3,
        backgroundColor: '#FFFFFF',
        border: '1px solid',
        borderColor: 'divider',
        position: isTablet ? 'relative' : 'sticky',
        top: isTablet ? 0 : 80,
        maxHeight: isTablet ? 'none' : 'calc(100vh - 100px)',
        overflowY: isTablet ? 'visible' : 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '3px',
          '&:hover': {
            background: '#555',
          }
        }
      }}
    >
      {filterContent}
    </Paper>
  );
}