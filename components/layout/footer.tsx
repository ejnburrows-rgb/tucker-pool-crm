export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-white/50 px-6 py-4 backdrop-blur dark:bg-background/50">
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
        <p>
          &copy; {currentYear} Tucker Pool Service. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <span className="font-bold tracking-wide text-emerald-600">NBO</span>
          <span className="text-[10px] text-muted-foreground/70">Novo Business Order</span>
        </div>
      </div>
    </footer>
  );
}
