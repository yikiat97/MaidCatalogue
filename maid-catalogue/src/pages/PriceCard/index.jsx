import React from 'react';
import WavyCard from '../../components/ui/WavyCard';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const PriceCardPage = () => {
  // Enhanced pricing data for wavy cards
  const pricingPlans = [
    {
      title: 'Premium Features',
      subtitle: 'Unlock advanced capabilities',
      variant: 'default',
      price: '$29',
      period: '/month',
      description: 'Experience the next level of functionality with our premium tier. Get access to advanced analytics, priority support, and exclusive features.',
      features: [
        'Analytics Dashboard',
        'Priority Support',
        'Advanced Tools',
        'Custom Integrations',
        'Team Collaboration',
      ],
      ctaText: 'Upgrade Now',
      popular: false,
    },
    {
      title: 'Smart Dashboard',
      subtitle: 'Monitor everything in one place',
      variant: 'accent',
      price: '$49',
      period: '/month',
      description: 'Get real-time insights into your business performance with our intuitive dashboard. Track metrics, analyze trends, and make data-driven decisions.',
      stats: [
        { label: '24/7', sublabel: 'Monitoring' },
        { label: '99.9%', sublabel: 'Uptime' },
      ],
      features: [
        'Real-time Analytics',
        'Custom Reports',
        'API Access',
        'White-label Options',
        'Dedicated Support',
      ],
      ctaText: 'Get Started',
      popular: true,
    },
    {
      title: 'Team Collaboration',
      subtitle: 'Work together seamlessly',
      variant: 'default',
      price: '$79',
      period: '/month',
      description: 'Bring your team together with powerful collaboration tools. Share projects, communicate in real-time, and achieve more together.',
      features: [
        'Unlimited Team Members',
        'Advanced Permissions',
        'Version Control',
        'Real-time Editing',
        'Project Templates',
        'Time Tracking',
      ],
      ctaText: 'Start Free Trial',
      teamSize: '+12 members',
      popular: false,
    },
  ];

  const handlePlanSelect = (planTitle) => {
    console.log(`Selected plan: ${planTitle}`);
    // Handle plan selection logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary-orange to-orange-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4 text-balance">
              Dynamic Wavy Header Cards
            </h1>
            <p className="text-lg opacity-90 text-pretty max-w-2xl mx-auto">
              Breaking away from traditional rectangular shapes with fluid, engaging design elements
            </p>
          </div>
        </div>

        {/* Pricing Cards Section */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => (
                <WavyCard
                  key={plan.title}
                  title={plan.title}
                  subtitle={plan.subtitle}
                  variant={plan.variant}
                  className={`${plan.popular ? 'ring-2 ring-primary-orange ring-offset-4' : ''} ${plan.title === 'Smart Dashboard' ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  <div className="space-y-6">
                    {/* Pricing */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary-orange">
                        {plan.price}
                      </span>
                      <span className="text-gray-500">{plan.period}</span>
                      {plan.popular && (
                        <span className="ml-auto bg-primary-orange text-white px-2 py-1 rounded-full text-xs font-medium">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Stats for Smart Dashboard */}
                    {plan.stats && (
                      <div className="grid grid-cols-2 gap-4 text-center py-4 bg-gray-50 rounded-lg">
                        {plan.stats.map((stat, index) => (
                          <div key={index}>
                            <div className="text-2xl font-bold text-primary-orange">
                              {stat.label}
                            </div>
                            <div className="text-xs text-gray-500">
                              {stat.sublabel}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Team Size for Team Collaboration */}
                    {plan.teamSize && (
                      <div className="flex -space-x-2 items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-orange flex items-center justify-center text-white text-xs font-medium">
                          JD
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                          SM
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium">
                          AL
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium">
                          {plan.teamSize}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-primary-orange flex items-center justify-center">
                            <svg
                              className="w-2 h-2 text-white"
                              fill="currentColor"
                              viewBox="0 0 8 8"
                            >
                              <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                            </svg>
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={() => handlePlanSelect(plan.title)}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        plan.variant === 'accent'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : plan.popular
                          ? 'bg-primary-orange hover:bg-orange-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200'
                      }`}
                    >
                      {plan.ctaText}
                    </button>
                  </div>
                </WavyCard>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-16 text-center">
              <p className="text-gray-600 text-sm">
                All plans include a 30-day money-back guarantee. No hidden fees.
              </p>
              <div className="mt-4 flex justify-center gap-8 text-xs text-gray-500">
                <span>✓ SSL Security</span>
                <span>✓ 24/7 Support</span>
                <span>✓ Regular Updates</span>
                <span>✓ Data Backup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PriceCardPage;