import { pricingCatalog } from "@/config/pricing";
import type { ToolKey, ToolPlanId } from "@/types/audit";

export function getToolDefinition(toolKey: ToolKey) {
  return pricingCatalog[toolKey];
}

export function getPlanDefinition(toolKey: ToolKey, planId: ToolPlanId) {
  return pricingCatalog[toolKey].plans.find((plan) => plan.id === planId) ?? null;
}

export function isCreditEligible(toolKey: ToolKey) {
  return pricingCatalog[toolKey].creditEligible;
}
