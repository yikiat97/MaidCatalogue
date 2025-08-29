import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Button } from '../ui/button';
import Card from '../ui/Card';
import { MapPin, Check } from 'lucide-react';
import { useStaggeredAnimation } from '../../hooks/useAnimation';
import { cn } from '../../lib/utils';

const HelperServicesSection = () => {
  const [activeTab, setActiveTab] = useState("new-helper");

  // Service packages for New Helpers
  const newHelperServices = [
    {
      nationality: 'Myanmar',
      price: '$695',
      popular: false,
      features: [
        'Work Permit Application & Processing',
        'Administrative & Documentation',
        'Safety Awareness Training',
        'Medical Check-up & Health Screening',
        'Transportation & Air Ticket',
        'Agency Fee WAIVED - Save $378!'
      ],
      buttonText: 'Find a Helper'
    },
    {
      nationality: 'Philippines',
      price: '$1,993',
      popular: false,
      features: [
        'Work Permit Application & Processing',
        'Administrative & Documentation',
        'Safety Awareness Training',
        'Medical Check-up & Health Screening',
        'Transportation & Air Ticket',
        'POEA/Document Processing Fee',
        'Complete Agency Support'
      ],
      buttonText: 'Find a Helper'
    },
    {
      nationality: 'Indonesia',
      price: '$1,323',
      popular: false,
      features: [
        'Work Permit Application & Processing',
        'Administrative & Documentation',
        'Safety Awareness Training',
        'Medical Check-up & Health Screening',
        'Transportation & Air Ticket',
        'Overseas Processing Fee',
        'Full Agency Support'
      ],
      buttonText: 'Find a Helper'
    }
  ];

  // Service packages for Experienced Helpers
  const experiencedHelperServices = [
    {
      nationality: 'Myanmar',
      price: '$998',
      popular: false,
      features: [
        'Work Permit Application & Processing',
        'Administrative & Documentation',
        'Medical Check-up & Health Screening',
        'Transportation & Air Ticket',
        'Skills Verification & Reference Check',
        'Full Agency Support & Guarantee'
      ],
      buttonText: 'Find a Helper'
    },
    {
      nationality: 'Philippines', 
      price: '$1,918',
      popular: false,
      features: [
        'Work Permit Application & Processing',
        'Administrative & Documentation',
        'Medical Check-up & Health Screening',
        'Transportation & Air Ticket',
        'POEA/Document Processing Fee',
        'Experience Verification & Support'
      ],
      buttonText: 'Find a Helper'
    },
    {
      nationality: 'Indonesia',
      price: '$1,248',
      popular: false,
      features: [
        'Work Permit Application & Processing',
        'Administrative & Documentation',
        'Medical Check-up & Health Screening',
        'Transportation & Air Ticket',
        'Overseas Processing Fee',
        'Experience Verification & Support'
      ],
      buttonText: 'Find a Helper'
    }
  ];

  const currentServices = activeTab === "new-helper" ? newHelperServices : experiencedHelperServices;
  const { containerRef: servicesRef, visibleItems: visibleServices } = useStaggeredAnimation(currentServices, 200);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1440px] w-full mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold leading-tight mb-4">
            <span className="text-black">Helper </span>
            <span className="text-[#ff690d]">Services</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Choose between our new helper services or experienced helper packages based on your preferences.
          </p>
        </div>

        {/* Tab Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="flex h-16 p-2 bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-xl border-2 border-[#ff690d]/20 shadow-lg shadow-[#ff690d]/10 rounded-xl">
              <TabsTrigger 
                value="new-helper" 
                className="flex-1 h-12 px-6 text-lg font-inter font-semibold transition-all duration-300 rounded-lg min-w-0 text-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff690d] data-[state=active]:to-[#ff914d] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#ff690d]/30 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#ff690d] data-[state=inactive]:hover:bg-[#ff690d]/5"
              >
                New Helper
              </TabsTrigger>
              <TabsTrigger 
                value="experienced-helper" 
                className="flex-1 h-12 px-6 text-lg font-inter font-semibold transition-all duration-300 rounded-lg min-w-0 text-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff690d] data-[state=active]:to-[#ff914d] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#ff690d]/30 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#ff690d] data-[state=inactive]:hover:bg-[#ff690d]/5"
              >
                Experienced Helper
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Service Cards */}
          <TabsContent value="new-helper" className="mt-0">
            <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {newHelperServices.map((service, index) => (
                <ServiceCard 
                  key={`new-helper-${index}`} 
                  service={service} 
                  index={index} 
                  visibleServices={visibleServices} 
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="experienced-helper" className="mt-0">
            <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {experiencedHelperServices.map((service, index) => (
                <ServiceCard 
                  key={`experienced-helper-${index}`} 
                  service={service} 
                  index={index} 
                  visibleServices={visibleServices} 
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        

      </div>
    </section>
  );
};

const ServiceCard = ({ service, index, visibleServices }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ 
      opacity: visibleServices.includes(index) ? 1 : 0, 
      y: visibleServices.includes(index) ? 0 : 30,
      scale: visibleServices.includes(index) ? 1 : 0.95
    }}
    transition={{ 
      duration: 0.6, 
      ease: "easeOut",
      delay: index * 0.15
    }}
  >
    <Card
      className={cn(
        "relative h-full p-6 flex flex-col transition-all duration-300 ease-out hover:-translate-y-2",
        "bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl",
        "border-t-4 border-t-[#ff690d]",
        "border border-[#ff690d]/10 shadow-lg hover:shadow-xl hover:shadow-[#ff690d]/10"
      )}
      rounded={true}
      variant="elevated"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#ff690d] to-[#ff914d] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#ff690d]/30">
          <MapPin size={24} className="text-white" />
        </div>
        
        <h3 className="text-xl font-inter font-bold text-[#0c191b] mb-2 tracking-tight">
          {service.nationality}
        </h3>
        
        <div className="text-3xl font-bold text-[#ff690d] mb-1">
          {service.price}
        </div>
        <div className="text-sm text-gray-600">
          {service.subtitle}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-8 flex-grow">
        {service.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-[#ff690d] rounded-full flex items-center justify-center mt-0.5 shadow-sm">
              <Check size={12} className="text-white" />
            </div>
            <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        <Button
          className="w-full h-12 rounded-xl font-inter font-semibold text-base transition-all duration-300 border-2 border-[#ff690d] text-[#ff690d] bg-white hover:bg-[#ff690d] hover:text-white hover:-translate-y-0.5"
          variant="outline"
        >
          {service.buttonText}
        </Button>
      </div>
    </Card>
  </motion.div>
);

export default HelperServicesSection;