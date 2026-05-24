import type { AuditRule } from "./rule-engine";
import { withSavings } from "./rule-engine";
import { getPlanDefinition, getToolDefinition, isCreditEligible } from "./catalog";
import type { AuditTool, PrimaryUseCase, Recommendation, ToolPlanId } from "@/types/audit";

function recommendationId(tool: AuditTool, category: Recommendation["category"], suffix?: string) {
  return [tool.toolKey, tool.id, category, suffix].filter(Boolean).join("-");
}

function isCompatibleUseCase(current: PrimaryUseCase, allowed: PrimaryUseCase[]) {
  return allowed.includes("mixed") || allowed.includes(current) || current === "mixed";
}

function seatPriceFor(tool: AuditTool) {
  return getPlanDefinition(tool.toolKey, tool.planId)?.monthlySeatPrice;
}

function listSpendFor(tool: AuditTool, planId = tool.planId) {
  const plan = getPlanDefinition(tool.toolKey, planId);
  if (!plan?.monthlySeatPrice) return null;
  return Math.round(plan.monthlySeatPrice * Math.max(tool.seats, 1));
}

function cheaperPlan(tool: AuditTool, targetPlanId: ToolPlanId) {
  const targetPlan = getPlanDefinition(tool.toolKey, targetPlanId);
  const recommendedSpend = listSpendFor(tool, targetPlanId);

  if (!targetPlan || recommendedSpend === null) return null;

  const estimatedMonthlySavings = Math.round(tool.monthlySpend - recommendedSpend);
  if (estimatedMonthlySavings < 10) return null;

  return {
    targetPlan,
    recommendedSpend,
    estimatedMonthlySavings,
  };
}

const downgradeRule: AuditRule = {
  id: "downgrade",
  evaluate: ({ input }) =>
    input.tools.flatMap((tool) => {
      const toolDefinition = getToolDefinition(tool.toolKey);
      const currentPlan = getPlanDefinition(tool.toolKey, tool.planId);

      if (!currentPlan) return [];

      let targetPlanId: ToolPlanId | null = null;
      let reason = "";

      if (tool.toolKey === "chatgpt" && tool.planId === "team" && tool.seats <= 2 && input.primaryUseCase !== "mixed") {
        targetPlanId = "plus";
        reason = `Your ${tool.seats}-seat ChatGPT workspace is on a collaboration tier, but ${input.primaryUseCase} work for a team this small can usually run on Plus without paying for a shared workspace.`;
      }

      if (tool.toolKey === "claude" && tool.planId === "team" && tool.seats < 5) {
        targetPlanId = "pro";
        reason = `Claude Team is designed for 5 to 150 users, so paying for it below five seats is structurally inefficient.`;
      }

      if (tool.toolKey === "claude" && tool.planId === "max" && tool.seats <= 2 && input.primaryUseCase !== "mixed") {
        targetPlanId = "pro";
        reason = `Claude Max is a power-user tier. For ${input.primaryUseCase} usage on ${tool.seats} seat${tool.seats === 1 ? "" : "s"}, Claude Pro is the lower-cost baseline to test first.`;
      }

      if (tool.toolKey === "cursor" && tool.planId === "business" && tool.seats <= 2) {
        targetPlanId = "pro";
        reason = `Cursor Business pricing is easier to justify once you need shared admin and team controls. At ${tool.seats} seats, Pro is the lower-cost default.`;
      }

      if (tool.toolKey === "github-copilot" && tool.planId === "business" && tool.seats === 1) {
        targetPlanId = "individual";
        reason = `A single-seat Copilot deployment rarely needs centralized business controls.`;
      }

      if (tool.toolKey === "gemini" && tool.planId === "max" && tool.seats <= 2 && input.primaryUseCase !== "mixed") {
        targetPlanId = "pro";
        reason = `Google AI Ultra is the highest-access tier. For a small team using Gemini mainly for ${input.primaryUseCase}, Pro is the cheaper first fit.`;
      }

      if (!targetPlanId) return [];

      const cheaper = cheaperPlan(tool, targetPlanId);
      if (!cheaper) return [];

      return [
        withSavings({
          id: recommendationId(tool, "downgrade", targetPlanId),
          toolId: tool.id,
          toolKey: tool.toolKey,
          toolName: toolDefinition.displayName,
          category: "downgrade",
          confidence: "high",
          title: `Move ${toolDefinition.displayName} to ${cheaper.targetPlan.label}`,
          reason,
          action: `Shift the next renewal to ${cheaper.targetPlan.label} and keep the current setup only for users who can name a business-critical reason to stay on ${currentPlan.label}.`,
          currentPlanLabel: currentPlan.label,
          currentSpend: tool.monthlySpend,
          recommendedPlanLabel: cheaper.targetPlan.label,
          recommendedSpend: cheaper.recommendedSpend,
          estimatedMonthlySavings: cheaper.estimatedMonthlySavings,
        }),
      ];
    }),
};

const seatMismatchRule: AuditRule = {
  id: "seat-mismatch",
  evaluate: ({ input }) =>
    input.tools.flatMap((tool) => {
      const seatPrice = seatPriceFor(tool);
      const currentPlan = getPlanDefinition(tool.toolKey, tool.planId);
      const toolDefinition = getToolDefinition(tool.toolKey);
      if (!seatPrice || !currentPlan) return [];

      if (tool.seats <= input.teamSize) return [];

      const removableSeats = tool.seats - input.teamSize;
      const estimatedMonthlySavings = Math.round(removableSeats * seatPrice);
      if (estimatedMonthlySavings < 10) return [];

      return [
        withSavings({
          id: recommendationId(tool, "right-size"),
          toolId: tool.id,
          toolKey: tool.toolKey,
          toolName: toolDefinition.displayName,
          category: "right-size",
          confidence: "high",
          title: `Right-size ${toolDefinition.displayName} seats`,
          reason: `You entered ${tool.seats} paid seat${tool.seats === 1 ? "" : "s"} for a ${input.teamSize}-person team. Paying for more seats than headcount is direct overspend.`,
          action: `Trim ${removableSeats} seat${removableSeats === 1 ? "" : "s"} before the next billing cycle or reassign them to active users.`,
          currentPlanLabel: currentPlan.label,
          currentSpend: tool.monthlySpend,
          recommendedPlanLabel: currentPlan.label,
          recommendedSpend: Math.round(tool.monthlySpend - estimatedMonthlySavings),
          estimatedMonthlySavings,
        }),
      ];
    }),
};

const retailMismatchRule: AuditRule = {
  id: "retail-mismatch",
  evaluate: ({ input }) =>
    input.tools.flatMap((tool) => {
      const currentPlan = getPlanDefinition(tool.toolKey, tool.planId);
      const toolDefinition = getToolDefinition(tool.toolKey);
      const listSpend = listSpendFor(tool);

      if (!currentPlan || listSpend === null) return [];

      const overage = Math.round(tool.monthlySpend - listSpend);
      if (overage < 15) return [];

      return [
        withSavings({
          id: recommendationId(tool, "right-size", "billing"),
          toolId: tool.id,
          toolKey: tool.toolKey,
          toolName: toolDefinition.displayName,
          category: "right-size",
          confidence: "medium",
          title: `Normalize ${toolDefinition.displayName} billing to the public list price`,
          reason: `${toolDefinition.displayName} ${currentPlan.label} lists at about ${listSpend}/mo for ${tool.seats} seat${tool.seats === 1 ? "" : "s"}, but the current spend entered is ${tool.monthlySpend}/mo.`,
          action: "Review whether you are paying monthly instead of annually, carrying add-ons, or keeping inactive seats.",
          currentPlanLabel: currentPlan.label,
          currentSpend: tool.monthlySpend,
          recommendedPlanLabel: currentPlan.label,
          recommendedSpend: listSpend,
          estimatedMonthlySavings: overage,
        }),
      ];
    }),
};

const alternativeRule: AuditRule = {
  id: "alternative",
  evaluate: ({ input }) =>
    input.tools.flatMap((tool) => {
      const toolDefinition = getToolDefinition(tool.toolKey);
      const currentPlan = getPlanDefinition(tool.toolKey, tool.planId);
      if (!currentPlan) return [];

      return (toolDefinition.alternatives ?? []).flatMap((alternative) => {
        if (!isCompatibleUseCase(input.primaryUseCase, alternative.compatibleUseCases)) return [];
        if (!alternative.monthlySeatPrice) return [];

        const alternativeSpend = Math.round(alternative.monthlySeatPrice * Math.max(tool.seats, 1));
        const estimatedMonthlySavings = Math.round(tool.monthlySpend - alternativeSpend);

        if (estimatedMonthlySavings < 20) return [];

        return [
          withSavings({
            id: recommendationId(tool, "alternative", alternative.toolKey),
            toolId: tool.id,
            toolKey: tool.toolKey,
            toolName: toolDefinition.displayName,
            category: "alternative",
            confidence: "medium",
            title: `Compare ${toolDefinition.displayName} with ${alternative.toolName}`,
            reason: alternative.rationale,
            action: `Pilot ${alternative.toolName} ${alternative.planLabel} with one workflow owner before moving the broader team.`,
            currentPlanLabel: currentPlan.label,
            currentSpend: tool.monthlySpend,
            recommendedPlanLabel: alternative.planLabel,
            recommendedSpend: alternativeSpend,
            alternativeToolName: alternative.toolName,
            estimatedMonthlySavings,
          }),
        ];
      });
    }),
};

const creditsRule: AuditRule = {
  id: "credits",
  evaluate: ({ input }) =>
    input.tools.flatMap((tool) => {
      if (!isCreditEligible(tool.toolKey) || tool.monthlySpend < 100) return [];

      const toolDefinition = getToolDefinition(tool.toolKey);
      const currentPlan = getPlanDefinition(tool.toolKey, tool.planId);
      const estimatedMonthlySavings = Math.min(Math.round(tool.monthlySpend * 0.2), 1000);

      return [
        withSavings({
          id: recommendationId(tool, "credits"),
          toolId: tool.id,
          toolKey: tool.toolKey,
          toolName: toolDefinition.displayName,
          category: "credits",
          confidence: "medium",
          title: `Check credits for ${toolDefinition.displayName}`,
          reason: `${toolDefinition.displayName} can sometimes be offset through startup programs, cloud marketplace credits, or committed vendor promos without changing the underlying workflow.`,
          action: "Confirm whether your startup already qualifies for cloud or vendor credits before the next invoice lands.",
          currentPlanLabel: currentPlan?.label ?? "Current plan",
          currentSpend: tool.monthlySpend,
          recommendedPlanLabel: currentPlan?.label,
          recommendedSpend: Math.round(tool.monthlySpend - estimatedMonthlySavings),
          estimatedMonthlySavings,
        }),
      ];
    }),
};

export const auditRules: AuditRule[] = [
  downgradeRule,
  seatMismatchRule,
  retailMismatchRule,
  alternativeRule,
  creditsRule,
];
