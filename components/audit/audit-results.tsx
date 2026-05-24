"use client";

import { ArrowRight, CalendarDays, CheckCircle2, Copy, DollarSign, Mail, ShieldCheck, TrendingDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AuditResult, LeadCapturePayload } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { money } from "./money";

type AuditResultsProps = {
  result: AuditResult;
};

export function AuditResults({ result }: AuditResultsProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState(result.input.companyName);
  const [teamSize, setTeamSize] = useState(result.input.teamSize);
  const [honeypot, setHoneypot] = useState("");
  const [auditId, setAuditId] = useState("");
  const [captured, setCaptured] = useState(false);
  const [captureError, setCaptureError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreparingShare, setIsPreparingShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [summary, setSummary] = useState(result.summary);
  const highSavings = result.estimatedMonthlySavings > 500;
  const lowSavings = result.estimatedMonthlySavings < 100;

  const publicUrl = useMemo(() => {
    if (typeof window === "undefined" || !auditId) return "";
    return `${window.location.origin}/audit/${auditId}`;
  }, [auditId]);

  useEffect(() => {
    const controller = new AbortController();
    setSummary(result.summary);
    setCaptured(false);
    setCaptureError("");
    setAuditId("");

    fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: result.input.companyName,
        monthlySpend: result.monthlySpend,
        estimatedMonthlySavings: result.estimatedMonthlySavings,
        savingsRate: result.savingsRate,
        posture: result.posture,
        recommendations: result.recommendations.map((item) => ({
          title: item.title,
          estimatedMonthlySavings: item.estimatedMonthlySavings,
          reason: item.reason,
        })),
      }),
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { summary?: string } | null) => {
        if (data?.summary) setSummary(data.summary);
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [result]);

  async function ensurePublicAudit() {
    if (auditId) return auditId;

    setIsPreparingShare(true);

    try {
      const response = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: result.input,
          result,
        }),
      });

      if (!response.ok) throw new Error("Could not create public audit");

      const data = (await response.json()) as { auditId: string };
      setAuditId(data.auditId);
      return data.auditId;
    } finally {
      setIsPreparingShare(false);
    }
  }

  async function captureLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.includes("@")) return;

    setIsSubmitting(true);
    setCaptureError("");

    try {
      const publicAuditId = await ensurePublicAudit();
      const intent: LeadCapturePayload["intent"] = highSavings ? "consultation" : lowSavings ? "notify-me" : "email-report";

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName,
          role,
          teamSize,
          auditId: publicAuditId,
          intent,
          honeypot,
        }),
      });

      if (!response.ok) throw new Error("Lead capture failed");

      const data = (await response.json()) as { emailSent?: boolean; emailError?: string | null };

      setCaptured(true);
      if (data.emailSent === false) {
        setCaptureError(data.emailError || "Lead captured, but the confirmation email was not delivered.");
      }
    } catch {
      setCaptureError("Could not capture this lead yet. Check your backend env vars and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyShareUrl() {
    try {
      const publicAuditId = await ensurePublicAudit();
      const shareUrl = `${window.location.origin}/audit/${publicAuditId}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCaptureError("Could not create a public result URL yet.");
    }
  }

  return (
    <section className="space-y-5" aria-live="polite">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={DollarSign} label="Current monthly spend" value={money.format(result.monthlySpend)} />
        <Metric icon={TrendingDown} label="Monthly savings" value={money.format(result.estimatedMonthlySavings)} />
        <Metric icon={CalendarDays} label="Annual savings" value={money.format(result.estimatedAnnualSavings)} />
        <Metric icon={ShieldCheck} label="Savings rate" value={`${result.savingsRate}%`} />
      </div>

      <Card className="p-5 shadow-audit">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Audit summary</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {lowSavings ? "You’re spending well." : "Your defensible savings range"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{summary}</p>
          </div>
          <div className="rounded-md bg-slate-950 px-4 py-3 text-white">
            <p className="text-xs text-slate-300">{lowSavings ? "Current posture" : "Annualized impact"}</p>
            <p className="text-2xl font-semibold">{lowSavings ? "Healthy" : money.format(result.estimatedAnnualSavings)}</p>
          </div>
        </div>

        {highSavings && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
            Credex should be surfaced here: this audit shows more than {money.format(500)}/mo in likely savings, so a vendor negotiation or stack redesign could capture materially more than a simple self-serve downgrade.
          </div>
        )}
      </Card>

      <div className="grid gap-3">
        {result.recommendations.length > 0 ? (
          result.recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-teal-600" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-medium">{recommendation.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {money.format(recommendation.currentSpend)} now
                        {recommendation.recommendedSpend !== undefined ? ` -> ${money.format(recommendation.recommendedSpend)} recommended` : ""}
                      </p>
                    </div>
                    <span className="w-fit rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-800">
                      {money.format(recommendation.estimatedMonthlySavings)}/mo
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{recommendation.reason}</p>
                  <p className="mt-2 text-sm font-medium text-slate-800">{recommendation.action}</p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-5">
            <h3 className="text-lg font-semibold tracking-tight">No forced savings story</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This stack does not show enough defensible waste to justify a downgrade recommendation today. The honest move is to keep the lead warm and re-run the audit when pricing, credits, or team structure changes.
            </p>
          </Card>
        )}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b bg-[linear-gradient(120deg,rgba(20,184,166,.12),rgba(59,130,246,.10),rgba(244,114,182,.10))] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Next step</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">
            {lowSavings ? "Notify me when new optimizations apply" : "Send the full audit to your inbox"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            No login required. The public report URL strips identifying details. Email is captured only after the audit value is already visible.
          </p>
        </div>
        <div className="grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <form onSubmit={captureLead} className="space-y-3">
            <input
              type="text"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
              name="website"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={lowSavings ? "Email for future optimization alerts" : "Work email"}>
                <Input
                  type="email"
                  placeholder="founder@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Field>
              <Field label="Role (optional)">
                <Input placeholder="Founder" value={role} onChange={(event) => setRole(event.target.value)} />
              </Field>
              <Field label="Company name (optional)">
                <Input value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
              </Field>
              <Field label="Team size (optional)">
                <Input
                  type="number"
                  min={1}
                  value={teamSize}
                  onChange={(event) => setTeamSize(Math.max(1, Number(event.target.value) || 1))}
                />
              </Field>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" disabled={isSubmitting || captured}>
                <Mail className="h-4 w-4" aria-hidden="true" />
                {captured ? "Captured" : isSubmitting ? "Submitting" : lowSavings ? "Notify me" : "Send full audit"}
              </Button>
              {highSavings && (
                <a
                  href="mailto:hello@credex.com?subject=Credex%20consultation%20request"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  Book Credex Consultation
                </a>
              )}
            </div>
            {captured && (
              <p className="text-sm font-medium text-teal-700">
                Lead captured. {publicUrl ? "The public audit URL is ready to share." : "Your audit was stored successfully."}
              </p>
            )}
            {captureError && <p className="text-sm font-medium text-destructive">{captureError}</p>}
          </form>

          <div className="flex flex-col gap-2">
            <Button type="button" variant="secondary" onClick={copyShareUrl} disabled={isPreparingShare}>
              <Copy className="h-4 w-4" aria-hidden="true" />
              {copied ? "Copied" : isPreparingShare ? "Preparing URL" : "Copy public URL"}
            </Button>
            {publicUrl && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
              >
                Open public result
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-4">
      <Icon className="h-4 w-4 text-teal-700" aria-hidden="true" />
      <p className="mt-3 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  );
}
