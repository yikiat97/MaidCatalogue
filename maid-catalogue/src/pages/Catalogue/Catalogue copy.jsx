import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Box,
  Chip,
  CircularProgress,
  Fade,
  Paper,
  IconButton,
  Badge,
  Drawer,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert,
  Snackbar,
  Fab,
  Zoom
} from '@mui/material';
import MaidCard from '../../components/Catalogue/MaidCard';
import FilterBar from '../../components/Catalogue/FilterBar';
import NavBar from '../../components/Catalogue/NavBar';
import logoBlack from '../assets/logoBlack.png';
import { useMaidContext } from '../../context/maidList';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import SortIcon from '@mui/icons-material/Sort';

export default function Catalogue() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [maids, setMaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salaryRange, setSalaryRange] = useState([400, 1000]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [skillsets, setSkillsets] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [types, setTypes] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [gridView, setGridView] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { maidList, setMaidList } = useMaidContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Calculate active filters count
  const activeFiltersCount = 
    selectedCountries.length +
    skillsets.length +
    languages.length +
    types.length +
    (salaryRange[0] !== 400 || salaryRange[1] !== 1000 ? 1 : 0) +
    (ageRange[0] !== 18 || ageRange[1] !== 60 ? 1 : 0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/auth/profile', {
          credentials: 'include',
        });

        if (res.ok) {
          setIsAuthenticated(true);
          fetch('http://localhost:3000/api/catalogue/user/favorites', {
            credentials: 'include',
          })
            .then((res) => res.json())
            .then((data) => {
              setUserFavorites(data);
            })
            .catch((err) => console.error(err));
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
      }
    };

    const fetchMaids = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3000/api/catalogue/maids', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch maids');
        const data = await res.json();
        setMaids(data);
        setMaidList(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load maids. Please try again later.');
        setLoading(false);
      }
    };

    checkAuth();
    fetchMaids();
  }, [setMaidList]);

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const clearAllFilters = () => {
    setSalaryRange([400, 1000]);
    setSelectedCountries([]);
    setSkillsets([]);
    setLanguages([]);
    setAgeRange([18, 60]);
    setTypes([]);
    setSearchQuery('');
    setShowSuccess(true);
  };

  // Enhanced filter logic with search
  const filteredMaids = maids.filter((maid) => {
    const searchMatch = searchQuery === '' || 
      maid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      maid.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      maid.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(maid.country);
    const salaryMatch = maid.salary >= salaryRange[0] && maid.salary <= salaryRange[1];
    const ageMatch = maid.age >= ageRange[0] && maid.age <= ageRange[1];
    const skillMatch = skillsets.length === 0 || skillsets.some((s) => maid.skills.includes(s));
    const languageMatch = languages.length === 0 || languages.some((l) => maid.languages.includes(l));
    const typeMatch = types.length === 0 || types.some((t) => maid.type.includes(t));
    
    return searchMatch && countryMatch && salaryMatch && ageMatch && skillMatch && languageMatch && typeMatch;
  });

  // Sort maids
  const sortedMaids = [...filteredMaids].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'salary-low':
        return a.salary - b.salary;
      case 'salary-high':
        return b.salary - a.salary;
      case 'age':
        return a.age - b.age;
      case 'experience':
        return b.experience - a.experience;
      default:
        return 0;
    }
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F7FA' }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Sidebar for Desktop */}
          {!isTablet && (
            <Grid item md={3} lg={2.5}>
              <Box 
                sx={{ 
                  position: 'sticky', 
                  top: 20,
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Logo */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    mb: 3, 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 3
                  }}
                >
                  <img 
                    src={logoBlack} 
                    alt="Logo" 
                    style={{ 
                      width: '100%', 
                      maxWidth: '150px',
                      filter: 'brightness(0) invert(1)'
                    }} 
                  />
                </Paper>

                {/* Desktop Filter */}
                <FilterBar 
                  salaryRange={salaryRange} 
                  setSalaryRange={setSalaryRange}
                  selectedCountries={selectedCountries} 
                  setSelectedCountries={setSelectedCountries}
                  skillsets={skillsets} 
                  setSkillsets={setSkillsets}
                  languages={languages} 
                  setLanguages={setLanguages}
                  ageRange={ageRange} 
                  setAgeRange={setAgeRange}
                  types={types} 
                  setTypes={setTypes}
                />
              </Box>
            </Grid>
          )}

          {/* Main Content */}
          <Grid item xs={12} md={9} lg={9.5}>
            {/* NavBar */}
            <Box sx={{ mb: 3 }}>
              <NavBar isAuthenticated={isAuthenticated} />
            </Box>

            {/* Header Section */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                mb: 3, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography 
                  variant="h3" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '2rem', md: '3rem' }
                  }}
                >
                  Find Your Perfect Helper
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                  {sortedMaids.length} maids available
                </Typography>

                {/* Search Bar */}
                <Paper 
                  sx={{ 
                    p: 1, 
                    display: 'flex', 
                    alignItems: 'center',
                    maxWidth: 600,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <IconButton sx={{ p: '10px' }}>
                    <SearchIcon />
                  </IconButton>
                  <input
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      padding: '10px',
                      fontSize: '16px',
                      backgroundColor: 'transparent'
                    }}
                    placeholder="Search by name, country, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <IconButton onClick={() => setSearchQuery('')}>
                      <ClearIcon />
                    </IconButton>
                  )}
                </Paper>
              </Box>

              {/* Background decoration */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
              />
            </Paper>

            {/* Controls Section */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              {/* Mobile Filter Button */}
              {isTablet && (
                <Badge badgeContent={activeFiltersCount} color="error">
                  <Button
                    variant="contained"
                    startIcon={<FilterListIcon />}
                    onClick={toggleFilter}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%)',
                      }
                    }}
                  >
                    Filters
                  </Button>
                </Badge>
              )}

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography variant="body2" color="text.secondary">
                    Active filters:
                  </Typography>
                  {selectedCountries.map(country => (
                    <Chip 
                      key={country} 
                      label={country} 
                      size="small" 
                      onDelete={() => setSelectedCountries(prev => prev.filter(c => c !== country))}
                    />
                  ))}
                  {skillsets.map(skill => (
                    <Chip 
                      key={skill} 
                      label={skill} 
                      size="small" 
                      onDelete={() => setSkillsets(prev => prev.filter(s => s !== skill))}
                    />
                  ))}
                  <Button 
                    size="small" 
                    onClick={clearAllFilters}
                    sx={{ ml: 1 }}
                  >
                    Clear all
                  </Button>
                </Box>
              )}

              {/* Sort and View Options */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #E0E0E0',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="name">Sort by Name</option>
                  <option value="salary-low">Price: Low to High</option>
                  <option value="salary-high">Price: High to Low</option>
                  <option value="age">Age: Youngest First</option>
                  <option value="experience">Experience: Most First</option>
                </select>

                {!isMobile && (
                  <Box sx={{ display: 'flex', bgcolor: 'white', borderRadius: 1, border: '1px solid #E0E0E0' }}>
                    <IconButton 
                      onClick={() => setGridView(true)}
                      sx={{ 
                        color: gridView ? 'primary.main' : 'text.secondary',
                        borderRadius: '8px 0 0 8px'
                      }}
                    >
                      <GridViewIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => setGridView(false)}
                      sx={{ 
                        color: !gridView ? 'primary.main' : 'text.secondary',
                        borderRadius: '0 8px 8px 0'
                      }}
                    >
                      <ViewListIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Loading State */}
            {loading && (
              <Grid container spacing={2}>
                {[...Array(6)].map((_, index) => (
                  <Grid item xs={6} sm={6} md={4} key={index}>
                    <Skeleton variant="rectangular" height={420} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Error State */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* No Results State */}
            {!loading && !error && sortedMaids.length === 0 && (
              <Paper sx={{ p: 6, textAlign: 'center' }}>
                <SearchIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  No maids found
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Try adjusting your filters or search criteria
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={clearAllFilters}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%)',
                    }
                  }}
                >
                  Clear All Filters
                </Button>
              </Paper>
            )}

            {/* Maid Cards Grid */}
            {!loading && !error && sortedMaids.length > 0 && (
              <Fade in timeout={500}>
                <Grid 
                  container 
                  spacing={4} 
                  sx={{ 
                    display: gridView ? 'grid' : 'flex',
                    gridTemplateColumns: gridView ? {
                      xs: 'repeat(2, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(3, 1fr)'
                    } : '1fr',
                    flexDirection: !gridView ? 'column' : 'row'
                  }}
                >
                  {sortedMaids.map((maid, index) => (
                    <Fade 
                      in 
                      timeout={300} 
                      style={{ transitionDelay: `${index * 50}ms` }}
                      key={maid.id}
                    >
                      <Grid item xs={gridView ? 6 : 12} sm={gridView ? 6 : 12} md={gridView ? 4 : 12}>
                        <MaidCard 
                          userFavorites={userFavorites} 
                          maid={maid} 
                          isAuthenticated={isAuthenticated} 
                        />
                      </Grid>
                    </Fade>
                  ))}
                </Grid>
              </Fade>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={showFilter && isTablet}
        onClose={() => setShowFilter(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '85%', sm: '400px' },
            p: 3
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setShowFilter(false)}>
            <ClearIcon />
          </IconButton>
        </Box>
        <FilterBar 
          salaryRange={salaryRange} 
          setSalaryRange={setSalaryRange}
          selectedCountries={selectedCountries} 
          setSelectedCountries={setSelectedCountries}
          skillsets={skillsets} 
          setSkillsets={setSkillsets}
          languages={languages} 
          setLanguages={setLanguages}
          ageRange={ageRange} 
          setAgeRange={setAgeRange}
          types={types} 
          setTypes={setTypes}
        />
      </Drawer>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="small"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%)',
            }
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        message="All filters cleared"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}