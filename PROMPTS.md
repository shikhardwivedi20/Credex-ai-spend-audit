# Prompts

The audit calculations and recommendations in this project are fully deterministic. AI is only used to generate a short personalized summary after the audit result is already computed.

## System prompt

```text
You generate short SaaS audit summaries for founders and small technical teams.

Guidelines:
- Use only the audit data provided.
- Do not invent pricing, vendors, savings, or recommendations.
- Do not modify the existing audit logic.
- Keep the tone professional, clear, and trustworthy.
- Write a single paragraph between 90 and 120 words.
- If savings are low or the stack already looks optimized, say that honestly.
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

Generate a concise personalized summary paragraph.
```

## Prompt design decisions

I intentionally kept the prompt narrow and structured because the assignment specifically mentioned that the financial reasoning should remain deterministic.

The AI model is not responsible for:
- pricing calculations
- recommendation generation
- savings estimation
- plan comparison logic

Those parts are handled entirely inside the audit engine.

The model only receives the final audit output and turns it into a more readable founder-facing summary.

I also added explicit instructions preventing the model from inventing:
- pricing numbers
- additional vendors
- unsupported claims
- exaggerated confidence

This helped keep the summaries more reliable and consistent with the actual audit results.

The summary length was also intentionally limited so the result page stays easy to scan and share.

---

## Prompt iterations that did not work well

### 1. Very short prompts

Earlier versions used only a few instructions and produced summaries that felt too generic and repetitive.

### 2. Open-ended “marketing style” prompts

Allowing the model too much freedom sometimes caused exaggerated wording or overly confident recommendations that did not match the deterministic audit output.

### 3. Large raw recommendation dumps

Passing too much detail into the prompt made the summaries noisy and harder to read.

The final version is more constrained, which produced cleaner and more reliable outputs during testing.

---

## Failure handling

If the configured AI provider fails or times out:

1. The app attempts the next configured provider if available.
2. If no provider succeeds, the app falls back to a deterministic template summary.

This keeps the audit flow usable even if external AI services are unavailable.
