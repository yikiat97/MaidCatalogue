import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Button } from '../../components/ui/button';
import { useAnimation } from '../../hooks/useAnimation';

const AboutPage = () => {
  const { elementRef: titleRef, isVisible: isTitleVisible } = useAnimation(0.3);
  const { elementRef: storyRef, isVisible: isStoryVisible } = useAnimation(0.2);
  const { elementRef: valuesRef, isVisible: isValuesVisible } = useAnimation(0.1);

  const values = [
    {
      title: "Transparency",
      description: "No hidden fees, no unexpected clauses - just honest, transparent pricing and communication.",
      icon: "💎"
    },
    {
      title: "Technology", 
      description: "Seamless digital hiring process from the comfort of your home with integrated modern solutions.",
      icon: "💻"
    },
    {
      title: "Quality Selection",
      description: "Every helper profile meticulously screened and trained for diverse household needs.",
      icon: "⭐"
    },
    {
      title: "Ongoing Support",
      description: "Comprehensive post-hire support to ensure smooth transitions and long-term success.",
      icon: "🤝"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-12">
        {/* Hero Section */}
        <section 
          className="bg-cover bg-no-repeat relative overflow-hidden"
          style={{
            backgroundImage: 'url(/images/all-staff.PNG)',
            backgroundPosition: 'center 15%',
            height: '50vh',
            paddingTop: '30px' // Account for fixed navbar
          }}
        >
          {/* Background overlay for text readability */}
          <div className="absolute inset-0 bg-black/40 z-10"></div>
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
                  <span className="text-[#ff690d]">Easy Hire</span>
                </h1>
                <p className="text-lg md:text-xl text-white mt-6 max-w-3xl mx-auto">
                  Serving Homes, Serving Hearts - Technology-enabled hiring that makes quality domestic help accessible and affordable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 ">
          <div className="max-w-[1440px] w-full mx-auto px-4">
            <div 
              ref={storyRef}
              className={`transition-all duration-1000 ease-out ${
                isStoryVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-center overflow-hidden shadow-none">
                {/* Text Content */}
                <div className="w-full lg:w-3/5 p-8 lg:p-12">
                  <div className="space-y-6">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-bold text-gray-900">
                      Serving Homes, Serving Hearts
                    </h2>
                    
                    <div className="space-y-4 text-base md:text-lg font-inter leading-relaxed text-gray-700">
                      <p>
                        At Easy Hire, we understand the genuine needs of both employers and domestic helpers. We've revolutionized the traditional hiring process by integrating <span className="text-[#ff690d] font-bold">cutting-edge technology</span> to make it seamless, transparent, and affordable.
                      </p>
                      
                      <p>
                        Our mission is simple: reduce hiring costs to the <span className="text-[#ff690d] font-bold">bare cost of direct hiring</span> while ensuring every helper profile is meticulously screened and trained for diverse household needs.
                      </p>

                      <p>
                        We enable employers to hire from the comfort of their homes with complete transparency - no hidden fees, no unexpected clauses, and comprehensive post-hire support every step of the way.
                      </p>
                    </div>

                    <Button 
                      size="lg" 
                      className="bg-[#ff690d] hover:bg-[#e55a0a] text-white px-8 py-3 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
                    >
                      FIND A HELPER
                    </Button>
                  </div>
                </div>
                
                {/* Image Section */}
                <div className="w-full lg:w-2/5 relative">
                  <div className="relative h-64 lg:h-full min-h-[400px] flex items-end justify-center lg:justify-end">
                    <img
                      src="/images/all-staff.PNG"
                      alt="Happy family together - representing the caring relationships Easy Hire helps build"
                      className="w-full h-full object-cover lg:object-contain max-w-sm lg:max-w-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 bg-white">
          <div className="max-w-[1440px] w-full mx-auto px-4">
            <div 
              ref={valuesRef}
              className={`transition-all duration-1000 ease-out ${
                isValuesVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold leading-tight">
                  <span className="text-black">Our Core </span>
                  <span className="text-[#ff690d]">Values</span>
                </h2>
                <p className="text-lg text-gray-700 mt-4 max-w-3xl mx-auto">
                  These principles guide everything we do and shape how we serve families across Singapore.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="text-center p-6 h-full bg-white rounded-lg shadow-md"
                    style={{ 
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-inter font-bold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 bg-[#ff690d] text-white relative overflow-hidden">
          <div className="max-w-[1440px] w-full mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-inter font-bold mb-6">Our Mission</h3>
                <p className="text-lg leading-relaxed">
                  Serving Homes, Serving Hearts - To bridge the gap between employers and domestic helpers through technology-enabled transparency, affordability, and unwavering commitment to quality service.
                </p>
              </div>
              
              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-inter font-bold mb-6">Our Vision</h3>
                <p className="text-lg leading-relaxed">
                  To revolutionize domestic helper hiring in Singapore through innovative technology, making quality help accessible at the bare cost of direct hiring while maintaining the highest standards of service and support.
                </p>
              </div>
            </div>
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-32 h-32 bg-white/10 rounded-full animate-float"
                 style={{ 
                   top: '20%', left: '10%',
                   animationDelay: '0s',
                   animationDuration: '8s'
                 }}></div>
            <div className="absolute w-24 h-24 bg-white/10 rounded-full animate-float"
                 style={{ 
                   bottom: '30%', right: '15%',
                   animationDelay: '2s',
                   animationDuration: '6s'
                 }}></div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1440px] w-full mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold leading-tight mb-6">
              <span className="text-black">Ready to Find Your Perfect </span>
              <span className="text-[#ff690d]">Helper?</span>
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied families who have found their ideal domestic helper through Easy Hire. Start your journey today.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Button 
                size="lg" 
                className="bg-[#ff690d] hover:bg-[#e55a0a] text-white px-8 py-3 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                FIND A HELPER
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="border-[#ff690d] text-[#ff690d] hover:bg-[#ff690d] hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-200"
              >
                CONTACT US
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;