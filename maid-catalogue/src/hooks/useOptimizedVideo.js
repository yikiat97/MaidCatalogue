import { useState, useEffect, useRef, useCallback } from 'react';
import { videoPerformanceMonitor } from '../utils/videoPerformance';

/**
 * Custom hook for optimized video loading and playback
 * Implements progressive loading, format fallbacks, and performance optimizations
 */
export const useOptimizedVideo = ({
  src,
  posterSrc,
  autoplay = false,
  muted = false,
  loop = false,
  preload = 'none',
  intersectionThreshold = 0.1,
  videoId
}) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [error, setError] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const maxRetries = 3;
  const performanceId = videoId || `video-${Math.random().toString(36).substr(2, 9)}`;

  // Intersection Observer for lazy loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: intersectionThreshold }
    );

    observer.observe(video);

    return () => {
      if (video) observer.unobserve(video);
    };
  }, [intersectionThreshold]);

  // Load video when it comes into view
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isIntersecting || isLoaded) return;

    // Start performance monitoring
    videoPerformanceMonitor.startMonitoring(video, performanceId);

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlayThrough = () => {
      setIsLoading(false);
      setIsLoaded(true);
      setError(null);
    };
    const handleError = (e) => {
      setIsLoading(false);
      setError(e.target.error);
      console.warn('Video load error:', e.target.error);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('error', handleError);

    // Start loading
    if (video.readyState < 4) {
      video.load();
    }

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('error', handleError);
    };
  }, [isIntersecting, isLoaded, performanceId]);

  // Handle autoplay when loaded and visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoplay || !isLoaded || !isIntersecting) return;

    const playVideo = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (error) {
        console.warn('Autoplay failed:', error);
        setIsPlaying(false);
      }
    };

    playVideo();
  }, [autoplay, isLoaded, isIntersecting]);

  // Video event handlers
  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);
  const handleEnded = useCallback(() => setIsPlaying(false), []);

  // Control functions
  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
      setIsPlaying(true);
    } catch (error) {
      console.warn('Play failed:', error);
      setIsPlaying(false);
      
      // Retry logic for transient failures
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          play();
        }, 1000 * (retryCount + 1));
      }
    }
  }, [retryCount, maxRetries]);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const newMutedState = !isMuted;
    video.muted = newMutedState;
    setIsMuted(newMutedState);
  }, [isMuted]);

  const retry = useCallback(() => {
    setError(null);
    setRetryCount(0);
    setIsLoaded(false);
    const video = videoRef.current;
    if (video) {
      video.load();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video) {
        video.pause();
      }
      // Stop performance monitoring
      videoPerformanceMonitor.stopMonitoring(performanceId);
    };
  }, [performanceId]);

  return {
    videoRef,
    isLoading,
    isLoaded,
    isPlaying,
    isMuted,
    error,
    isIntersecting,
    handlers: {
      onPlay: handlePlay,
      onPause: handlePause,
      onEnded: handleEnded
    },
    controls: {
      play,
      pause,
      togglePlay,
      toggleMute,
      retry
    }
  };
};