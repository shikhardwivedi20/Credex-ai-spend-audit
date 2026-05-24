import Link from "next/link";
import { ArrowRight, BarChart3, Boxes, CheckCircle2, Sparkles, Zap } from "lucide-react";
import { ProductVisual } from "./product-visual";
import { SiteHeader } from "./site-header";

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader />
      <section className="relative bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(20,184,166,.22),transparent_32%),radial-gradient(circle_at_80%_8%,rgba(59,130,246,.20),transparent_30%),radial-gradient(circle_at_60%_95%,rgba(244,114,182,.16),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-50 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-white/70 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-teal-700" aria-hidden="true" />
              Founder-grade AI spend clarity
            </div>
            <h1 className="mt-7 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Stop AI tool sprawl before it reaches finance.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Credex turns subscriptions, seats, utilization, and use cases into a beautiful deterministic audit with
              savings you can actually explain.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/audit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-medium text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Run free audit
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex h-11 items-center justify-center rounded-md bg-white/90 px-5 text-sm font-medium text-slate-950 ring-1 ring-border transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Explore workflow
              </Link>
            </div>
            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              <Proof icon={CheckCircle2} title="Rule-based" body="No AI math" />
              <Proof icon={BarChart3} title="Savings first" body="Monthly + annual" />
              <Proof icon={Boxes} title="Shareable" body="Audit URLs" />
            </div>
          </div>
          <ProductVisual />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Benefits", "See the business value and trust model.", "/benefits"],
            ["How it works", "Understand the audit flow step by step.", "/how-it-works"],
            ["FAQ", "Review assumptions before launch.", "/faq"],
          ].map(([title, body, href]) => (
            <Link
              key={title}
              href={href}
              className="group rounded-xl border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-audit"
            >
              <Zap className="h-5 w-5 text-teal-700 transition group-hover:rotate-12" aria-hidden="true" />
              <h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-950">
                Open page
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Proof({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof CheckCircle2;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur transition hover:-translate-y-1">
      <Icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
      <p className="mt-4 font-semibold text-slate-950">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{body}</p>
    </div>
  );
}
