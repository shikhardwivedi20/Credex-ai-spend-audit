import { NextResponse } from "next/server";
import { z } from "zod";
import { createPublicAuditRecord } from "@/lib/audit/storage";

const toolSchema = z.object({
  id: z.string(),
  toolKey: z.enum(["cursor", "github-copilot", "claude", "chatgpt", "anthropic-api", "openai-api", "gemini", "windsurf"]),
  planId: z.enum(["hobby", "pro", "business", "enterprise", "individual", "free", "max", "team", "plus", "api"]),
  monthlySpend: z.number().nonnegative(),
  seats: z.number().int().positive(),
});

const inputSchema = z.object({
  companyName: z.string().optional().default(""),
  teamSize: z.number().int().positive(),
  primaryUseCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
  tools: z.array(toolSchema).min(1),
});

const recommendationSchema = z.object({
  id: z.string(),
  toolId: z.string(),
  toolKey: z.enum(["cursor", "github-copilot", "claude", "chatgpt", "anthropic-api", "openai-api", "gemini", "windsurf"]),
  toolName: z.string(),
  category: z.enum(["downgrade", "alternative", "credits", "right-size", "healthy"]),
  title: z.string(),
  reason: z.string(),
  action: z.string(),
  currentPlanLabel: z.string(),
  currentSpend: z.number(),
  recommendedPlanLabel: z.string().optional(),
  recommendedSpend: z.number().optional(),
  alternativeToolName: z.string().optional(),
  estimatedMonthlySavings: z.number(),
  estimatedAnnualSavings: z.number(),
  confidence: z.enum(["high", "medium"]),
});

const resultSchema = z.object({
  input: inputSchema,
  publicInput: z.object({
    teamSize: z.number().int().positive(),
    primaryUseCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
    tools: z.array(toolSchema).min(1),
  }),
  monthlySpend: z.number(),
  annualSpend: z.number(),
  estimatedMonthlySavings: z.number(),
  estimatedAnnualSavings: z.number(),
  savingsRate: z.number(),
  recommendations: z.array(recommendationSchema),
  summary: z.string(),
  posture: z.enum(["optimize", "healthy"]),
});

const requestSchema = z.object({
  input: inputSchema,
  result: resultSchema,
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid audit payload" }, { status: 400 });
  }

  const auditId = await createPublicAuditRecord(parsed.data.input, parsed.data.result);
  if (!auditId) {
    return NextResponse.json({ error: "Supabase is not configured for public audit storage" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, auditId });
}
