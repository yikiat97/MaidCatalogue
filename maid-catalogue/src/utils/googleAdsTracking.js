/**
 * Google Ads Conversion Tracking Utility
 * 
 * This utility provides functions to track conversions for Google Ads.
 * The conversion tracking tag must be installed in index.html for this to work.
 */

/**
 * Track a conversion event for Google Ads
 * @param {string} url - Optional URL to redirect to after tracking (for outbound links)
 * @param {number} value - Optional conversion value (default: 1.0)
 * @param {string} currency - Optional currency code (default: 'SGD')
 * @returns {boolean} - Returns false to prevent default link behavior if url is provided
 */
export const trackConversion = (url = undefined, value = 1.0, currency = 'SGD') => {
  // Check if gtag is available
  if (typeof window === 'undefined' || typeof window.gtag === 'undefined') {
    console.warn('Google Ads tracking not available. Make sure gtag is loaded.');
    return false;
  }

  const callback = () => {
    if (typeof url !== 'undefined' && url) {
      window.location = url;
    }
  };

  window.gtag('event', 'conversion', {
    'send_to': 'AW-11379248226/n2-JCPWW5t4bEOKYhrIq',
    'value': value,
    'currency': currency,
    'event_callback': callback
  });

  // Return false to prevent default behavior if url is provided
  return url ? false : true;
};

/**
 * Track conversion for a button click (no redirect)
 * Use this for form submissions, signups, etc.
 */
export const trackButtonConversion = (value = 1.0, currency = 'SGD') => {
  trackConversion(undefined, value, currency);
};

/**
 * Track conversion for an outbound link click
 * Use this for links that navigate away from your site
 * @param {string} url - The URL to navigate to
 * @param {number} value - Optional conversion value (default: 1.0)
 * @param {string} currency - Optional currency code (default: 'SGD')
 */
export const trackLinkConversion = (url, value = 1.0, currency = 'SGD') => {
  return trackConversion(url, value, currency);
};

/**
 * Create an onClick handler that tracks conversion
 * @param {Function} originalHandler - The original onClick handler (optional)
 * @param {number} value - Optional conversion value (default: 1.0)
 * @param {string} currency - Optional currency code (default: 'SGD')
 * @returns {Function} - Combined onClick handler
 */
export const createConversionHandler = (originalHandler = null, value = 1.0, currency = 'SGD') => {
  return (e) => {
    trackButtonConversion(value, currency);
    if (originalHandler) {
      originalHandler(e);
    }
  };
};
