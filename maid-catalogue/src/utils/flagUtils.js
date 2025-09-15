// Utility functions for country flags

// Country to country code mapping for flag API
const countryCodeMap = {
  'Philippines': 'ph',
  'Indonesia': 'id',
  'Myanmar': 'mm',
  'India': 'in',
  'Bangladesh': 'bd',
  'Sri Lanka': 'lk',
  'Cambodia': 'kh',
  'Vietnam': 'vn',
  'Thailand': 'th',
  'Malaysia': 'my',
};

/**
 * Get country flag URL using flagcdn.com API
 * @param {string} country - Country name
 * @returns {string} Flag image URL
 */
export const getCountryFlag = (country) => {
  const countryCode = countryCodeMap[country] || 'un'; // 'un' for unknown/default
  return `https://flagcdn.com/${countryCode}.svg`;
};

/**
 * Get country code for a given country name
 * @param {string} country - Country name
 * @returns {string} Two-letter country code
 */
export const getCountryCode = (country) => {
  return countryCodeMap[country] || 'un';
};

export default {
  getCountryFlag,
  getCountryCode,
  countryCodeMap
};