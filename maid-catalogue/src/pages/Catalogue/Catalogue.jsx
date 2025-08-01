import { useState ,useEffect} from 'react';
import { Container, Typography, Grid, Button, Collapse , Box } from '@mui/material';
import MaidCard from '../../components/Catalogue/MaidCard';
import FilterBar from '../../components/Catalogue/FilterBar';
import NavBar from '../../components/Catalogue/NavBar';
import logoBlack from '../../assets/logoBlack.png';
import { useMaidContext } from '../../context/maidList';


export default function Catalogue() {
  const [maids, setMaids] = useState([]);
  const [salaryRange, setSalaryRange] = useState([400, 1000]);
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [skillsets, setSkillsets] = useState([]);
  const [languages, setLanguages] = useState([]);
  // const [ageRange, setAgeRange] = useState([18, 60]);
  const [types, setTypes] = useState([]);
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
      console.log(data)
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

  // Function to calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };




  // Filter logic
  const filteredMaids = maids.filter((maid) => {
    const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(maid.country);
    const salaryMatch = maid.salary >= salaryRange[0] && maid.salary <= salaryRange[1];
      // Calculate age from DOB
    const age = calculateAge(maid.DOB);
    const ageInRange = age >= ageRange[0] && age <= ageRange[1];
    // const ageMatch = maid.age >= ageRange[0] && maid.age <= ageRange[1];
    const skillMatch = skillsets.length === 0 || skillsets.some((s) => maid.skills.includes(s));
    const languageMatch = languages.length === 0 || languages.some((l) => maid.languages.includes(l));
    const typeMatch = types.length === 0 || types.some((t) => maid.type.includes(t));
    return countryMatch && salaryMatch && ageInRange   && skillMatch && languageMatch && typeMatch //&& ageMatch;
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
            <Box sx={{ display: { xs:  'block', md: 'block' }}}>
              <FilterBar 
                // salaryRange={salaryRange} setSalaryRange={setSalaryRange}
                selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries}
                skillsets={skillsets} setSkillsets={setSkillsets}
                languages={languages} setLanguages={setLanguages}
                // ageRange={ageRange} setAgeRange={setAgeRange}
                types={types} setTypes={setTypes}
                defaultSalaryRange={salaryRange} 
                defaultAgeRange={ageRange}
                onSalaryChange={setSalaryRange}
                onAgeChange={setAgeRange}
              />
            </Box>
          </Box>

          {/* NavBar */}
          <Box sx={{ flexGrow: 1 }}>
            <NavBar  isAuthenticated={isAuthenticated}/>     
          </Box>

          <Box sx={{ flexGrow: 1, mt: { xs: 0, md: 20 } }}>
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


