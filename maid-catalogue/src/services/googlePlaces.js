// Google Places API Service
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

// Cache configuration
const CACHE_KEY = 'googleReviews';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Cache utility functions
 */
const cacheUtils = {
  set: (key, data) => {
    const cacheItem = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  },

  get: (key) => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const cacheItem = JSON.parse(cached);
      const isExpired = Date.now() - cacheItem.timestamp > CACHE_DURATION;
      
      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  clear: (key) => {
    localStorage.removeItem(key);
  }
};

/**
 * Fetch place details including reviews from Google Places API
 * @param {string} placeId - Google Place ID
 * @returns {Promise<Object>} Place details with reviews
 */
export const fetchPlaceDetails = async (placeId) => {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key is not configured');
  }

  if (!placeId) {
    throw new Error('Place ID is required');
  }

  // Check cache first
  const cacheKey = `${CACHE_KEY}_${placeId}`;
  const cachedData = cacheUtils.get(cacheKey);
  
  if (cachedData) {
    console.log('Using cached Google Reviews data');
    return cachedData;
  }

  try {
    // Construct API URL with required fields
    const fields = [
      'name',
      'rating', 
      'user_ratings_total',
      'reviews',
      'place_id',
      'url'
    ].join(',');

    // Try direct call first, then CORS proxy as fallback
    const directUrl = `${PLACES_API_BASE_URL}/details/json?place_id=${encodeURIComponent(placeId)}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`;
    
    // Alternative CORS proxies to try
    const corsProxies = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(directUrl)}`,
      `https://cors-anywhere.herokuapp.com/${directUrl}`,
    ];

    console.log('🌐 Fetching Google Reviews for Place ID:', placeId);

    let response;
    let usedCorsProxy = false;

    try {
      // Try direct call first
      console.log('🔄 Attempting direct API call...');
      response = await fetch(directUrl);
      
      if (!response.ok) {
        throw new Error(`Direct call failed: ${response.status}`);
      }
    } catch (directError) {
      console.warn('⚠️ Direct API call failed (likely CORS), trying CORS proxies...', directError.message);
      
      // Try CORS proxies
      let lastError = directError;
      for (let i = 0; i < corsProxies.length; i++) {
        try {
          console.log(`🔄 Trying CORS proxy ${i + 1}...`);
          response = await fetch(corsProxies[i]);
          
          if (response.ok) {
            usedCorsProxy = true;
            console.log(`✅ CORS proxy ${i + 1} worked!`);
            
            // For allorigins proxy, we need to parse the response differently
            if (corsProxies[i].includes('allorigins')) {
              const proxyData = await response.json();
              response = {
                ok: true,
                status: 200,
                json: () => Promise.resolve(JSON.parse(proxyData.contents))
              };
            }
            break;
          }
        } catch (corsError) {
          lastError = corsError;
          console.warn(`❌ CORS proxy ${i + 1} failed:`, corsError.message);
        }
      }
      
      if (!usedCorsProxy) {
        console.error('❌ All API call methods failed');
        throw new Error(`All API calls failed. Last error: ${lastError.message}`);
      }
    }

    console.log('📊 Used CORS proxy:', usedCorsProxy);

    if (!response.ok) {
      console.error('❌ API call failed:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Google Reviews loaded:', data.result?.name, `(${data.result?.reviews?.length || 0} reviews, ${data.result?.rating}/5 stars)`);

    if (data.status !== 'OK') {
      console.error('❌ Google Places API error:', data.status, data.error_message);
      throw new Error(`Google Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    if (!data.result) {
      console.error('❌ No place data found in response');
      throw new Error('No place data found');
    }

    // Cache the successful response
    console.log('💾 Caching successful response');
    cacheUtils.set(cacheKey, data.result);

    return data.result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};

/**
 * Transform Google Reviews data to match our testimonial format
 * @param {Array} googleReviews - Raw Google Reviews from Places API
 * @returns {Array} Formatted testimonials
 */
export const transformGoogleReviews = (googleReviews) => {
  if (!Array.isArray(googleReviews)) {
    return [];
  }

  return googleReviews.map((review, index) => ({
    id: index + 1,
    name: review.author_name || 'Anonymous',
    role: 'Verified Google Review',
    image: review.profile_photo_url || '/images/img_frame_4.png',
    rating: review.rating || 5,
    text: review.text || 'Great service!',
    createTime: review.time ? new Date(review.time * 1000).toISOString() : null,
    authorUrl: review.author_url || null,
    language: review.language || 'en',
    originalLanguage: review.original_language || 'en',
    isTranslated: review.language !== review.original_language
  }));
};

/**
 * Get formatted reviews for testimonials section
 * @param {string} placeId - Google Place ID
 * @returns {Promise<Object>} Object containing reviews and place info
 */
export const getGoogleReviews = async (placeId) => {
  try {
    const placeDetails = await fetchPlaceDetails(placeId);
    
    const reviews = transformGoogleReviews(placeDetails.reviews || []);
    
    return {
      reviews,
      placeInfo: {
        name: placeDetails.name,
        rating: placeDetails.rating,
        totalReviews: placeDetails.user_ratings_total,
        placeId: placeDetails.place_id,
        googleUrl: placeDetails.url
      }
    };
  } catch (error) {
    console.error('Error getting Google reviews:', error);
    throw error;
  }
};

/**
 * Clear cached reviews data
 */
export const clearReviewsCache = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_KEY)) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Default fallback reviews in case of API failure
 */
export const getFallbackReviews = () => {
  return [
    {
      id: 1,
      name: "Zhi Ren Yeo",
      role: "Verified Google Review",
      image: "/images/img_frame_4.png",
      rating: 5,
      text: "I had a great experience with Easy Hire Maid Agency. From the start, their staff were friendly, professional, and very responsive to all my questions. They took the time to understand my family's specific needs and recommended suitable helpers with relevant experience and good attitudes. The process was smooth and efficient — from the initial consultation to the paperwork and deployment. What really stood out was their transparency and how they kept me informed at every step. Even after placement, they followed up to make sure everything was going well, which shows they truly care about their clients and the helpers. Highly recommend Easy Hire if you're looking for a reliable and supportive maid agency. Great service, great team!"
    },
    {
      id: 2,
      name: "Mak Lim",
      role: "Verified Google Review", 
      image: "/images/img_frame_4.png",
      rating: 5,
      text: "Absolutely fantastic service from Easy Hire! From the start to finish, the process was seamless. The initial consultation was thorough and helpful. The consultant Ms. Li Ling was very professional and helpful throughout the process. I highly recommend their service for the efficiency and trustworthiness of the matched helper."
    }
  ];
};