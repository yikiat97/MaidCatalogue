import { useState, useEffect, useCallback } from 'react';

// Hook for responsive image optimization
export const useResponsiveImage = (baseUrl, alt = '') => {
  const [currentSrc, setCurrentSrc] = useState(baseUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate responsive image URLs (assuming your backend supports image resizing)
  const generateResponsiveSources = useCallback((url) => {
    if (!url || url.includes('placeholder.jpg')) {
      return { src: url, srcSet: '', sizes: '' };
    }

    // Extract file extension and create different sizes
    const isS3Url = url.includes('amazonaws.com') || url.includes('s3.');
    
    if (isS3Url) {
      // For S3 URLs, we'll create different size variants
      // This assumes your backend can handle resize parameters
      const baseUrlWithoutExt = url.replace(/\.[^/.]+$/, '');
      const ext = url.split('.').pop();
      
      const srcSet = [
        `${baseUrlWithoutExt}_400w.${ext} 400w`,
        `${baseUrlWithoutExt}_800w.${ext} 800w`,
        `${baseUrlWithoutExt}_1200w.${ext} 1200w`,
        `${url} 1600w`
      ].join(', ');

      const sizes = [
        '(max-width: 400px) 400px',
        '(max-width: 800px) 800px', 
        '(max-width: 1200px) 1200px',
        '1600px'
      ].join(', ');

      return { src: url, srcSet, sizes };
    }

    // For non-S3 URLs, return as-is
    return { src: url, srcSet: '', sizes: '' };
  }, []);

  const imageProps = generateResponsiveSources(baseUrl);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setError('Failed to load image');
    setCurrentSrc('/placeholder.jpg'); // Fallback to placeholder
  }, []);

  return {
    ...imageProps,
    alt,
    loading: 'lazy',
    onLoad: handleLoad,
    onError: handleError,
    isLoading,
    error,
    currentSrc
  };
};

// Hook for blur placeholder loading
export const useBlurPlaceholder = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const getPlaceholderProps = useCallback((src) => ({
    src,
    onLoad: handleLoad,
    className: `transition-all duration-500 ${isLoaded 
      ? 'filter-none opacity-100' 
      : 'filter blur-sm opacity-75'
    }`
  }), [handleLoad, isLoaded]);

  return { isLoaded, getPlaceholderProps };
};

// Hook for image format detection and optimization
export const useImageFormat = () => {
  const [supportsAvif, setSupportsAvif] = useState(false);
  const [supportsWebp, setSupportsWebp] = useState(false);

  useEffect(() => {
    const checkAvifSupport = () => {
      const avif = new Image();
      avif.onload = () => setSupportsAvif(true);
      avif.onerror = () => setSupportsAvif(false);
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    };

    const checkWebpSupport = () => {
      const webp = new Image();
      webp.onload = () => setSupportsWebp(true);
      webp.onerror = () => setSupportsWebp(false);
      webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    };

    checkAvifSupport();
    checkWebpSupport();
  }, []);

  const getOptimalFormat = useCallback((originalUrl) => {
    if (!originalUrl || originalUrl.includes('placeholder.jpg')) {
      return originalUrl;
    }

    const baseUrl = originalUrl.replace(/\.[^/.]+$/, '');
    
    if (supportsAvif) {
      return `${baseUrl}.avif`;
    } else if (supportsWebp) {
      return `${baseUrl}.webp`;
    }
    
    return originalUrl;
  }, [supportsAvif, supportsWebp]);

  return { supportsAvif, supportsWebp, getOptimalFormat };
};

// Main hook that combines all optimizations
export const useOptimizedImage = (src, alt = '', options = {}) => {
  const { enableBlur = true, enableResponsive = true, enableFormatOptimization = true } = options;
  
  const responsiveProps = useResponsiveImage(src, alt);
  const { isLoaded, getPlaceholderProps } = useBlurPlaceholder();
  const { getOptimalFormat } = useImageFormat();

  const optimizedSrc = enableFormatOptimization ? getOptimalFormat(src) : src;
  
  const finalProps = {
    ...responsiveProps,
    src: optimizedSrc,
    ...(enableBlur ? getPlaceholderProps(optimizedSrc) : {}),
    className: `${responsiveProps.className || ''} ${enableBlur && !isLoaded ? 'blur-sm' : ''}`.trim()
  };

  return {
    ...finalProps,
    isLoading: responsiveProps.isLoading,
    error: responsiveProps.error,
    isLoaded: enableBlur ? isLoaded : !responsiveProps.isLoading
  };
};

// Lazy loading hook with Intersection Observer
export const useLazyImage = (threshold = 0.1, rootMargin = '50px') => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  return { ref: setRef, isIntersecting };
};

export default {
  useResponsiveImage,
  useBlurPlaceholder,
  useImageFormat,
  useOptimizedImage,
  useLazyImage
};