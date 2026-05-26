# User Interviews

I had a few informal conversations with people around me who actively use AI tools during development, writing, and team collaboration. The goal was mainly to understand whether people actually notice AI spend growth and whether they would trust a tool recommending cost optimizations.

---

# Interview 1

- **Name / initials:** Tanmay
- **Role:** Freelance developer
- **Team size:** Solo

## Key points from the conversation

- Uses Cursor Pro and ChatGPT Plus regularly
- Mostly pays personally instead of through a company
- Had never compared overlapping subscriptions before

## Direct quotes

> “I honestly forgot I was paying for both ChatGPT and Claude at one point.”

> “Most people notice cloud bills late, but AI subscriptions are even easier to ignore.”

> “If a tool saved me even ₹1-2k monthly without affecting workflow, I would probably keep using it.”

## Most surprising thing

The biggest surprise was that overlapping subscriptions were common even for solo users, mainly because people experiment with tools and forget to cancel older plans.

## What changed in the product

This conversation made me simplify the form flow and focus more on:
- monthly spend visibility
- overlapping plan recommendations
- simpler savings explanations

---

# Interview 2

- **Name / initials:** Ritik
- **Role:** Engineering student working on AI projects
- **Team size:** 3-4 collaborators

## Key points from the conversation

- Uses Gemini, ChatGPT, and GitHub Copilot
- Team members often buy tools independently
- Nobody tracks total AI spend centrally

## Direct quotes

> “We usually optimize cloud costs but not AI subscriptions.”

> “The same team can end up paying for multiple tools doing almost the same thing.”

> “A comparison tool would be useful only if the recommendations feel realistic.”

## Most surprising thing

The interesting part was that trust mattered more than aggressive savings numbers. Overpromising savings actually reduced confidence in the recommendations.

## What changed in the product

After this discussion, I adjusted the recommendation logic so the app can also return:
- “your current setup already looks reasonable”
instead of always forcing optimization suggestions.

That made the results feel more believable.

---

# Interview 3

- **Name / initials:** Anish
- **Role:** Startup intern
- **Team size:** Around 8 people

## Key points from the conversation

- Team uses multiple AI tools across different workflows
- API usage and subscription usage are tracked separately
- People often do not know which plans other teammates already have

## Direct quotes

> “AI tooling expenses are growing quietly compared to other SaaS tools.”

> “We only notice duplicate spending after checking invoices manually.”

> “The public share link idea is useful because founders usually want quick summaries instead of dashboards.”

## Most surprising thing

The most useful insight was that founders usually prefer:
- quick summaries
- simple savings estimates
- shareable reports

instead of detailed admin dashboards initially.

## What changed in the product

This pushed me to focus more on:
- cleaner result pages
- shareable public URLs
- mobile readability
- screenshot-friendly summaries

instead of adding too many dashboard-style analytics features.

---

# Common patterns I noticed

Across all conversations, a few patterns repeated consistently:

- AI subscriptions are often purchased independently without centralized tracking.
- Teams usually notice cloud costs earlier than AI subscription costs.
- Users trusted realistic recommendations more than exaggerated savings claims.
- Simpler summaries were preferred over complex analytics-heavy dashboards.

These conversations helped shape the product toward a more practical and founder-focused MVP instead of a highly technical internal admin tool.
