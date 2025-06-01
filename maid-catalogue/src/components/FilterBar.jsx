import {
  Box, FormControlLabel, Checkbox, Slider,
  Button, ButtonGroup, Typography, Grid
} from '@mui/material';

const skillsetOptions = ['Cooking', 'Housekeeping', 'Childcare','Babysitting', 'Elderly Care','Dog(s)','Cat(s)',"Caregiving"];
const languageOptions = ['English', 'Mandarin', 'Malay', 'Tamil'];
const typeOptions = ['New/Fresh', 'Transfer', 'Ex-Singapore', 'Ex-Hongkong', 'Ex-Taiwan', 'Ex-Middle East'];

export default function FilterBar({
  salaryRange, setSalaryRange,
  selectedCountries, setSelectedCountries,
  skillsets, setSkillsets,
  languages, setLanguages,
  ageRange, setAgeRange,
  types, setTypes
}) {
  const handleToggle = (setter, value) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
      {/* Salary Range */}
      <Box>
        <Typography gutterBottom>Salary Range ($)</Typography>
        <Slider
          value={salaryRange}
          onChange={(e, newValue) => setSalaryRange(newValue)}
          valueLabelDisplay="auto"
          min={400}
          max={1000}
        />
      </Box>

      {/* Country Checklist */}
      <Box>
        <Typography gutterBottom>Countries</Typography>
        <Grid container spacing={1}>
          {['Philippines', 'Indonesia', 'Myanmar'].map((c) => (
            <Grid item xs={6} sm={4} md={3} key={c}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedCountries.includes(c)}
                    onChange={() => handleToggle(setSelectedCountries, c)}
                  />
                }
                label={c}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Skillset Button checklist */}
      <Box>
        <Typography gutterBottom>Skillsets</Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          {skillsetOptions.map((s) => (
            <Button
              key={s}
              variant={skillsets.includes(s) ? 'contained' : 'outlined'}
              onClick={() => handleToggle(setSkillsets, s)}
            >
              {s}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Language Checklist */}
      <Box>
        <Typography gutterBottom>Languages</Typography>
        <Grid container spacing={1}>
          {languageOptions.map((l) => (
            <Grid item xs={6} sm={4} md={3} key={l}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={languages.includes(l)}
                    onChange={() => handleToggle(setLanguages, l)}
                  />
                }
                label={l}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Age Range */}
      <Box>
        <Typography gutterBottom>Age Range</Typography>
        <Slider
          value={ageRange}
          onChange={(e, newValue) => setAgeRange(newValue)}
          valueLabelDisplay="auto"
          min={18}
          max={60}
        />
      </Box>

      {/* Type Button checklist */}
      <Box>
        <Typography gutterBottom>Type</Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          {typeOptions.map((t) => (
            <Button
              key={t}
              variant={types.includes(t) ? 'contained' : 'outlined'}
              onClick={() => handleToggle(setTypes, t)}
            >
              {t}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
