import React from 'react';
import OptimizedVideo from './OptimizedVideo';

/**
 * PhoneFramedVideo Component
 * An optimized video component wrapped in a phone frame design
 * Used in About page for mobile-style video presentation
 */
const PhoneFramedVideo = ({
  sources,
  poster,
  autoplay = true,
  muted = false,
  loop = false,
  className = '',
  videoClassName = '',
  videoId,
  ariaLabel,
  ...props
}) => {
  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Phone Frame Container */}
      <div className="relative p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] shadow-2xl">
        {/* Multiple Shadow Layers for Floating Effect */}
        <div className="absolute inset-0 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.3),_0_8px_25px_rgba(0,0,0,0.2),_0_3px_10px_rgba(0,0,0,0.15)] transform translate-y-1"></div>
        
        {/* Inner Phone Screen */}
        <div className="relative bg-black rounded-[1.75rem] p-1 overflow-hidden">
          <OptimizedVideo
            className={`w-full h-auto rounded-[1.5rem] bg-black ${videoClassName}`}
            sources={sources}
            poster={poster}
            autoplay={autoplay}
            muted={muted}
            loop={loop}
            playsInline={true}
            preload="none"
            showControls={true}
            showLoadingState={true}
            intersectionThreshold={0.2}
            videoId={videoId}
            aria-label={ariaLabel}
            {...props}
          />
        </div>
        
        {/* Phone Details - Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default PhoneFramedVideo;