import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
  });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        formRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative py-24 lg:py-32 bg-[#111111]"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#111111] to-[#0A0A0A]" />
      <div className="absolute inset-0 vignette" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left content */}
            <div ref={contentRef}>
              <h2 className="text-[#F5F5F5] font-extrabold text-[clamp(32px,4vw,48px)] tracking-tight mb-4">
                Ready to Take{' '}
                <span className="text-[#22D3EE]">Control?</span>
              </h2>
              <p className="text-[#A1A1AA] text-lg mb-8 leading-relaxed">
                A lightweight CRM built for pool service teams. Schedule, bill,
                and remind—without the clutter.
              </p>

              {/* Contact info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center">
                    <Mail size={18} className="text-[#22D3EE]" />
                  </div>
                  <div>
                    <p className="text-[#A1A1AA] text-xs uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-[#F5F5F5] font-medium">
                      hello@rndpoolservices.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center">
                    <Phone size={18} className="text-[#22D3EE]" />
                  </div>
                  <div>
                    <p className="text-[#A1A1AA] text-xs uppercase tracking-wider">
                      Phone
                    </p>
                    <p className="text-[#F5F5F5] font-medium">(305) 555-0142</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center">
                    <MapPin size={18} className="text-[#22D3EE]" />
                  </div>
                  <div>
                    <p className="text-[#A1A1AA] text-xs uppercase tracking-wider">
                      Location
                    </p>
                    <p className="text-[#F5F5F5] font-medium">Miami, FL</p>
                  </div>
                </div>
              </div>

              {/* Partner mention */}
              <p className="text-[#A1A1AA] text-sm">
                Powered by{' '}
                <span className="text-[#F5F5F5] font-medium">NBO</span>
              </p>
            </div>

            {/* Right form */}
            <div ref={formRef}>
              <div className="glass-card p-8">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#22D3EE]/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-[#22D3EE]" />
                    </div>
                    <h3 className="text-[#F5F5F5] font-bold text-xl mb-2">
                      Thank You!
                    </h3>
                    <p className="text-[#A1A1AA] text-sm">
                      We've received your request. Our team will contact you within 24 hours to schedule your demo.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-[#F5F5F5] font-bold text-xl mb-2">
                      Book a Demo
                    </h3>
                    <p className="text-[#A1A1AA] text-sm mb-6">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[#D4D4D8] text-sm">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Smith"
                          className="bg-white/[0.03] border-white/[0.1] text-[#F5F5F5] placeholder:text-[#52525B] focus:border-[#22D3EE] focus:ring-[#22D3EE]/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#D4D4D8] text-sm">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@company.com"
                          className="bg-white/[0.03] border-white/[0.1] text-[#F5F5F5] placeholder:text-[#52525B] focus:border-[#22D3EE] focus:ring-[#22D3EE]/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-[#D4D4D8] text-sm">
                          Company Name
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Pool Pro Services"
                          className="bg-white/[0.03] border-white/[0.1] text-[#F5F5F5] placeholder:text-[#52525B] focus:border-[#22D3EE] focus:ring-[#22D3EE]/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[#D4D4D8] text-sm">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(305) 555-0142"
                          className="bg-white/[0.03] border-white/[0.1] text-[#F5F5F5] placeholder:text-[#52525B] focus:border-[#22D3EE] focus:ring-[#22D3EE]/20"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-[#F5F5F5] text-[#0A0A0A] rounded-xl font-semibold text-sm hover:bg-white transition-all flex items-center justify-center gap-2 group"
                      >
                        Request Demo
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>

                      <p className="text-[#52525B] text-xs text-center">
                        By submitting, you agree to our Privacy Policy and Terms of Service.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
