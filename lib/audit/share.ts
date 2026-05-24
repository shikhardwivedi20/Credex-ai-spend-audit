import type { AuditInput, PublicAuditInput } from "@/types/audit";

export function toPublicAuditInput(input: AuditInput): PublicAuditInput {
  return {
    teamSize: input.teamSize,
    primaryUseCase: input.primaryUseCase,
    tools: input.tools,
  };
}
