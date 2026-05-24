import { NextResponse } from "next/server";
import { z } from "zod";
import { getAppUrl } from "@/lib/app-url";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const leadSchema = z.object({
  email: z.string().email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.number().int().positive().optional(),
  auditId: z.string().uuid(),
  intent: z.enum(["email-report", "consultation", "notify-me"]),
  honeypot: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = leadSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lead payload" }, { status: 400 });
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ error: "Spam blocked" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured for lead capture" }, { status: 503 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for") ?? "unknown";
  const ipHash = await sha256(forwardedFor.split(",")[0]?.trim() ?? "unknown");
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", tenMinutesAgo);

  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: "Too many requests. Please wait a few minutes." }, { status: 429 });
  }

  const { data: audit, error: auditError } = await supabase
    .from("audits")
    .select("id, estimated_monthly_savings, estimated_annual_savings")
    .eq("id", parsed.data.auditId)
    .single();

  if (auditError || !audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  const { error: leadError } = await supabase.from("leads").insert({
    email: parsed.data.email,
    company_name: parsed.data.companyName ?? null,
    role: parsed.data.role ?? null,
    team_size: parsed.data.teamSize ?? null,
    audit_id: parsed.data.auditId,
    intent: parsed.data.intent,
    ip_hash: ipHash,
  });

  if (leadError) {
    return NextResponse.json({ error: "Could not store lead" }, { status: 500 });
  }

  const publicUrl = `${getAppUrl()}/audit/${parsed.data.auditId}`;
  const emailDelivery = await sendTransactionalEmail({
    to: parsed.data.email,
    companyName: parsed.data.companyName,
    intent: parsed.data.intent,
    publicUrl,
    estimatedMonthlySavings: Number(audit.estimated_monthly_savings ?? 0),
    estimatedAnnualSavings: Number(audit.estimated_annual_savings ?? 0),
  });

  return NextResponse.json({
    ok: true,
    emailSent: emailDelivery.ok,
    emailError: emailDelivery.error ?? null,
  });
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sendTransactionalEmail({
  to,
  companyName,
  intent,
  publicUrl,
  estimatedMonthlySavings,
  estimatedAnnualSavings,
}: {
  to: string;
  companyName?: string;
  intent: "email-report" | "consultation" | "notify-me";
  publicUrl: string;
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
}): Promise<{ ok: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !fromEmail) {
    return { ok: false, error: "Resend is not configured." };
  }

  const subject =
    intent === "notify-me"
      ? "Credex will notify you when new optimizations apply"
      : "Your Credex AI spend audit is ready";

  const body = [
    `Hi ${companyName || "there"},`,
    "",
    intent === "notify-me"
      ? "Your current stack looks reasonably well-priced today, so we are keeping you on the list for future optimization opportunities."
      : `Your audit is ready. Credex found an estimated ${estimatedMonthlySavings}/mo (${estimatedAnnualSavings}/yr) in defensible AI savings opportunities.`,
    "",
    `Public audit URL: ${publicUrl}`,
    "",
    estimatedMonthlySavings > 500
      ? "This audit crossed the high-savings threshold, so Credex may reach out with a deeper consultation."
      : "If pricing, credits, or plan packaging changes, re-running the audit may uncover new savings.",
    "",
    "Thanks,",
    "Credex",
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject,
        text: body,
      }),
    });

    if (response.ok) {
      return { ok: true };
    }

    const responseText = await response.text();
    return {
      ok: false,
      error: humanizeEmailError(fromEmail, responseText),
    };
  } catch {
    return {
      ok: false,
      error: "Email provider request failed.",
    };
  }
}

function humanizeEmailError(fromEmail: string, responseText: string) {
  if (fromEmail.endsWith("@resend.dev")) {
    return "Resend test sender is active. Verify a domain in Resend before sending to arbitrary inboxes.";
  }

  if (responseText.toLowerCase().includes("verify")) {
    return "Your Resend sender domain or address is not verified yet.";
  }

  if (responseText.toLowerCase().includes("forbidden")) {
    return "Resend rejected the send request. Check the API key and sender permissions.";
  }

  return "Transactional email could not be delivered. Check the Resend sender setup.";
}
