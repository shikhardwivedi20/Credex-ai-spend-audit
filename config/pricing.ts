import type { PrimaryUseCase, ToolKey, ToolPlanId } from "@/types/audit";

export type PlanDefinition = {
  id: ToolPlanId;
  label: string;
  monthlySeatPrice?: number;
  monthlyListPrice?: number;
  pricingModel: "seat" | "usage" | "contact-sales";
  collaboration: boolean;
  minimumSeats?: number;
  notes?: string;
};

export type ToolAlternative = {
  toolKey: ToolKey;
  toolName: string;
  planId: ToolPlanId;
  planLabel: string;
  monthlySeatPrice?: number;
  compatibleUseCases: PrimaryUseCase[];
  rationale: string;
};

export type ToolPricing = {
  key: ToolKey;
  displayName: string;
  category: string;
  description: string;
  logoSlug?: string;
  logoBg: string;
  accent: string;
  aliases: string[];
  useCases: PrimaryUseCase[];
  sourceUrl: string;
  verifiedOn: string;
  creditEligible: boolean;
  plans: PlanDefinition[];
  alternatives?: ToolAlternative[];
};

export const pricingCatalog: Record<ToolKey, ToolPricing> = {
  cursor: {
    key: "cursor",
    displayName: "Cursor",
    category: "Developer AI",
    description: "Editor-native AI coding for engineering teams.",
    logoSlug: "cursor",
    logoBg: "linear-gradient(135deg, #0ea5e9, #22d3ee)",
    accent: "from-sky-500 to-cyan-400",
    aliases: ["cursor"],
    useCases: ["coding", "mixed"],
    sourceUrl: "https://cursor.com/pricing",
    verifiedOn: "2026-05-23",
    creditEligible: false,
    plans: [
      { id: "hobby", label: "Hobby", monthlySeatPrice: 0, monthlyListPrice: 0, pricingModel: "seat", collaboration: false },
      { id: "pro", label: "Pro", monthlySeatPrice: 20, monthlyListPrice: 20, pricingModel: "seat", collaboration: false },
      {
        id: "business",
        label: "Business",
        monthlySeatPrice: 40,
        monthlyListPrice: 40,
        pricingModel: "seat",
        collaboration: true,
        notes: "Cursor currently markets this self-serve team tier as Teams.",
      },
      { id: "enterprise", label: "Enterprise", pricingModel: "contact-sales", collaboration: true },
    ],
    alternatives: [
      {
        toolKey: "github-copilot",
        toolName: "GitHub Copilot",
        planId: "business",
        planLabel: "Business",
        monthlySeatPrice: 19,
        compatibleUseCases: ["coding", "mixed"],
        rationale: "Copilot Business is materially cheaper when the team mainly wants inline coding help rather than Cursor-specific editor workflows.",
      },
      {
        toolKey: "windsurf",
        toolName: "Windsurf",
        planId: "pro",
        planLabel: "Pro",
        monthlySeatPrice: 15,
        compatibleUseCases: ["coding"],
        rationale: "Windsurf Pro can cover editor-centric coding workflows at a lower self-serve price point for smaller teams.",
      },
    ],
  },
  "github-copilot": {
    key: "github-copilot",
    displayName: "GitHub Copilot",
    category: "Developer AI",
    description: "Code completion, chat, and agent workflows for developers.",
    logoSlug: "githubcopilot",
    logoBg: "linear-gradient(135deg, #8b5cf6, #c084fc)",
    accent: "from-violet-500 to-purple-400",
    aliases: ["github copilot", "copilot"],
    useCases: ["coding", "mixed"],
    sourceUrl: "https://docs.github.com/en/copilot/get-started/plans",
    verifiedOn: "2026-05-23",
    creditEligible: false,
    plans: [
      { id: "individual", label: "Individual", monthlySeatPrice: 10, monthlyListPrice: 10, pricingModel: "seat", collaboration: false },
      { id: "business", label: "Business", monthlySeatPrice: 19, monthlyListPrice: 19, pricingModel: "seat", collaboration: true },
      { id: "enterprise", label: "Enterprise", monthlySeatPrice: 39, monthlyListPrice: 39, pricingModel: "seat", collaboration: true },
    ],
    alternatives: [
      {
        toolKey: "cursor",
        toolName: "Cursor",
        planId: "pro",
        planLabel: "Pro",
        monthlySeatPrice: 20,
        compatibleUseCases: ["coding"],
        rationale: "Cursor Pro is a close substitute for smaller teams that want editor-native coding help without enterprise policy controls.",
      },
    ],
  },
  claude: {
    key: "claude",
    displayName: "Claude",
    category: "General AI",
    description: "Writing, research, analysis, and AI-assisted planning.",
    logoSlug: "anthropic",
    logoBg: "linear-gradient(135deg, #f97316, #fbbf24)",
    accent: "from-orange-500 to-amber-400",
    aliases: ["claude", "anthropic claude"],
    useCases: ["writing", "research", "data", "mixed"],
    sourceUrl: "https://claude.com/pricing",
    verifiedOn: "2026-05-23",
    creditEligible: true,
    plans: [
      { id: "free", label: "Free", monthlySeatPrice: 0, monthlyListPrice: 0, pricingModel: "seat", collaboration: false },
      { id: "pro", label: "Pro", monthlySeatPrice: 20, monthlyListPrice: 20, pricingModel: "seat", collaboration: false },
      {
        id: "max",
        label: "Max",
        monthlySeatPrice: 100,
        monthlyListPrice: 100,
        pricingModel: "seat",
        collaboration: false,
        notes: "Claude Max currently starts at $100/month for Max 5x, with a $200/month Max 20x tier.",
      },
      {
        id: "team",
        label: "Team",
        monthlySeatPrice: 25,
        monthlyListPrice: 25,
        pricingModel: "seat",
        collaboration: true,
        minimumSeats: 5,
        notes: "Claude Team standard seat is $25/seat/month billed monthly, or $20/seat/month billed annually.",
      },
      { id: "enterprise", label: "Enterprise", pricingModel: "contact-sales", collaboration: true },
      { id: "api", label: "API direct", pricingModel: "usage", collaboration: false, notes: "Usage-based API billing." },
    ],
    alternatives: [
      {
        toolKey: "chatgpt",
        toolName: "ChatGPT",
        planId: "plus",
        planLabel: "Plus",
        monthlySeatPrice: 20,
        compatibleUseCases: ["writing", "research", "mixed"],
        rationale: "ChatGPT Plus is a credible lower-cost alternative for broad writing and research workflows when Claude-specific features are not required.",
      },
      {
        toolKey: "gemini",
        toolName: "Gemini",
        planId: "pro",
        planLabel: "Pro",
        monthlySeatPrice: 19.99,
        compatibleUseCases: ["research", "writing", "mixed"],
        rationale: "Gemini Pro is a viable lower-cost substitute for general knowledge work, especially in Google Workspace-heavy teams.",
      },
    ],
  },
  chatgpt: {
    key: "chatgpt",
    displayName: "ChatGPT",
    category: "General AI",
    description: "General-purpose AI for research, writing, analysis, and teamwork.",
    logoSlug: "openai",
    logoBg: "linear-gradient(135deg, #10b981, #2dd4bf)",
    accent: "from-emerald-500 to-teal-400",
    aliases: ["chatgpt", "openai chatgpt"],
    useCases: ["writing", "research", "data", "mixed"],
    sourceUrl: "https://openai.com/business/chatgpt-pricing/",
    verifiedOn: "2026-05-23",
    creditEligible: true,
    plans: [
      { id: "plus", label: "Plus", monthlySeatPrice: 20, monthlyListPrice: 20, pricingModel: "seat", collaboration: false },
      {
        id: "team",
        label: "Team",
        monthlySeatPrice: 25,
        monthlyListPrice: 25,
        pricingModel: "seat",
        collaboration: true,
        minimumSeats: 2,
        notes: "OpenAI now markets the self-serve team workspace as ChatGPT Business; older references call it Team.",
      },
      { id: "enterprise", label: "Enterprise", pricingModel: "contact-sales", collaboration: true },
      { id: "api", label: "API direct", pricingModel: "usage", collaboration: false, notes: "Usage-based API billing." },
    ],
    alternatives: [
      {
        toolKey: "claude",
        toolName: "Claude",
        planId: "pro",
        planLabel: "Pro",
        monthlySeatPrice: 20,
        compatibleUseCases: ["writing", "research", "mixed"],
        rationale: "Claude Pro offers similar value for writing and research-heavy knowledge work at a lower collaboration overhead for tiny teams.",
      },
      {
        toolKey: "gemini",
        toolName: "Gemini",
        planId: "pro",
        planLabel: "Pro",
        monthlySeatPrice: 19.99,
        compatibleUseCases: ["research", "data", "mixed"],
        rationale: "Gemini Pro is a defensible substitute when the team already lives in Google Workspace and does not need a shared ChatGPT workspace.",
      },
    ],
  },
  "anthropic-api": {
    key: "anthropic-api",
    displayName: "Anthropic API",
    category: "API AI",
    description: "Usage-based Claude API access for custom products and internal tools.",
    logoSlug: "anthropic",
    logoBg: "linear-gradient(135deg, #fdba74, #fb923c)",
    accent: "from-orange-400 to-amber-400",
    aliases: ["anthropic api", "claude api"],
    useCases: ["coding", "writing", "data", "research", "mixed"],
    sourceUrl: "https://platform.claude.com/docs/en/about-claude/pricing",
    verifiedOn: "2026-05-23",
    creditEligible: true,
    plans: [{ id: "api", label: "API direct", pricingModel: "usage", collaboration: false, notes: "Claude Sonnet 4.6 standard pricing is $3/MTok input and $15/MTok output." }],
    alternatives: [
      {
        toolKey: "openai-api",
        toolName: "OpenAI API",
        planId: "api",
        planLabel: "API direct",
        compatibleUseCases: ["coding", "writing", "data", "research", "mixed"],
        rationale: "OpenAI API can be cheaper for some production workloads depending on token mix, latency, and model selection.",
      },
    ],
  },
  "openai-api": {
    key: "openai-api",
    displayName: "OpenAI API",
    category: "API AI",
    description: "Usage-based OpenAI API access for custom products and internal tools.",
    logoSlug: "openai",
    logoBg: "linear-gradient(135deg, #34d399, #22c55e)",
    accent: "from-emerald-400 to-lime-400",
    aliases: ["openai api", "api direct openai"],
    useCases: ["coding", "writing", "data", "research", "mixed"],
    sourceUrl: "https://openai.com/api/pricing/",
    verifiedOn: "2026-05-23",
    creditEligible: true,
    plans: [{ id: "api", label: "API direct", pricingModel: "usage", collaboration: false, notes: "Current flagship pricing starts at $2.50/MTok input and $15/MTok output for GPT-5.4." }],
    alternatives: [
      {
        toolKey: "anthropic-api",
        toolName: "Anthropic API",
        planId: "api",
        planLabel: "API direct",
        compatibleUseCases: ["coding", "writing", "data", "research", "mixed"],
        rationale: "Anthropic API can be a defensible alternative when Claude's pricing/performance mix better matches the workload.",
      },
    ],
  },
  gemini: {
    key: "gemini",
    displayName: "Gemini",
    category: "Google AI",
    description: "Google's AI app and API for research, analysis, and multimodal work.",
    logoSlug: "googlegemini",
    logoBg: "linear-gradient(135deg, #3b82f6, #818cf8)",
    accent: "from-blue-500 to-indigo-400",
    aliases: ["gemini", "google ai"],
    useCases: ["research", "writing", "data", "mixed"],
    sourceUrl: "https://gemini.google/us/subscriptions/?hl=en",
    verifiedOn: "2026-05-23",
    creditEligible: true,
    plans: [
      { id: "pro", label: "Pro", monthlySeatPrice: 19.99, monthlyListPrice: 19.99, pricingModel: "seat", collaboration: false },
      { id: "max", label: "Ultra", monthlySeatPrice: 99.99, monthlyListPrice: 99.99, pricingModel: "seat", collaboration: false, notes: "Google AI Ultra also has a higher $199.99/month tier for expanded limits." },
      { id: "api", label: "API", pricingModel: "usage", collaboration: false, notes: "Gemini 2.5 Pro starts at $1.25/MTok input and $10/MTok output." },
    ],
    alternatives: [
      {
        toolKey: "chatgpt",
        toolName: "ChatGPT",
        planId: "plus",
        planLabel: "Plus",
        monthlySeatPrice: 20,
        compatibleUseCases: ["writing", "research", "mixed"],
        rationale: "ChatGPT Plus is price-parity with Gemini Pro and can be simpler to standardize when Google Workspace tie-ins are not important.",
      },
    ],
  },
  windsurf: {
    key: "windsurf",
    displayName: "Windsurf",
    category: "Developer AI",
    description: "AI coding assistant and editor for engineering workflows.",
    logoSlug: "codeium",
    logoBg: "linear-gradient(135deg, #38bdf8, #8b5cf6)",
    accent: "from-cyan-400 to-violet-500",
    aliases: ["windsurf", "codeium"],
    useCases: ["coding", "mixed"],
    sourceUrl: "https://docs.windsurf.com/windsurf/accounts/usage",
    verifiedOn: "2026-05-23",
    creditEligible: false,
    plans: [
      { id: "free", label: "Free", monthlySeatPrice: 0, monthlyListPrice: 0, pricingModel: "seat", collaboration: false },
      { id: "pro", label: "Pro", monthlySeatPrice: 15, monthlyListPrice: 15, pricingModel: "seat", collaboration: false, notes: "Windsurf introduced new self-serve pricing in March 2026." },
      { id: "business", label: "Business", monthlySeatPrice: 30, monthlyListPrice: 30, pricingModel: "seat", collaboration: true, notes: "Mapped to Windsurf Teams for startup billing comparisons." },
      { id: "enterprise", label: "Enterprise", pricingModel: "contact-sales", collaboration: true },
    ],
    alternatives: [
      {
        toolKey: "github-copilot",
        toolName: "GitHub Copilot",
        planId: "business",
        planLabel: "Business",
        monthlySeatPrice: 19,
        compatibleUseCases: ["coding"],
        rationale: "Copilot Business is the cheaper baseline when the team primarily wants coding assistance inside standard IDE workflows.",
      },
    ],
  },
};

export const mandatoryToolOrder: ToolKey[] = [
  "cursor",
  "github-copilot",
  "claude",
  "chatgpt",
  "anthropic-api",
  "openai-api",
  "gemini",
  "windsurf",
];
