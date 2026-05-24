import { mandatoryToolOrder, pricingCatalog } from "@/config/pricing";
import type { AuditTool, PrimaryUseCase, ToolKey } from "@/types/audit";

export const primaryUseCases: PrimaryUseCase[] = ["coding", "writing", "data", "research", "mixed"];

export type AiToolOption = {
  key: ToolKey;
  name: string;
  category: string;
  description: string;
  accent: string;
  logoBg: string;
  logoSlug?: string;
  supportedPlans: Array<{
    id: AuditTool["planId"];
    label: string;
    monthlySeatPrice?: number;
    pricingModel: "seat" | "usage" | "contact-sales";
    notes?: string;
  }>;
  defaultPlanId: AuditTool["planId"];
  defaultSeats: number;
  defaultMonthlySpend: number;
};

export const aiToolOptions: AiToolOption[] = mandatoryToolOrder.map((toolKey) => {
  const tool = pricingCatalog[toolKey];
  const seatPlans = tool.plans.filter((plan) => plan.pricingModel === "seat");
  const defaultPlan = seatPlans.find((plan) => plan.monthlySeatPrice && plan.monthlySeatPrice > 0) ?? tool.plans[0];
  const defaultSeats = tool.key.includes("api") ? 1 : tool.key === "claude" || tool.key === "chatgpt" ? 2 : 3;
  const defaultMonthlySpend =
    defaultPlan.monthlySeatPrice === undefined ? 150 : Math.round(defaultPlan.monthlySeatPrice * defaultSeats);

  return {
    key: tool.key,
    name: tool.displayName,
    category: tool.category,
    description: tool.description,
    accent: tool.accent,
    logoBg: tool.logoBg,
    logoSlug: tool.logoSlug,
    supportedPlans: tool.plans.map((plan) => ({
      id: plan.id,
      label: plan.label,
      monthlySeatPrice: plan.monthlySeatPrice,
      pricingModel: plan.pricingModel,
      notes: plan.notes,
    })),
    defaultPlanId: defaultPlan.id,
    defaultSeats,
    defaultMonthlySpend,
  };
});

export const defaultAuditTools: AuditTool[] = [
  buildTool("chatgpt", "tool-1"),
  buildTool("cursor", "tool-2"),
];

export function buildTool(toolKey: ToolKey, id = crypto.randomUUID()): AuditTool {
  const option = aiToolOptions.find((item) => item.key === toolKey) ?? aiToolOptions[0];

  return {
    id,
    toolKey: option.key,
    planId: option.defaultPlanId,
    seats: option.defaultSeats,
    monthlySpend: option.defaultMonthlySpend,
  };
}

export const auditStorageKey = "credex-ai-spend-audit-form-v2";
