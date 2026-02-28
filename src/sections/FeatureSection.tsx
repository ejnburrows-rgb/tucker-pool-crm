import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Droplets,
  Wrench,
  ShieldCheck,
  Sparkles,
  ThermometerSun,
  Beaker,
  Calendar,
  Clock,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 'cleaning',
    icon: Droplets,
    headline: 'Weekly Cleaning.',
    highlight: 'Clear.',
    subheadline: 'Crystal',
    description: 'Skimming, vacuuming, brushing, and filter cleaning. Every visit, guaranteed.',
    image: '/ui-clients.jpg',
    label: 'CLEANING',
  },
  {
    id: 'maintenance',
    icon: Wrench,
    headline: 'Equipment Repair.',
    highlight: 'Done Right.',
    subheadline: 'Pumps, filters,',
    description: 'Expert repair and replacement of pumps, filters, heaters, and automation systems.',
    image: '/ui-schedule.jpg',
    label: 'MAINTENANCE',
  },
  {
    id: 'chemistry',
    icon: Beaker,
    headline: 'Water Chemistry.',
    highlight: 'Balance.',
    subheadline: 'Perfect',
    description: 'pH, chlorine, alkalinity, and stabilizer testing. Lab-grade precision.',
    image: '/ui-workorders.jpg',
    label: 'CHEMISTRY',
  },
  {
    id: 'inspection',
    icon: ShieldCheck,
    headline: 'Pool Inspections.',
    highlight: 'Reports.',
    subheadline: 'Detailed',
    description: 'Pre-sale, insurance, and compliance inspections with comprehensive documentation.',
    image: '/ui-payments.jpg',
    label: 'INSPECTIONS',
  },
  {
    id: 'resurfacing',
    icon: Sparkles,
    headline: 'Resurfacing.',
    highlight: 'New.',
    subheadline: 'Like Brand',
    description: 'Plaster, pebble, and quartz finishes. Transform your pool in days.',
    image: '/ui-overdue.jpg',
    label: 'RESURFACING',
  },
  {
    id: 'heating',
    icon: ThermometerSun,
    headline: 'Heating Systems.',
    highlight: 'Round.',
    subheadline: 'Swim Year',
    description: 'Gas, electric, and solar heater installation, repair, and optimization.',
    image: '/ui-backups.jpg',
    label: 'HEATING',
  },
  {
    id: 'scheduling',
    icon: Calendar,
    headline: 'Flexible Plans.',
    highlight: 'Schedule.',
    subheadline: 'Your',
    description: 'Weekly, bi-weekly, or custom service plans. We work around your schedule.',
    image: '/ui-reminders.jpg',
    label: 'PLANS',
  },
  {
    id: 'emergency',
    icon: Clock,
    headline: 'Emergency Service.',
    highlight: 'Response.',
    subheadline: 'Same-Day',
    description: 'Green pool rescue, leak detection, and after-storm cleanups. Call anytime.',
    image: '/ui-payments.jpg',
    label: 'EMERGENCY',
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        headlineRef.current,
        { x: '-55vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        cardRef.current,
        { x: '55vw', opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0.06
      );

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-40vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        cardRef.current,
        { x: 0, opacity: 1 },
        { x: '40vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.06, opacity: 0.7 },
        { scale: 1.1 + index * 0.04, opacity: 0.55 - index * 0.05, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [index]);

  const Icon = service.icon;

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ zIndex: 20 + index }}
      id={index === 0 ? 'services' : undefined}
    >
      {/* Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.7 }}
      >
        <img
          src="/hero-pool.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/60 to-[#0A0A0A]/90" />
        <div className="absolute inset-0 vignette" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex items-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Headline */}
            <div
              ref={headlineRef}
              className="w-full lg:w-[45%] text-center lg:text-left"
            >
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center">
                  <Icon size={20} className="text-[#22D3EE]" />
                </div>
                <span className="text-xs font-mono tracking-[0.12em] text-[#22D3EE] uppercase">
                  {service.label}
                </span>
              </div>
              <h2 className="text-[#F5F5F5] font-extrabold tracking-tight leading-[1.05] uppercase text-[clamp(28px,4vw,48px)]">
                <span className="block">{service.headline}</span>
                <span className="block">
                  {service.subheadline}{' '}
                  <span className="text-[#22D3EE]">{service.highlight}</span>
                </span>
              </h2>
              <p className="mt-4 text-[#A1A1AA] text-base max-w-md mx-auto lg:mx-0">
                {service.description}
              </p>
            </div>

            {/* UI Card */}
            <div
              ref={cardRef}
              className="w-full lg:w-[50%] flex justify-center lg:justify-end"
            >
              <div className="glass-card overflow-hidden w-full max-w-[420px] lg:max-w-[480px]">
                <img
                  src={service.image}
                  alt={`${service.label} service`}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeatureSection() {
  return (
    <div className="relative">
      {services.map((service, index) => (
        <ServiceCard key={service.id} service={service} index={index} />
      ))}
    </div>
  );
}
