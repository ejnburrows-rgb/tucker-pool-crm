import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Load animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Background entrance
      tl.fromTo(
        bgRef.current,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.2 },
        0
      );

      // Headline lines entrance
      const lines = headlineRef.current?.querySelectorAll('.headline-line');
      if (lines) {
        tl.fromTo(
          lines,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
          0.3
        );
      }

      // CTA entrance
      tl.fromTo(
        ctaRef.current,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.6
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set([headlineRef.current, ctaRef.current], { opacity: 1, y: 0 });
            gsap.set(bgRef.current, { opacity: 1, scale: 1 });
          },
        },
      });

      // EXIT phase (70% - 100%)
      scrollTl.fromTo(
        headlineRef.current,
        { y: 0, opacity: 1 },
        { y: '-18vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        ctaRef.current,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.06, opacity: 0.7, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden z-10"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0 }}
      >
        <img
          src="/hero-pool.jpg"
          alt="Crystal clear pool service"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/70 via-[#0A0A0A]/50 to-[#0A0A0A]/90" />
        <div className="absolute inset-0 vignette" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-[1100px] mx-auto">
          {/* Headline */}
          <div ref={headlineRef} className="mb-8 lg:mb-12">
            <h1 className="text-[#F5F5F5] font-extrabold tracking-tight leading-[0.95] uppercase">
              <span className="headline-line block text-[clamp(32px,6vw,72px)]">
                Miami's Premier
              </span>
              <span className="headline-line block text-[clamp(32px,6vw,72px)]">
                Pool Service
              </span>
              <span className="headline-line block text-[clamp(32px,6vw,72px)]">
                <span className="text-[#22D3EE]">Experts</span>
              </span>
            </h1>
          </div>

          {/* Subheadline */}
          <p className="headline-line text-[#A1A1AA] text-base sm:text-lg max-w-xl mx-auto mb-8 lg:mb-10">
            Professional pool cleaning, maintenance, and repair services.
            Crystal clear water, every visit. Servicio en Inglés y Español.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('#cta')}
              className="group flex items-center gap-2 px-8 py-4 bg-[#F5F5F5] text-[#0A0A0A] rounded-xl font-semibold text-base hover:bg-white transition-all hover:scale-[1.02] hover:-translate-y-0.5"
            >
              Get a Free Quote
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="tel:+13055550142"
              className="group flex items-center gap-2 px-8 py-4 bg-white/[0.05] text-[#F5F5F5] rounded-xl font-semibold text-base border border-white/[0.1] hover:bg-white/[0.08] transition-all"
            >
              <Phone size={18} className="text-[#22D3EE]" />
              (305) 555-0142
            </a>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
    </section>
  );
}
