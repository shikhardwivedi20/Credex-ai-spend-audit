# Metrics

The North Star metric for this product should be **qualified audit completions**. Not just “audit started,” and definitely not generic DAU. A qualified completion means a user finishes an audit with believable spend inputs and reaches the results state where lead capture and sharing become possible. That is the moment where the product has actually delivered value and created the opportunity for Credex to convert interest into pipeline.

The three input metrics I would watch first are:

1. **Audit start → audit completion rate**  
   This tells us whether the form is too heavy, confusing, or missing expected tools and plans.

2. **Audit completion → lead capture rate**  
   This is the clearest signal for whether the results feel valuable enough to trade an email for.

3. **Audit completion → public share rate**  
   This measures whether the output is compelling enough to circulate internally or socially, which matters because the share loop is one of the most interesting distribution levers in the product.

The first instrumentation I would add is event tracking around: landing CTA click, audit started, tool added, audit completed, share URL created, lead captured, consultation CTA clicked, and public result viewed. I would also track whether the audit fell into the “healthy” branch or the “high savings” branch, because those two cohorts are likely to behave differently in the funnel.

The pivot trigger I would watch is this: if after a few hundred qualified visitors the product still cannot get at least a 10% audit completion-to-lead capture rate, I would seriously question whether it is functioning as a real wedge for Credex. That would suggest either the results are not sharp enough, the target user is wrong, or the product is answering a problem people find mildly interesting but not urgent enough to act on.
