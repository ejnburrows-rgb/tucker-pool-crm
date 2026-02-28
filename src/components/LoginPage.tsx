import { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
    const [email, setEmail] = useState('rodeanddavid@yahoo.com');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Entrance animation delay
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate brief load then proceed
        await new Promise(resolve => setTimeout(resolve, 1200));
        setIsLoading(false);
        onLogin();
    };

    return (
        <div className="login-page fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#000000]" />

            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Subtle ambient glow - purple/magenta Miami Vice tones */}
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse, rgba(156, 39, 176, 0.06) 0%, rgba(255, 20, 147, 0.03) 40%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
            />

            {/* R&D Pool Services Hero Logo — Full Screen */}
            <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
                    }`}
            >
                <img
                    src="/rnd-hero-dark.png"
                    alt="R&D Pool Services"
                    className="w-full h-full object-contain max-w-[85vw] max-h-[75vh] select-none"
                    draggable={false}
                    style={{
                        filter: 'drop-shadow(0 0 60px rgba(0, 229, 255, 0.08))',
                    }}
                />
            </div>

            {/* Login Form — Center-Lower */}
            <div
                className={`relative z-10 mt-auto mb-[8vh] w-full max-w-[420px] px-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
            >
                <div
                    className="rounded-2xl p-6 sm:p-8"
                    style={{
                        background: 'rgba(10, 10, 10, 0.65)',
                        backdropFilter: 'blur(24px) saturate(120%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(120%)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
                    }}
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="login-email"
                                className="block text-[#b0b0b0] text-xs font-medium tracking-wider uppercase"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    id="login-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-[#555] outline-none transition-all duration-300"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.04)',
                                        border: `1px solid ${focusedField === 'email' ? 'rgba(0, 229, 255, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                                        boxShadow: focusedField === 'email'
                                            ? '0 0 0 3px rgba(0, 229, 255, 0.08), 0 0 20px rgba(0, 229, 255, 0.05)'
                                            : 'none',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="login-password"
                                className="block text-[#b0b0b0] text-xs font-medium tracking-wider uppercase"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-white placeholder:text-[#444] outline-none transition-all duration-300"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.04)',
                                        border: `1px solid ${focusedField === 'password' ? 'rgba(0, 229, 255, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                                        boxShadow: focusedField === 'password'
                                            ? '0 0 0 3px rgba(0, 229, 255, 0.08), 0 0 20px rgba(0, 229, 255, 0.05)'
                                            : 'none',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#999] transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-[#666] text-xs hover:text-[#00e5ff] transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Login Button — Neon Gradient */}
                        <button
                            type="submit"
                            disabled={isLoading || !password}
                            className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-[0.15em] text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
                            style={{
                                background: 'linear-gradient(135deg, #00e5ff 0%, #ff1493 100%)',
                                boxShadow: (!isLoading && password)
                                    ? '0 8px 32px rgba(0, 229, 255, 0.2), 0 4px 16px rgba(255, 20, 147, 0.15)'
                                    : 'none',
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    SIGNING IN...
                                </>
                            ) : (
                                'LOG IN'
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* NBO Logo — Bottom Right */}
            <div
                className={`absolute bottom-5 right-5 sm:bottom-8 sm:right-10 transition-all duration-700 delay-500 ${mounted ? 'opacity-[0.55]' : 'opacity-0'
                    }`}
            >
                <img
                    src="/nbo-logo.png"
                    alt="NBO - Novo Business Order"
                    className="w-[90px] sm:w-[120px] lg:w-[140px] h-auto select-none"
                    draggable={false}
                    style={{
                        filter: 'drop-shadow(0 2px 8px rgba(192, 192, 192, 0.12)) brightness(0.9)',
                    }}
                />
            </div>

            {/* Bottom copyright — subtle */}
            <div
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-700 delay-500 ${mounted ? 'opacity-30' : 'opacity-0'
                    }`}
            >
                <p className="text-[#555] text-[10px] tracking-wider">
                    © 2026 R&D Pool Services
                </p>
            </div>
        </div>
    );
}
