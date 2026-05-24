import { describe, expect, it } from "vitest";
import { analyzeAudit } from "@/lib/audit/engine";
import type { AuditInput } from "@/types/audit";

describe("analyzeAudit", () => {
  it("calculates deterministic spend and savings", () => {
    const input: AuditInput = {
      companyName: "Credex Demo",
      teamSize: 10,
      primaryUseCase: "coding",
      tools: [
        {
          id: "cursor-team",
          toolKey: "cursor",
          planId: "business",
          seats: 5,
          monthlySpend: 200,
        },
        {
          id: "copilot",
          toolKey: "github-copilot",
          planId: "business",
          seats: 3,
          monthlySpend: 57,
        },
      ],
    };

    const result = analyzeAudit(input);

    expect(result.monthlySpend).toBe(257);
    expect(result.annualSpend).toBe(3084);
    expect(result.estimatedMonthlySavings).toBeGreaterThan(0);
    expect(result.estimatedAnnualSavings).toBe(result.estimatedMonthlySavings * 12);
  });

  it("recommends a cheaper same-vendor plan for small ChatGPT teams", () => {
    const result = analyzeAudit({
      companyName: "Tiny Co",
      teamSize: 2,
      primaryUseCase: "writing",
      tools: [
        {
          id: "chatgpt-team",
          toolKey: "chatgpt",
          planId: "team",
          seats: 2,
          monthlySpend: 50,
        },
      ],
    });

    const downgrade = result.recommendations.find((item) => item.category === "downgrade");

    expect(downgrade?.recommendedPlanLabel).toBe("Plus");
    expect(downgrade?.estimatedMonthlySavings).toBe(10);
  });

  it("flags Claude Team as overkill below the minimum team size", () => {
    const result = analyzeAudit({
      companyName: "Small Research Lab",
      teamSize: 3,
      primaryUseCase: "research",
      tools: [
        {
          id: "claude-team",
          toolKey: "claude",
          planId: "team",
          seats: 3,
          monthlySpend: 75,
        },
      ],
    });

    expect(result.recommendations.some((item) => item.title.includes("Claude"))).toBe(true);
  });

  it("recommends credits for API-direct spend without inventing plan downgrades", () => {
    const result = analyzeAudit({
      companyName: "API Native",
      teamSize: 4,
      primaryUseCase: "mixed",
      tools: [
        {
          id: "openai-api",
          toolKey: "openai-api",
          planId: "api",
          seats: 4,
          monthlySpend: 600,
        },
      ],
    });

    expect(result.recommendations.map((item) => item.category)).toContain("credits");
    expect(result.recommendations.map((item) => item.category)).not.toContain("downgrade");
  });

  it("returns a healthy posture when savings are small", () => {
    const result = analyzeAudit({
      companyName: "Lean Startup",
      teamSize: 2,
      primaryUseCase: "coding",
      tools: [
        {
          id: "copilot-individual",
          toolKey: "github-copilot",
          planId: "individual",
          seats: 2,
          monthlySpend: 20,
        },
      ],
    });

    expect(result.posture).toBe("healthy");
    expect(result.summary).toContain("well-priced");
  });
});
