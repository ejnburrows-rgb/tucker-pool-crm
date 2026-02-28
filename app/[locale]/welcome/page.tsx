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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-700/35 via-zinc-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_35%),radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
      <div className="absolute inset-y-0 left-0 w-[22rem] bg-[radial-gradient(circle_at_left,rgba(255,255,255,0.08),transparent_70%)]" />
      <div className="absolute inset-y-0 right-0 w-[22rem] bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.08),transparent_70%)]" />

      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-8">
        <div className="relative h-[40vh] w-full max-w-4xl md:h-[48vh]">
          <Image
            src="/rd-logo.png"
            alt="R&D Pool Services"
            fill
            className="object-contain drop-shadow-[0_18px_38px_rgba(0,0,0,0.7)]"
            priority
            quality={100}
          />
        </div>
      </div>

      <div className="relative z-20 flex w-full flex-col items-center gap-4 bg-gradient-to-t from-black via-black/90 to-transparent px-6 py-8">
        <Link href={`/${locale}`}>
          <Button
            size="lg"
            className="rounded-xl border border-zinc-500 bg-zinc-100 px-12 py-6 text-lg font-semibold text-zinc-900 shadow-[0_12px_24px_rgba(0,0,0,0.45)] transition-all hover:scale-[1.02] hover:bg-white"
          >
            {t('enter')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <p className="text-sm tracking-wide text-zinc-400">&copy; 2026 R&D Pool Services</p>
      </div>

      <div className="absolute bottom-5 right-5 z-20">
        <Image
          src="/nbo-logo.png"
          alt="NBO - Novo Business Order"
          width={136}
          height={56}
          className="object-contain opacity-70 grayscale saturate-0 brightness-110"
        />
      </div>
    </div>
  );
}
