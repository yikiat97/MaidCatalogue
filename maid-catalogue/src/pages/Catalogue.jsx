import { useState ,useEffect} from 'react';
import { Container, Typography, Grid, Button, Collapse , Box } from '@mui/material';
import MaidCard from '../components/MaidCard';
import FilterBar from '../components/FilterBar';
import NavBar from '../components/navBar';
import logoBlack from '../assets/logoBlack.png';
import { useMaidContext } from '../context/maidList';


export default function Catalogue() {
  const [maids, setMaids] = useState([]);
  const [salaryRange, setSalaryRange] = useState([400, 1000]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [skillsets, setSkillsets] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [types, setTypes] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);
  

const { maidList, setMaidList } = useMaidContext();

  // 👇 NEW: Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

useEffect(() => {
  // Function to check authentication
  const checkAuth = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/profile', {
        credentials: 'include',
      });

      if (res.ok) {
        setIsAuthenticated(true);
        fetch('http://localhost:3000/api/user/GetUserfavorites', {
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => {
            setUserFavorites(data); // e.g., [1, 2, 5, 8]
          })
          .catch((err) => console.error(err));
  
      } 
      
      else {
        setIsAuthenticated(false);
      }
    } 
    catch (err) {
      console.error(err);
      setIsAuthenticated(false);
    }
  };

  // Function to get all maids
  const fetchMaids = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/maids', {
        credentials: 'include',
      });
      const data = await res.json();
      setMaids(data);
      setMaidList(data)
    } catch (err) {
      console.error(err);
    }
  };

  // Call both functions independently
  checkAuth();
  fetchMaids();
}, []);



  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  // Filter logic
  const filteredMaids = maids.filter((maid) => {
    const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(maid.country);
    const salaryMatch = maid.salary >= salaryRange[0] && maid.salary <= salaryRange[1];
    const ageMatch = maid.age >= ageRange[0] && maid.age <= ageRange[1];
    const skillMatch = skillsets.length === 0 || skillsets.some((s) => maid.skills.includes(s));
    const languageMatch = languages.length === 0 || languages.some((l) => maid.languages.includes(l));
    const typeMatch = types.length === 0 || types.some((t) => maid.type.includes(t));
    return countryMatch && salaryMatch && ageMatch && skillMatch && languageMatch && typeMatch;
  });

  return (
    <div>
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Box sx={{ display: { xs: 'block', md: 'flex' } }}>
          {/* Sidebar */}
          <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 250 }, mr: { md: 2 } }}>
            <Box sx={{ textAlign: 'center', p: 0, mt:{ xs: '20%', md:0} }}>
              <img src={logoBlack} alt="Logo" style={{ width: '100%', maxWidth: '200px' }} />
            </Box>
            <Box sx={{ display: { xs: showFilter ? 'block' : 'none', md: 'block' }}}>
              <FilterBar 
                salaryRange={salaryRange} setSalaryRange={setSalaryRange}
                selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries}
                skillsets={skillsets} setSkillsets={setSkillsets}
                languages={languages} setLanguages={setLanguages}
                ageRange={ageRange} setAgeRange={setAgeRange}
                types={types} setTypes={setTypes}
              />
            </Box>
          </Box>

          {/* NavBar */}
          <Box sx={{ flexGrow: 1 }}>
            <NavBar  isAuthenticated={isAuthenticated}/>     
          </Box>

          <Box sx={{ flexGrow: 1, mt: { xs: 0, md: 20 } }}>
            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
              <Button variant="outlined" onClick={toggleFilter} fullWidth>
                {showFilter ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </Box>

            <Typography variant="h4" gutterBottom align="center">
              Maid Catalogue
            </Typography>

            <Grid container spacing={2} justifyContent="center">
              {filteredMaids.map((maid) => (
                <Grid item xs={6} sm={6} md={4} key={maid.id}>
                  <MaidCard userFavorites={userFavorites} maid={maid} isAuthenticated={isAuthenticated} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
