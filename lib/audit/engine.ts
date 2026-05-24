import { auditRules } from "./rules";
import { runAuditRules } from "./rule-engine";
import type { AuditInput, AuditResult, PublicAuditInput } from "@/types/audit";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function analyzeAudit(input: AuditInput): AuditResult {
  const monthlySpend = input.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0);
  const publicInput: PublicAuditInput = {
    teamSize: input.teamSize,
    primaryUseCase: input.primaryUseCase,
    tools: input.tools,
  };

  const recommendations = dedupeRecommendations(runAuditRules(input, auditRules))
    .sort((left, right) => right.estimatedMonthlySavings - left.estimatedMonthlySavings)
    .slice(0, 8);

  const estimatedMonthlySavings = recommendations.reduce((sum, item) => sum + item.estimatedMonthlySavings, 0);
  const savingsRate = monthlySpend === 0 ? 0 : Math.round((estimatedMonthlySavings / monthlySpend) * 100);
  const posture = estimatedMonthlySavings < 100 ? "healthy" : "optimize";

  return {
    input,
    publicInput,
    monthlySpend,
    annualSpend: monthlySpend * 12,
    estimatedMonthlySavings,
    estimatedAnnualSavings: estimatedMonthlySavings * 12,
    savingsRate,
    recommendations,
    posture,
    summary: buildDeterministicSummary(
      input.companyName,
      monthlySpend,
      estimatedMonthlySavings,
      savingsRate,
      posture,
    ),
  };
}

function dedupeRecommendations<T extends { toolId: string; category: string; recommendedPlanLabel?: string; alternativeToolName?: string }>(
  recommendations: T[],
) {
  const seen = new Set<string>();

  return recommendations.filter((item) => {
    const key = [item.toolId, item.category, item.recommendedPlanLabel, item.alternativeToolName].join(":");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function buildDeterministicSummary(
  companyName: string,
  monthlySpend: number,
  estimatedMonthlySavings: number,
  savingsRate: number,
  posture: "optimize" | "healthy" = estimatedMonthlySavings < 100 ? "healthy" : "optimize",
) {
  const label = companyName.trim() || "Your team";

  if (posture === "healthy") {
    return `${label} looks reasonably well-priced right now. Current savings opportunities are limited, so the honest recommendation is to keep renewal dates visible and re-check the stack when plan pricing or team usage changes.`;
  }

  return `${label} is spending ${currency.format(monthlySpend)} per month on AI tools. A defensible first pass can likely recover ${currency.format(
    estimatedMonthlySavings,
  )} per month, or about ${savingsRate}% of current spend, by removing plan mismatch, retail overpayment, or unnecessary overlap before renewal.`;
}
