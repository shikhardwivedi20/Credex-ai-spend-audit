# Reflection

## 1. The hardest bug I encountered and how I debugged it

The hardest issue I encountered was around the shareable audit flow and public URLs.

In the earlier version, I was generating share links directly from encoded audit data in the URL because it felt like the fastest approach for an MVP. Initially it worked fine technically, but later I realized it created a problem: some identifying information could still end up tied to the public audit result flow, which was not ideal for a shareable public page.

At first, I tried sanitizing the payload before encoding it into the URL, but that quickly became messy because the audit page, lead capture flow, and Open Graph sharing all depended on the same structure.

The better solution was moving public audit storage to Supabase and generating UUID-based public share pages instead. I added a dedicated API route for audit creation and separated the public audit structure from the internal audit state.

This was less of a “crashing app” bug and more of an architectural issue that became obvious only after testing the full user flow carefully.

---

## 2. A decision I reversed during development

One decision I changed midway was keeping everything on a single scrolling landing page.

Initially I combined:
- homepage content
- benefits
- FAQ
- audit form

all into one long page because it was faster to build.

But after using the app more, it started feeling more like a generic landing page template instead of an actual product experience.

So I separated the flows into cleaner routes:
- homepage
- audit flow
- public share page

That made the app feel much more focused and product-oriented.

The `/audit` route especially became cleaner once it was treated like the main product workflow instead of just another section inside a long marketing page.

---

## 3. What I would improve in a second iteration

If I continued this project further, the first thing I would improve would be API usage analysis.

Right now, the app mainly uses monthly spend as the primary input because most startup teams know their billing numbers more easily than token-level usage details.

A more advanced version could optionally support:
- token usage analysis
- request volume estimates
- model-level API cost comparisons

I would also add:
- better analytics
- audit completion tracking
- public share tracking
- stronger rate limiting
- better email delivery infrastructure

Another improvement would be making the public result page more visual and easier to screenshot/share.

---

## 4. How I used AI tools during development

AI tools were mainly useful for speeding up iteration during development.

I used them for:
- brainstorming UI layouts
- restructuring components
- improving wording and copy
- debugging repetitive issues faster
- generating alternative implementation ideas

However, I intentionally kept the audit engine itself deterministic and rule-based.

I did not want pricing recommendations to depend directly on LLM output because:
- recommendations should stay explainable
- pricing logic should remain testable
- financial suggestions should stay predictable

One place where AI suggestions were unreliable was around current pricing tiers and naming consistency across vendors. I noticed some mismatches between older and newer plan names while testing the pricing configuration, so I verified those manually using official pricing pages before updating the final configuration.

---

## 5. Self-rating

### Discipline — 7/10

I think I managed the MVP scope reasonably well and focused on finishing the core flow instead of endlessly adding features.

### Code quality — 8/10

The audit logic is separated cleanly from the UI layer, and most of the important flows are typed and modular.

### Design sense — 7/10

The UI became much cleaner after separating the audit flow from the landing experience, although there is still room for better polish and animation consistency.

### Problem solving — 8/10

The strongest part of the project was identifying structural issues early enough to refactor them before deployment.

### Entrepreneurial thinking — 7/10

I tried to think beyond just the coding assignment and shape the project more like a real SaaS workflow instead of only a demo app.
