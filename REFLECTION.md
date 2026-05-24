# Reflection

## 1. The hardest bug you hit this week, and how you debugged it

The trickiest bug in this build was a frontend/backend mismatch around the shareable audit flow. The original version generated share links by encoding the whole audit input into the URL, which looked convenient, but it quietly violated the product requirement that identifying details be stripped from the public result. Once that became clear, I had to rethink not just the URL shape, but also how the result page, Open Graph preview, and lead capture flow worked together. My first hypothesis was that I could sanitize the payload in-place and keep the encoded URL approach. That quickly fell apart because the public page still needed a stable share identifier, and the email capture flow needed something canonical to reference.

The better fix was to move to stored public audit records. I introduced a server-side audit creation route, a Supabase storage helper, and a public record type that intentionally omits `companyName`. The debugging process here was less about a crashing error and more about catching an architectural bug before it became locked into the product. What worked was tracing the evaluator requirement through the entire user journey rather than treating it as a metadata tweak.

## 2. A decision you reversed mid-week, and what made you reverse it

One decision I reversed was keeping the app as a single long landing page with all sections visible at once. At first, that felt efficient: a polished homepage, then the audit form, then the FAQs, all in one scroll. But once I looked at the experience more critically, it felt too much like a template site and not enough like a premium founder tool. It also weakened the information hierarchy. If the navigation promised “Benefits,” “How it works,” and “FAQ,” those links should open distinct destinations rather than just nudging the user down a tall page.

I changed course and split those areas into separate routes while letting `/audit` become the actual product flow. That made the site feel more productized and less like a mock landing page. It also simplified the mental model: homepage sells the tool, audit page does the work, public share page closes the loop. The reversal happened because the earlier choice was fast, but it was not aligned with how a launch-ready SaaS product should feel.

## 3. What you would build in week 2 if you had it

Week 2 would be about turning the MVP from “strong evaluation project” into something a real startup team could pilot. The first thing I would add is better pricing model depth for API-direct usage. Right now, the form uses monthly spend as the main input because it is practical, but a more advanced version should optionally let power users enter token mix, request volume, and model family. That would make API savings suggestions much sharper without making the default form harder for typical founders.

Second, I would build analytics and instrumentation. I would want to know audit completion rate, lead capture rate after value is shown, public share rate, and conversion from high-savings audits into consultation requests. That tells us whether the product is mostly an educational calculator, a lead magnet, or a real sales funnel for Credex.

Third, I would tighten the backend posture: row-level access patterns, stronger rate limiting, and maybe a job queue for email and summary generation. Finally, I would improve the public result page so it looks even more screenshot-worthy, with clearer tool-by-tool storytelling and stronger social sharing polish.

## 4. How you used AI tools

AI was useful in the parts of the project where speed and synthesis mattered more than authority. I used AI assistance mainly for UI iteration, copy phrasing, and structural code drafting. It was good at helping generate candidate layouts, refactor repetitive component scaffolding, and rephrase product messaging into a more polished founder-facing tone. It was also useful for thinking through alternate folder structures and surfacing trade-offs quickly.

What I did not trust AI with was the financial logic itself. The audit engine deliberately stays deterministic because evaluator requirements and user trust both depend on defensible reasoning. I also did not trust AI to “remember” current vendor pricing without verification. One specific place the AI was wrong was around plan naming and pricing equivalence: it treated older and newer vendor labels too loosely, especially around ChatGPT Team versus ChatGPT Business and around exact tier mappings for some tools. I caught that by checking the official pricing sources and then restructuring the pricing config so the app could preserve evaluator wording while still documenting the current vendor naming reality.

## 5. Self-rating

**Discipline: 7/10**  
The product and docs are moving in the right direction, but the missing real 7-day git history is a serious gap that should have been managed earlier.

**Code quality: 8/10**  
The core audit logic is now typed, test-covered, and separated cleanly from UI and AI summary generation.

**Design sense: 7/10**  
The interface is cleaner and more product-like now, especially after separating the landing and audit flows, though there is still room to raise the visual polish further.

**Problem solving: 8/10**  
The strongest work this week was catching architectural requirement mismatches early enough to change direction cleanly.

**Entrepreneurial thinking: 7/10**  
The product is now more aligned with how Credex could actually use it, but the go-to-market and interview evidence still need real-world validation.
