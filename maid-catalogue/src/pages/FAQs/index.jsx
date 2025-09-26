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
      title: "Who is eligible to hire a maid?",
      content: "Singapore Citizens, Permanent Residents, and expatriates with a valid work pass may hire a Migrant Domestic Worker (MDW), subject to the Ministry of Manpower's (MOM) approval based on the stated reason for employment.\n\nExpatriates must also show proof that their family members live with them at the time of application.\n\nTo qualify as an employer, you must:\n• Be at least 21 years old.\n• Not be an undischarged bankrupt.\n• Have the mental capacity to understand and fulfill employer responsibilities.\n• Demonstrate sufficient financial resources to employ, maintain, and provide proper housing for the helper."
    },
    {
      title: "Do I need to give my maid rest days?",
      content: "Yes. MDWs are entitled to one rest day every week, with the specific day agreed upon between you and your helper.\n• If the maid agrees in writing to work on her rest day, you must compensate her.\n• Since **1 January 2023**, all employers must grant their helper **at least one non-negotiable rest day each month.**\n\nIf the helper chooses to work on other rest days, compensation can be either:\n1. An additional day's wages (separate from basic salary), or\n2. A replacement rest day within the same month."
    },
    {
      title: "What are my responsibilities as an employer?",
      content: "Under MOM regulations, employers must:\n• Pay the helper on time.\n• Cover all her living expenses.\n• Safeguard her general welfare while she resides in Singapore."
    },
    {
      title: "What is the average salary of a maid?",
      content: "• **Indonesian MDWs:** Starting salary is about **$550 SGD**, with potential increments depending on skills and experience.\n• **Myanmar MDWs:** Starting salary is between **$500–$550 SGD**, also subject to experience and ability."
    },
    {
      title: "How long does it take to hire a maid from overseas?",
      content: "The process typically takes **3–6 weeks**, depending on the maid's country of origin and document readiness.\n• If documents (e.g., passport) are in order, work permit approval may take less than a week.\n• Once approved, the maid can usually arrive within a month, subject to MOM's Entry Approval scheduling.\n• If extra processing is needed due to country-specific rules, the process may extend to 1–2 months.\n• On arrival, the maid must complete a medical check-up and, if it is her first time in Singapore, the **Settling-In Programme**.\n• The work permit must be issued within **14 days of arrival** after passing the medical exam."
    },
    {
      title: "What are transfer maids?",
      content: "Transfer maids are MDWs already in Singapore under another employer who are looking for new employment.\nThis often happens when a two-year contract ends or when either party decides to terminate the employment earlier."
    },
    {
      title: "How do I transfer my maid?",
      content: "• Provide written consent to the agency to begin the process.\n• You must continue paying the levy until the new Work Permit is issued.\n• If the maid's 6-Monthly Medical Examination (6ME) is due, you are responsible for arranging it.\n• If the transfer is unsuccessful and the Work Permit is cancelled or expires, you must repatriate the maid within **14 days**.\n• The maid can only start work with the new employer after the new Work Permit is issued.\n• Any outstanding salary must be paid on the release date."
    },
    {
      title: "What should I do if my maid goes missing?",
      content: "• Cancel her Work Permit immediately to stop levy payments.\n• You have **1 month** to locate and repatriate her, or you risk losing the **$5,000 security deposit**."
    }
  ];

  const rightColumnFAQs = [
    {
      title: "What happens if my maid becomes pregnant?",
      content: "Work permit holders, including MDWs, are not allowed to become pregnant or give birth in Singapore unless they are legally married to a Singapore Citizen or PR with prior government approval.\n\nIf your helper becomes pregnant:\n• Notify MOM.\n• Terminate her contract.\n• Cancel her Work Permit.\n• Pay for her air ticket home.\n\nFailure to comply may result in forfeiture of the **$5,000 security deposit**."
    },
    {
      title: "Can I hire a maid part-time?",
      content: "No. MOM does not allow MDWs to work part-time."
    },
    {
      title: "Why should I use a maid agency?",
      content: "Agencies handle the complex processes of hiring, including:\n• Training, work permit application, levy and insurance arrangements.\n• Security bond, travel, and immigration clearance.\n• Medical screening and other administrative steps.\n\nYou do not pay an agency fee — only the direct costs of hiring."
    },
    {
      title: "How much is the maid levy?",
      content: "• **Standard levy:** $300/month ($9.87/day).\n• **Additional MDWs:** $450/month ($14.80/day).\n• **Concessionary levy:** $60/month (for households with children under 16 or elderly above 67, who are Singapore Citizens).\n\nPayment rules:\n• Levy is deducted monthly via GIRO.\n• Missing GIRO payments will lead to Work Permit cancellation.\n• For first-time helpers, the levy starts from the **5th day after arrival** (excluding arrival day). For others, it starts the day after arrival.\n• Payment must be completed by the **17th of the following month** (next working day if it falls on a holiday/weekend)."
    },
    {
      title: "What is the $5,000 security bond?",
      content: "Employers must provide a **$5,000 bond** to ensure obligations are met (timely salary, proper care, repatriation).\n• If the employer breaches MOM conditions, the bond may be forfeited.\n• If the maid herself breaches conditions (e.g., pregnancy), the employer is not penalized.\n• If the maid absconds and repatriation is impossible, half the bond will be forfeited, provided you show reasonable effort to locate her."
    },
    {
      title: "Are there alternatives to the $5,000 bond?",
      content: "Yes. Employers may purchase maid insurance instead, which is generally cheaper and may include coverage for \"runaway\" situations.\nHowever, if you fail to repatriate the helper when required, you may still be liable for bond forfeiture unless your policy specifically covers it."
    },
    {
      title: "Can I claim tax relief on the maid levy?",
      content: "Yes, if you are:\n• A married woman who opted for separate tax assessment.\n• Married but your husband is not a Singapore resident.\n• Divorced, widowed, or separated and living with an unmarried child for whom you can claim child relief."
    },
    {
      title: "Who pays for the maid's medical expenses?",
      content: "You, as the employer, must cover all her medical costs (both inpatient and outpatient), as required by the Employment of Foreign Manpower Act."
    },
    {
      title: "What documents are needed for first-time employers?",
      content: "**For local employers:**\n• NRIC (yours and household members').\n• Proof of income (e.g., Notice of Assessment, or consent for MOM to verify income with IRAS).\n• If returning from overseas, a company letter confirming your job title, monthly salary, and start date.\n• If you did not file income tax:\n◦ Overseas tax assessment, and/or\n◦ CPF contribution statements for the last 3 months.\n\n**For expatriate employers:**\n• Passport copies (yours and family members').\n• Employment pass and dependent passes of family members living with you.\n\nThese documents are required for the Work Permit application process."
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