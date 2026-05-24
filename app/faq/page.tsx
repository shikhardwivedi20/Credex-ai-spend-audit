import { BarChart3 } from "lucide-react";
import { faqs } from "@/components/landing/content";
import { PageHero } from "@/components/landing/page-hero";

export default function FaqPage() {
  return (
    <main className="min-h-screen">
      <PageHero
        eyebrow="FAQ"
        title="Clear assumptions make the audit easier to trust."
        body="Credex is transparent about what is deterministic, what is estimated, and what still needs validation before a renewal decision."
      />
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="divide-y overflow-hidden rounded-xl border bg-white shadow-sm">
          {faqs.map((faq) => (
            <details key={faq.question} className="group p-5 transition open:bg-slate-50 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-slate-950">
                {faq.question}
                <BarChart3 className="h-4 w-4 text-teal-700 transition group-open:rotate-90" aria-hidden="true" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
