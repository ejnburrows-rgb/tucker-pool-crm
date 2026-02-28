import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PhoneCall, ClipboardCheck, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    icon: PhoneCall,
    title: 'Call or Request a Quote',
    description:
      'Call us or fill out the form below. We\'ll discuss your pool, schedule a visit, and give you a free no-obligation estimate. Servicio en Español disponible.',
  },
  {
    number: '02',
    icon: ClipboardCheck,
    title: 'We Inspect & Plan',
    description:
      'Our certified technicians inspect your pool, test the water chemistry, check all equipment, and create a custom service plan tailored to your pool.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Enjoy Crystal Clear Water',
    description:
      'Sit back and relax. We handle everything — cleaning, chemicals, equipment, and reporting. Your pool stays pristine, always swim-ready.',
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      const cards = cardsRef.current?.querySelectorAll('.step-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-24 lg:py-32 bg-[#0A0A0A]"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 bg-[#22D3EE]/10 text-[#22D3EE] text-xs font-mono tracking-[0.12em] uppercase rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-[#F5F5F5] font-extrabold text-[clamp(32px,4vw,48px)] tracking-tight mb-4">
            Getting Started is <span className="text-[#22D3EE]">Easy</span>
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
            From first call to crystal clear water — we make pool care effortless.
          </p>
        </div>

        {/* Steps */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="step-card glass-card-light p-8 lg:p-10 relative group hover:bg-white/[0.05] transition-colors"
              >
                {/* Step number */}
                <div className="absolute -top-4 -left-2 w-12 h-12 bg-[#22D3EE] rounded-xl flex items-center justify-center text-[#0A0A0A] font-bold text-sm">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#22D3EE]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={28} className="text-[#22D3EE]" />
                </div>

                {/* Content */}
                <h3 className="text-[#F5F5F5] font-bold text-xl mb-3">
                  {step.title}
                </h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Connector line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-[#22D3EE]/50 to-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
