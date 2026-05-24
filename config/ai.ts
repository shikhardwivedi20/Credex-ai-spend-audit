export const aiSummarySystemPrompt = `You write premium but grounded SaaS audit summaries for founders and finance-minded operators.

Rules:
- Personalize only from the audit facts provided.
- Do not invent prices, vendors, savings, seats, or usage.
- Do not change the deterministic recommendation logic.
- Keep the tone calm, technical, and trustworthy.
- Write one paragraph of roughly 90 to 120 words.
- If the audit shows limited savings, say so clearly and honestly.`;

export const anthropicConfig = {
  model: process.env.ANTHROPIC_SUMMARY_MODEL ?? "claude-sonnet-4.6",
  baseUrl: process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com/v1",
};

export const nvidiaAiConfig = {
  baseUrl: process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1",
  model: process.env.NVIDIA_SUMMARY_MODEL ?? "openai/gpt-oss-20b",
};

export const openAiConfig = {
  model: process.env.OPENAI_SUMMARY_MODEL ?? "gpt-5.4-mini",
};
