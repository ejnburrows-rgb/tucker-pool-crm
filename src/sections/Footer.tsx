import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin } from 'lucide-react';
import LegalModal from '../components/LegalModal';
import { privacyPolicy, termsOfService, cookiePolicy, aboutContent } from '../data/legal';

gsap.registerPlugin(ScrollTrigger);

type ModalType = 'privacy' | 'terms' | 'cookies' | 'about' | null;

const footerLinks = {
  services: [
    { label: 'Pool Cleaning', href: '#services' },
    { label: 'Equipment Repair', href: '#services' },
    { label: 'Water Chemistry', href: '#services' },
    { label: 'Emergency Service', href: '#services' },
  ],
  company: [
    { label: 'About Us', href: '#', modal: 'about' as ModalType },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Get a Quote', href: '#cta' },
  ],
  support: [
    { label: 'Email Us', href: 'mailto:hello@rndpoolservices.com' },
    { label: 'Call Us', href: 'tel:+13055550142' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#', modal: 'privacy' as ModalType },
    { label: 'Terms of Service', href: '#', modal: 'terms' as ModalType },
    { label: 'Cookie Policy', href: '#', modal: 'cookies' as ModalType },
  ],
};

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(footerRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, scrollTrigger: { trigger: footerRef.current, start: 'top 90%', toggleActions: 'play none none reverse' } });
    }, footerRef);
    return () => ctx.revert();
  }, []);
  const handleLinkClick = (href: string, modal?: ModalType) => {
    if (modal) { setActiveModal(modal); return; }
    if (href.startsWith('mailto:') || href.startsWith('tel:')) { window.location.href = href; return; }
    if (href === '#') return;
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };
  const getModalContent = () => {
    switch (activeModal) {
      case 'privacy': return privacyPolicy;
      case 'terms': return termsOfService;
      case 'cookies': return cookiePolicy;
      case 'about': return aboutContent;
      default: return null;
    }
  };
  const modalContent = getModalContent();
  return (
    <>
      <footer ref={footerRef} className="relative bg-[#0A0A0A] border-t border-white/[0.06]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12 mb-12">
              {/* Brand */}
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#0891B2] flex items-center justify-center"><span className="text-white font-bold text-sm">R</span></div>
                  <span className="text-[#F5F5F5] font-semibold">R&D Pool Services</span>
                </div>
                <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6 max-w-xs">Miami's premier pool cleaning, maintenance, and repair service. Crystal clear water, every visit. English y Español.</p>
                <div className="space-y-3 mb-6">
                  <a href="mailto:hello@rndpoolservices.com" className="flex items-center gap-2 text-[#A1A1AA] text-sm hover:text-[#22D3EE] transition-colors"><Mail size={14} />hello@rndpoolservices.com</a>
                  <a href="tel:+13055550142" className="flex items-center gap-2 text-[#A1A1AA] text-sm hover:text-[#22D3EE] transition-colors"><Phone size={14} />(305) 555-0142</a>
                  <div className="flex items-center gap-2 text-[#A1A1AA] text-sm"><MapPin size={14} />Miami-Dade County, FL</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#52525B] text-xs">Powered by</span>
                  <img src="/nbo-logo.png" alt="NBO" className="h-5 opacity-40" style={{ filter: 'grayscale(100%) brightness(0.8)' }} />
                </div>
              </div>
              {/* Services */}
              <div>
                <h4 className="text-[#F5F5F5] font-semibold text-sm mb-4">Services</h4>
                <ul className="space-y-3">{footerLinks.services.map((l) => (<li key={l.label}><button onClick={() => handleLinkClick(l.href)} className="text-[#A1A1AA] text-sm hover:text-[#F5F5F5] transition-colors">{l.label}</button></li>))}</ul>
              </div>
              {/* Company */}
              <div>
                <h4 className="text-[#F5F5F5] font-semibold text-sm mb-4">Company</h4>
                <ul className="space-y-3">{footerLinks.company.map((l) => (<li key={l.label}><button onClick={() => handleLinkClick(l.href, l.modal)} className="text-[#A1A1AA] text-sm hover:text-[#F5F5F5] transition-colors">{l.label}</button></li>))}</ul>
              </div>
              {/* Support */}
              <div>
                <h4 className="text-[#F5F5F5] font-semibold text-sm mb-4">Contact</h4>
                <ul className="space-y-3">{footerLinks.support.map((l) => (<li key={l.label}><button onClick={() => handleLinkClick(l.href)} className="text-[#A1A1AA] text-sm hover:text-[#F5F5F5] transition-colors">{l.label}</button></li>))}</ul>
              </div>
              {/* Legal */}
              <div>
                <h4 className="text-[#F5F5F5] font-semibold text-sm mb-4">Legal</h4>
                <ul className="space-y-3">{footerLinks.legal.map((l) => (<li key={l.label}><button onClick={() => handleLinkClick(l.href, l.modal)} className="text-[#A1A1AA] text-sm hover:text-[#F5F5F5] transition-colors">{l.label}</button></li>))}</ul>
              </div>
            </div>
            {/* Bottom bar */}
            <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[#52525B] text-sm">© 2026 R&D Pool Services. All rights reserved.</p>
              <p className="text-[#52525B] text-sm">Licensed & Insured · Miami-Dade County, FL</p>
            </div>
          </div>
        </div>
      </footer>
      {modalContent && (
        <LegalModal open={activeModal !== null} onOpenChange={(open) => { if (!open) setActiveModal(null); }} title={modalContent.title} lastUpdated={'lastUpdated' in modalContent ? (modalContent as { lastUpdated: string }).lastUpdated : undefined} sections={modalContent.sections} />
      )}
    </>
  );
}
