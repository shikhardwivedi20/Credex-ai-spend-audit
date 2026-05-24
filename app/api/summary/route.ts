import { NextResponse } from "next/server";
import { z } from "zod";
import { aiSummarySystemPrompt, anthropicConfig, nvidiaAiConfig, openAiConfig } from "@/config/ai";
import { buildDeterministicSummary } from "@/lib/audit/engine";

const recommendationSchema = z.object({
  title: z.string(),
  estimatedMonthlySavings: z.number(),
  reason: z.string().optional(),
});

const summaryRequestSchema = z.object({
  companyName: z.string(),
  monthlySpend: z.number(),
  estimatedMonthlySavings: z.number(),
  savingsRate: z.number(),
  posture: z.enum(["optimize", "healthy"]).default("optimize"),
  recommendations: z.array(recommendationSchema).max(8),
});

export async function POST(request: Request) {
  const parsed = summaryRequestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid summary payload" }, { status: 400 });
  }

  const payload = parsed.data;
  const fallback = buildDeterministicSummary(
    payload.companyName,
    payload.monthlySpend,
    payload.estimatedMonthlySavings,
    payload.savingsRate,
    payload.posture,
  );

  const prompt = `Company: ${payload.companyName}
Monthly AI spend: ${payload.monthlySpend}
Estimated monthly savings: ${payload.estimatedMonthlySavings}
Savings rate: ${payload.savingsRate}%
Audit posture: ${payload.posture}
Recommendations:
${payload.recommendations.map((item) => `- ${item.title}: ${item.reason ?? "No extra reason provided"} (${item.estimatedMonthlySavings}/mo)`).join("\n")}

Write one paragraph around 100 words.`;

  if (process.env.ANTHROPIC_API_KEY) {
    const anthropicResponse = await summarizeWithAnthropic(prompt);
    if (anthropicResponse) {
      return NextResponse.json({ summary: anthropicResponse, source: "anthropic" });
    }
  }

  if (process.env.OPENAI_API_KEY) {
    const openAiResponse = await summarizeWithOpenAi(prompt);
    if (openAiResponse) {
      return NextResponse.json({ summary: openAiResponse, source: "openai" });
    }
  }

  if (process.env.NVIDIA_API_KEY) {
    const nvidiaResponse = await summarizeWithNvidia(prompt);
    if (nvidiaResponse) {
      return NextResponse.json({ summary: nvidiaResponse, source: "nvidia" });
    }
  }

  return NextResponse.json({ summary: fallback, source: "deterministic" });
}

async function summarizeWithAnthropic(prompt: string) {
  const response = await fetch(`${anthropicConfig.baseUrl}/messages`, {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: anthropicConfig.model,
      max_tokens: 240,
      system: aiSummarySystemPrompt,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    content?: Array<{ type?: string; text?: string }>;
  };

  return data.content?.find((item) => item.type === "text")?.text?.trim() ?? null;
}

async function summarizeWithOpenAi(prompt: string) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: openAiConfig.model,
      instructions: aiSummarySystemPrompt,
      input: prompt,
    }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as { output_text?: string };
  return data.output_text?.trim() ?? null;
}

async function summarizeWithNvidia(prompt: string) {
  const response = await fetch(`${nvidiaAiConfig.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: nvidiaAiConfig.model,
      temperature: 0.4,
      max_tokens: 220,
      messages: [
        { role: "system", content: aiSummarySystemPrompt },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() ?? null;
}
