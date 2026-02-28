import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  { question: 'What areas do you service?', answer: 'We serve all of Miami-Dade County including Miami, Miami Beach, Coral Gables, Coconut Grove, Brickell, Doral, Kendall, Homestead, and surrounding areas. If you\'re unsure, just give us a call — we\'ll let you know!' },
  { question: 'Do you offer service in Spanish?', answer: '¡Sí! All of our technicians are bilingual (English and Spanish). You can communicate with us in whichever language you prefer — calls, texts, reports, everything.' },
  { question: 'How often should my pool be serviced?', answer: 'For most residential pools in Miami\'s climate, we recommend weekly service. The heat and humidity accelerate algae growth and chemical consumption. We also offer bi-weekly plans for pools with less usage.' },
  { question: 'What\'s included in a standard cleaning visit?', answer: 'Every visit includes: skimming the surface, vacuuming the pool floor, brushing walls and tile, emptying skimmer and pump baskets, testing and balancing water chemistry (pH, chlorine, alkalinity), and checking equipment operation. We also provide a digital service report after each visit.' },
  { question: 'Do I need to be home during service?', answer: 'No! Most of our customers aren\'t home when we service their pools. We just need gate access or a code. After each visit, you\'ll receive a photo report showing the pool condition and chemical readings.' },
  { question: 'What if my pool turns green?', answer: 'Don\'t worry — it happens, especially after storms. We offer emergency green pool recovery service (usually 24-48 hours to restore). For Premium plan customers, storm cleanups are included at no extra charge.' },
  { question: 'Are you licensed and insured?', answer: 'Yes. R&D Pool Services is fully licensed and insured in the State of Florida. We carry general liability and workers\' compensation insurance for your peace of mind. Certificates available upon request.' },
  { question: 'Is there a contract or commitment?', answer: 'No long-term contracts required. Our monthly plans are month-to-month — you can pause or cancel anytime with 30 days notice. No cancellation fees, no hassle. We keep customers because of quality, not contracts.' },
];

export default function FAQSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: headerRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } });
      gsap.fromTo(accordionRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, scrollTrigger: { trigger: accordionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={sectionRef} id="faq" className="relative py-24 lg:py-32 bg-[#0A0A0A]">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div ref={headerRef} className="text-center mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 bg-[#22D3EE]/10 text-[#22D3EE] text-xs font-mono tracking-[0.12em] uppercase rounded-full mb-4">FAQ</span>
          <h2 className="text-[#F5F5F5] font-extrabold text-[clamp(32px,4vw,48px)] tracking-tight mb-4">Frequently Asked <span className="text-[#22D3EE]">Questions</span></h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">Everything you need to know about our pool services.</p>
        </div>
        <div ref={accordionRef} className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="glass-card-light border-none px-6 data-[state=open]:bg-white/[0.05]">
                <AccordionTrigger className="text-[#F5F5F5] font-semibold text-left hover:no-underline py-5 text-sm lg:text-base">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-[#A1A1AA] text-sm leading-relaxed pb-5">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
