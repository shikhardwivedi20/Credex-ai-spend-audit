import { benefits } from "@/components/landing/content";
import { PageHero } from "@/components/landing/page-hero";

export default function BenefitsPage() {
  return (
    <main className="min-h-screen">
      <PageHero
        eyebrow="Benefits"
        title="A sharper way to control AI spend without slowing the team down."
        body="Credex is built for founders who need fast, clear, financially defensible recommendations before AI subscriptions become invisible burn."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-audit"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${benefit.color}`}
                aria-hidden="true"
              />
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${benefit.color} text-white shadow-sm transition group-hover:scale-105`}>
                <benefit.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-xl font-semibold tracking-tight text-slate-950">{benefit.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{benefit.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
