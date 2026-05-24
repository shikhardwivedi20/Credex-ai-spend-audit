import type { AuditInput, Recommendation } from "@/types/audit";

export type AuditRuleContext = {
  input: AuditInput;
};

export type AuditRule = {
  id: string;
  evaluate: (context: AuditRuleContext) => Recommendation[];
};

export function runAuditRules(input: AuditInput, rules: AuditRule[]) {
  return rules.flatMap((rule) => rule.evaluate({ input }));
}

export function withSavings(recommendation: Omit<Recommendation, "estimatedAnnualSavings">): Recommendation {
  return {
    ...recommendation,
    estimatedAnnualSavings: recommendation.estimatedMonthlySavings * 12,
  };
}
