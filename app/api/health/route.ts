import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/app-url";

export async function GET() {
  const checks = {
    appUrl: getAppUrl(),
    supabaseClient: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    supabaseAdmin: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    resend: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL),
    summaryProvider: Boolean(
      process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || process.env.NVIDIA_API_KEY,
    ),
  };

  const ready =
    checks.supabaseClient &&
    checks.supabaseAdmin &&
    checks.summaryProvider;

  return NextResponse.json({
    ok: true,
    ready,
    checks,
  });
}
