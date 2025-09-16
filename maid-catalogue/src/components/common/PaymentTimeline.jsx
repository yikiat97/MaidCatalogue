import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Card } from '../ui/card';
import { DollarSign, Calendar, CheckCircle, FileText } from 'lucide-react';
import { useAnimation } from '../../hooks/useAnimation';

const PaymentTimeline = () => {
  const { elementRef: timelineRef, isVisible: isTimelineVisible } = useAnimation(0.3);

  const paymentStages = [
    {
      id: 1,
      title: '1st Payment',
      subtitle: 'Package Fee',
      amount: 'Package Fee',
      timing: 'Upon Confirmation',
      description: 'Package fee upon confirmation',
      icon: Calendar,
      color: 'bg-[#ff690d]'
    },
    {
      id: 2,
      title: '2nd Payment',
      subtitle: 'Insurance Purchase',
      amount: 'Insurance',
      timing: 'Insurance Payment',
      description: 'Purchase of helper\'s insurance - Direct payment to our partnered insurer for helper\'s medical insurance',
      icon: FileText,
      color: 'bg-[#ff914d]'
    },
    {
      id: 3,
      title: '3rd Payment',
      subtitle: 'Helper\'s Loan',
      amount: 'Loan Payment',
      timing: 'Upon Deployment',
      description: 'Helper\'s loan upon deployment',
      icon: CheckCircle,
      color: 'bg-[#4ade80]'
    }
  ];

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-[1440px] w-full mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold leading-tight mb-4">
            <span className="text-black">Payment </span>
            <span className="text-[#ff690d]">Schedule</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our transparent 3-stage payment system ensures you only pay as progress is made on your helper placement.
          </p>
        </div>

        {/* Timeline */}
        <motion.div
          ref={timelineRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: isTimelineVisible ? 1 : 0, 
            y: isTimelineVisible ? 0 : 30 
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Desktop Timeline */}
          <div className="hidden md:block">
            <div className="flex items-stretch justify-between relative">
              {/* Connection Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff690d] via-[#ff914d] to-[#4ade80] transform -translate-y-1/2 z-0"></div>
              
              {paymentStages.map((stage, index) => {
                const IconComponent = stage.icon;
                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: isTimelineVisible ? 1 : 0,
                      scale: isTimelineVisible ? 1 : 0.8
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.2,
                      ease: "easeOut"
                    }}
                    className="flex-1 relative z-10 flex"
                  >
                    <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-4 md:p-6 mx-2 flex flex-col h-full w-full">
                      {/* Stage Indicator */}
                      <div className="flex flex-col items-center mb-4">
                        <div className={`w-16 h-16 ${stage.color} rounded-full flex items-center justify-center mb-3 shadow-lg`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs font-semibold bg-white">
                          Stage {stage.id}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="text-center flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {stage.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {stage.subtitle}
                        </p>
                        <div className="text-3xl font-bold text-[#ff690d] mb-2">
                          {stage.amount}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed flex-1">
                          {stage.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="block md:hidden space-y-4">
            {paymentStages.map((stage, index) => {
              const IconComponent = stage.icon;
              const isLast = index === paymentStages.length - 1;
              
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ 
                    opacity: isTimelineVisible ? 1 : 0,
                    x: isTimelineVisible ? 0 : -30
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2,
                    ease: "easeOut"
                  }}
                  className="relative"
                >
                  <div className="flex">
                    {/* Timeline indicator */}
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-12 h-12 ${stage.color} rounded-full flex items-center justify-center shadow-lg z-10`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      {!isLast && (
                        <Separator 
                          orientation="vertical" 
                          className="w-0.5 h-16 bg-gradient-to-b from-gray-300 to-gray-200 mt-2"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <Card className="flex-1 bg-white border border-gray-200 shadow-lg p-3 sm:p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {stage.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {stage.subtitle}
                          </p>
                        </div>
                        <div className="text-2xl font-bold text-[#ff690d]">
                          {stage.amount}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {stage.description}
                      </p>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isTimelineVisible ? 1 : 0, 
            y: isTimelineVisible ? 0 : 20 
          }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 md:mt-10 lg:mt-12 text-center">
          <Card className="bg-gradient-to-r from-[#ff690d]/5 to-[#ff914d]/5 border border-[#ff690d]/20 p-4 md:p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-[#ff690d] mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Payment Protection</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Our structured payment system protects both parties. Each payment is tied to specific milestones, 
              ensuring transparency and accountability throughout the entire helper placement process.
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default PaymentTimeline;