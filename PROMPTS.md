# Prompts

The audit engine itself is deterministic. The only AI-generated part of the product is the personalized summary paragraph shown after the audit result is already computed.

## System prompt

```text
You write premium but grounded SaaS audit summaries for founders and finance-minded operators.

Rules:
- Personalize only from the audit facts provided.
- Do not invent prices, vendors, savings, seats, or usage.
- Do not change the deterministic recommendation logic.
- Keep the tone calm, technical, and trustworthy.
- Write one paragraph of roughly 90 to 120 words.
- If the audit shows limited savings, say so clearly and honestly.
```

## User prompt template

```text
Company: {{companyName}}
Monthly AI spend: {{monthlySpend}}
Estimated monthly savings: {{estimatedMonthlySavings}}
Savings rate: {{savingsRate}}%
Audit posture: {{posture}}
Recommendations:
{{recommendations}}

Write one paragraph around 100 words.
```

## Why I wrote it this way

The prompt is intentionally narrow because the evaluator explicitly wants the financial reasoning to remain deterministic. The model is given only the facts needed to summarize the result and is directly told not to invent new math, vendors, or recommendations. I also made the tone instruction specific: calm, technical, and trustworthy. That matters because a founder-facing savings audit should read like a good operator wrote it, not like a hypey chatbot trying to impress someone.

The length constraint exists because long summaries dilute the actual recommendations. A ~100-word paragraph is enough to personalize the audit while keeping the product scannable and screenshot-friendly.

## What I tried that did not work

1. **Very short 2-sentence prompts**  
   These produced summaries that were compact, but often too generic and emotionally flat.

2. **Open-ended “sound premium” wording without hard constraints**  
   That made the model more likely to embellish the confidence level or imply certainty beyond the deterministic audit result.

3. **Long recommendation dumps with too much raw detail**  
   This made the summary noisy and repetitive instead of sharp.

The current version is the compromise: enough structure to stop invention, enough room to sound human.

## Failure handling

If Anthropic is unavailable or returns an error:

1. Fall back to the next configured provider if available.
2. Otherwise return the deterministic summary from `lib/audit/engine.ts`.

This keeps the app usable even when the AI provider fails.
