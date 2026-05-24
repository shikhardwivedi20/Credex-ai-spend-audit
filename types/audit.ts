export type PrimaryUseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolKey =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type ToolPlanId =
  | "hobby"
  | "pro"
  | "business"
  | "enterprise"
  | "individual"
  | "free"
  | "max"
  | "team"
  | "plus"
  | "api";

export type AuditTool = {
  id: string;
  toolKey: ToolKey;
  planId: ToolPlanId;
  monthlySpend: number;
  seats: number;
};

export type AuditInput = {
  companyName: string;
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
  tools: AuditTool[];
};

export type PublicAuditInput = Omit<AuditInput, "companyName">;

export type Recommendation = {
  id: string;
  toolId: string;
  toolKey: ToolKey;
  toolName: string;
  category: "downgrade" | "alternative" | "credits" | "right-size" | "healthy";
  title: string;
  reason: string;
  action: string;
  currentPlanLabel: string;
  currentSpend: number;
  recommendedPlanLabel?: string;
  recommendedSpend?: number;
  alternativeToolName?: string;
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
  confidence: "high" | "medium";
};

export type AuditResult = {
  input: AuditInput;
  publicInput: PublicAuditInput;
  monthlySpend: number;
  annualSpend: number;
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
  savingsRate: number;
  recommendations: Recommendation[];
  summary: string;
  posture: "optimize" | "healthy";
};

export type PublicAuditRecord = {
  id: string;
  createdAt: string;
  input: PublicAuditInput;
  result: AuditResult;
};

export type LeadCapturePayload = {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
  intent: "email-report" | "consultation" | "notify-me";
  honeypot?: string;
};
