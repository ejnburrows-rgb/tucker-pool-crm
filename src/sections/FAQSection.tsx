import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: 'Is the CRM really bilingual?',
    answer:
      'Yes! Tucker CRM supports both English and Spanish throughout the entire interface. Each user can set their preferred language, and all client communications (emails, SMS reminders) can be sent in either language. Perfect for teams with diverse language preferences.',
  },
  {
    question: 'Can I import my existing client list?',
    answer:
      'Absolutely. We support CSV imports from Excel, Google Sheets, or any other CRM. Our team can also help with custom data migration for larger operations. Most clients are up and running within 24 hours.',
  },
  {
    question: 'How does the payment tracking work?',
    answer:
      'Tucker CRM tracks all your invoices with three clear statuses: Paid, Pending, and Overdue. The overdue dashboard gives you a prioritized list of accounts needing attention, and you can send automated reminders with one click.',
  },
  {
    question: 'Is there a mobile app for my technicians?',
    answer:
      'Yes, Tucker CRM is fully responsive and works great on mobile browsers. Technicians can view their daily schedule, update work orders, add photos, and mark jobs complete—all from their phones. Native iOS and Android apps are coming soon.',
  },
  {
    question: 'What happens to my data? Is it secure?',
    answer:
      'Your data is encrypted at rest and in transit. We perform automated daily backups, and you can export your data anytime. We never sell or share your information with third parties.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, there are no long-term contracts. You can cancel anytime from your account settings, and you\'ll continue to have access until the end of your billing period. We also offer a 30-day money-back guarantee.',
  },
  {
    question: 'Do you offer training or onboarding?',
    answer:
      'All plans include access to our video tutorial library and documentation. Professional and Enterprise plans include live onboarding sessions. Our support team is available via chat and email to help you get started.',
  },
  {
    question: 'Can multiple team members use the same account?',
    answer:
      'Yes, Tucker CRM is built for teams. You can add unlimited team members with different permission levels—admins can manage everything, while technicians only see their assigned work.',
  },
];

export default function FAQSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        accordionRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: accordionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative py-24 lg:py-32 bg-[#0A0A0A]"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 bg-[#22D3EE]/10 text-[#22D3EE] text-xs font-mono tracking-[0.12em] uppercase rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-[#F5F5F5] font-extrabold text-[clamp(32px,4vw,48px)] tracking-tight mb-4">
            Frequently Asked <span className="text-[#22D3EE]">Questions</span>
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
            Everything you need to know about Tucker CRM.
          </p>
        </div>

        {/* Accordion */}
        <div ref={accordionRef} className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card-light border-none px-6 data-[state=open]:bg-white/[0.05]"
              >
                <AccordionTrigger className="text-[#F5F5F5] font-semibold text-left hover:no-underline py-5 text-sm lg:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#A1A1AA] text-sm leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
