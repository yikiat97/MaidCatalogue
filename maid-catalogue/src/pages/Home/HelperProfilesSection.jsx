import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useAnimation, useStaggeredAnimation } from '../../hooks/useAnimation';
import API_CONFIG from '../../config/api.js';

const HelperProfilesSection = () => {
  const [maids, setMaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const maidsPerPage = 3;
  const navigate = useNavigate();
  
  const { elementRef: titleRef, isVisible: isTitleVisible } = useAnimation(0.3);
  const { elementRef: navRef, isVisible: isNavVisible } = useAnimation(0.2);

  // Function to get optimized image URL
  const getOptimizedImageUrl = (originalUrl) => {
    if (!originalUrl) return "/images/img_frame_4_309x253.png";
    
    // If using a CDN like CloudFront, you can add optimization parameters
    // For now, we'll use the original URL but add lazy loading
    const finalUrl = originalUrl.startsWith('http') ? originalUrl : API_CONFIG.buildImageUrl(originalUrl);
    return finalUrl;
  };

  // Fetch top maids from backend
  useEffect(() => {
    const fetchTopMaids = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.CATALOGUE.TOP_MAIDS));
        
        if (!response.ok) {
          throw new Error('Failed to fetch maids');
        }
        
        const data = await response.json();
        setMaids(data);
      } catch (err) {
        console.error('Error fetching maids:', err);
        setError('Failed to load helpers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopMaids();
  }, []);

  // Secure blur protection
  useEffect(() => {
    const protectBlur = () => {
      const blurredImages = document.querySelectorAll('.secure-blur');
      blurredImages.forEach(img => {
        // Ensure blur is always applied
        if (!img.style.filter || !img.style.filter.includes('blur')) {
          img.style.filter = 'blur(8px)';
          img.style.transform = 'scale(1.1)';
        }
        
        // Prevent context menu
        img.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Prevent drag and drop
        img.addEventListener('dragstart', (e) => e.preventDefault());
      });
    };

    // Run protection immediately and set up interval
    protectBlur();
    const interval = setInterval(protectBlur, 1000);

    // Set up mutation observer to watch for DOM changes
    const observer = new MutationObserver(protectBlur);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [maids]);

  const { containerRef, visibleItems } = useStaggeredAnimation(maids.slice(currentPage * maidsPerPage, (currentPage + 1) * maidsPerPage), 150);

  const nextPage = () => {
    setCurrentPage((prev) => {
      const maxPage = Math.ceil(maids.length / maidsPerPage) - 1;
      return prev >= maxPage ? 0 : prev + 1;
    });
  };

  const prevPage = () => {
    setCurrentPage((prev) => {
      const maxPage = Math.ceil(maids.length / maidsPerPage) - 1;
      return prev <= 0 ? maxPage : prev - 1;
    });
  };

  const getCurrentMaids = () => {
    const startIndex = currentPage * maidsPerPage;
    return maids.slice(startIndex, startIndex + maidsPerPage);
  };

  const getLanguageRating = (maid) => {
    if (!maid.maidDetails) return 'N/A';
    const { englishRating, chineseRating, dialectRating } = maid.maidDetails;
    const ratings = [englishRating, chineseRating, dialectRating].filter(r => r !== null);
    if (ratings.length === 0) return 'N/A';
    return `${Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length)}/10`;
  };

  const getSkillsDisplay = (skills) => {
    if (!skills || skills.length === 0) return 'General housekeeping';
    return skills.slice(0, 3).join(', ');
  };

  const handleMaidClick = (maidId) => {
    navigate(`/maid/${maidId}`);
  };

  if (loading) {
    return (
      <section className="bg-[#f3f3f3] py-12 md:py-16 relative">
        <div className="max-w-6xl w-full mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-semibold text-[#0e0e0e] mb-2">
              Find Your Helper
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-inter font-normal text-[#333232]">
              Loading our top helpers...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#f3f3f3] py-12 md:py-16 relative">
        <div className="max-w-6xl w-full mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-semibold text-[#0e0e0e] mb-2">
              Find Your Helper
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-inter font-normal text-[#333232] mb-4">
              {error}
            </p>
            <Button variant="outline" size="medium" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f3f3f3] py-12 md:py-16 relative">
      <div className="max-w-6xl w-full mx-auto px-4">
        {/* Section Title */}
        <div 
          ref={titleRef}
          className={`text-center mb-8 transition-all duration-1000 ease-out ${
            isTitleVisible || maids.length > 0
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-semibold text-[#0e0e0e] mb-2">
            Find Your Helper
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-inter font-normal text-[#333232]">
            Browse our top {maids.length} active helpers ready to join your family
          </p>
        </div>

        {/* Navigation Arrows */}
        <div 
          ref={navRef}
          className={`flex justify-between items-center mb-6 md:mb-8 transition-all duration-1000 ease-out delay-300 ${
            isNavVisible || maids.length > 0
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <button
            onClick={prevPage}
            className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-all duration-300 hover-scale"
            disabled={maids.length === 0}
          >
            <img
              src="/images/img_frame_1000006136.svg"
              alt="Previous"
              className="w-8 h-8"
            />
          </button>
          
          {/* Page Indicator */}
          <div className="flex items-center space-x-2">
            <span className="page-indicator text-sm font-medium">
              {currentPage + 1} of {Math.ceil(maids.length / maidsPerPage)}
            </span>
          </div>
          
          <button
            onClick={nextPage}
            className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-all duration-300 hover-scale"
            disabled={maids.length === 0}
          >
            <img
              src="/images/img_frame_1000006135.svg"
              alt="Next"
              className="w-8 h-8"
            />
          </button>
        </div>

        {/* Helper Profiles Grid */}
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {getCurrentMaids().map((maid, index) => (
            <div
              key={maid.id}
              className={`flex flex-col items-center border border-[#d9d9d9] rounded-2xl p-4 sm:p-6 bg-white shadow hover-lift transition-all duration-700 ease-out cursor-pointer ${
                visibleItems.includes(index)
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => handleMaidClick(maid.id)}
            >
              {/* Helper Image with Secure Blur */}
              <div className="relative w-40 h-40 sm:w-52 sm:h-52 mb-8 overflow-hidden rounded-xl">
                <img
                  src={getOptimizedImageUrl(maid.imageUrl)}
                  alt={maid.name}
                  className="w-full h-full object-cover secure-blur"
                  onError={(e) => {
                    e.target.src = "/images/img_frame_4_309x253.png";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 pointer-events-none"></div>
              </div>

              {/* Helper Info */}
              <div className="w-full space-y-3">
                <h3 className="text-lg sm:text-xl md:text-2xl font-inter font-semibold text-[#0e0e0e] text-center">
                  {maid.name}
                </h3>

                <div className="flex items-center justify-center">
                  <img
                    src="/images/img_location06.svg"
                    alt="Location"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-base font-inter text-[#0e0e0e]">
                    {maid.country}
                  </span>
                </div>

                <div className="flex items-center justify-center">
                  <img
                    src="/images/img_calendarfavorite02.svg"
                    alt="Salary"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-base font-inter text-[#0e0e0e]">
                    ${maid.salary}/month
                  </span>
                </div>

                <div className="flex items-center justify-center">
                  <img
                    src="/images/img_work.svg"
                    alt="Skills"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-base font-inter text-[#0e0e0e] text-center">
                    {getSkillsDisplay(maid.skills)}
                  </span>
                </div>

                {maid.maidDetails && (
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-inter text-[#ff690d]">
                      Language Rating: {getLanguageRating(maid)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Browse Button */}
        <div className="text-center">
          <Button variant="outline" size="medium" className="px-4 py-2 hover-scale">
            Browse All Helpers
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HelperProfilesSection;