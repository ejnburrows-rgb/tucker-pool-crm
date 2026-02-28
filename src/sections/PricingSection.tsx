import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for solo operators',
    price: 29,
    period: 'month',
    features: [
      'Up to 100 clients',
      'Basic scheduling',
      'Payment tracking',
      'Email reminders',
      'Bilingual support',
      'Mobile app access',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    description: 'For growing pool service teams',
    price: 79,
    period: 'month',
    features: [
      'Unlimited clients',
      'Advanced scheduling',
      'Full payment suite',
      'SMS + Email reminders',
      'Overdue dashboard',
      'Work order management',
      'Priority support',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    description: 'For multi-location operations',
    price: 199,
    period: 'month',
    features: [
      'Everything in Pro',
      'Multiple locations',
      'Custom integrations',
      'Dedicated account manager',
      'Advanced reporting',
      'API access',
      'White-label options',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

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

      const cards = cardsRef.current?.querySelectorAll('.pricing-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
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

  const handleCTAClick = (planName: string) => {
    setSelectedPlan(planName);
    setIsDialogOpen(true);
  };

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative py-24 lg:py-32 bg-[#0A0A0A]"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 bg-[#22D3EE]/10 text-[#22D3EE] text-xs font-mono tracking-[0.12em] uppercase rounded-full mb-4">
            Pricing
          </span>
          <h2 className="text-[#F5F5F5] font-extrabold text-[clamp(32px,4vw,48px)] tracking-tight mb-4">
            Simple, Transparent <span className="text-[#22D3EE]">Pricing</span>
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
            Start free for 14 days. No credit card required. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-start"
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card relative p-8 rounded-[18px] transition-all ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-[#22D3EE]/20 to-[#1F1F1F] border-2 border-[#22D3EE]/50 scale-105 z-10'
                  : 'glass-card-light hover:bg-white/[0.05]'
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#22D3EE] text-[#0A0A0A] text-xs font-bold rounded-full flex items-center gap-1">
                  <Sparkles size={12} />
                  Most Popular
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className="text-[#F5F5F5] font-bold text-xl mb-2">
                  {plan.name}
                </h3>
                <p className="text-[#A1A1AA] text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-[#F5F5F5] font-extrabold text-4xl lg:text-5xl">
                    ${plan.price}
                  </span>
                  <span className="text-[#A1A1AA] text-sm">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#22D3EE]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-[#22D3EE]" />
                    </div>
                    <span className="text-[#D4D4D8] text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handleCTAClick(plan.name)}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlighted
                    ? 'bg-[#22D3EE] text-[#0A0A0A] hover:bg-[#06B6D4]'
                    : 'bg-white/[0.05] text-[#F5F5F5] border border-white/[0.1] hover:bg-white/[0.08]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <p className="text-center text-[#A1A1AA] text-sm mt-12">
          All plans include SSL security, daily backups, and 99.9% uptime guarantee.
        </p>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#111111] border-white/[0.06] text-[#F5F5F5]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Coming Soon
            </DialogTitle>
            <DialogDescription className="text-[#A1A1AA]">
              The {selectedPlan} plan signup is coming soon. Book a demo to get early access!
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <button
              onClick={() => {
                setIsDialogOpen(false);
                document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-3 px-4 bg-[#22D3EE] text-[#0A0A0A] rounded-xl font-semibold text-sm hover:bg-[#06B6D4] transition-colors"
            >
              Book a Demo
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
