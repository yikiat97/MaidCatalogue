import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const PricingCard = ({
  title,
  price,
  period = '/month',
  features = [],
  isPopular = false,
  ctaText = 'Choose Plan',
  onCTAClick,
  className = '',
  ...props
}) => {
  const cardBaseClasses = 'relative rounded-[30px] overflow-hidden text-white min-h-[500px] transition-all duration-300 hover:scale-105 hover:shadow-2xl';

  // Different background gradients for each plan type
  const backgroundGradients = {
    basic: 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900',
    standard: 'bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900',
    premium: 'bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900'
  };

  const planType = title.toLowerCase();
  const bgGradient = backgroundGradients[planType] || backgroundGradients.basic;

  return (
    <div
      className={`${cardBaseClasses} ${bgGradient} ${className}`}
      {...props}
    >
      {/* Popular badge for highlighted plan */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-[#ff690d] to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
            Most Popular
          </div>
        </div>
      )}


      <div className="relative z-10 p-8 h-full flex flex-col">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4 capitalize text-white drop-shadow-sm">
            {title}
          </h3>

          {/* Price Display */}
          <div className="mb-6">
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-extrabold text-white drop-shadow-sm">${price}</span>
              <span className="text-lg text-gray-200 ml-1">{period}</span>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="flex-grow mb-8 relative">
          {/* Features background */}
          <div className="absolute inset-x-0 top-0 h-full bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10" />

          <div className="relative z-10 p-6">
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-400 flex items-center justify-center mr-3 mt-0.5 shadow-lg ring-2 ring-white/20">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-white text-sm leading-relaxed font-medium drop-shadow-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-auto relative z-10">
          <Button
            onClick={onCTAClick}
            variant="primary"
            size="medium"
            className="w-full bg-[#ff690d] hover:bg-[#e55a0a] text-white font-bold py-4 rounded-[20px] transition-all duration-200 hover:shadow-xl transform hover:scale-105 shadow-lg"
          >
            {ctaText}
          </Button>
        </div>
      </div>

      {/* Enhanced overlay pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30 pointer-events-none" />

      {/* Improved decorative elements */}
      <div className="absolute top-4 right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-xl pointer-events-none" />
    </div>
  );
};

PricingCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  period: PropTypes.string,
  features: PropTypes.arrayOf(PropTypes.string),
  isPopular: PropTypes.bool,
  ctaText: PropTypes.string,
  onCTAClick: PropTypes.func,
  className: PropTypes.string,
};

export default PricingCard;