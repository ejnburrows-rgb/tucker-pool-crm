import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Calendar,
  ClipboardList,
  CreditCard,
  AlertCircle,
  Database,
  Bell,
  BarChart3,
  Globe,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: 'bilingual',
    icon: Globe,
    headline: 'Bilingual.',
    highlight: 'Simple.',
    subheadline: 'Built for your team.',
    description: 'Switch languages instantly. Your crew and office stay aligned.',
    image: '/ui-clients.jpg',
    label: 'CLIENTS',
  },
  {
    id: 'schedule',
    icon: Calendar,
    headline: 'Weekly Schedule.',
    highlight: 'Drop.',
    subheadline: 'Drag. Done.',
    description: 'See the week at a glance. Reassign in seconds.',
    image: '/ui-schedule.jpg',
    label: 'SCHEDULE',
  },
  {
    id: 'workorders',
    icon: ClipboardList,
    headline: 'Work Orders.',
    highlight: 'To Field.',
    subheadline: 'From phone',
    description: 'Create, assign, and track jobs—online or offline.',
    image: '/ui-workorders.jpg',
    label: 'WORK ORDERS',
  },
  {
    id: 'payments',
    icon: CreditCard,
    headline: 'Payments.',
    highlight: "Chase What's Not.",
    subheadline: "See what's paid.",
    description: 'Filter by status. Export in one click.',
    image: '/ui-payments.jpg',
    label: 'PAYMENTS',
  },
  {
    id: 'overdue',
    icon: AlertCircle,
    headline: 'Overdue Dashboard.',
    highlight: 'Lose',
    subheadline: 'Never',
    description: 'Auto-reminders + follow-up history.',
    thirdLine: 'a payment.',
    image: '/ui-overdue.jpg',
    label: 'OVERDUE',
  },
  {
    id: 'backups',
    icon: Database,
    headline: 'Backups.',
    highlight: 'Safe.',
    subheadline: 'Your data,',
    description: 'Daily snapshots. One-click restore.',
    image: '/ui-backups.jpg',
    label: 'BACKUPS',
  },
  {
    id: 'reminders',
    icon: Bell,
    headline: 'Reminders.',
    highlight: "You Don't.",
    subheadline: 'They forget.',
    description: 'SMS + email. Scheduled automatically.',
    image: '/ui-reminders.jpg',
    label: 'REMINDERS',
  },
  {
    id: 'reports',
    icon: BarChart3,
    headline: 'Reports.',
    highlight: 'Insights.',
    subheadline: 'Real-time',
    description: 'Track revenue, performance, and growth metrics.',
    image: '/ui-payments.jpg',
    label: 'REPORTS',
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
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

      // SETTLE (30% - 70%) - hold

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

  const Icon = feature.icon;

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ zIndex: 20 + index }}
      id={index === 0 ? 'features' : undefined}
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
                  {feature.label}
                </span>
              </div>
              <h2 className="text-[#F5F5F5] font-extrabold tracking-tight leading-[1.05] uppercase text-[clamp(28px,4vw,48px)]">
                <span className="block">{feature.headline}</span>
                <span className="block">
                  {feature.subheadline}{' '}
                  <span className="text-[#22D3EE]">{feature.highlight}</span>
                </span>
                {feature.thirdLine && (
                  <span className="block text-[#F5F5F5]">{feature.thirdLine}</span>
                )}
              </h2>
              <p className="mt-4 text-[#A1A1AA] text-base max-w-md mx-auto lg:mx-0">
                {feature.description}
              </p>
            </div>

            {/* UI Card */}
            <div
              ref={cardRef}
              className="w-full lg:w-[50%] flex justify-center lg:justify-end"
            >
              <div className="glass-card overflow-hidden w-full max-w-[420px] lg:max-w-[480px]">
                <img
                  src={feature.image}
                  alt={`${feature.label} interface`}
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
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} feature={feature} index={index} />
      ))}
    </div>
  );
}
