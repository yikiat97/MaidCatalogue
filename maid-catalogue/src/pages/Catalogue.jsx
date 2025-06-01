import { useState } from 'react';
import { Container, Typography, Grid, Button, Collapse , Box } from '@mui/material';
import MaidCard from '../components/MaidCard';
import FilterBar from '../components/FilterBar';
import NavBar from '../components/navBar';
import logoBlack from '../assets/logoBlack.png';


// import { removeToken } from '../utils/auth';

const maids = [
  {
    id: 1,
    name: 'Mary jane elvis lim james',
    country: 'Philippines',
    experience: 2,
    salary: 500,
    age: 25,
    skills: ['Cooking', 'Housekeeping', 'Childcare','Babysitting', 'Elderly Care','Dog(s)','Cat(s)',"Caregiving"],
    languages: ['English', 'Mandarin'],
    type: ['Transfer'],
  },
  {
    id: 2,
    name: 'Anna',
    country: 'Indonesia',
    experience: 3,
    salary: 550,
    age: 30,
    skills: ['Housekeeping', 'Elderly Care'],
    languages: ['English'],
    type: ['Transfer'],
  },
  {
    id: 3,
    name: 'Lily',
    country: 'Myanmar',
    experience: 1,
    salary: 480,
    age: 22,
    skills: ['Cooking', 'Housekeeping'],
    languages: ['English', 'Malay'],
    type: ['New/Fresh'],
  },
  {
    id: 4,
    name: 'Jane',
    country: 'Philippines',
    experience: 4,
    salary: 600,
    age: 35,
    skills: ['Childcare', 'Elderly Care','Cooking', 'Housekeeping'],
    languages: ['English', 'Tagalog'],
    type: ['Ex-Hongkong'],
  },
  {
    id: 5,
    name: 'Mary',
    country: 'Philippines',
    experience: 2,
    salary: 500,
    age: 26,
    skills: ['Cooking'],
    languages: ['English'],
    type: ['Ex-Middle East'],
  },
  {
    id: 6,
    name: 'Anna',
    country: 'Indonesia',
    experience: 3,
    salary: 550,
    age: 28,
    skills: ['Childcare'],
    languages: ['English', 'Malay'],
    type: ['Transfer'],
  },
  {
    id: 7,
    name: 'Lily',
    country: 'Myanmar',
    experience: 1,
    salary: 480,
    age: 21,
    skills: ['Housekeeping'],
    languages: ['English'],
    type: ['New/Fresh'],
  },
  {
    id: 8,
    name: 'Jane',
    country: 'Philippines',
    experience: 4,
    salary: 600,
    age: 34,
    skills: ['Cooking', 'Childcare','Elderly Care'],
    languages: ['English', 'Tagalog'],
    type: ['Ex-Taiwan'],
  },
  {
    id: 9,
    name: 'Mary',
    country: 'Philippines',
    experience: 2,
    salary: 500,
    age: 27,
    skills: ['Elderly Care'],
    languages: ['English'],
    type: ['Ex-Middle East'],
  },
  {
    id: 10,
    name: 'Anna',
    country: 'Indonesia',
    experience: 3,
    salary: 550,
    age: 29,
    skills: ['Cooking', 'Housekeeping'],
    languages: ['English', 'Malay'],
    type: ['Transfer'],
  },
  {
    id: 11,
    name: 'Lily',
    country: 'Myanmar',
    experience: 1,
    salary: 480,
    age: 23,
    skills: ['Childcare', 'Cooking'],
    languages: ['English'],
    type: ['New/Fresh'],
  },
  {
    id: 12,
    name: 'Jane',
    country: 'Philippines',
    experience: 4,
    salary: 600,
    age: 36,
    skills: ['Elderly Care'],
    languages: ['English', 'Tagalog'],
    type: ['Ex-Hongkong'],
  },
];


export default function Catalogue() {
  const [salaryRange, setSalaryRange] = useState([400, 1000]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [skillsets, setSkillsets] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [types, setTypes] = useState([]);

  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };




  // Filter logic
  const filteredMaids = maids.filter((maid) => {
  const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(maid.country);
  // const experienceMatch = !experience || maid.experience >= experience;
  const salaryMatch = maid.salary >= salaryRange[0] && maid.salary <= salaryRange[1];
  const ageMatch = maid.age >= ageRange[0] && maid.age <= ageRange[1];
  const skillMatch = skillsets.length === 0 || skillsets.some((s) => maid.skills.includes(s));
  const languageMatch = languages.length === 0 || languages.some((l) => maid.languages.includes(l));
  const typeMatch = types.length === 0 || types.includes(maid.type);

  return countryMatch  && salaryMatch && ageMatch && skillMatch && languageMatch && typeMatch;
});

  return (
    <div>


      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Box
          sx={{
            display: { xs: 'block', md: 'flex' },
          }}
        >
          {/* Sidebar (logo + filter) */}
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: '100%', md: 250 },
              mr: { md: 2 },
            }}
          >
            {/* Logo on top of filter bar */}
            <Box sx={{ textAlign: 'center', p: 0, mt:{ xs: '20%', md:0} }}>
              <img src={logoBlack} alt="Logo" style={{ width: '100%', maxWidth: '200px' }} />
            </Box>

            {/* Filter bar */}
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

          {/* NAVBAR full width on top right */}
          <Box sx={{ flexGrow: 1}}>
            <NavBar />     
          </Box>
      
          <Box sx={{ flexGrow: 1 ,mt:{xs:0, md:20} }} >
            {/* Toggle filter button only on mobile */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
              <Button variant="outlined" onClick={toggleFilter} fullWidth>
                {showFilter ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </Box>
           
            <Typography variant="h4" gutterBottom align="center">
              Maid Catalogue
            </Typography>

            <Grid container spacing={2} justifyContent="center" >
              {filteredMaids.map((maid) => (
                <Grid item xs={6} sm={6} md={4} key={maid.id}>
                  <MaidCard maid={maid} isShortlisted ={false}/>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}