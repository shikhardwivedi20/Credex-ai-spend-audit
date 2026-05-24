import { AuditForm } from "@/components/audit/audit-form";
import { PageHero } from "@/components/landing/page-hero";

export default function AuditPage() {
  return (
    <main className="min-h-screen">
      <PageHero
        eyebrow="Live audit"
        title="Enter your AI stack and get a deterministic savings plan."
        body="This is the actual product flow: add tools, plans, spend, seats, and use cases, then review recommendations with monthly and annual savings."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <AuditForm />
      </section>
    </main>
  );
}
