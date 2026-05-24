# Deployment

This is the quickest honest path to a live, reachable production URL for the Credex evaluation.

## 1. Git setup

Run these commands from the project root:

```bash
git branch -M main
git add .
git commit -m "feat: prepare credex ai spend audit mvp for deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Notes:

- The evaluator requires a public repo.
- GitHub Actions in [.github/workflows/ci.yml](C:/Users/shikh/OneDrive/Documents/New%20project%203/.github/workflows/ci.yml) will only show checks after the repo is pushed.

## 2. Supabase

1. Create a new Supabase project.
2. Open the SQL editor.
3. Run [config/database.sql](C:/Users/shikh/OneDrive/Documents/New%20project%203/config/database.sql).
4. Copy these values:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` -> `SUPABASE_SERVICE_ROLE_KEY`

## 3. Resend

1. Create a Resend account.
2. Verify a sending domain or use the testing sender you control.
3. Copy:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`

## 4. Summary provider

Preferred:

- `ANTHROPIC_API_KEY`
- optional: `ANTHROPIC_SUMMARY_MODEL`

Fallbacks supported:

- `OPENAI_API_KEY`
- `NVIDIA_API_KEY`

The app works without AI summaries, but production should have at least one provider configured.

## 5. Vercel

1. Import the GitHub repo into Vercel.
2. Framework preset: `Next.js`
3. Add the environment variables from [.env.local.example](C:/Users/shikh/OneDrive/Documents/New%20project%203/.env.local.example)
4. Set `NEXT_PUBLIC_APP_URL` to your production domain, for example:

```text
https://credex-ai-spend-audit.vercel.app
```

5. Deploy.

## 6. Post-deploy verification

Check these URLs on production:

- `/`
- `/audit`
- `/api/health`

Expected `/api/health` target:

```json
{
  "ok": true,
  "ready": true
}
```

Then verify the real flow:

1. Run an audit
2. Copy a public URL
3. Open the public URL in a new tab
4. Submit the email gate
5. Confirm a lead row appears in Supabase
6. Confirm Resend shows the transactional email

## 7. Final evaluator cleanup

Before submission, replace placeholders in:

- [README.md](C:/Users/shikh/OneDrive/Documents/New%20project%203/README.md)
- [DEVLOG.md](C:/Users/shikh/OneDrive/Documents/New%20project%203/DEVLOG.md)
- [USER_INTERVIEWS.md](C:/Users/shikh/OneDrive/Documents/New%20project%203/USER_INTERVIEWS.md)

Without those, the app may be deployed, but the submission is still not evaluator-ready.
