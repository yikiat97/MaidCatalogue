import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Button } from '../../components/ui/button';
import Accordion from '../../components/ui/Accordion';
import { useAnimation } from '../../hooks/useAnimation';

const FAQsPage = () => {
  const { elementRef: titleRef, isVisible: isTitleVisible } = useAnimation(0.3);
  const { elementRef: leftRef, isVisible: isLeftVisible } = useAnimation(0.2);
  const { elementRef: rightRef, isVisible: isRightVisible } = useAnimation(0.1);

  const leftColumnFAQs = [
    {
      title: "Is there really no agency fee ?",
      content: "Yes, we offer packages with no agency fees to make our services accessible to every family in Singapore."
    },
    {
      title: "Why should I choose Easy Hire to hire a maid?",
      content: "We provide transparent pricing, comprehensive support, and have over 10 years of experience in the industry."
    },
    {
      title: "Do I need to provide rest days to my maid?",
      content: "Yes, according to Singapore law, domestic workers are entitled to at least one rest day per week."
    },
    {
      title: "What responsibilities do I hold as an employer towards my maid?",
      content: "As an employer, you are responsible for providing fair wages, adequate accommodation, medical care, and ensuring their safety and well-being."
    },
    {
      title: "What is the average salary of a maid from Indonesia?",
      content: "The average salary ranges from $600 to $750 per month, depending on experience and specific requirements."
    },
    {
      title: "What is the average salary of a maid from Philippines?",
      content: "Filipino domestic workers typically earn between $650 to $800 per month based on their experience and skills."
    },
    {
      title: "What is the average salary of a maid from Myanmar?",
      content: "Myanmar domestic workers usually earn between $580 to $700 per month depending on their experience level."
    },
    {
      title: "What are the benefits of using a maid agency for hiring a maid",
      content: "Using an agency provides professional screening, legal compliance, ongoing support, and replacement services if needed."
    }
  ];

  const rightColumnFAQs = [
    {
      title: "Who can hire a maid?",
      content: "Singapore citizens and permanent residents can hire domestic workers. Work permit holders may also hire with proper documentation."
    },
    {
      title: "My maid got pregnant. What should I do?",
      content: "Contact us immediately. We will guide you through the legal requirements and help arrange for replacement if needed."
    },
    {
      title: "Is it possible to hire a maid on part-time basis?",
      content: "Yes, we offer part-time domestic helper services for families who do not require full-time assistance."
    },
    {
      title: "My maid went missing. What should I do?",
      content: "Report to the police immediately and contact us. We will assist with the necessary procedures and replacement arrangements."
    },
    {
      title: "What is a security bond ($5,000 security deposit)?",
      content: "The security bond is a mandatory deposit required by the government to ensure compliance with work permit conditions."
    },
    {
      title: "What other options do I have instead of the $5,000 security deposit?",
      content: "You can opt for security bond insurance which costs significantly less than the full deposit amount."
    },
    {
      title: "What is the duration required to hire a maid from overseas?",
      content: "The process typically takes 4-8 weeks depending on the country of origin and documentation requirements."
    }
  ];


  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-12">
        {/* Hero Section */}
        <section 
          className="bg-cover bg-center bg-no-repeat relative overflow-hidden"
          style={{
            backgroundImage: "url('/images/hero-bg.jpg')",
            height: 'clamp(300px, 40vh, 450px)',
            paddingTop: '30px' // Account for fixed navbar
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-45 z-10"></div>
          
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
                  <span className="text-white">Frequently Asked </span>
                  <span className="text-[#ff690d]">Questions</span>
                </h1>
                <p className="text-lg md:text-xl text-white mt-6 max-w-3xl mx-auto">
                  Find answers to common questions about hiring domestic helpers, our services, and the employment process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Content */}
        <section className="py-6 md:py-12 bg-white">
          <div className="max-w-[1440px] w-full mx-auto px-4">
            <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-8">
              {/* Left Column */}
              <div
                ref={leftRef}
                className={`w-full md:w-1/2 transition-all duration-1000 ease-out delay-300 ${
                  isLeftVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <Accordion items={leftColumnFAQs} allowMultiple={false} />
              </div>

              {/* Right Column */}
              <div
                ref={rightRef}
                className={`w-full md:w-1/2 transition-all duration-1000 ease-out delay-500 ${
                  isRightVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <Accordion items={rightColumnFAQs} allowMultiple={false} />
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
};

export default FAQsPage;