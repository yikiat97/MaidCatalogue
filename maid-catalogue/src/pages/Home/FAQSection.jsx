import React from 'react';
import Accordion from '../../components/ui/Accordion';

const FAQSection = () => {
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
    <section className="py-12 bg-white">
      <div className="max-w-6xl w-full mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-semibold leading-tight text-[#0e0e0e] mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-inter font-semibold leading-relaxed text-black">
            Explore our FAQ page to answer your questions about hiring maids, ensuring a smooth and confident hiring process.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-8">
          {/* Left Column */}
          <div className="w-full md:w-1/2">
            <Accordion items={leftColumnFAQs} allowMultiple={false} />
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2">
            <Accordion items={rightColumnFAQs} allowMultiple={false} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;