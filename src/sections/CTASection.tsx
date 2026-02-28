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
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', message: '' });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: contentRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } });
      gsap.fromTo(formRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, scrollTrigger: { trigger: formRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('https://formsubmit.co/ajax/hello@rndpoolservices.com', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...formData, _subject: `Pool Service Quote: ${formData.name}`, _template: 'table' }),
      });
      if (response.ok) { setIsSubmitted(true); }
      else { window.location.href = `mailto:hello@rndpoolservices.com?subject=${encodeURIComponent(`Quote Request: ${formData.name}`)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nAddress: ${formData.address}\nMessage: ${formData.message}`)}`; setIsSubmitted(true); }
    } catch { window.location.href = `mailto:hello@rndpoolservices.com?subject=${encodeURIComponent(`Quote Request: ${formData.name}`)}`; setIsSubmitted(true); }
    finally { setIsSubmitting(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };

  return (
    <section ref={sectionRef} id="cta" className="relative py-24 lg:py-32 bg-[#111111]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#111111] to-[#0A0A0A]" />
      <div className="absolute inset-0 vignette" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#22D3EE]/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div ref={contentRef}>
              <span className="inline-block px-4 py-1.5 bg-[#22D3EE]/10 text-[#22D3EE] text-xs font-mono tracking-[0.12em] uppercase rounded-full mb-4">Free Quote</span>
              <h2 className="text-[#F5F5F5] font-extrabold text-[clamp(32px,4vw,48px)] tracking-tight mb-4">Ready for a <span className="text-[#22D3EE]">Cleaner Pool?</span></h2>
              <p className="text-[#A1A1AA] text-lg mb-8 leading-relaxed">Get a free, no-obligation quote. We'll visit your property, assess your pool, and recommend the right service plan. Most quotes within 24 hours.</p>
              <div className="space-y-4 mb-8">
                <a href="mailto:hello@rndpoolservices.com" className="flex items-center gap-4 group"><div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center group-hover:bg-[#22D3EE]/15 transition-colors"><Mail size={18} className="text-[#22D3EE]" /></div><div><p className="text-[#A1A1AA] text-xs uppercase tracking-wider">Email</p><p className="text-[#F5F5F5] font-medium group-hover:text-[#22D3EE] transition-colors">hello@rndpoolservices.com</p></div></a>
                <a href="tel:+13055550142" className="flex items-center gap-4 group"><div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center group-hover:bg-[#22D3EE]/15 transition-colors"><Phone size={18} className="text-[#22D3EE]" /></div><div><p className="text-[#A1A1AA] text-xs uppercase tracking-wider">Phone</p><p className="text-[#F5F5F5] font-medium group-hover:text-[#22D3EE] transition-colors">(305) 555-0142</p></div></a>
                <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center"><MapPin size={18} className="text-[#22D3EE]" /></div><div><p className="text-[#A1A1AA] text-xs uppercase tracking-wider">Service Area</p><p className="text-[#F5F5F5] font-medium">Miami-Dade County, FL</p></div></div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 glass-card-light rounded-full"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-[#A1A1AA] text-xs">Free estimates</span></div>
                <div className="flex items-center gap-2 px-3 py-1.5 glass-card-light rounded-full"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-[#A1A1AA] text-xs">No contracts</span></div>
                <div className="flex items-center gap-2 px-3 py-1.5 glass-card-light rounded-full"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-[#A1A1AA] text-xs">Licensed & insured</span></div>
              </div>
              <p className="text-[#A1A1AA] text-sm mt-8">Powered by <span className="text-[#F5F5F5] font-medium">NBO</span></p>
            </div>
            <div ref={formRef}>
              <div className="glass-card p-8">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#22D3EE]/10 flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-[#22D3EE]" /></div>
                    <h3 className="text-[#F5F5F5] font-bold text-xl mb-2">Thank You, {formData.name.split(' ')[0]}!</h3>
                    <p className="text-[#A1A1AA] text-sm mb-6">We've received your quote request. One of our technicians will contact you at <span className="text-[#F5F5F5]">{formData.phone || formData.email}</span> within 24 hours.</p>
                    <button onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', phone: '', address: '', message: '' }); }} className="text-[#22D3EE] text-sm hover:underline">Submit another request</button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-[#F5F5F5] font-bold text-xl mb-2">Get a Free Quote</h3>
                    <p className="text-[#A1A1AA] text-sm mb-6">Tell us about your pool and we'll give you a personalized quote.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="name" className="text-[#D4D4D8] text-sm">Full Name *</Label><Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="John Smith" className="bg-white/[0.03] border-white/[0.1] text-[#F5F5F5] placeholder:text-[#52525B] focus:border-[#22D3EE] focus:ring-[#22D3EE]/20" /></div>
                        <div className="space-y-2"><Label htmlFor="phone" className="text-[#D4D4D8] text-sm">Phone *</Label><Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder="(305) 555-0142" className="bg-white/[0.03] border-white/[0.1] text-[#F5F5F5] placeholder:text-[#52525B] focus:border-[#22D3EE] focus:ring-[#22D3EE]/20" /></div>
                      </div>
                      <div className="space-y-2"><Label htmlFor="email" className="text-[#D4D4D8] text-sm">Email</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="bg-white/[0.03] border-white/[0.1] text-[#F5F5F5] placeholder:text-[#52525B] focus:border-[#22D3EE] focus:ring-[#22D3EE]/20" /></div>
                      <div className="space-y-2"><Label htmlFor="address" className="text-[#D4D4D8] text-sm">Property Address</Label><Input id="address" name="address" type="text" value={formData.address} onChange={handleChange} placeholder="123 Palm Ave, Miami FL" className="bg-white/[0.03] border-white/[0.1] text-[#F5F5F5] placeholder:text-[#52525B] focus:border-[#22D3EE] focus:ring-[#22D3EE]/20" /></div>
                      <div className="space-y-2"><Label htmlFor="message" className="text-[#D4D4D8] text-sm">Tell us about your pool</Label><textarea id="message" name="message" rows={3} value={formData.message} onChange={handleChange} placeholder="Pool size, current issues, frequency needed..." className="flex w-full rounded-md border bg-white/[0.03] border-white/[0.1] text-[#F5F5F5] placeholder:text-[#52525B] focus:border-[#22D3EE] focus:ring-[#22D3EE]/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" /></div>
                      <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 bg-[#F5F5F5] text-[#0A0A0A] rounded-xl font-semibold text-sm hover:bg-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50 hover:scale-[1.01] hover:shadow-lg hover:shadow-white/10">
                        {isSubmitting ? <><Loader2 size={16} className="animate-spin" />Sending...</> : <>Get My Free Quote<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
                      </button>
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
