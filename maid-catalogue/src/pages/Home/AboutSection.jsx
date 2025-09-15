import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { useAnimation } from '../../hooks/useAnimation';
import YouTubeVideoControls from '../../components/common/YouTubeVideoControls';
const AboutSection = () => {
  const { elementRef: cardRef, isVisible: isCardVisible } = useAnimation(0.2);
  const { elementRef: videoRef, isVisible: isVideoVisible } = useAnimation(0.1);
  const navigate = useNavigate();

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white relative overflow-hidden" style={{ containerType: 'inline-size' }}>
      <div className="max-w-[1440px] w-full px-4 sm:px-6 lg:px-8 mx-auto relative">
        {/* Scattered Exploded Blurred Circles - Multi-Layer Z-Index System */}
        <div className="absolute inset-0 pointer-events-none">
          {/* BACKGROUND TIER (z-index: -1) - Large scattered background circles */}
          
          {/* Top-Left Background Explosion */}
          <div className="hidden lg:block absolute w-96 h-96 rounded-full animate-float" 
               style={{ 
                 top: '-20%', left: '-15%',
                 backgroundColor: '#ff690d', 
                 opacity: 0.03,
                 filter: 'blur(20px)',
                 zIndex: -1,
                 transform: 'rotate(-15deg)',
                 animationDelay: '0s',
                 animationDuration: '12s'
               }}></div>
          
          {/* Top-Right Background */}
          <div className="absolute w-64 h-64 md:w-80 md:h-80 lg:w-[28rem] lg:h-[28rem] rounded-full animate-float" 
               style={{ 
                 top: '-25%', right: '-20%',
                 backgroundColor: '#ff8a3d', 
                 opacity: 0.04,
                 filter: 'blur(18px)',
                 zIndex: -1,
                 transform: 'rotate(25deg)',
                 animationDelay: '2s',
                 animationDuration: '10s'
               }}></div>
          
          {/* Bottom-Left Background */}
          <div className="hidden md:block absolute w-72 h-72 lg:w-80 lg:h-80 rounded-full animate-float" 
               style={{ 
                 bottom: '-30%', left: '-25%',
                 backgroundColor: '#e55a0a', 
                 opacity: 0.035,
                 filter: 'blur(16px)',
                 zIndex: -1,
                 transform: 'rotate(45deg)',
                 animationDelay: '4s',
                 animationDuration: '11s'
               }}></div>
          
          {/* MID-LAYER TIER (z-index: 1) - Interactive layer above section, below content */}
          
          {/* Top-Right Cluster */}
          <div className="absolute w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full animate-float" 
               style={{ 
                 top: '-8%', right: '5%',
                 backgroundColor: '#ff690d', 
                 opacity: 0.06,
                 filter: 'blur(12px)',
                 zIndex: 1,
                 transform: 'rotate(-30deg)',
                 animationDelay: '1s',
                 animationDuration: '8s'
               }}></div>
          
          {/* Left Side Scatter */}
          <div className="hidden sm:block absolute w-40 h-40 md:w-52 md:h-52 rounded-full animate-float" 
               style={{ 
                 top: '15%', left: '-2%',
                 backgroundColor: '#ff8a3d', 
                 opacity: 0.04,
                 filter: 'blur(12px)',
                 zIndex: 1,
                 transform: 'rotate(60deg)',
                 animationDelay: '3s',
                 animationDuration: '9s'
               }}></div>
          
          {/* Center-Right Explosion */}
          <div className="absolute w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full animate-float" 
               style={{ 
                 top: '40%', right: '-5%',
                 backgroundColor: '#ff690d', 
                 opacity: 0.08,
                 filter: 'blur(8px)',
                 zIndex: 1,
                 transform: 'rotate(90deg)',
                 animationDelay: '0.5s',
                 animationDuration: '7s'
               }}></div>
          
          {/* Bottom-Right Scatter */}
          <div className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full animate-float" 
               style={{ 
                 bottom: '10%', right: '8%',
                 backgroundColor: '#e55a0a', 
                 opacity: 0.11,
                 filter: 'blur(9px)',
                 zIndex: 1,
                 transform: 'rotate(-45deg)',
                 animationDelay: '5s',
                 animationDuration: '6s'
               }}></div>
          
          {/* FOREGROUND TIER (z-index: 5) - Small accent circles above card */}
          
          {/* Top Accent */}
          <div className="absolute w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full animate-float" 
               style={{ 
                 top: '5%', right: '15%',
                 backgroundColor: '#ff8a3d', 
                 opacity: 0.15,
                 filter: 'blur(4px)',
                 zIndex: 5,
                 transform: 'rotate(120deg)',
                 animationDelay: '1.5s',
                 animationDuration: '5s'
               }}></div>
          
          {/* Left Accent */}
          <div className="hidden md:block absolute w-16 h-16 lg:w-20 lg:h-20 rounded-full animate-float" 
               style={{ 
                 top: '25%', left: '3%',
                 backgroundColor: '#ff690d', 
                 opacity: 0.08,
                 filter: 'blur(4px)',
                 zIndex: 5,
                 transform: 'rotate(-60deg)',
                 animationDelay: '2.5s',
                 animationDuration: '4s'
               }}></div>
          
          {/* Bottom Accent */}
          <div className="absolute w-14 h-14 md:w-18 md:h-18 rounded-full animate-float" 
               style={{ 
                 bottom: '15%', left: '20%',
                 backgroundColor: '#ff8a3d', 
                 opacity: 0.10,
                 filter: 'blur(3px)',
                 zIndex: 5,
                 transform: 'rotate(30deg)',
                 animationDelay: '3.5s',
                 animationDuration: '6s'
               }}></div>
          
          {/* Micro Accent Details (Desktop Only) */}
          <div className="hidden lg:block absolute w-12 h-12 rounded-full animate-float" 
               style={{ 
                 top: '60%', right: '25%',
                 backgroundColor: '#e55a0a', 
                 opacity: 0.25,
                 filter: 'blur(1px)',
                 zIndex: 5,
                 transform: 'rotate(150deg)',
                 animationDelay: '4.5s',
                 animationDuration: '3s'
               }}></div>
        </div>
        <h2 className="relative z-10 font-inter font-extrabold leading-tight text-center capitalize mb-6 sm:mb-8 lg:mb-12" 
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
          <span className="text-black">About </span>
          <span className="text-[#ff690d]">Easy Hire</span>
        </h2>
        
        <Card 
          ref={cardRef}
          variant="flat" 
          padding="none"
          shadow={false}
          className={`!bg-transparent border-0 relative z-10 transition-all duration-1000 ease-out ${
            isCardVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center overflow-hidden about-section-layout">
            {/* Text Content */}
            <div className="w-full md:w-1/2 mb-6 sm:mb-8 md:mb-0 about-section-content flex flex-col justify-center">
              <div className="space-y-4 sm:space-y-6 about-section-spacing">
                {/* Header with Badge */}
             
                {/* Founder Introduction */}
                <div className="space-y-3 sm:space-y-4">
                  <p className="font-inter font-medium text-gray-800" 
                     style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
                    <span className="text-[#ff690d] font-bold">"Serving Homes, Serving Hearts"</span>
                  </p>
                  
                  <div className="space-y-4 font-inter leading-relaxed text-gray-700" 
                       style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}>
                    <p>
                      At Easy Hire, we understand the genuine needs of both employers and domestic helpers. We've revolutionized the traditional hiring process by integrating technology to make it seamless and affordable.
                    </p>
                    
                    <p>
                      Our mission is to reduce hiring costs to the bare cost of direct hiring while ensuring every helper profile is meticulously screened and trained for diverse household needs.
                    </p>
                  </div>
                </div>

                {/* Key Value Propositions */}
                <div className="space-y-4">
                  <h4 className="font-inter font-semibold text-gray-900" 
                      style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
                    What makes Easy Hire different:
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-[#ff690d] rounded-full mt-2"></div>
                      <p className="text-gray-700" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}>
                        <span className="text-[#ff690d] font-semibold">Complete transparency</span> - No hidden fees, no unexpected clauses, just honest pricing.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-[#ff690d] rounded-full mt-2"></div>
                      <p className="text-gray-700" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}>
                        <span className="text-[#ff690d] font-semibold">Technology-enabled hiring</span> from the comfort of your home with ongoing post-hire support.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="pt-4 sm:pt-6">
                  <Button 
                    size="lg" 
                    className="bg-[#ff690d] hover:bg-[#e55a0a] text-white px-6 sm:px-8 py-3 font-semibold transition-all duration-200 transform hover:scale-105 min-h-[44px] min-w-[44px]"
                    style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                    onClick={() => navigate('/catalogue')}
                  >
                    FIND A HELPER
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Video Section */}
            <div className="w-full md:w-1/2 relative flex items-center justify-center">
              <div 
                ref={videoRef}
                className={`relative transition-all duration-1000 ease-out w-full ${
                  isVideoVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Aspect Ratio Container - 16:9 standard */}
                <div className="relative w-full about-section-video" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    id="youtube-player-about"
                    className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
                    src="https://www.youtube.com/embed/3V9f6NTaxtc?autoplay=1&mute=1&loop=1&playlist=3V9f6NTaxtc&controls=0&enablejsapi=1&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&color=white&vq=hd720"
                    title="About Easy Hire - Professional Service Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                  {/* Transparent overlay to prevent YouTube hover effects */}
                  <div className="absolute inset-0 z-10 pointer-events-none bg-transparent rounded-lg"></div>
                  <YouTubeVideoControls playerId="youtube-player-about" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AboutSection;
