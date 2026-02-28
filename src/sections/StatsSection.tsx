import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Calendar, Star, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
    {
        icon: Users,
        value: 2500,
        suffix: '+',
        label: 'Active Clients Managed',
        description: 'Pool service accounts tracked',
    },
    {
        icon: Calendar,
        value: 15000,
        suffix: '+',
        label: 'Jobs Scheduled Monthly',
        description: 'Appointments booked per month',
    },
    {
        icon: Star,
        value: 4.9,
        suffix: '/5',
        label: 'Customer Rating',
        description: 'Based on owner reviews',
        decimals: 1,
    },
    {
        icon: TrendingUp,
        value: 98,
        suffix: '%',
        label: 'Payment Recovery Rate',
        description: 'Overdue invoices collected',
    },
];

function AnimatedCounter({
    target,
    suffix,
    decimals = 0,
    isVisible,
}: {
    target: number;
    suffix: string;
    decimals?: number;
    isVisible: boolean;
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000;
        const steps = 60;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            // Ease-out curve
            const progress = 1 - Math.pow(1 - step / steps, 3);
            current = target * progress;

            if (step >= steps) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(current);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isVisible, target]);

    const displayValue = decimals > 0
        ? count.toFixed(decimals)
        : Math.floor(count).toLocaleString();

    return (
        <span className="tabular-nums">
            {displayValue}
            {suffix}
        </span>
    );
}

export default function StatsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top 75%',
                onEnter: () => setIsVisible(true),
            });

            const cards = cardsRef.current?.querySelectorAll('.stat-card');
            if (cards) {
                gsap.fromTo(
                    cards,
                    { y: 30, opacity: 0, scale: 0.95 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.1,
                        scrollTrigger: {
                            trigger: cardsRef.current,
                            start: 'top 80%',
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
            className="relative py-20 lg:py-24 bg-[#0A0A0A] overflow-hidden"
        >
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#22D3EE]/[0.03] rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
                <div
                    ref={cardsRef}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto"
                >
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="stat-card glass-card-light p-6 lg:p-8 text-center group hover:bg-white/[0.05] transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#22D3EE]/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-[#22D3EE]/15 transition-all duration-300">
                                    <Icon size={24} className="text-[#22D3EE]" />
                                </div>
                                <div className="text-[#F5F5F5] font-extrabold text-2xl lg:text-3xl mb-1">
                                    <AnimatedCounter
                                        target={stat.value}
                                        suffix={stat.suffix}
                                        decimals={stat.decimals}
                                        isVisible={isVisible}
                                    />
                                </div>
                                <p className="text-[#F5F5F5] font-semibold text-sm mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-[#A1A1AA] text-xs">
                                    {stat.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
