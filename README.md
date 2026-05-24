# Credex AI Spend Audit

Credex AI Spend Audit is a founder-focused SaaS web app that helps startup teams evaluate whether they are overspending on AI subscriptions, seats, and API usage. It is built for operators, finance-minded founders, and engineering leaders who want defensible savings recommendations instead of fuzzy AI advice.

## Demo assets

- Screenshot 1: add a homepage screenshot here before submission
- Screenshot 2: add an audit form screenshot here before submission
- Screenshot 3: add a results/share page screenshot here before submission
- Optional screen recording: add a 30-second Loom or YouTube link here before submission

## Deployed URL

- Replace with live URL before submission: `https://your-vercel-url.vercel.app`

## Quick start

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Run tests

```bash
npm test
```

### Run lint

```bash
npm run lint
```

### Production build

```bash
npm run build
```

### Deploy

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Add the environment variables from [.env.local.example](C:/Users/shikh/OneDrive/Documents/New%20project%203/.env.local.example).
4. Run the SQL in [config/database.sql](C:/Users/shikh/OneDrive/Documents/New%20project%203/config/database.sql) against Supabase.
5. Redeploy and verify `/audit`, `/api/audits`, `/api/leads`, and `/api/health` on production.

For the full launch checklist, use [DEPLOYMENT.md](C:/Users/shikh/OneDrive/Documents/New%20project%203/DEPLOYMENT.md).

## Decisions

1. **Deterministic recommendations instead of AI-generated audit math**  
   The evaluator explicitly wants finance-defensible logic. Hardcoded rules are easier to explain, test, and trust.

2. **Supabase + Resend over a heavier backend**  
   This keeps the MVP shippable in a week while still giving real storage, public audit URLs, and transactional email hooks.

3. **Public audit URLs without login**  
   This supports the viral/shareable loop and lowers friction, but requires stripping identifying details from the public record.

4. **Use actual monthly spend as the primary input even for API tools**  
   Founders usually know the bill, not their token mix. This keeps the form usable and still allows deterministic savings heuristics.

5. **Mobile-first polished UI over a denser internal dashboard**  
   The product needs to earn trust quickly and get screenshotted. The current layout favors clarity and shareability over internal-admin complexity.

## Submission note

This repo still needs three real-world submission inputs before it is actually safe to submit:

- a real public GitHub URL
- a real deployed production URL
- real screenshots or a real screen recording

The app code, docs, tests, and CI scaffolding are in place, but those external deliverables cannot be invented locally.
