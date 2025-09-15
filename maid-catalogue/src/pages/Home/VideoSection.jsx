import React from 'react';
import { useAnimation } from '../../hooks/useAnimation';
import OptimizedVideo from '../../components/common/OptimizedVideo';

const VideoSection = () => {
  const { elementRef: headingRef, isVisible: isHeadingVisible } = useAnimation(0.2);
  const { elementRef: videoContainerRef, isVisible: isVideoVisible } = useAnimation(0.1);
  
  // Video sources with format fallbacks for optimal performance
  const videoSources = [
    { src: '/assets/rawvideo.mp4', type: 'video/mp4' },
    { src: '/assets/rawvideo.webm', type: 'video/webm' },
    { src: '/assets/rawvideo.MOV', type: 'video/quicktime' } // Fallback to original
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Minimal Background Decorations */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-[#ff690d]/10 to-[#ffa366]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-tr from-[#ff690d]/8 to-[#ff8a3d]/3 rounded-full blur-2xl"></div>
      
      <div className="max-w-[1440px] w-full px-4 lg:px-6 mx-auto relative">
        
        {/* Section Heading */}
        <div 
          ref={headingRef}
          className={`text-center mb-16 relative z-10 transition-all duration-1000 ease-out ${
            isHeadingVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-inter font-extrabold leading-tight capitalize mb-6">
            <span className="text-black">Experience Our </span>
            <span className="text-[#ff690d]">Professional Service</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-inter font-light leading-relaxed text-gray-600 max-w-4xl mx-auto">
            See how we help families find the perfect domestic helper with our transparent and caring approach.
          </p>
        </div>

        {/* Video Container */}
        <div 
          ref={videoContainerRef}
          className={`relative z-10 transition-all duration-1000 ease-out delay-300 ${
            isVideoVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
              <OptimizedVideo
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl cursor-pointer"
                style={{ filter: 'saturate(1.1)' }}
                sources={videoSources}
                poster="/assets/rawvideo-poster.jpg"
                autoplay={true}
                muted={false}
                loop={true}
                playsInline={true}
                preload="none"
                showControls={true}
                showLoadingState={true}
                intersectionThreshold={0.3}
                videoId="home-hero-video"
                aria-label="Professional service demonstration video"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default VideoSection;