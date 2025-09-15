import React from 'react';
import PricingCard from '../../components/ui/PricingCard';

const PricingPage = () => {
  // Pricing data matching the image design
  const pricingPlans = [
    {
      title: 'Basic',
      price: '19',
      period: '/month',
      isPopular: false,
      features: [
        'Up to 5 team members',
        '10GB cloud storage',
        'Basic email support',
        'Standard templates',
        'Mobile app access',
        'Basic analytics'
      ],
      ctaText: 'Get Basic'
    },
    {
      title: 'Standard',
      price: '29',
      period: '/month',
      isPopular: true,
      features: [
        'Up to 25 team members',
        '100GB cloud storage',
        'Priority email support',
        'Premium templates',
        'Mobile & desktop apps',
        'Advanced analytics',
        'Custom integrations',
        'Team collaboration tools'
      ],
      ctaText: 'Get Standard'
    },
    {
      title: 'Premium',
      price: '39',
      period: '/month',
      isPopular: false,
      features: [
        'Unlimited team members',
        '1TB cloud storage',
        '24/7 phone & email support',
        'All premium templates',
        'Full platform access',
        'Advanced analytics & reporting',
        'Custom integrations',
        'Advanced security features',
        'Dedicated account manager'
      ],
      ctaText: 'Get Premium'
    }
  ];

  const handlePlanSelect = (planTitle) => {
    console.log(`Selected plan: ${planTitle}`);
    // Here you would typically handle the plan selection
    // e.g., redirect to checkout, open modal, etc.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-16 px-4">
      {/* Pricing Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
          {pricingPlans.map((plan) => (
            <div key={plan.title} className="flex justify-center">
              <PricingCard
                title={plan.title}
                price={plan.price}
                period={plan.period}
                features={plan.features}
                isPopular={plan.isPopular}
                ctaText={plan.ctaText}
                onCTAClick={() => handlePlanSelect(plan.title)}
                className="w-full max-w-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;