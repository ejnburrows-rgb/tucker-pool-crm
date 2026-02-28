import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Basic',
    description: 'For small residential pools',
    price: 120,
    period: 'month',
    features: ['Weekly pool cleaning', 'Chemical balancing', 'Skimming & vacuuming', 'Filter check', 'Service report per visit', 'Bilingual technicians'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Premium',
    description: 'Full-service pool care',
    price: 199,
    period: 'month',
    features: ['Everything in Basic', 'Equipment inspection', 'Tile & surface brushing', 'Pump & filter maintenance', 'Priority scheduling', 'Storm cleanup included', 'Photo reports', 'Direct tech hotline'],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Commercial',
    description: 'HOAs, hotels, & properties',
    price: 0,
    period: '',
    priceLabel: 'Custom',
    features: ['Multiple pool management', 'Daily or weekly visits', 'Health dept compliance', 'Emergency response 24/7', 'Dedicated account manager', 'Commercial equipment service', 'Insurance certificates', 'Volume discounts'],
    cta: 'Contact Us',
    highlighted: false,
  },
];

export default function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: headerRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } });
      const cards = cardsRef.current?.querySelectorAll('.pricing-card');
      if (cards) { gsap.fromTo(cards, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: cardsRef.current, start: 'top 75%', toggleActions: 'play none none reverse' } }); }
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  const handleCTA = () => { document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }); };
  const getPrice = (base: number) => isAnnual ? Math.round(base * 0.85) : base;
  return (
    <section ref={sectionRef} id="pricing" className="relative py-24 lg:py-32 bg-[#0A0A0A]">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div ref={headerRef} className="text-center mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 bg-[#22D3EE]/10 text-[#22D3EE] text-xs font-mono tracking-[0.12em] uppercase rounded-full mb-4">Pricing</span>
          <h2 className="text-[#F5F5F5] font-extrabold text-[clamp(32px,4vw,48px)] tracking-tight mb-4">Simple, Honest <span className="text-[#22D3EE]">Pricing</span></h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto mb-8">No contracts. No hidden fees. Just clean pools.</p>
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-[#F5F5F5]' : 'text-[#A1A1AA]'}`}>Monthly</span>
            <button onClick={() => setIsAnnual(!isAnnual)} className={`relative w-12 h-6 rounded-full transition-colors ${isAnnual ? 'bg-[#22D3EE]' : 'bg-white/[0.15]'}`}><div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-0.5'}`} /></button>
            <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-[#F5F5F5]' : 'text-[#A1A1AA]'}`}>Annual</span>
            {isAnnual && <span className="px-2 py-0.5 bg-[#22D3EE]/10 text-[#22D3EE] text-xs font-semibold rounded-full">Save 15%</span>}
          </div>
        </div>
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-start">
          {plans.map((plan) => (
            <div key={plan.name} className={`pricing-card relative p-8 rounded-[18px] transition-all duration-300 ${plan.highlighted ? 'bg-gradient-to-b from-[#22D3EE]/20 to-[#1F1F1F] border-2 border-[#22D3EE]/50 scale-105 z-10 shadow-xl shadow-[#22D3EE]/5' : 'glass-card-light hover:bg-white/[0.05]'}`}>
              {plan.highlighted && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#22D3EE] text-[#0A0A0A] text-xs font-bold rounded-full flex items-center gap-1"><Sparkles size={12} />Most Popular</div>}
              <div className="mb-6"><h3 className="text-[#F5F5F5] font-bold text-xl mb-2">{plan.name}</h3><p className="text-[#A1A1AA] text-sm">{plan.description}</p></div>
              <div className="mb-8">
                {plan.priceLabel ? (
                  <span className="text-[#F5F5F5] font-extrabold text-4xl lg:text-5xl">{plan.priceLabel}</span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-[#F5F5F5] font-extrabold text-4xl lg:text-5xl">${getPrice(plan.price)}</span>
                    <span className="text-[#A1A1AA] text-sm">/{plan.period}</span>
                  </div>
                )}
                {isAnnual && plan.price > 0 && <p className="text-[#22D3EE] text-xs mt-1">Billed ${getPrice(plan.price) * 12}/year</p>}
              </div>
              <ul className="space-y-3 mb-8">{plan.features.map((f) => (<li key={f} className="flex items-start gap-3"><div className="w-5 h-5 rounded-full bg-[#22D3EE]/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Check size={12} className="text-[#22D3EE]" /></div><span className="text-[#D4D4D8] text-sm">{f}</span></li>))}</ul>
              <button onClick={handleCTA} className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${plan.highlighted ? 'bg-[#22D3EE] text-[#0A0A0A] hover:bg-[#06B6D4] hover:shadow-lg hover:shadow-[#22D3EE]/20 hover:scale-[1.02]' : 'bg-white/[0.05] text-[#F5F5F5] border border-white/[0.1] hover:bg-white/[0.08] hover:scale-[1.02]'}`}>{plan.cta}</button>
            </div>
          ))}
        </div>
        <p className="text-center text-[#A1A1AA] text-sm mt-12">All plans include free water testing, bilingual service, and a satisfaction guarantee.</p>
      </div>
    </section>
  );
}
