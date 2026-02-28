import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Mail, Phone, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Submit via FormSubmit.co — sends email to hello@rndpoolservices.com
      const response = await fetch('https://formsubmit.co/ajax/hello@rndpoolservices.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          message: formData.message || 'Demo request from Tucker CRM landing page',
          _subject: `Tucker CRM Demo Request: ${formData.name}`,
          _template: 'table',
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        // Fallback — open mailto
        const mailtoLink = `mailto:hello@rndpoolservices.com?subject=${encodeURIComponent(`Demo Request: ${formData.name}`)}&body=${encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nPhone: ${formData.phone}\nMessage: ${formData.message || 'I would like to schedule a demo.'}`
        )}`;
        window.location.href = mailtoLink;
        setIsSubmitted(true);
      }
    } catch {
      // Network error — fallback to mailto
      const mailtoLink = `mailto:hello@rndpoolservices.com?subject=${encodeURIComponent(`Demo Request: ${formData.name}`)}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nPhone: ${formData.phone}\nMessage: ${formData.message || 'I would like to schedule a demo.'}`
      )}`;
      window.location.href = mailtoLink;
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#22D3EE]/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left content */}
            <div ref={contentRef}>
              <span className="inline-block px-4 py-1.5 bg-[#22D3EE]/10 text-[#22D3EE] text-xs font-mono tracking-[0.12em] uppercase rounded-full mb-4">
                Get Started
              </span>
              <h2 className="text-[#F5F5F5] font-extrabold text-[clamp(32px,4vw,48px)] tracking-tight mb-4">
                Ready to Take{' '}
                <span className="text-[#22D3EE]">Control?</span>
              </h2>
              <p className="text-[#A1A1AA] text-lg mb-8 leading-relaxed">
                A lightweight CRM built for pool service teams. Schedule, bill,
                and remind—without the clutter. Start your 14-day free trial today.
              </p>

              {/* Contact info */}
              <div className="space-y-4 mb-8">
                <a
                  href="mailto:hello@rndpoolservices.com"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center group-hover:bg-[#22D3EE]/15 transition-colors">
                    <Mail size={18} className="text-[#22D3EE]" />
                  </div>
                  <div>
                    <p className="text-[#A1A1AA] text-xs uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-[#F5F5F5] font-medium group-hover:text-[#22D3EE] transition-colors">
                      hello@rndpoolservices.com
                    </p>
                  </div>
                </a>
                <a
                  href="tel:+13055550142"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center group-hover:bg-[#22D3EE]/15 transition-colors">
                    <Phone size={18} className="text-[#22D3EE]" />
                  </div>
                  <div>
                    <p className="text-[#A1A1AA] text-xs uppercase tracking-wider">
                      Phone
                    </p>
                    <p className="text-[#F5F5F5] font-medium group-hover:text-[#22D3EE] transition-colors">
                      (305) 555-0142
                    </p>
                  </div>
                </a>
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

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 glass-card-light rounded-full">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[#A1A1AA] text-xs">14-day free trial</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 glass-card-light rounded-full">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[#A1A1AA] text-xs">No credit card required</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 glass-card-light rounded-full">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[#A1A1AA] text-xs">Cancel anytime</span>
                </div>
              </div>

              {/* Partner mention */}
              <p className="text-[#A1A1AA] text-sm mt-8">
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
                      Thank You, {formData.name.split(' ')[0]}!
                    </h3>
                    <p className="text-[#A1A1AA] text-sm mb-6">
                      We've received your demo request. Our team will contact you at{' '}
                      <span className="text-[#F5F5F5]">{formData.email}</span> within 24 hours to schedule your personalized demo.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', company: '', phone: '', message: '' });
                      }}
                      className="text-[#22D3EE] text-sm hover:underline"
                    >
                      Submit another request
                    </button>
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-[#D4D4D8] text-sm">
                            Full Name *
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
                            Email Address *
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
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-[#D4D4D8] text-sm">
                          Message (optional)
                        </Label>
                        <textarea
                          id="message"
                          name="message"
                          rows={3}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us about your pool service business..."
                          className="flex w-full rounded-md border bg-white/[0.03] border-white/[0.1] text-[#F5F5F5] placeholder:text-[#52525B] focus:border-[#22D3EE] focus:ring-[#22D3EE]/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                        />
                      </div>

                      {submitError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                          <p className="text-red-400 text-sm">{submitError}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-[#F5F5F5] text-[#0A0A0A] rounded-xl font-semibold text-sm hover:bg-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] hover:shadow-lg hover:shadow-white/10"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Request Demo
                            <ArrowRight
                              size={16}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </>
                        )}
                      </button>

                      <p className="text-[#52525B] text-xs text-center">
                        By submitting, you agree to our{' '}
                        <button
                          type="button"
                          className="text-[#A1A1AA] hover:text-[#22D3EE] underline transition-colors"
                          onClick={() => {
                            // The Footer handles the legal modals, so scroll to bottom
                            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                          }}
                        >
                          Privacy Policy
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          className="text-[#A1A1AA] hover:text-[#22D3EE] underline transition-colors"
                          onClick={() => {
                            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                          }}
                        >
                          Terms of Service
                        </button>
                        .
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
