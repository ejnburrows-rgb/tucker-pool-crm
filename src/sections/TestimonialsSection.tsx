import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Use UI Avatars for reliable avatar generation (no hotlink issues)
const getAvatarUrl = (name: string, bg: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=96&background=${bg}&color=fff&font-size=0.4&bold=true&format=svg`;

const testimonials = [
  {
    name: 'Carlos Rodriguez',
    role: 'Owner, Miami Pool Pros',
    avatarBg: '0891B2',
    content:
      "The bilingual feature is a game-changer. My crew prefers Spanish, and the office works in English. Tucker CRM bridges that gap perfectly. We've reduced miscommunication by 90%.",
    rating: 5,
  },
  {
    name: 'Jennifer Walsh',
    role: 'Operations Manager, AquaCare Services',
    avatarBg: '22D3EE',
    content:
      "We tried three other CRMs before finding Tucker. The overdue payment tracking alone has recovered over $15,000 in unpaid invoices. The automated reminders are gentle but effective.",
    rating: 5,
  },
  {
    name: 'Marcus Thompson',
    role: 'Founder, ClearBlue Pool Maintenance',
    avatarBg: '06B6D4',
    content:
      "The scheduling interface is intuitive. I can see my entire week at a glance and reassign jobs with drag-and-drop. My technicians get instant updates on their phones.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
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

      const cards = cardsRef.current?.querySelectorAll('.testimonial-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
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
      className="relative py-24 lg:py-32 bg-[#0A0A0A]"
    >
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#22D3EE]/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 bg-[#22D3EE]/10 text-[#22D3EE] text-xs font-mono tracking-[0.12em] uppercase rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-[#F5F5F5] font-extrabold text-[clamp(32px,4vw,48px)] tracking-tight mb-4">
            Loved by Pool <span className="text-[#22D3EE]">Pros</span>
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
            See what pool service business owners are saying about Tucker CRM.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="testimonial-card glass-card-light p-8 relative group hover:bg-white/[0.05] transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#22D3EE]/10 flex items-center justify-center group-hover:bg-[#22D3EE]/15 transition-colors">
                <Quote size={18} className="text-[#22D3EE]" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-[#22D3EE] fill-[#22D3EE]"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-[#D4D4D8] text-sm leading-relaxed mb-8">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={getAvatarUrl(testimonial.name, testimonial.avatarBg)}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/[0.06]"
                  loading="lazy"
                />
                <div>
                  <p className="text-[#F5F5F5] font-semibold text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-[#A1A1AA] text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
