# Deployment

This is the deployment process I followed to get the project running in production for testing and evaluation.

## 1. GitHub setup

From the project root:

```bash
git branch -M main
git add .
git commit -m "feat: prepare app for deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Notes:

- The repository should stay public for evaluation.
- `.env.local` should NOT be pushed.
- Only `.env.local.example` should exist in the repo.

---

## 2. Supabase setup

1. Create a new Supabase project.
2. Open the SQL Editor.
3. Run the queries from `config/database.sql`.
4. Copy the following values into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

These are used for:
- public audit reads
- audit storage
- lead capture persistence

---

## 3. Resend setup

1. Create a Resend account.
2. Generate an API key.
3. Add these values to `.env.local`:

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=
```

During development I used:

```env
RESEND_FROM_EMAIL=onboarding@resend.dev
```

For full production delivery, a verified sender domain is recommended.

---

## 4. AI summary provider

The audit engine itself is deterministic and rule-based.

AI is only used for generating a short personalized summary paragraph.

The project currently supports:
- NVIDIA-hosted inference
- OpenAI-compatible APIs
- Anthropic/OpenAI fallback support

Example configuration:

```env
NVIDIA_API_KEY=
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_SUMMARY_MODEL=openai/gpt-oss-20b
```

The app still works even if AI summaries fail because there is a fallback deterministic summary flow.

---

## 5. Vercel deployment

1. Import the GitHub repository into Vercel.
2. Select the Next.js framework preset.
3. Add all environment variables from `.env.local`.
4. Set:

```env
NEXT_PUBLIC_APP_URL=
```

to the production deployment URL.

Example:

```text
https://stacklens.vercel.app
```

5. Deploy the project.

---

## 6. Production verification

After deployment, I tested:

- `/`
- `/audit`
- `/api/health`

Then verified the main user flow:

1. Complete an audit
2. Generate recommendations
3. Open the public share URL
4. Submit the lead capture form
5. Verify audit rows appear in Supabase
6. Verify lead rows appear in Supabase

---

## 7. Notes

A few tradeoffs were intentionally made for the MVP:

- The audit engine is deterministic instead of AI-generated because pricing recommendations should stay explainable.
- The frontend stores temporary form state in `localStorage` to improve the user experience during longer audit sessions.
- The infrastructure was kept intentionally simple to prioritize reliability and deployment speed during the assignment timeline.
