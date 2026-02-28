import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin } from 'lucide-react';
import LegalModal from '../components/LegalModal';
import {
  privacyPolicy,
  termsOfService,
  cookiePolicy,
  aboutContent,
} from '../data/legal';

gsap.registerPlugin(ScrollTrigger);

type ModalType = 'privacy' | 'terms' | 'cookies' | 'about' | null;

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
  company: [
    { label: 'About', href: '#', modal: 'about' as ModalType },
    { label: 'Contact', href: '#cta' },
    { label: 'Book a Demo', href: '#cta' },
  ],
  support: [
    { label: 'Help Center', href: 'mailto:hello@rndpoolservices.com?subject=Help%20Request' },
    { label: 'Email Support', href: 'mailto:hello@rndpoolservices.com' },
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
      gsap.fromTo(
        footerRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleLinkClick = (href: string, modal?: ModalType) => {
    if (modal) {
      setActiveModal(modal);
      return;
    }
    if (href.startsWith('mailto:') || href.startsWith('tel:')) {
      window.location.href = href;
      return;
    }
    if (href === '#') return;
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getModalContent = () => {
    switch (activeModal) {
      case 'privacy':
        return privacyPolicy;
      case 'terms':
        return termsOfService;
      case 'cookies':
        return cookiePolicy;
      case 'about':
        return aboutContent;
      default:
        return null;
    }
  };

  const modalContent = getModalContent();

  return (
    <>
      <footer ref={footerRef} className="relative bg-[#0A0A0A] border-t border-white/[0.06]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Main footer content */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12 mb-12">
              {/* Brand column */}
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#0891B2] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">R</span>
                  </div>
                  <span className="text-[#F5F5F5] font-semibold">
                    R&D Pool Services
                  </span>
                </div>
                <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6 max-w-xs">
                  Pool service software that stays out of your way. Built for teams
                  that speak English y Español.
                </p>

                {/* Contact info */}
                <div className="space-y-3 mb-6">
                  <a
                    href="mailto:hello@rndpoolservices.com"
                    className="flex items-center gap-2 text-[#A1A1AA] text-sm hover:text-[#22D3EE] transition-colors"
                  >
                    <Mail size={14} />
                    hello@rndpoolservices.com
                  </a>
                  <a
                    href="tel:+13055550142"
                    className="flex items-center gap-2 text-[#A1A1AA] text-sm hover:text-[#22D3EE] transition-colors"
                  >
                    <Phone size={14} />
                    (305) 555-0142
                  </a>
                  <div className="flex items-center gap-2 text-[#A1A1AA] text-sm">
                    <MapPin size={14} />
                    Miami, FL
                  </div>
                </div>

                {/* Partner badge */}
                <div className="flex items-center gap-2">
                  <span className="text-[#52525B] text-xs">Powered by</span>
                  <span className="text-[#A1A1AA] text-sm font-medium">NBO</span>
                </div>
              </div>

              {/* Product links */}
              <div>
                <h4 className="text-[#F5F5F5] font-semibold text-sm mb-4">
                  Product
                </h4>
                <ul className="space-y-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => handleLinkClick(link.href)}
                        className="text-[#A1A1AA] text-sm hover:text-[#F5F5F5] transition-colors"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company links */}
              <div>
                <h4 className="text-[#F5F5F5] font-semibold text-sm mb-4">
                  Company
                </h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => handleLinkClick(link.href, link.modal)}
                        className="text-[#A1A1AA] text-sm hover:text-[#F5F5F5] transition-colors"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support links */}
              <div>
                <h4 className="text-[#F5F5F5] font-semibold text-sm mb-4">
                  Support
                </h4>
                <ul className="space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => handleLinkClick(link.href)}
                        className="text-[#A1A1AA] text-sm hover:text-[#F5F5F5] transition-colors"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal links */}
              <div>
                <h4 className="text-[#F5F5F5] font-semibold text-sm mb-4">
                  Legal
                </h4>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => handleLinkClick(link.href, link.modal)}
                        className="text-[#A1A1AA] text-sm hover:text-[#F5F5F5] transition-colors"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[#52525B] text-sm">
                © 2026 R&D Pool Services. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="text-[#52525B] text-sm hover:text-[#A1A1AA] transition-colors"
                >
                  Privacy
                </button>
                <button
                  onClick={() => setActiveModal('terms')}
                  className="text-[#52525B] text-sm hover:text-[#A1A1AA] transition-colors"
                >
                  Terms
                </button>
                <button
                  onClick={() => setActiveModal('cookies')}
                  className="text-[#52525B] text-sm hover:text-[#A1A1AA] transition-colors"
                >
                  Cookies
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Modals */}
      {modalContent && (
        <LegalModal
          open={activeModal !== null}
          onOpenChange={(open) => {
            if (!open) setActiveModal(null);
          }}
          title={modalContent.title}
          lastUpdated={'lastUpdated' in modalContent ? (modalContent as { lastUpdated: string }).lastUpdated : undefined}
          sections={modalContent.sections}
        />
      )}
    </>
  );
}
