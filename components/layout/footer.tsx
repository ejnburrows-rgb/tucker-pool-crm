import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-gradient-to-b from-slate-800 to-slate-900 px-6 py-5">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-xs text-slate-400">
          &copy; {currentYear} R&D Pool Services. All rights reserved.
        </p>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-500">Powered by</span>
          <Image
            src="/nbo-logo.png"
            alt="NBO - Novo Business Order"
            width={140}
            height={60}
            className="object-contain"
          />
        </div>
      </div>
    </footer>
  );
}
