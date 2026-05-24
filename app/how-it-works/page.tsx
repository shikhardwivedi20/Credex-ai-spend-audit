import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { steps } from "@/components/landing/content";
import { PageHero } from "@/components/landing/page-hero";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <PageHero
        eyebrow="How it works"
        title="A guided audit flow that feels fast, not procurement-heavy."
        body="The product collects just enough context to produce useful recommendations, then turns the result into a shareable internal link."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <ol className="grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="group rounded-xl border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-audit"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white transition group-hover:rotate-3">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="text-5xl font-semibold text-slate-100">0{index + 1}</span>
              </div>
              <h2 className="mt-8 text-xl font-semibold tracking-tight text-slate-950">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 rounded-xl bg-slate-950 p-6 text-white shadow-audit sm:p-8">
          <p className="text-sm font-semibold text-teal-200">Ready to try it</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Run the audit flow with live inputs.</h2>
          <Link
            href="/audit"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-medium text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            Start audit
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
