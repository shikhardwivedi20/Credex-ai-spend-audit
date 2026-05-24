import Link from "next/link";
import type { PublicAuditRecord } from "@/types/audit";
import { CredexLogo } from "@/components/landing/credex-logo";
import { AuditResults } from "./audit-results";

export function SharedAudit({ record }: { record: PublicAuditRecord | null }) {
  if (!record) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-5">
        <h1 className="text-3xl font-semibold tracking-tight">This audit link is invalid.</h1>
        <p className="mt-3 text-muted-foreground">Create a fresh audit to generate a new shareable result URL.</p>
        <Link
          href="/audit"
          className="mt-6 inline-flex h-10 w-fit items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Start new audit
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6 sm:px-6 lg:py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <CredexLogo className="h-8" />
        <Link
          href="/audit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-foreground ring-1 ring-border transition-colors hover:bg-slate-50"
        >
          New audit
        </Link>
      </div>
      <AuditResults result={record.result} />
    </main>
  );
}
