import { useState, useEffect } from 'react';
import { Menu, X, LogIn, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signinData, setSigninData] = useState({ email: '', password: '' });
  const [signinError, setSigninError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, show a message that the CRM app is coming soon
    setSigninError('The Tucker CRM app is launching soon! Book a demo to get early access.');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
            ? 'bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
          }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2 text-[#F5F5F5] font-semibold text-lg tracking-tight"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#0891B2] flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="hidden sm:inline">R&D Pool Services</span>
              <span className="sm:hidden">R&D</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors text-sm font-medium relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#22D3EE] transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setIsSignInOpen(true)}
                className="text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors text-sm font-medium flex items-center gap-1.5"
              >
                <LogIn size={15} />
                Sign In
              </button>
              <button
                onClick={() => scrollToSection('#cta')}
                className="px-4 py-2 bg-[#F5F5F5] text-[#0A0A0A] rounded-xl text-sm font-semibold hover:bg-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10"
              >
                Book a Demo
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#F5F5F5]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-16 left-0 right-0 bg-[#111111] border-b border-white/[0.06] p-4 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="text-left px-4 py-3 text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-white/[0.03] rounded-xl transition-colors"
              >
                {item.label}
              </button>
            ))}
            <hr className="border-white/[0.06] my-2" />
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSignInOpen(true);
              }}
              className="text-left px-4 py-3 text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-white/[0.03] rounded-xl transition-colors flex items-center gap-2"
            >
              <LogIn size={16} />
              Sign In
            </button>
            <button
              onClick={() => scrollToSection('#cta')}
              className="mx-4 mt-2 px-4 py-3 bg-[#F5F5F5] text-[#0A0A0A] rounded-xl text-sm font-semibold"
            >
              Book a Demo
            </button>
          </div>
        </div>
      </div>

      {/* Sign In Dialog */}
      <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogContent className="bg-[#111111] border-white/[0.06] text-[#F5F5F5] max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22D3EE] to-[#0891B2] flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  Welcome Back
                </DialogTitle>
                <DialogDescription className="text-[#A1A1AA] text-sm">
                  Sign in to your Tucker CRM account
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSignIn} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="signin-email" className="text-[#D4D4D8] text-sm">
                Email Address
              </Label>
              <Input
                id="signin-email"
                type="email"
                required
                value={signinData.email}
                onChange={(e) => {
                  setSigninData(prev => ({ ...prev, email: e.target.value }));
                  setSigninError('');
                }}
                placeholder="you@company.com"
                className="bg-white/[0.03] border-white/[0.1] text-[#F5F5F5] placeholder:text-[#52525B] focus:border-[#22D3EE] focus:ring-[#22D3EE]/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="signin-password" className="text-[#D4D4D8] text-sm">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-[#22D3EE] text-xs hover:underline"
                  onClick={() => {
                    setSigninError('Password reset is coming soon. Contact hello@rndpoolservices.com for help.');
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={signinData.password}
                  onChange={(e) => {
                    setSigninData(prev => ({ ...prev, password: e.target.value }));
                    setSigninError('');
                  }}
                  placeholder="••••••••"
                  className="bg-white/[0.03] border-white/[0.1] text-[#F5F5F5] placeholder:text-[#52525B] focus:border-[#22D3EE] focus:ring-[#22D3EE]/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#A1A1AA] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {signinError && (
              <div className="p-3 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/20">
                <p className="text-[#22D3EE] text-sm">{signinError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#F5F5F5] text-[#0A0A0A] rounded-xl font-semibold text-sm hover:bg-white transition-all"
            >
              Sign In
            </button>

            <p className="text-center text-[#52525B] text-xs">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignInOpen(false);
                  document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[#22D3EE] hover:underline"
              >
                Book a Demo
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
