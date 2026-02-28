import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const navItems = [
  { label: 'Services', href: '#services' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 text-[#F5F5F5] font-semibold text-lg tracking-tight" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#0891B2] flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="hidden sm:inline">R&D Pool Services</span>
              <span className="sm:hidden">R&D</span>
            </a>
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button key={item.label} onClick={() => scrollToSection(item.href)} className="text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors text-sm font-medium relative group">
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#22D3EE] transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>
            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              <a href="tel:+13055550142" className="text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors text-sm font-medium flex items-center gap-1.5">
                <Phone size={15} className="text-[#22D3EE]" />(305) 555-0142
              </a>
              <button onClick={() => scrollToSection('#cta')} className="px-4 py-2 bg-[#F5F5F5] text-[#0A0A0A] rounded-xl text-sm font-semibold hover:bg-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10">Free Quote</button>
            </div>
            {/* Mobile Menu */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-[#F5F5F5]" aria-label="Toggle menu">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu Panel */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-16 left-0 right-0 bg-[#111111] border-b border-white/[0.06] p-4 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (<button key={item.label} onClick={() => scrollToSection(item.href)} className="text-left px-4 py-3 text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-white/[0.03] rounded-xl transition-colors">{item.label}</button>))}
            <hr className="border-white/[0.06] my-2" />
            <a href="tel:+13055550142" className="px-4 py-3 text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-white/[0.03] rounded-xl transition-colors flex items-center gap-2"><Phone size={16} className="text-[#22D3EE]" />(305) 555-0142</a>
            <button onClick={() => scrollToSection('#cta')} className="mx-4 mt-2 px-4 py-3 bg-[#F5F5F5] text-[#0A0A0A] rounded-xl text-sm font-semibold">Free Quote</button>
          </div>
        </div>
      </div>
    </>
  );
}
