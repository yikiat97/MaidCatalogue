/**
 * Utility to generate placeholder poster images for videos
 * This creates colored placeholder images that can be replaced with actual video frames
 */

export const generatePosterPlaceholder = (width = 1280, height = 720, title = 'Video') => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = width;
  canvas.height = height;
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#ff690d');
  gradient.addColorStop(0.5, '#ff8a3d');
  gradient.addColorStop(1, '#e55a0a');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add overlay for better text contrast
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, width, height);
  
  // Add play icon
  const centerX = width / 2;
  const centerY = height / 2;
  const playIconSize = Math.min(width, height) * 0.1;
  
  // Play button circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, playIconSize * 1.5, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fill();
  
  // Play triangle
  ctx.beginPath();
  ctx.moveTo(centerX - playIconSize * 0.4, centerY - playIconSize * 0.6);
  ctx.lineTo(centerX - playIconSize * 0.4, centerY + playIconSize * 0.6);
  ctx.lineTo(centerX + playIconSize * 0.8, centerY);
  ctx.closePath();
  ctx.fillStyle = '#ff690d';
  ctx.fill();
  
  // Add title text
  ctx.font = `bold ${Math.min(width, height) * 0.04}px Inter, Arial, sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.textAlign = 'center';
  ctx.fillText(title, centerX, height - 60);
  
  // Add "Easy Hire" branding
  ctx.font = `${Math.min(width, height) * 0.025}px Inter, Arial, sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('Easy Hire', centerX, height - 30);
  
  return canvas.toDataURL('image/jpeg', 0.8);
};

export const createVideoPosterPlaceholders = () => {
  const posters = {
    'rawvideo-poster': generatePosterPlaceholder(1280, 720, 'Professional Service Demo'),
    'aboutfounder-poster': generatePosterPlaceholder(720, 1280, 'About Our Founder'),
    'historyofEH-poster': generatePosterPlaceholder(720, 1280, 'History of Easy Hire')
  };
  
  return posters;
};

/**
 * Download generated poster as image file
 * This is a client-side utility for manual poster generation
 */
export const downloadPoster = (dataUrl, filename) => {
  const link = document.createElement('a');
  link.download = `${filename}.jpg`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate and download all poster placeholders
 * Call this from browser console to generate placeholder images
 */
export const generateAllPosters = () => {
  const posters = createVideoPosterPlaceholders();
  
  Object.entries(posters).forEach(([name, dataUrl]) => {
    downloadPoster(dataUrl, name);
  });
  
  console.log('Generated poster placeholders for:', Object.keys(posters).join(', '));
};