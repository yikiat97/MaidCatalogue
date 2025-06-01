import { Stack, Typography, Slider, Chip, Box, Button, Checkbox, FormControlLabel, Paper, Grid } from '@mui/material';
import { useState } from 'react';

const skillsetOptions = ['Cooking', 'Housekeeping', 'Childcare', 'Babysitting', 'Elderly Care', 'Dog(s)', 'Cat(s)', "Caregiving"];
const languageOptions = ['English', 'Mandarin', 'Malay', 'Tamil'];
const typeOptions = ['New/Fresh', 'Transfer', 'Ex-Singapore', 'Ex-Hongkong', 'Ex-Taiwan', 'Ex-Middle East'];
const countryOptions = ['Philippines', 'Indonesia', 'Myanmar'];

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
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      {/* Salary Range */}
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>💰 Salary Range ($)</Typography>
        <Slider
          value={salaryRange}
          onChange={(e, newValue) => setSalaryRange(newValue)}
          valueLabelDisplay="auto"
          min={400}
          max={1000}
          sx={{ color: '#ff8c42' }}
        />
      </Box>

      {/* Countries */}
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>🌏 Countries</Typography>
        <Grid container spacing={1}>
          {countryOptions.map((c) => (
            <Grid item key={c}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedCountries.includes(c)}
                    onChange={() => handleToggle(setSelectedCountries, c)}
                    sx={{
                      color: '#ff8c42',
                      '&.Mui-checked': { color: '#ff8c42' },
                    }}
                  />
                }
                label={c}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Skillsets */}
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>⭐ Skillsets</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {skillsetOptions.map((s) => (
            <Chip
              key={s}
              label={s}
              clickable
              onClick={() => handleToggle(setSkillsets, s)}
              variant={skillsets.includes(s) ? "filled" : "outlined"}
              sx={{
                backgroundColor: skillsets.includes(s) ? '#ff8c42' : 'transparent',
                color: skillsets.includes(s) ? 'white' : 'inherit',
                borderColor: '#ff8c42',
                '&:hover': {
                  borderColor: '#ff8c42',
                }
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Languages */}
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>🗣️ Languages</Typography>
        <Grid container spacing={1}>
          {languageOptions.map((l) => (
            <Grid item key={l}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={languages.includes(l)}
                    onChange={() => handleToggle(setLanguages, l)}
                    sx={{
                      color: '#ff8c42',
                      '&.Mui-checked': { color: '#ff8c42' },
                    }}
                  />
                }
                label={l}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Age Range */}
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>👥 Age Range</Typography>
        <Slider
          value={ageRange}
          onChange={(e, newValue) => setAgeRange(newValue)}
          valueLabelDisplay="auto"
          min={18}
          max={60}
          sx={{ color: '#ff8c42' }}
        />
      </Box>

      {/* Experience Types */}
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>📋 Experience Type</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {typeOptions.map((t) => (
            <Button
              key={t}
              variant={types.includes(t) ? "contained" : "outlined"}
              onClick={() => handleToggle(setTypes, t)}
              sx={{
                color: types.includes(t) ? 'white' : '#666',
                backgroundColor: types.includes(t) ? '#ff8c42' : 'transparent',
                borderColor: '#ff8c42',
                '&:hover': {
                  borderColor: '#ff8c42',
                  backgroundColor: types.includes(t) ? '#ff8c42' : 'rgba(255, 140, 66, 0.1)',
                },
              }}
            >
              {t}
            </Button>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
