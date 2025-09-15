import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import Accordion from '../../components/ui/Accordion';
import { useAnimation } from '../../hooks/useAnimation';

const FAQsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { elementRef: titleRef, isVisible: isTitleVisible } = useAnimation(0.3);
  const { elementRef: searchRef, isVisible: isSearchVisible } = useAnimation(0.2);

  const categories = [
    'All',
    'General Questions',
    'Hiring Process',
    'Legal Requirements',
    'Costs & Fees',
    'After-Hire Support',
    'Helper Management'
  ];

  const faqs = [
    // General Questions
    {
      category: 'General Questions',
      title: "Is there really no agency fee?",
      content: "Yes, we offer packages with no agency fees to make our services accessible to every family in Singapore. Our zero service fee applies specifically to new Myanmar helpers, making quality domestic help affordable for all families."
    },
    {
      category: 'General Questions',
      title: "Why should I choose Easy Hire to hire a maid?",
      content: "We provide transparent pricing, comprehensive support, and have over 10 years of experience in the industry. Our founder's personal experience drives our commitment to honest, affordable service with full support from start to finish."
    },
    {
      category: 'General Questions',
      title: "Who can hire a maid?",
      content: "Singapore citizens and permanent residents can hire domestic workers. Work permit holders may also hire with proper documentation and meeting specific eligibility criteria set by MOM (Ministry of Manpower)."
    },
    {
      category: 'General Questions',
      title: "What are the benefits of using a maid agency for hiring a maid?",
      content: "Using an agency provides professional screening, legal compliance, ongoing support, and replacement services if needed. We handle all paperwork, ensure proper documentation, and provide continuous support throughout the employment period."
    },

    // Hiring Process
    {
      category: 'Hiring Process',
      title: "What is the duration required to hire a maid from overseas?",
      content: "The process typically takes 4-8 weeks depending on the country of origin and documentation requirements. Myanmar helpers may take 6-8 weeks, while transfer maids can start within 2-3 weeks after successful interviews."
    },
    {
      category: 'Hiring Process',
      title: "Is it possible to hire a maid on part-time basis?",
      content: "Yes, we offer part-time domestic helper services for families who do not require full-time assistance. Part-time arrangements can be daily, weekly, or customized to your specific needs and schedule."
    },
    {
      category: 'Hiring Process',
      title: "How do I know if a helper is suitable for my family?",
      content: "We provide detailed profiles, work history, and facilitate video interviews. Our matching process considers your specific requirements, family size, living arrangements, and special needs to find the most suitable helper."
    },

    // Legal Requirements
    {
      category: 'Legal Requirements',
      title: "Do I need to provide rest days to my maid?",
      content: "Yes, according to Singapore law, domestic workers are entitled to at least one rest day per week. This can be a full day off or compensation if the helper agrees to work on their rest day, subject to MOM regulations."
    },
    {
      category: 'Legal Requirements',
      title: "What responsibilities do I hold as an employer towards my maid?",
      content: "As an employer, you are responsible for providing fair wages, adequate accommodation, medical care, and ensuring their safety and well-being. You must also comply with work permit conditions and maintain proper employment records."
    },
    {
      category: 'Legal Requirements',
      title: "What is a security bond ($5,000 security deposit)?",
      content: "The security bond is a mandatory deposit required by the government to ensure compliance with work permit conditions. It serves as a guarantee that you will fulfill your obligations as an employer and cover any potential costs if issues arise."
    },
    {
      category: 'Legal Requirements',
      title: "What other options do I have instead of the $5,000 security deposit?",
      content: "You can opt for security bond insurance which costs significantly less than the full deposit amount. This insurance typically costs around $240-300 per year and provides the same coverage as the cash deposit."
    },

    // Costs & Fees
    {
      category: 'Costs & Fees',
      title: "What is the average salary of a maid from Indonesia?",
      content: "The average salary ranges from $600 to $750 per month, depending on experience and specific requirements. Indonesian helpers typically have good experience in household management and childcare."
    },
    {
      category: 'Costs & Fees',
      title: "What is the average salary of a maid from Philippines?",
      content: "Filipino domestic workers typically earn between $650 to $800 per month based on their experience and skills. They are known for their English proficiency and experience in eldercare."
    },
    {
      category: 'Costs & Fees',
      title: "What is the average salary of a maid from Myanmar?",
      content: "Myanmar domestic workers usually earn between $580 to $700 per month depending on their experience level. They are hardworking and eager to learn, making them excellent choices for first-time employers."
    },
    {
      category: 'Costs & Fees',
      title: "Are there any hidden costs I should be aware of?",
      content: "No, we maintain transparent pricing with no hidden costs. All fees are clearly outlined in our service packages. The only additional costs would be the helper's salary, levy, insurance, and any personal items you choose to provide."
    },

    // After-Hire Support
    {
      category: 'After-Hire Support',
      title: "My maid got pregnant. What should I do?",
      content: "Contact us immediately. We will guide you through the legal requirements and help arrange for replacement if needed. Pregnant domestic workers must return to their home country for delivery, and we'll assist with all necessary arrangements."
    },
    {
      category: 'After-Hire Support',
      title: "My maid went missing. What should I do?",
      content: "Report to the police immediately and contact us. We will assist with the necessary procedures and replacement arrangements. It's important to file the police report within 24 hours and inform MOM about the situation."
    },
    {
      category: 'After-Hire Support',
      title: "What if my helper and my family don't get along?",
      content: "We provide counseling and mediation services to resolve conflicts. If issues cannot be resolved, we offer replacement services within the first 6 months at no additional charge, subject to terms and conditions."
    },
    {
      category: 'After-Hire Support',
      title: "Do you provide ongoing training for helpers?",
      content: "Yes, we offer ongoing training programs including language classes, skill development workshops, and specialized training for childcare or eldercare as needed. This ensures your helper continues to improve and adapt to your family's needs."
    },

    // Helper Management
    {
      category: 'Helper Management',
      title: "How often should I review my helper's performance?",
      content: "We recommend monthly informal check-ins and formal quarterly reviews. This helps maintain open communication, address concerns early, and acknowledge good performance. We can provide performance review templates and guidance."
    },
    {
      category: 'Helper Management',
      title: "What should I include in my helper's contract?",
      content: "The contract should include salary, duties, working hours, rest day arrangements, accommodation details, and house rules. We provide standard contract templates that comply with Singapore employment laws and can customize them to your needs."
    },
    {
      category: 'Helper Management',
      title: "How do I handle disciplinary issues?",
      content: "Document issues, communicate clearly with your helper, and contact us for guidance. We can provide mediation services and help resolve conflicts professionally. For serious issues, we'll guide you through proper procedures to protect both parties."
    },
    {
      category: 'Helper Management',
      title: "Can my helper visit friends or family during rest days?",
      content: "Yes, during official rest days, helpers are free to leave the house and spend time as they choose, as long as they return by the agreed time. However, you may set reasonable house rules for safety and security purposes."
    }
  ];

  // Filter FAQs based on category
  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    
    return matchesCategory;
  });


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

        {/* Filter Section */}
        <section className="py-4 md:py-8 bg-gray-50">
          <div className="max-w-[1440px] w-full mx-auto px-4">
            <div 
              ref={searchRef}
              className={`transition-all duration-1000 ease-out ${
                isSearchVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="max-w-4xl mx-auto">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={
                        selectedCategory === category
                          ? "bg-[#ff690d] hover:bg-[#e55a0a] text-white"
                          : "border-[#ff690d] text-[#ff690d] hover:bg-[#ff690d] hover:text-white"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Content */}
        <section className="py-6 md:py-12 bg-white">
          <div className="max-w-[1440px] w-full mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Accordion 
                  items={filteredFAQs.slice(0, Math.ceil(filteredFAQs.length / 2))} 
                  allowMultiple={false} 
                />
              </div>
              <div>
                <Accordion 
                  items={filteredFAQs.slice(Math.ceil(filteredFAQs.length / 2))} 
                  allowMultiple={false} 
                />
              </div>
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No FAQs found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try selecting a different category.
                </p>
                <Button 
                  onClick={() => {
                    setSelectedCategory('All');
                  }}
                  className="bg-[#ff690d] hover:bg-[#e55a0a]"
                >
                  Show All FAQs
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="py-8 md:py-16 bg-[#ff690d] text-white relative overflow-hidden">
          <div className="max-w-[1440px] w-full mx-auto px-4 text-center relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-extrabold leading-tight mb-6">
              Still Have Questions?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our friendly support team is here to help you every step of the way.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Button 
                size="lg" 
                className="bg-white text-[#ff690d] hover:bg-gray-100 px-8 py-3 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                CONTACT SUPPORT
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-[#ff690d] px-8 py-3 text-lg font-semibold transition-all duration-200"
              >
                CALL US NOW
              </Button>
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
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQsPage;