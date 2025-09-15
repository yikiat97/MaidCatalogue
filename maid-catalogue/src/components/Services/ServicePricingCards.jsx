import React, { useState, useEffect } from 'react';
import WavyCard from '../ui/WavyCard';
import { getCountryFlag } from '../../utils/flagUtils';

const ServicePricingCards = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [isVisible, setIsVisible] = useState(true);

  const serviceTiers = [
    // New Helper Packages
    {
      title: 'Myanmar Helper',
      subtitle: 'New Helper Package',
      variant: 'default',
      country: 'Myanmar',
      price: '$695',
      period: 'total cost',
      category: 'new',
      description: 'Cost-effective package for new Myanmar domestic helpers with comprehensive support and training.',
      features: [
        'Work Permit Application & Issuance: $70',
        'Administrative cost: $80',
        'Safety awareness course: $75',
        'Medical check up: $80',
        'Transportation upon arrival: $140',
        'Air Ticket: $250',
        'Agency Fee: WAIVED'
      ],
      ctaText: 'Find a Helper',
      popular: true,
      waiveFee: true,
    },
    {
      title: 'Indonesian Helper',
      subtitle: 'New Helper Package',
      variant: 'default',
      country: 'Indonesia',
      price: '$1,323',
      period: 'total cost',
      category: 'new',
      description: 'Comprehensive package for new Indonesian domestic helpers with full documentation support.',
      features: [
        'Work Permit Application & Issuance: $70',
        'Administrative cost: $80',
        'Safety awareness course: $75',
        'Medical check up: $80',
        'Transportation upon arrival: $140',
        'Air Ticket: $250',
        'Overseas processing fee: $250',
        'Agency Fee: $378'
      ],
      ctaText: 'Find a Helper',
      popular: false,
    },
    {
      title: 'Filipino Helper',
      subtitle: 'New Helper Package',
      variant: 'accent',
      country: 'Philippines',
      price: '$1,993',
      period: 'total cost',
      category: 'new',
      description: 'Premium package for new Filipino domestic helpers with extensive government documentation.',
      features: [
        'Work Permit Application & Issuance: $70',
        'Administrative cost: $80',
        'Safety awareness course: $75',
        'Medical check up: $80',
        'Transportation upon arrival: $140',
        'Air Ticket: $250',
        'POEA/Document fee to Philippines government: $700',
        'Agency Fee: $598'
      ],
      ctaText: 'Find a Helper',
      popular: false,
    },
    // Experienced Helper Packages
    {
      title: 'Myanmar Helper',
      subtitle: 'Experienced Helper Package',
      variant: 'default',
      country: 'Myanmar',
      price: '$620',
      period: 'total cost',
      category: 'experienced',
      description: 'Package for experienced Myanmar domestic helpers with proven work history.',
      features: [
        'Work Permit Application & Issuance: $70',
        'Administrative cost: $80',
        'Safety awareness course: Not Required',
        'Medical check up: $80',
        'Transportation upon arrival: $140',
        'Air Ticket: $250',
        'Agency Fee: WAIVED'
      ],
      ctaText: 'Find a Helper',
      popular: true,
      waiveFee: true,
    },
    {
      title: 'Indonesian Helper',
      subtitle: 'Experienced Helper Package',
      variant: 'accent',
      country: 'Indonesia',
      price: '$1,248',
      period: 'total cost',
      category: 'experienced',
      description: 'Package for experienced Indonesian domestic helpers with validated work experience.',
      features: [
        'Work Permit Application & Issuance: $70',
        'Administrative cost: $80',
        'Safety awareness course: Not Required',
        'Medical check up: $80',
        'Transportation upon arrival: $140',
        'Air Ticket: $250',
        'Overseas processing fee: $250',
        'Agency Fee: $378'
      ],
      ctaText: 'Find a Helper',
      popular: false,
    },
    {
      title: 'Filipino Helper',
      subtitle: 'Experienced Helper Package',
      variant: 'default',
      country: 'Philippines',
      price: '$1,918',
      period: 'total cost',
      category: 'experienced',
      description: 'Package for experienced Filipino domestic helpers with established track record.',
      features: [
        'Work Permit Application & Issuance: $70',
        'Administrative cost: $80',
        'Safety awareness course: Not Required',
        'Medical check up: $80',
        'Transportation upon arrival: $140',
        'Air Ticket: $250',
        'POEA/Document fee to Philippines government: $700',
        'Agency Fee: $598'
      ],
      ctaText: 'Find a Helper',
      popular: false,
    },
  ];

  const handleServiceSelect = (serviceTitle) => {
    console.log(`Selected service: ${serviceTitle}`);
    // Handle service selection logic - could redirect to booking or contact form
  };

  const handleTabChange = (newTab) => {
    if (newTab !== activeTab) {
      setIsVisible(false);
      setTimeout(() => {
        setActiveTab(newTab);
        setIsVisible(true);
      }, 300);
    }
  };

  // Filter packages based on active tab
  const filteredPackages = serviceTiers.filter(tier => tier.category === activeTab);

  // Create different orderings for mobile vs desktop
  const displayedPackages = filteredPackages;

  return (
    <section className="py-8 sm:py-12 lg:py-16 xl:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-4">
       

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 sm:p-1.5 shadow-md border border-gray-200 flex flex-col sm:flex-row">
            <button
              className={`px-3 sm:px-4 md:px-6 py-3 rounded-md font-medium transition-all duration-200 text-sm sm:text-base ${
                activeTab === 'new'
                  ? 'bg-[#ff690d] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => handleTabChange('new')}
            >
              New Helper
            </button>
            <button
              className={`px-3 sm:px-4 md:px-6 py-3 rounded-md font-medium transition-all duration-200 text-sm sm:text-base ${
                activeTab === 'experienced'
                  ? 'bg-[#ff690d] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => handleTabChange('experienced')}
            >
              Experienced Helper
            </button>
          </div>
        </div>

        {/* Tab Content Description */}
        <div className="text-center mb-8 px-2 sm:px-0">
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            {activeTab === 'new'
              ? 'Packages for first-time domestic helpers including comprehensive training and safety.'
              : 'Packages for experienced domestic helpers with proven work history and validated skills.'
            }
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-8 xl:gap-10 items-stretch transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {displayedPackages.map((service, index) => (
            <WavyCard
              key={service.title}
              title={service.title}
              subtitle={service.subtitle}
              variant={service.variant}
              flagBackground={getCountryFlag(service.country)}
              className={`
                ${service.popular && !service.waiveFee ? 'ring-2 ring-[#ff690d] ring-offset-4' : ''}
                ${service.waiveFee ?
                  'ring-4 ring-[#ff690d] ring-offset-4 shadow-2xl shadow-[#ff690d]/30 mx-3 sm:mx-0' :
                  'hover:-translate-y-1'
                }
                ${service.country === 'Myanmar' ? 'lg:order-2' : ''}
                ${service.country === 'Indonesia' ? 'lg:order-1' : ''}
                ${service.country === 'Philippines' ? 'lg:order-3' : ''}
                transform transition-all duration-500 relative
              `.trim()}
            >
              {/* Enhanced Visual Elements for Myanmar Cards */}
              {service.waiveFee && (
                <>
                  {/* Corner Decorations */}
                  <div className="absolute top-0 left-0 w-0 h-0 border-l-[20px] border-l-[#ff690d] border-t-[20px] border-t-[#ff690d] border-r-[20px] border-r-transparent border-b-[20px] border-b-transparent z-10"></div>
                  <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[20px] border-r-[#ff690d] border-b-[20px] border-b-[#ff690d] border-l-[20px] border-l-transparent border-t-[20px] border-t-transparent z-10"></div>


                  {/* Waived Agency Fee Badge - Top Right */}
                  <div className="absolute top-2 right-2 z-20">
                    <div className="bg-gradient-to-r from-[#ff690d] to-[#ff914d] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-white/20 transform rotate-3">
                      Most Popular
                    </div>
                  </div>
                </>
              )}
              <div className="flex flex-col h-full">
                {/* Main Content Container - grows to fill available space */}
                <div className="flex-1 space-y-6">
                  {/* Pricing */}
                  <div className="flex items-baseline gap-2">
                    <span className={`font-bold text-[#ff690d] ${
                      service.waiveFee
                        ? 'text-4xl drop-shadow-lg shadow-[#ff690d]/50'
                        : 'text-3xl'
                    }`}>
                      {service.price}
                    </span>
                    <span className="text-gray-500 text-sm">{service.period}</span>
                    {service.popular && !service.waiveFee && (
                      <span className="ml-auto bg-[#ff690d] text-white px-2 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    )}
                  </div>

                  {/* Stats for Premium Service */}
                  {service.stats && (
                    <div className="grid grid-cols-2 gap-4 text-center py-4 bg-blue-50 rounded-lg">
                      {service.stats.map((stat, index) => (
                        <div key={index}>
                          <div className="text-2xl font-bold text-blue-600">
                            {stat.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {stat.sublabel}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dedicated Support Indicator for Enterprise */}
                  {service.teamSize && (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#ff690d] flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {service.teamSize}
                        </div>
                        <div className="text-xs text-gray-500">
                          Personal assistance throughout
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <ul className="space-y-3 text-sm">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#ff690d] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 8 8"
                          >
                            <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                          </svg>
                        </div>
                        <span className={`text-gray-700 ${
                          service.waiveFee && feature.includes('Agency Fee: WAIVED')
                            ? 'text-lg font-bold text-[#ff690d]'
                            : ''
                        }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button - Always positioned at bottom */}
                <div className="mt-6">
                  <button
                    onClick={() => handleServiceSelect(service.title)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                      service.waiveFee
                        ? 'bg-gradient-to-r from-[#ff690d] to-[#ff914d] text-white shadow-xl font-bold text-lg py-4'
                        : service.variant === 'accent'
                        ? 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 hover:border-gray-400'
                        : service.popular
                        ? 'bg-[#ff690d] hover:bg-orange-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {service.waiveFee ? `${service.ctaText} - Save $378!` : service.ctaText}
                  </button>
                </div>
              </div>
            </WavyCard>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center px-2 sm:px-0">
          <p className="text-gray-600 text-xs sm:text-sm mb-4">
            All service packages include our quality guarantee. Additional services available upon request.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#ff690d]" fill="currentColor" viewBox="0 0 8 8">
                <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
              </svg>
              Licensed Agency
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#ff690d]" fill="currentColor" viewBox="0 0 8 8">
                <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
              </svg>
              MOM Approved
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#ff690d]" fill="currentColor" viewBox="0 0 8 8">
                <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
              </svg>
              Insurance Covered
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#ff690d]" fill="currentColor" viewBox="0 0 8 8">
                <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
              </svg>
              24/7 Emergency Support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicePricingCards;