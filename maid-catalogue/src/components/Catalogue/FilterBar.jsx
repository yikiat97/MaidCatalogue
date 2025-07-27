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

const skillsetOptions = ['Cooking', 'Housekeeping', 'Childcare', 'Babysitting', 'Elderly Care', 'Dog(s)', 'Cat(s)', 'Caregiving'];
const languageOptions = ['English', 'Mandarin', 'Malay', 'Tamil'];
const typeOptions = ['New/Fresh', 'Transfer', 'Ex-Singapore', 'Ex-Hongkong', 'Ex-Taiwan', 'Ex-Middle East'];
const countryOptions = ['Philippines', 'Indonesia', 'Myanmar'];

// Smooth, flicker-free range slider
const SmoothRangeSlider = ({
  min = 0,
  max = 100,
  step = 1,
  value = [min, max],
  onChangeCommitted,
  color = '#3498DB',
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
  const getValue = useCallback(x => {
    if (!sliderRef.current) return min;
    const { left, width } = sliderRef.current.getBoundingClientRect();
    let pct = (x - left) / width;
    pct = Math.max(0, Math.min(1, pct));
    const raw = min + pct * (max - min);
    return Math.round(raw / step) * step;
  }, [min, max, step]);

  const onMouseDown = useCallback((e, thumb) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    setActiveThumb(thumb);

    const onMouseMove = mv => {
      const val = getValue(mv.clientX);
      const next = [...localValue];
      if (thumb === 0) next[0] = Math.min(val, localValue[1]);
      else          next[1] = Math.max(val, localValue[0]);
      setLocalValue(next);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      setActiveThumb(null);
      onChangeCommitted?.(null, localValue);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [disabled, getValue, localValue, onChangeCommitted]);

  const onTrackClick = useCallback(e => {
    if (disabled || isDragging) return;
    const val = getValue(e.clientX);
    const next = [...localValue];
    const d0 = Math.abs(val - localValue[0]);
    const d1 = Math.abs(val - localValue[1]);
    if (d0 < d1) next[0] = Math.min(val, localValue[1]);
    else         next[1] = Math.max(val, localValue[0]);
    setLocalValue(next);
    onChangeCommitted?.(null, next);
  }, [disabled, isDragging, getValue, localValue, onChangeCommitted]);

  const leftPct = percent(localValue[0]);
  const rightPct = percent(localValue[1]);

  return (
    <Box sx={{ width: '100%', px:1 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', mb:1 }}>
        <Typography variant="body2" color="text.secondary">{formatLabel(localValue[0])}</Typography>
        <Typography variant="body2" color="text.secondary">{formatLabel(localValue[1])}</Typography>
      </Box>
      <Box
        ref={sliderRef}
        onClick={onTrackClick}
        sx={{ position:'relative', height:32, display:'flex', alignItems:'center', cursor: disabled?'default':'pointer', userSelect:'none', opacity: disabled?0.5:1 }}
      >
        <Box sx={{ position:'absolute', width:'100%', height:4, bgcolor:'#E0E0E0', borderRadius:2 }} />
        <Box sx={{ position:'absolute', height:4, bgcolor:color, borderRadius:2, left:`${leftPct}%`, width:`${rightPct-leftPct}%`, transition: isDragging?'none':'all 0.15s ease' }} />
        {[0,1].map(idx => (
          <Box
            key={idx}
            onMouseDown={e => onMouseDown(e, idx)}
            sx={{
              position:'absolute', left:`${idx===0?leftPct:rightPct}%`, transform:'translateX(-50%)',
              width:20, height:20, bgcolor:color, borderRadius:'50%', border:'2px solid white',
              boxShadow: activeThumb===idx?`0 0 0 8px ${color}20`:'0 2px 6px rgba(0,0,0,0.2)',
              cursor: disabled?'default':'grab', transition:isDragging?'none':'all 0.15s ease', zIndex: activeThumb===idx?3:2,
              '&:hover': disabled?{}:{ transform:'translateX(-50%) scale(1.1)' }, '&:active':{ cursor:'grabbing' }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const FilterSection = memo(({ title, icon, expanded, onToggle, children }) => (
  <Box mb={2}>
    <Box display='flex' alignItems='center' justifyContent='space-between' onClick={onToggle} sx={{ cursor:'pointer', mb:1.5 }}>
      <Box display='flex' alignItems='center' gap={1}>{icon}<Typography variant='subtitle1' fontWeight={600}>{title}</Typography></Box>
      <IconButton size='small'><ExpandMoreIcon sx={{ transform:expanded?'rotate(180deg)':'rotate(0deg)', transition:'0.3s' }}/></IconButton>
    </Box>
    <Collapse in={expanded}><Box pl={1}>{children}</Box></Collapse>
    <Divider sx={{ mt:1 }} />
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
  const [exp, setExp] = useState({ salary:true, age:true, countries:true, skills:true, languages:true, experience:true ,Skillsets:true, Languages:true, Experience:true});

  const toggle = s => setExp(e => ({...e, [s]: !e[s]}));
  const clearAll = () => {
    onSalaryChange([400,1000]);
    onAgeChange([18,60]);
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
    let c=0;
    if(defaultSalaryRange[0]>400||defaultSalaryRange[1]<1000) c++;
    if(defaultAgeRange[0]>18  ||defaultAgeRange[1]<60)   c++;
    c += selectedCountries.length + skillsets.length + languages.length + types.length;
    return c;
  },[defaultSalaryRange, defaultAgeRange, selectedCountries, skillsets, languages, types]);

  const content = (
    <>
      {!isMobile && <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h5'>Filters</Typography>
        {activeCount>0 && <Button startIcon={<ClearIcon />} color='error' onClick={clearAll}>Clear All ({activeCount})</Button>}
      </Box>}

      <FilterSection title='Salary Range' icon={<MoneyIcon color='success'/>} expanded={exp.salary} onToggle={()=>toggle('salary')}>
        <SmoothRangeSlider
          min={400} max={1000} step={25}
          value={defaultSalaryRange}
          onChangeCommitted={(e,v)=>onSalaryChange(v)}
          color='#27AE60' formatLabel={v=>`$${v}`}
        />
      </FilterSection>

      <FilterSection title='Age Range' icon={<PersonIcon color='warning'/>} expanded={exp.age} onToggle={()=>toggle('age')}>
        <SmoothRangeSlider
          min={18} max={60} step={1}
          value={defaultAgeRange}
          onChangeCommitted={(e,v)=>onAgeChange(v)}
          color='#E74C3C' formatLabel={v=>`${v} yrs`}
        />
      </FilterSection>

      <FilterSection title='Countries' icon={<PublicIcon color='info'/>} expanded={exp.countries} onToggle={()=>toggle('countries')}>
        <Grid container spacing={1}>{countryOptions.map(c=>(
          <Grid key={c} item xs={6}>
            <FormControlLabel
              control={<Checkbox checked={selectedCountries.includes(c)} onChange={()=>{
                const next = selectedCountries.includes(c)
                  ? selectedCountries.filter(x=>x!==c)
                  : [...selectedCountries,c];
                setSelectedCountries(next);
              }}/>} label={c}
            />
          </Grid>
        ))}</Grid>
      </FilterSection>

      {/* Add Skillsets, Languages, Experience sections similarly using Chips or Buttons */}
          
      {/* Skillsets - UNCHANGED */}
      <FilterSection 
        title="Skillsets" 
        icon={<StarIcon sx={{ color: '#F39C12' }} />}
        section="skills"
        expanded={exp.Skillsets} 
        onToggle={()=>toggle('Skillsets')}
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
                transition: 'all 0.2s ease',
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

      {/* Languages - UNCHANGED */}
      <FilterSection 
        title="Languages" 
        icon={<TranslateIcon sx={{ color: '#9B59B6' }} />}
        section="languages"
        expanded={exp.Languages} 
        onToggle={()=>toggle('Languages')}
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


      {/* Experience Types - UNCHANGED */}
      <FilterSection 
        title="Experience Type" 
        icon={<WorkIcon sx={{ color: '#16A085' }} />}
        section="experience"
        expanded={exp.Experience} 
        onToggle={()=>toggle('Experience')}
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
                transition: 'all 0.2s ease',
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

  if(isMobile) {
    return <>
      <Button fullWidth variant='contained' startIcon={<FilterListIcon />} onClick={()=>setMobileOpen(o=>!o)}>
        Filters {activeCount>0 && <Badge badgeContent={activeCount} color='error'/>}
      </Button>
      <Collapse in={mobileOpen}><Paper sx={{ p:2, mt:2 }}>{content}</Paper></Collapse>
    </>;
  }

  return <Paper sx={{ p:2, borderRadius:2, position:isTablet?'relative':'sticky', top:isTablet?0:80, maxHeight:isTablet?'auto':'calc(100vh-100px)', overflowY:isTablet?'visible':'auto' }}>{content}</Paper>;
});

export default FilterBar;


// import { 
//   Stack, 
//   Typography, 
//   Slider, 
//   Chip, 
//   Box, 
//   Button, 
//   Checkbox, 
//   FormControlLabel, 
//   Paper, 
//   Grid,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   useTheme,
//   useMediaQuery,
//   IconButton,
//   Collapse,
//   Divider,
//   Badge
// } from '@mui/material';
// import { useState, useCallback, useRef, useEffect, useMemo, memo } from 'react';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import ClearIcon from '@mui/icons-material/Clear';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import PublicIcon from '@mui/icons-material/Public';
// import StarIcon from '@mui/icons-material/Star';
// import TranslateIcon from '@mui/icons-material/Translate';
// import PersonIcon from '@mui/icons-material/Person';
// import WorkIcon from '@mui/icons-material/Work';

// const skillsetOptions = ['Cooking', 'Housekeeping', 'Childcare', 'Babysitting', 'Elderly Care', 'Dog(s)', 'Cat(s)', 'Caregiving'];
// const languageOptions = ['English', 'Mandarin', 'Malay', 'Tamil'];
// const typeOptions = ['New/Fresh', 'Transfer', 'Ex-Singapore', 'Ex-Hongkong', 'Ex-Taiwan', 'Ex-Middle East'];
// const countryOptions = ['Philippines', 'Indonesia', 'Myanmar'];

// // === EXACT COPY OF MY WORKING SMOOTH SLIDER ===
// const SmoothRangeSlider = ({ 
//   min = 0, 
//   max = 100, 
//   step = 1, 
//   value = [min, max], 
//   onChange, 
//   onChangeCommitted,
//   color = '#3498DB',
//   formatLabel = (val) => val,
//   disabled = false 
// }) => {
//   const [localValue, setLocalValue] = useState(value);
//   const [isDragging, setIsDragging] = useState(false);
//   const [activeThumb, setActiveThumb] = useState(null);
//   const sliderRef = useRef(null);

//   // Update local value when prop changes (but not when dragging)
//   useEffect(() => {
//     if (!isDragging) {
//       setLocalValue(value);
//     }
//   }, [value, isDragging]);

//   const getPercentage = useCallback((val) => {
//     return ((val - min) / (max - min)) * 100;
//   }, [min, max]);

//   const getValueFromPosition = useCallback((clientX) => {
//     if (!sliderRef.current) return min;
    
//     const rect = sliderRef.current.getBoundingClientRect();
//     const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
//     const rawValue = min + percentage * (max - min);
//     return Math.round(rawValue / step) * step;
//   }, [min, max, step]);

//   const handleMouseDown = useCallback((e, thumbIndex) => {
//     if (disabled) return;
    
//     e.preventDefault();
//     setIsDragging(true);
//     setActiveThumb(thumbIndex);
    
//     const handleMouseMove = (moveEvent) => {
//       const newValue = getValueFromPosition(moveEvent.clientX);
//       const newRange = [...localValue];
      
//       if (thumbIndex === 0) {
//         // Left thumb - ensure it doesn't go beyond right thumb
//         newRange[0] = Math.min(newValue, localValue[1]);
//       } else {
//         // Right thumb - ensure it doesn't go below left thumb
//         newRange[1] = Math.max(newValue, localValue[0]);
//       }
      
//       setLocalValue(newRange);
//       if (onChange) {
//         onChange(null, newRange);
//       }
//     };
    
//     const handleMouseUp = () => {
//       setIsDragging(false);
//       setActiveThumb(null);
//       if (onChangeCommitted) {
//         onChangeCommitted(null, localValue);
//       }
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     };
    
//     document.addEventListener('mousemove', handleMouseMove);
//     document.addEventListener('mouseup', handleMouseUp);
//   }, [disabled, localValue, getValueFromPosition, onChange, onChangeCommitted]);

//   const handleTrackClick = useCallback((e) => {
//     if (disabled || isDragging) return;
    
//     const newValue = getValueFromPosition(e.clientX);
//     const newRange = [...localValue];
    
//     // Determine which thumb to move based on proximity
//     const leftDistance = Math.abs(newValue - localValue[0]);
//     const rightDistance = Math.abs(newValue - localValue[1]);
    
//     if (leftDistance < rightDistance) {
//       newRange[0] = Math.min(newValue, localValue[1]);
//     } else {
//       newRange[1] = Math.max(newValue, localValue[0]);
//     }
    
//     setLocalValue(newRange);
//     if (onChange) {
//       onChange(null, newRange);
//     }
//     if (onChangeCommitted) {
//       onChangeCommitted(null, newRange);
//     }
//   }, [disabled, isDragging, localValue, getValueFromPosition, onChange, onChangeCommitted]);

//   const leftPercentage = getPercentage(localValue[0]);
//   const rightPercentage = getPercentage(localValue[1]);

//   return (
//     <Box sx={{ width: '100%', px: 1 }}>
//       {/* Value Labels */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
//           {formatLabel(localValue[0])}
//         </Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
//           {formatLabel(localValue[1])}
//         </Typography>
//       </Box>

//       {/* Slider Container */}
//       <Box
//         ref={sliderRef}
//         onClick={handleTrackClick}
//         sx={{
//           position: 'relative',
//           height: 32,
//           display: 'flex',
//           alignItems: 'center',
//           cursor: disabled ? 'default' : 'pointer',
//           userSelect: 'none',
//           opacity: disabled ? 0.5 : 1,
//         }}
//       >
//         {/* Background Track */}
//         <Box
//           sx={{
//             position: 'absolute',
//             width: '100%',
//             height: 4,
//             backgroundColor: '#E0E0E0',
//             borderRadius: 2,
//           }}
//         />

//         {/* Active Track */}
//         <Box
//           sx={{
//             position: 'absolute',
//             height: 4,
//             backgroundColor: color,
//             borderRadius: 2,
//             left: `${leftPercentage}%`,
//             width: `${rightPercentage - leftPercentage}%`,
//             transition: isDragging ? 'none' : 'all 0.15s ease',
//           }}
//         />

//         {/* Left Thumb */}
//         <Box
//           onMouseDown={(e) => handleMouseDown(e, 0)}
//           sx={{
//             position: 'absolute',
//             left: `${leftPercentage}%`,
//             transform: 'translateX(-50%)',
//             width: 20,
//             height: 20,
//             backgroundColor: color,
//             borderRadius: '50%',
//             border: '2px solid white',
//             boxShadow: activeThumb === 0 
//               ? `0 0 0 8px ${color}20` 
//               : '0 2px 6px rgba(0,0,0,0.2)',
//             cursor: disabled ? 'default' : 'grab',
//             transition: isDragging ? 'none' : 'all 0.15s ease',
//             zIndex: activeThumb === 0 ? 3 : 2,
//             '&:hover': disabled ? {} : {
//               transform: 'translateX(-50%) scale(1.1)',
//               boxShadow: `0 0 0 8px ${color}20`,
//             },
//             '&:active': {
//               cursor: 'grabbing',
//             }
//           }}
//         />

//         {/* Right Thumb */}
//         <Box
//           onMouseDown={(e) => handleMouseDown(e, 1)}
//           sx={{
//             position: 'absolute',
//             left: `${rightPercentage}%`,
//             transform: 'translateX(-50%)',
//             width: 20,
//             height: 20,
//             backgroundColor: color,
//             borderRadius: '50%',
//             border: '2px solid white',
//             boxShadow: activeThumb === 1 
//               ? `0 0 0 8px ${color}20` 
//               : '0 2px 6px rgba(0,0,0,0.2)',
//             cursor: disabled ? 'default' : 'grab',
//             transition: isDragging ? 'none' : 'all 0.15s ease',
//             zIndex: activeThumb === 1 ? 3 : 2,
//             '&:hover': disabled ? {} : {
//               transform: 'translateX(-50%) scale(1.1)',
//               boxShadow: `0 0 0 8px ${color}20`,
//             },
//             '&:active': {
//               cursor: 'grabbing',
//             }
//           }}
//         />

//         {/* Value Tooltip (appears when dragging) */}
//         {isDragging && activeThumb !== null && (
//           <Box
//             sx={{
//               position: 'absolute',
//               left: `${activeThumb === 0 ? leftPercentage : rightPercentage}%`,
//               transform: 'translateX(-50%)',
//               bottom: 35,
//               backgroundColor: '#333',
//               color: 'white',
//               padding: '4px 8px',
//               borderRadius: 1,
//               fontSize: '0.75rem',
//               fontWeight: 500,
//               whiteSpace: 'nowrap',
//               zIndex: 4,
//               '&::after': {
//                 content: '""',
//                 position: 'absolute',
//                 top: '100%',
//                 left: '50%',
//                 transform: 'translateX(-50%)',
//                 border: '4px solid transparent',
//                 borderTopColor: '#333',
//               }
//             }}
//           >
//             {formatLabel(localValue[activeThumb])}
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// };

// // === YOUR EXACT FILTERBAR CODE WITH ONLY SLIDER REPLACEMENTS ===
// const FilterBar = memo(function FilterBar({
//   defaultSalaryRange, onSalaryChange,
//   defaultAgeRange, onAgeChange,
//   selectedCountries, setSelectedCountries,
//   skillsets, setSkillsets,
//   languages, setLanguages,
//   types, setTypes
// }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));
//   const [mobileOpen, setMobileOpen] = useState(false);
  
//   const [salaryRange, setSalaryRange] = useState(defaultSalaryRange);
//   const [ageRange, setAgeRange] = useState(defaultAgeRange);

//   const isDraggingSalary = useRef(false);
//   const isDraggingAge = useRef(false);
  
//   const salaryTimeoutRef = useRef(null);
//   const ageTimeoutRef = useRef(null);
  
//   const [expandedSections, setExpandedSections] = useState({
//     salary: true,
//     countries: true,
//     skills: true,
//     languages: true,
//     age: true,
//     experience: true
//   });

//   const activeFiltersCount = useMemo(() => 
//     (salaryRange[0] !== 400 || salaryRange[1] !== 1000 ? 1 : 0) +
//     selectedCountries.length +
//     skillsets.length +
//     languages.length +
//     (ageRange[0] !== 18 || ageRange[1] !== 60 ? 1 : 0) +
//     types.length
//   , [salaryRange, selectedCountries, skillsets, languages, ageRange, types]);

//   const handleToggle = useCallback((setter, value) => {
//     setter((prev) =>
//       prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
//     );
//   }, []);

//   const handleSectionToggle = useCallback((section) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   }, []);

//   const clearAllFilters = useCallback(() => {
//     const newSalaryRange = [400, 1000];
//     const newAgeRange = [18, 60];
    
//     if (salaryTimeoutRef.current) clearTimeout(salaryTimeoutRef.current);
//     if (ageTimeoutRef.current) clearTimeout(ageTimeoutRef.current);
    
//     setSalaryRange(newSalaryRange);
//     setSelectedCountries([]);
//     setSkillsets([]);
//     setLanguages([]);
//     setAgeRange(newAgeRange);
//     setTypes([]);
    
//     isDraggingSalary.current = false;
//     isDraggingAge.current = false;
//   }, [setSelectedCountries, setSkillsets, setLanguages, setTypes]);

//   const FilterSection = memo(({ title, icon, section, children }) => (
//     <Box sx={{ mb: 2 }}>
//       <Box 
//         sx={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'space-between',
//           mb: 1.5,
//           cursor: 'pointer',
//           '&:hover': { opacity: 0.8 }
//         }}
//         onClick={() => handleSectionToggle(section)}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           {icon}
//           <Typography 
//             variant="subtitle1" 
//             sx={{ 
//               fontWeight: 600,
//               color: '#2C3E50',
//               fontSize: { xs: '0.9rem', sm: '1rem' }
//             }}
//           >
//             {title}
//           </Typography>
//         </Box>
//         <IconButton size="small">
//           <ExpandMoreIcon 
//             sx={{ 
//               transform: expandedSections[section] ? 'rotate(180deg)' : 'rotate(0deg)',
//               transition: 'transform 0.3s'
//             }} 
//           />
//         </IconButton>
//       </Box>
//       <Collapse in={expandedSections[section]}>
//         <Box sx={{ pl: { xs: 0, sm: 1 } }}>
//           {children}
//         </Box>
//       </Collapse>
//       <Divider sx={{ mt: 2 }} />
//     </Box>
//   ));

//   const filterContent = (
//     <>
//       {/* Header for desktop */}
//       {!isMobile && (
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <Typography variant="h5" sx={{ fontWeight: 700, color: '#2C3E50' }}>
//             Filters
//           </Typography>
//           {activeFiltersCount > 0 && (
//             <Button
//               size="small"
//               startIcon={<ClearIcon />}
//               onClick={clearAllFilters}
//               sx={{ color: '#E74C3C' }}
//             >
//               Clear All ({activeFiltersCount})
//             </Button>
//           )}
//         </Box>
//       )}

//       {/* Salary Range - REPLACED WITH SMOOTH SLIDER */}
//       <FilterSection 
//         title="Salary Range" 
//         icon={<AttachMoneyIcon sx={{ color: '#27AE60' }} />}
//         section="salary"
//       >
//         <SmoothRangeSlider
//           value={salaryRange}
//           min={400}
//           max={1000}
//           step={25}
//           onChange={(e, newVal) => setSalaryRange(newVal)}
//           onChangeCommitted={(e, newVal) => onSalaryChange(newVal)}
//           color="#27AE60"
//           formatLabel={(val) => `$${val}`}
//         />
//       </FilterSection>

//       {/* Countries - UNCHANGED */}
//       <FilterSection 
//         title="Countries" 
//         icon={<PublicIcon sx={{ color: '#3498DB' }} />}
//         section="countries"
//       >
//         <Grid container spacing={1}>
//           {countryOptions.map((country) => (
//             <Grid item xs={12} sm={6} md={12} key={country}>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={selectedCountries.includes(country)}
//                     onChange={() => handleToggle(setSelectedCountries, country)}
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       color: '#3498DB',
//                       '&.Mui-checked': { color: '#3498DB' },
//                     }}
//                   />
//                 }
//                 label={
//                   <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
//                     {country}
//                   </Typography>
//                 }
//                 sx={{ width: '100%', m: 0 }}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       </FilterSection>

//       {/* Skillsets - UNCHANGED */}
//       <FilterSection 
//         title="Skillsets" 
//         icon={<StarIcon sx={{ color: '#F39C12' }} />}
//         section="skills"
//       >
//         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//           {skillsetOptions.map((skill) => (
//             <Chip
//               key={skill}
//               label={skill}
//               clickable
//               size={isMobile ? "small" : "medium"}
//               onClick={() => handleToggle(setSkillsets, skill)}
//               variant={skillsets.includes(skill) ? "filled" : "outlined"}
//               sx={{
//                 backgroundColor: skillsets.includes(skill) ? '#F39C12' : 'transparent',
//                 color: skillsets.includes(skill) ? 'white' : '#34495E',
//                 borderColor: '#F39C12',
//                 transition: 'all 0.2s ease',
//                 '&:hover': {
//                   backgroundColor: skillsets.includes(skill) ? '#E67E22' : 'rgba(243, 156, 18, 0.08)',
//                   borderColor: '#E67E22',
//                 },
//                 fontSize: { xs: '0.75rem', sm: '0.875rem' }
//               }}
//             />
//           ))}
//         </Box>
//       </FilterSection>

//       {/* Languages - UNCHANGED */}
//       <FilterSection 
//         title="Languages" 
//         icon={<TranslateIcon sx={{ color: '#9B59B6' }} />}
//         section="languages"
//       >
//         <Grid container spacing={1}>
//           {languageOptions.map((lang) => (
//             <Grid item xs={6} sm={6} md={12} key={lang}>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={languages.includes(lang)}
//                     onChange={() => handleToggle(setLanguages, lang)}
//                     size={isMobile ? "small" : "medium"}
//                     sx={{
//                       color: '#9B59B6',
//                       '&.Mui-checked': { color: '#9B59B6' },
//                     }}
//                   />
//                 }
//                 label={
//                   <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
//                     {lang}
//                   </Typography>
//                 }
//                 sx={{ width: '100%', m: 0 }}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       </FilterSection>

//       {/* Age Range - REPLACED WITH SMOOTH SLIDER */}
//       <FilterSection 
//         title="Age Range" 
//         icon={<PersonIcon sx={{ color: '#E74C3C' }} />}
//         section="age"
//       >
//         <SmoothRangeSlider
//           value={ageRange}
//           min={18}
//           max={60}
//           step={1}
//           onChange={(e, newVal) => setAgeRange(newVal)}
//           onChangeCommitted={(e, newVal) => onAgeChange(newVal)}
//           color="#E74C3C"
//           formatLabel={(val) => `${val} years`}
//         />
//       </FilterSection>

//       {/* Experience Types - UNCHANGED */}
//       <FilterSection 
//         title="Experience Type" 
//         icon={<WorkIcon sx={{ color: '#16A085' }} />}
//         section="experience"
//       >
//         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//           {typeOptions.map((type) => (
//             <Button
//               key={type}
//               size={isMobile ? "small" : "medium"}
//               variant={types.includes(type) ? "contained" : "outlined"}
//               onClick={() => handleToggle(setTypes, type)}
//               sx={{
//                 color: types.includes(type) ? 'white' : '#16A085',
//                 backgroundColor: types.includes(type) ? '#16A085' : 'transparent',
//                 borderColor: '#16A085',
//                 textTransform: 'none',
//                 fontSize: { xs: '0.75rem', sm: '0.875rem' },
//                 py: { xs: 0.5, sm: 1 },
//                 px: { xs: 1, sm: 2 },
//                 transition: 'all 0.2s ease',
//                 '&:hover': {
//                   borderColor: '#16A085',
//                   backgroundColor: types.includes(type) ? '#138D75' : 'rgba(22, 160, 133, 0.08)',
//                 },
//               }}
//             >
//               {type}
//             </Button>
//           ))}
//         </Box>
//       </FilterSection>
//     </>
//   );

//   // Mobile view - UNCHANGED
//   if (isMobile) {
//     return (
//       <>
//         <Box sx={{ mb: 2 }}>
//           <Button
//             fullWidth
//             variant="contained"
//             startIcon={<FilterListIcon />}
//             onClick={() => setMobileOpen(!mobileOpen)}
//             sx={{
//               backgroundColor: '#34495E',
//               color: 'white',
//               py: 1.5,
//               '&:hover': {
//                 backgroundColor: '#2C3E50',
//               }
//             }}
//           >
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <span>Filters</span>
//               {activeFiltersCount > 0 && (
//                 <Badge badgeContent={activeFiltersCount} color="error" />
//               )}
//             </Box>
//           </Button>
//         </Box>

//         <Collapse in={mobileOpen}>
//           <Paper 
//             elevation={3} 
//             sx={{ 
//               p: 2, 
//               borderRadius: 2, 
//               mb: 3,
//               backgroundColor: '#FAFAFA'
//             }}
//           >
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//               <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
//                 Filters
//               </Typography>
//               {activeFiltersCount > 0 && (
//                 <Button
//                   size="small"
//                   startIcon={<ClearIcon />}
//                   onClick={clearAllFilters}
//                   sx={{ color: '#E74C3C', fontSize: '0.75rem' }}
//                 >
//                   Clear ({activeFiltersCount})
//                 </Button>
//               )}
//             </Box>
//             {filterContent}
//           </Paper>
//         </Collapse>
//       </>
//     );
//   }

//   // Desktop/Tablet view - UNCHANGED
//   return (
//     <Paper 
//       elevation={2} 
//       sx={{ 
//         p: { xs: 2, sm: 3 }, 
//         borderRadius: 3, 
//         mb: 3,
//         backgroundColor: '#FFFFFF',
//         border: '1px solid',
//         borderColor: 'divider',
//         position: isTablet ? 'relative' : 'sticky',
//         top: isTablet ? 0 : 80,
//         maxHeight: isTablet ? 'none' : 'calc(100vh - 100px)',
//         overflowY: isTablet ? 'visible' : 'auto',
//         '&::-webkit-scrollbar': {
//           width: '6px',
//         },
//         '&::-webkit-scrollbar-track': {
//           background: '#f1f1f1',
//           borderRadius: '3px',
//         },
//         '&::-webkit-scrollbar-thumb': {
//           background: '#888',
//           borderRadius: '3px',
//           '&:hover': {
//             background: '#555',
//           }
//         }
//       }}
//     >
//       {filterContent}
//     </Paper>
//   );
// });

// export default FilterBar;