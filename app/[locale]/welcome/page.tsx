'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  const locale = useLocale();
  const t = useTranslations('welcome');

  return (
    <div className="relative flex min-h-screen flex-col bg-[#1a1a2e]">
      {/* Logo container - takes most of the screen */}
      <div className="relative flex-1 w-full flex items-center justify-center p-4">
        <Image
          src="/rd-logo.png"
          alt="R&D Pool Services"
          fill
          className="object-contain"
          priority
          quality={100}
        />
      </div>
      
      {/* Enter button and copyright - fixed at bottom, below the logo */}
      <div className="w-full flex flex-col items-center gap-3 py-6 bg-gradient-to-t from-black/80 to-transparent">
        <Link href={`/${locale}`}>
          <Button 
            size="lg" 
            className="bg-white/95 text-blue-900 hover:bg-white px-12 py-6 text-xl font-bold shadow-2xl transition-transform hover:scale-105"
          >
            {t('enter')}
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </Link>
        <p className="text-sm text-white/70">&copy; 2026 R&D Pool Services</p>
      </div>

      {/* NBO logo - bottom right corner */}
      <div className="absolute bottom-4 right-4">
        <Image
          src="/nbo-logo.png"
          alt="NBO - Novo Business Order"
          width={120}
          height={50}
          className="object-contain opacity-80"
        />
      </div>
    </div>
  );
}
