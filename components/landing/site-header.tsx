import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { navItems } from "./content";
import { CredexLogo } from "./credex-logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/75 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <CredexLogo className="h-9" />
        <div className="hidden items-center gap-1 rounded-md border bg-white/80 p-1 text-sm font-medium text-slate-600 shadow-sm md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className="rounded-md px-3 py-1.5 transition hover:bg-slate-100 hover:text-slate-950"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/audit"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Start audit
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}
