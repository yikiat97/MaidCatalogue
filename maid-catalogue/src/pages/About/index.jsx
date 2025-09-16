import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PhoneFramedYouTube from '../../components/common/PhoneFramedYouTube';
import { useAnimation } from '../../hooks/useAnimation';

const AboutPage = () => {
  const { elementRef: titleRef, isVisible: isTitleVisible } = useAnimation(0.3);
  const { elementRef: visionRef, isVisible: isVisionVisible } = useAnimation(0.3);
  const { elementRef: commitmentRef, isVisible: isCommitmentVisible } = useAnimation(0.3);
  const { elementRef: fetrinRef, isVisible: isFetrinVisible } = useAnimation(0.3);
  const { elementRef: videosRef, isVisible: isVideosVisible } = useAnimation(0.3);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-12 relative">
        {/* Combined gradient background that spans multiple sections */}
        <div 
          className="absolute inset-0 pointer-events-none z-5"
          style={{
            background: `
              radial-gradient(circle at 30% 25%, #fed7aa 0%, #fff7ed 20%, transparent 50%),
              radial-gradient(circle at 75% 45%, #fed7aa 0%, #fff7ed 20%, transparent 45%),
              radial-gradient(circle at 65% 85%, #fed7aa 0%, #fff7ed 20%, transparent 50%)
            `
          }}
        />
        {/* Hero Section */}
        <section 
          className="bg-cover bg-center bg-no-repeat relative overflow-hidden z-10"
          style={{
            backgroundImage: "url('/images/easyhire-cover.svg')",
            height: 'clamp(300px, 40vh, 450px)',
            paddingTop: '30px' // Account for fixed navbar
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
          
          <div className="max-w-[1440px] w-full px-4 mx-auto relative z-20 h-full flex items-center">
            <div className="w-full text-center">
              <div 
                ref={titleRef}
                className={`mb-8 transition-all duration-1000 ease-out ${
                  isTitleVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-inter font-extrabold leading-tight">
                  <span className="text-white">About </span>
                  <span className="text-[#ff690d]">EasyHire</span>
                </h1>
                <p className="text-lg md:text-xl text-white mt-6 max-w-3xl mx-auto">
                  Founded with a simple mission: to make finding quality domestic help accessible, transparent, and affordable for every family in Singapore.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section
          className="relative z-10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/vision-bg.jpg')"
          }}
        >
          <div className="max-w-[1440px] w-full mx-auto px-4 relative z-10">
            <div 
              ref={visionRef}
              className={`transition-all duration-1000 ease-out ${
                isVisionVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center">
                {/* Image Left */}
                <div className="flex items-center justify-center relative">
                  {/* Background gradient blur effect */}
                  <div className="absolute inset-0 bg-gradient-radial from-[#ff690d]/20 via-[#fed7aa]/10 to-transparent rounded-full blur-xl transform scale-110"></div>
                  {/* Foreground gradient container */}
                  <div className="relative z-10   to-transparent rounded-2xl p-6 md:p-8">
                    <img
                      src="/images/FOUNDER.svg"
                      alt="Li Ling - Founder of Easy Hire"
                      className="w-full max-w-md lg:max-w-lg h-auto object-contain"
                    />
                  </div>
                </div>
                
                {/* Text Content Right */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="pb-4">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold text-white mb-4">
                        Li Ling
                      </h2>
                      <div className="w-24 h-1 bg-[#ff690d]"></div>
                    </div>
                    <div className="space-y-4">
                      {/* Main bold statement */}
                    

                      {/* Personal story */}
                      <div className="space-y-4">
                        <p className="text-base md:text-lg lg:text-xl font-light font-inter text-gray-200 leading-relaxed text-justify">
                          Hi, I'm Li Ling, founder of Easy Hire. I started this agency after seeing my own family struggle with hidden fees and poor support when hiring a helper. Easy Hire is built on transparency, fair treatment, and real after-care so both employers and helpers feel respected from day one. No surprises, just honest guidance and support that leaves an impact.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section
          className="relative z-10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/commitment-bg.jpg')"
          }}
        >
          <div className="max-w-[1440px] w-full mx-auto px-4 relative z-10">
            <div 
              ref={commitmentRef}
              className={`transition-all duration-1000 ease-out ${
                isCommitmentVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center">
                {/* Text Content Left */}
                <div className="space-y-6 order-2 lg:order-1">
                  <div className="space-y-4">
                    <div className="pb-4">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold text-white mb-4">
                        Yikiat
                      </h2>
                      <div className="w-24 h-1 bg-[#ff690d]"></div>
                    </div>
                    <div className="space-y-4">
                      {/* Main bold statement */}
                      

                      {/* Personal story */}
                      <div className="space-y-4">
                        <p className="text-base md:text-lg lg:text-xl font-light font-inter text-gray-200 leading-relaxed text-justify">
                          I am Yikiat. I build the systems that make hiring simple and seamless. My focus is to build responsibly, protect data, and keep things steady without extra fuss. If something can be simpler or safer, that's what I work on next.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Image Right */}
                <div className="flex items-center justify-center order-1 lg:order-2 min-h-full self-center relative">
                  {/* Background gradient blur effect */}
                  <div className="absolute inset-0 bg-gradient-radial from-[#ff690d]/20 via-[#fed7aa]/10 to-transparent rounded-full blur-xl transform scale-110"></div>
                  {/* Foreground gradient container */}
                  <div className="relative z-10   to-transparent rounded-2xl p-6 md:p-8">
                    <img
                      src="/images/CTO.svg"
                      alt="Yikiat - Systems Developer"
                      className="w-full max-w-md lg:max-w-lg h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fetrin Testimonial Section */}
        <section
          className="py-8 md:py-12 lg:py-16 relative z-10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/Fetrin-bg.jpeg')"
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

          <div className="max-w-[1440px] w-full mx-auto px-4 relative z-20">
            <div
              ref={fetrinRef}
              className={`transition-all duration-1000 ease-out ${
                isFetrinVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center">
                {/* Image Left */}
                <div className="flex items-center justify-center relative">
                  {/* Background gradient blur effect */}
                  <div className="absolute inset-0 bg-gradient-radial from-[#ff690d]/20 via-[#fed7aa]/10 to-transparent rounded-full blur-xl transform scale-110"></div>
                  {/* Foreground gradient container */}
                  <div className="relative z-10 to-transparent rounded-2xl p-6 md:p-8">
                    <img
                      src="/images/OSE.svg"
                      alt="Fetrin - Customer Care Specialist"
                      className="w-full max-w-md lg:max-w-lg h-auto object-contain"
                    />
                  </div>
                </div>

                {/* Text Content Right */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="pb-4">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold text-white mb-4">
                        Fetrin
                      </h2>
                      <div className="w-24 h-1 bg-[#ff690d]"></div>
                    </div>
                    <div className="space-y-4">
                      {/* Main bold statement */}
                    

                      {/* Personal story */}
                      <div className="space-y-4">
                        <p className="text-base md:text-lg lg:text-xl font-light font-inter text-gray-200 leading-relaxed text-justify">
                          Hi there, my name is Fetrin. I want to make hiring helpers easy, reliable, and supportive for both families and helpers. I am committed to helping employers find the right helper while ensuring every helper is treated with fairness and respect.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Stories Section */}
        <section className="py-4 md:py-12 lg:py-20 relative z-10">
          <div className="max-w-[1440px] w-full mx-auto px-4">
            <div 
              ref={videosRef}
              className={`transition-all duration-1000 ease-out ${
                isVideosVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Section Header */}
              <div className="text-center mb-8 md:mb-12 lg:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold text-black mb-4">
                  Our Story
                </h2>
                <div className="w-24 h-1 bg-[#ff690d] mx-auto mb-6"></div>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover the passion and vision behind EasyHire through the stories of our founder and our company's journey.
                </p>
              </div>

              {/* Videos Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-start">
                
                {/* About Our Founder Video */}
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold font-inter text-gray-900 mb-2">
                      About Our Founder
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto">
                      Meet the visionary behind EasyHire and learn about the personal journey that inspired our mission.
                    </p>
                  </div>
                  
                  <PhoneFramedYouTube
                    videoId="https://www.youtube.com/shorts/ctPfJZD1m9c"
                    title="About Our Founder"
                    autoplay={false}
                    muted={true}
                    ariaLabel="Video about EasyHire founder and company vision"
                    className="mx-auto"
                  />
                </div>

                {/* EasyHire History Video */}
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold font-inter text-gray-900 mb-2">
                      EasyHire Story
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto">
                      Explore the history and evolution of EasyHire, from inception to becoming Singapore's trusted helper agency.
                    </p>
                  </div>
                  
                  <PhoneFramedYouTube
                    videoId="https://www.youtube.com/shorts/ctPfJZD1m9c"
                    title="EasyHire Story"
                    autoplay={false}
                    muted={true}
                    ariaLabel="Video about EasyHire company history and growth"
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;