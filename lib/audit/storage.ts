import { getSupabaseAdmin } from "@/lib/supabase/server";
import { toPublicAuditInput } from "@/lib/audit/share";
import type { AuditInput, AuditResult, PublicAuditRecord } from "@/types/audit";

type AuditRow = {
  id: string;
  created_at: string;
  public_input: PublicAuditRecord["input"];
  result_snapshot: AuditResult;
};

export async function createPublicAuditRecord(input: AuditInput, result: AuditResult) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const row = {
    public_input: toPublicAuditInput(input),
    result_snapshot: {
      ...result,
      input: {
        ...result.input,
        companyName: "",
      },
      publicInput: toPublicAuditInput(input),
    },
    monthly_spend: result.monthlySpend,
    estimated_monthly_savings: result.estimatedMonthlySavings,
    estimated_annual_savings: result.estimatedAnnualSavings,
    savings_rate: result.savingsRate,
  };

  const { data, error } = await supabase.from("audits").insert(row).select("id").single();
  if (error || !data) return null;

  return data.id as string;
}

export async function getPublicAuditRecord(id: string): Promise<PublicAuditRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("audits")
    .select("id, created_at, public_input, result_snapshot")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const row = data as AuditRow;

  return {
    id: row.id,
    createdAt: row.created_at,
    input: row.public_input,
    result: row.result_snapshot,
  };
}
