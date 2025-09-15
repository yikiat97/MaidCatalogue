# Google Reviews Integration Setup

## Overview
The testimonial section has been updated to fetch real Google Reviews from Google Places API using your API key `AIzaSyBH2Kp5pJN5VIKELzvWMCQjYuiGdVdqmuo`.

## Current Status
✅ Google Places API service implemented  
✅ Environment variables configured  
✅ TestimonialCarousel updated with dynamic reviews support  
✅ Loading and error states implemented  
✅ Fallback testimonials for offline/error scenarios  
✅ **Place ID configured and verified working**

## Active Configuration
- **Place ID**: ChIJ3-sJcgkX2jERZLFJwJX-e6E (Easy Hire Maid Agency)
- **Business Rating**: 4.9/5 stars
- **Total Reviews**: 27 reviews  
- **API Status**: Active and verified

## Next Steps

### 1. Find Your Google Place ID

You need to find the Place ID for "Easy Hire Maid Agency" in Singapore:

**Option A: Google Place ID Finder**
1. Visit: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
2. Search for "Easy Hire Maid Agency Singapore"
3. Click on the business listing
4. Copy the Place ID (starts with `ChIJ`)

**Option B: Google My Business**
1. If you have access to Google My Business dashboard
2. Go to your business profile
3. The Place ID can be found in the URL or profile settings

**Option C: Manual Search**
1. Go to Google Maps
2. Search for your business
3. Share the location and extract Place ID from the URL

### 2. Configure Place ID

Once you have the Place ID:

1. Open `.env` file
2. Replace `ChIJ_YOUR_PLACE_ID_HERE` with your actual Place ID:
   ```
   VITE_GOOGLE_PLACE_ID=ChIJ1234567890abcdef
   ```
3. Restart the development server: `npm run dev`

## How It Works

### With Valid Place ID
- Fetches up to 5 most recent Google Reviews
- Displays real customer reviews with ratings
- Shows "Verified Google Review" labels
- Caches data for 24 hours to reduce API calls

### Without Place ID (Current State)
- Uses fallback testimonials (existing hardcoded reviews)
- No API calls made
- Console message: "Google Place ID not configured"

### Error Handling
- If API fails, automatically falls back to default testimonials
- Shows loading spinner while fetching
- Logs errors to console for debugging

## Files Modified

- `.env` - Added Google API key and placeholder Place ID
- `src/services/googlePlaces.js` - New Google Places API service
- `src/components/common/TestimonialCarousel.jsx` - Updated to accept dynamic reviews
- `src/pages/Home/TestimonialsSection.jsx` - Added Google Reviews integration

## API Limitations

- Google Places API returns maximum 5 most recent reviews
- Reviews are in original language (may include translations)
- Rate limited - cached for 24 hours to minimize calls
- Requires valid Place ID to function

## Testing

Currently running on: http://localhost:5174/

To test with real reviews:
1. Configure valid Place ID as described above
2. Refresh the page
3. Check browser console for API status messages
4. Reviews should load in the testimonials carousel

## Troubleshooting

**No reviews showing?**
- Check console for error messages
- Verify Place ID is correctly formatted
- Ensure API key has Places API enabled
- Check if business has public reviews

**API quota exceeded?**
- Reviews are cached for 24 hours
- Consider upgrading Google Cloud plan
- Clear cache using `clearReviewsCache()` function

**Reviews in wrong language?**
- Google returns reviews in their original language
- Use `language` and `originalLanguage` fields if needed
- Consider implementing translation service

## Security Notes

- API key is exposed in frontend (normal for Google Places API)
- Consider implementing backend proxy for production
- Monitor API usage in Google Cloud Console
- Set up usage quotas and alerts