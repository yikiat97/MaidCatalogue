import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Collapse,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Public as PublicIcon,
  Star as StarIcon,
  Translate as TranslateIcon,
  Work as WorkIcon,
  ExpandMore as ExpandMoreIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';

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

const skillsetOptions = ['Cooking', 'Housekeeping', 'Childcare', 'Babysitting', 'Elderly Care', 'Dog(s)', 'Cat(s)', 'Caregiving'];
const languageOptions = ['English', 'Mandarin', 'Dialect'];
const typeOptions = ['New/Fresh', 'Transfer', 'Ex-Singapore', 'Ex-Hongkong', 'Ex-Taiwan', 'Ex-Middle East'];
const countryOptions = ['Philippines', 'Indonesia', 'Myanmar'];

// Improved range slider with touch support for mobile
const SmoothRangeSlider = ({
  min = 0,
  max = 100,
  step = 1,
  value = [min, max],
  onChangeCommitted,
  color = brandColors.primary,
  formatLabel = v => v,
  disabled = false
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (!isDragging) setLocalValue(value);
  }, [value, isDragging]);

  const percent = useCallback(v => ((v - min) / (max - min)) * 100, [min, max]);
  
  const getValue = useCallback((clientX) => {
    if (!sliderRef.current) return min;
    const { left, width } = sliderRef.current.getBoundingClientRect();
    let pct = (clientX - left) / width;
    pct = Math.max(0, Math.min(1, pct));
    const raw = min + pct * (max - min);
    return Math.round(raw / step) * step;
  }, [min, max, step]);

  const updateValue = useCallback((clientX, thumb) => {
    const val = getValue(clientX);
    const next = [...localValue];
    if (thumb === 0) {
      next[0] = Math.min(val, localValue[1] - step);
    } else {
      next[1] = Math.max(val, localValue[0] + step);
    }
    setLocalValue(next);
  }, [getValue, localValue, step]);

  const handleStart = useCallback((e, thumb) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    setActiveThumb(thumb);
    
    // Get the correct clientX for both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateValue(clientX, thumb);
  }, [disabled, updateValue]);

  const handleMove = useCallback((e) => {
    if (!isDragging || activeThumb === null) return;
    e.preventDefault();
    
    // Get the correct clientX for both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateValue(clientX, activeThumb);
  }, [isDragging, activeThumb, updateValue]);

  const handleEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setActiveThumb(null);
      onChangeCommitted?.(null, localValue);
    }
  }, [isDragging, onChangeCommitted, localValue]);

  // Add event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, handleMove, handleEnd]);

  const onTrackClick = useCallback(e => {
    if (disabled || isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const val = getValue(clientX);
    const next = [...localValue];
    const d0 = Math.abs(val - localValue[0]);
    const d1 = Math.abs(val - localValue[1]);
    if (d0 < d1) {
      next[0] = Math.min(val, localValue[1] - step);
    } else {
      next[1] = Math.max(val, localValue[0] + step);
    }
    setLocalValue(next);
    onChangeCommitted?.(null, next);
  }, [disabled, isDragging, getValue, localValue, onChangeCommitted, step]);

  const leftPct = percent(localValue[0]);
  const rightPct = percent(localValue[1]);

  return (
    <Box sx={{ width: '100%', px: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: brandColors.textSecondary,
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
          {formatLabel(localValue[0])}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: brandColors.textSecondary,
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
          {formatLabel(localValue[1])}
        </Typography>
      </Box>
      <Box
        ref={sliderRef}
        onClick={onTrackClick}
        onTouchStart={onTrackClick}
        sx={{ 
          position: 'relative', 
          height: 40, // Increased height for better touch targets
          display: 'flex', 
          alignItems: 'center', 
          cursor: disabled ? 'default' : 'pointer', 
          userSelect: 'none', 
          opacity: disabled ? 0.5 : 1,
          touchAction: 'none' // Prevents default touch behaviors
        }}
      >
        {/* Background track */}
        <Box sx={{ 
          position: 'absolute', 
          width: '100%', 
          height: 8, // Slightly thicker track
          bgcolor: brandColors.border, 
          borderRadius: 4 
        }} />
        
        {/* Active track */}
        <Box sx={{ 
          position: 'absolute', 
          height: 8,
          background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
          borderRadius: 4, 
          left: `${leftPct}%`, 
          width: `${rightPct - leftPct}%`, 
          transition: isDragging ? 'none' : 'all 0.15s ease' 
        }} />
        
        {/* Thumbs */}
        {[0, 1].map(idx => (
          <Box
            key={idx}
            onMouseDown={e => handleStart(e, idx)}
            onTouchStart={e => handleStart(e, idx)}
            sx={{
              position: 'absolute', 
              left: `${idx === 0 ? leftPct : rightPct}%`, 
              transform: 'translateX(-50%)',
              width: 28, // Larger touch target
              height: 28, // Larger touch target
              background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
              borderRadius: '50%', 
              border: '3px solid white',
              boxShadow: activeThumb === idx 
                ? `0 0 0 8px ${color}20, 0 4px 12px rgba(0,0,0,0.3)` 
                : '0 2px 8px rgba(0,0,0,0.2)',
              cursor: disabled ? 'default' : 'grab', 
              transition: isDragging ? 'none' : 'all 0.15s ease', 
              zIndex: activeThumb === idx ? 3 : 2,
              touchAction: 'none', // Prevents default touch behaviors
              '&:hover': disabled ? {} : { 
                transform: 'translateX(-50%) scale(1.1)',
                boxShadow: `0 0 0 8px ${color}20, 0 4px 12px rgba(0,0,0,0.3)`
              }, 
              '&:active': { 
                cursor: 'grabbing',
                transform: 'translateX(-50%) scale(1.05)'
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const FilterSection = memo(({ title, icon, expanded, onToggle, children }) => (
  <Box sx={{ mb: 3 }}>
    <Box 
      display='flex' 
      alignItems='center' 
      justifyContent='space-between' 
      onClick={onToggle} 
      sx={{ 
        cursor: 'pointer', 
        mb: 2,
        p: 1,
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: `${brandColors.primary}08`,
        }
      }}
    >
      <Box display='flex' alignItems='center' gap={1.5}>
        <Box sx={{ 
          color: brandColors.primary,
          display: 'flex',
          alignItems: 'center'
        }}>
          {icon}
        </Box>
        <Typography 
          variant='subtitle1' 
          sx={{ 
            fontWeight: 600,
            color: brandColors.text,
            fontSize: '1rem'
          }}
        >
          {title}
        </Typography>
      </Box>
      <IconButton 
        size='small'
        sx={{
          color: brandColors.primary,
          '&:hover': {
            backgroundColor: `${brandColors.primary}15`
          }
        }}
      >
        <ExpandMoreIcon 
          sx={{ 
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: '0.3s' 
          }}
        />
      </IconButton>
    </Box>
    <Collapse in={expanded}>
      <Box sx={{ pl: 1 }}>
        {children}
      </Box>
    </Collapse>
    <Divider sx={{ 
      mt: 2,
      borderColor: brandColors.border,
      opacity: 0.6
    }} />
  </Box>
));

const FilterBar = memo(function FilterBar({
  defaultSalaryRange, onSalaryChange,
  defaultAgeRange, onAgeChange,
  selectedCountries, setSelectedCountries,
  skillsets, setSkillsets,
  languages, setLanguages,
  types, setTypes
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exp, setExp] = useState({ 
    salary: true, 
    age: true, 
    countries: true, 
    skills: true, 
    languages: true, 
    experience: true,
    Skillsets: true, 
    Languages: true, 
    Experience: true
  });

  const toggle = s => setExp(e => ({...e, [s]: !e[s]}));
  
  const clearAll = () => {
    onSalaryChange([400, 1000]);
    onAgeChange([18, 60]);
    setSelectedCountries([]);
    setSkillsets([]);
    setLanguages([]);
    setTypes([]);
  };

  const handleToggle = useCallback((setter, value) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }, []);

  const activeCount = useMemo(() => {
    let c = 0;
    if (defaultSalaryRange[0] > 400 || defaultSalaryRange[1] < 1000) c++;
    if (defaultAgeRange[0] > 18 || defaultAgeRange[1] < 60) c++;
    c += selectedCountries.length + skillsets.length + languages.length + types.length;
    return c;
  }, [defaultSalaryRange, defaultAgeRange, selectedCountries, skillsets, languages, types]);

  const content = (
    <>
      {!isMobile && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography 
            variant='h6' 
            sx={{ 
              fontWeight: 700,
              color: brandColors.text
            }}
          >
            Filters
          </Typography>
          {activeCount > 0 && (
            <Button 
              startIcon={<ClearIcon />} 
              onClick={clearAll}
              sx={{
                color: brandColors.error,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: `${brandColors.error}10`
                }
              }}
            >
              Clear All ({activeCount})
            </Button>
          )}
        </Box>
      )}

      <FilterSection 
        title='Salary Range' 
        icon={<MoneyIcon sx={{ color: brandColors.success }} />} 
        expanded={exp.salary} 
        onToggle={() => toggle('salary')}
      >
        <SmoothRangeSlider
          min={400} 
          max={1000} 
          step={1}
          value={defaultSalaryRange}
          onChangeCommitted={(e, v) => onSalaryChange(v)}
          color={brandColors.success} 
          formatLabel={v => `$${v}`}
        />
      </FilterSection>

      <FilterSection 
        title='Age Range' 
        icon={<PersonIcon sx={{ color: brandColors.warning }} />} 
        expanded={exp.age} 
        onToggle={() => toggle('age')}
      >
        <SmoothRangeSlider
          min={18} 
          max={60} 
          step={1}
          value={defaultAgeRange}
          onChangeCommitted={(e, v) => onAgeChange(v)}
          color={brandColors.warning} 
          formatLabel={v => `${v} yrs`}
        />
      </FilterSection>

      <FilterSection 
        title='Countries' 
        icon={<PublicIcon sx={{ color: brandColors.primary }} />} 
        expanded={exp.countries} 
        onToggle={() => toggle('countries')}
      >
        <Grid container spacing={1}>
          {countryOptions.map(c => (
            <Grid key={c} item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={selectedCountries.includes(c)} 
                    onChange={() => {
                      const next = selectedCountries.includes(c)
                        ? selectedCountries.filter(x => x !== c)
                        : [...selectedCountries, c];
                      setSelectedCountries(next);
                    }}
                    sx={{
                      color: brandColors.primary,
                      '&.Mui-checked': { 
                        color: brandColors.primary 
                      },
                    }}
                  />
                } 
                label={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: brandColors.text,
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }}
                  >
                    {c}
                  </Typography>
                }
              />
            </Grid>
          ))}
        </Grid>
      </FilterSection>

      <FilterSection 
        title="Skillsets" 
        icon={<StarIcon sx={{ color: brandColors.warning }} />}
        expanded={exp.Skillsets} 
        onToggle={() => toggle('Skillsets')}
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
                backgroundColor: skillsets.includes(skill) 
                  ? `linear-gradient(135deg, ${brandColors.warning} 0%, ${brandColors.warning}80 100%)`
                  : 'transparent',
                color: skillsets.includes(skill) ? 'white' : brandColors.text,
                borderColor: brandColors.warning,
                borderWidth: '2px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: skillsets.includes(skill) 
                    ? brandColors.warning 
                    : `${brandColors.warning}08`,
                  borderColor: brandColors.warning,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(243, 156, 18, 0.3)'
                },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            />
          ))}
        </Box>
      </FilterSection>

      <FilterSection 
        title="Languages" 
        icon={<TranslateIcon sx={{ color: brandColors.primary }} />}
        expanded={exp.Languages} 
        onToggle={() => toggle('Languages')}
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
                      color: brandColors.primary,
                      '&.Mui-checked': { 
                        color: brandColors.primary 
                      },
                    }}
                  />
                }
                label={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      color: brandColors.text,
                      fontWeight: 500
                    }}
                  >
                    {lang}
                  </Typography>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Grid>
          ))}
        </Grid>
      </FilterSection>

      <FilterSection 
        title="Experience Type" 
        icon={<WorkIcon sx={{ color: brandColors.success }} />}
        expanded={exp.Experience} 
        onToggle={() => toggle('Experience')}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {typeOptions.map((type) => (
            <Button
              key={type}
              size={isMobile ? "small" : "medium"}
              variant={types.includes(type) ? "contained" : "outlined"}
              onClick={() => handleToggle(setTypes, type)}
              sx={{
                color: types.includes(type) ? 'white' : brandColors.success,
                backgroundColor: types.includes(type) 
                  ? `linear-gradient(135deg, ${brandColors.success} 0%, ${brandColors.success}80 100%)`
                  : 'transparent',
                borderColor: brandColors.success,
                borderWidth: '2px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                py: { xs: 0.5, sm: 1 },
                px: { xs: 1, sm: 2 },
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: brandColors.success,
                  backgroundColor: types.includes(type) 
                    ? brandColors.success 
                    : `${brandColors.success}08`,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(39, 174, 96, 0.3)'
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

  if (isMobile) {
    return (
      <>
        <Button 
          fullWidth 
          variant='contained' 
          startIcon={<FilterListIcon />} 
          onClick={() => setMobileOpen(o => !o)}
          sx={{
            background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryLight} 100%)`,
            color: 'white',
            fontWeight: 600,
            py: 1.5,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(255, 145, 77, 0.3)',
            '&:hover': {
              background: `linear-gradient(135deg, ${brandColors.primaryDark} 0%, ${brandColors.primary} 100%)`,
              boxShadow: '0 6px 16px rgba(255, 145, 77, 0.4)',
            }
          }}
        >
          Filters {activeCount > 0 && <Badge badgeContent={activeCount} color='error' />}
        </Button>
        <Collapse in={mobileOpen}>
          <Paper sx={{ 
            p: 3, 
            mt: 2, 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(12, 25, 27, 0.12)',
            border: `1px solid ${brandColors.border}`
          }}>
            {content}
          </Paper>
        </Collapse>
      </>
    );
  }

  return (
    <Box sx={{ 
      position: isTablet ? 'relative' : 'sticky', 
      top: isTablet ? 0 : 80, 
      maxHeight: isTablet ? 'auto' : 'calc(100vh-100px)', 
      overflowY: isTablet ? 'visible' : 'auto',
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: brandColors.background,
        borderRadius: '3px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: brandColors.primary,
        borderRadius: '3px',
        '&:hover': {
          background: brandColors.primaryDark,
        }
      }
    }}>
      {content}
    </Box>
  );
});

export default FilterBar;