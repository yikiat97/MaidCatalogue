import React, { forwardRef } from 'react';
import { useOptimizedVideo } from '../../hooks/useOptimizedVideo';
import { Loader2, Play, Pause, Volume2, VolumeX, AlertCircle, RotateCcw } from 'lucide-react';

/**
 * OptimizedVideo Component
 * A performance-optimized video component with progressive loading,
 * format fallbacks, error handling, and accessibility features
 */
const OptimizedVideo = forwardRef(({
  sources,
  poster,
  className = '',
  autoplay = false,
  muted = false,
  loop = false,
  playsInline = true,
  preload = 'none',
  showControls = true,
  showLoadingState = true,
  intersectionThreshold = 0.1,
  videoId,
  style,
  onClick,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const {
    videoRef,
    isLoading,
    isLoaded,
    isPlaying,
    isMuted,
    error,
    isIntersecting,
    handlers,
    controls: videoControls
  } = useOptimizedVideo({
    autoplay,
    muted,
    loop,
    preload,
    intersectionThreshold,
    videoId
  });

  // Combine refs
  const combinedRef = (element) => {
    videoRef.current = element;
    if (ref) {
      if (typeof ref === 'function') {
        ref(element);
      } else {
        ref.current = element;
      }
    }
  };

  const handleVideoClick = (e) => {
    if (onClick) {
      onClick(e);
    } else if (isLoaded) {
      videoControls.togglePlay();
    }
  };

  const handleControlClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  // Generate multiple source elements with format fallbacks
  const renderSources = () => {
    if (!sources) return null;

    // If sources is a string, convert to array
    const sourceArray = Array.isArray(sources) ? sources : [sources];
    
    return sourceArray.map((source, index) => {
      if (typeof source === 'string') {
        // Determine MIME type from extension
        const extension = source.split('.').pop().toLowerCase();
        const mimeType = {
          'mp4': 'video/mp4',
          'webm': 'video/webm',
          'mov': 'video/quicktime',
          'avi': 'video/x-msvideo',
          'ogg': 'video/ogg'
        }[extension] || 'video/mp4';

        return (
          <source
            key={`${source}-${index}`}
            src={source}
            type={mimeType}
          />
        );
      }

      // If source is an object with src and type
      return (
        <source
          key={`${source.src}-${index}`}
          src={source.src}
          type={source.type}
          media={source.media}
        />
      );
    });
  };

  return (
    <div className={`relative ${className}`} style={style}>
      <video
        ref={combinedRef}
        className="w-full h-full object-cover"
        poster={poster}
        autoPlay={false} // Controlled by hook
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload={isIntersecting ? 'auto' : preload}
        controls={false} // We provide custom controls
        onClick={handleVideoClick}
        onPlay={handlers.onPlay}
        onPause={handlers.onPause}
        onEnded={handlers.onEnded}
        aria-label={ariaLabel || 'Video player'}
        {...props}
      >
        {renderSources()}
        <p className="text-center text-gray-600 p-4">
          Your browser does not support the video tag. Please try a different browser or 
          <a href={sources[0]?.src || sources} className="text-blue-500 underline ml-1">
            download the video
          </a>.
        </p>
      </video>

      {/* Loading State */}
      {showLoadingState && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Video Load Failed</h3>
            <p className="text-gray-600 text-sm mb-4">
              Unable to load video content. Please check your connection and try again.
            </p>
            <button
              onClick={() => handleControlClick(null, videoControls.retry)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center mx-auto"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Custom Controls */}
      {showControls && isLoaded && !error && (
        <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center space-x-2">
          {/* Play/Pause Button */}
          <button
            onClick={(e) => handleControlClick(e, videoControls.togglePlay)}
            className="bg-orange-500 hover:bg-orange-600 rounded-full p-2.5 sm:p-3 shadow-lg transition-all duration-200 text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Mute/Unmute Button */}
          <button
            onClick={(e) => handleControlClick(e, videoControls.toggleMute)}
            className="bg-orange-500 hover:bg-orange-600 rounded-full p-2.5 sm:p-3 shadow-lg transition-all duration-200 text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      )}

      {/* Play/Pause Feedback Overlay */}
      {isLoaded && !error && (
        <div 
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
            isPlaying ? 'opacity-0' : 'opacity-0'
          }`}
          style={{ 
            opacity: onClick ? 0 : undefined // Hide if custom onClick provided
          }}
        >
          <div className="bg-black bg-opacity-30 rounded-full p-6">
            <Play className="w-12 h-12 text-white" />
          </div>
        </div>
      )}

      {/* Click Hint Overlay */}
      {isLoaded && !error && !onClick && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100 pointer-events-none">
          <div className="text-white text-sm font-medium bg-black bg-opacity-30 px-3 py-1 rounded-full">
            Click to {isPlaying ? 'pause' : 'play'}
          </div>
        </div>
      )}
    </div>
  );
});

OptimizedVideo.displayName = 'OptimizedVideo';

export default OptimizedVideo;