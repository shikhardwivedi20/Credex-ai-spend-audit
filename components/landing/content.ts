import { BadgeDollarSign, BrainCircuit, CheckCircle2, GitBranch, LockKeyhole, Route, ShieldCheck, Sparkles, WalletCards } from "lucide-react";

export const navItems = [
  { label: "Benefits", href: "/benefits" },
  { label: "How it works", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
];

export const benefits = [
  {
    icon: BadgeDollarSign,
    title: "Defensible savings",
    body: "Recommendations are tied to spend, seats, utilization, and plan pricing instead of vague AI guesses.",
    color: "from-teal-500 to-emerald-400",
  },
  {
    icon: Route,
    title: "Renewal-ready actions",
    body: "Know whether to downgrade, remove seats, consolidate tools, or check startup credits before renewal week.",
    color: "from-sky-500 to-cyan-400",
  },
  {
    icon: ShieldCheck,
    title: "Finance-safe logic",
    body: "AI only writes the summary. The recommendation engine stays deterministic and testable.",
    color: "from-indigo-500 to-violet-400",
  },
  {
    icon: WalletCards,
    title: "Credit opportunities",
    body: "Flag spend that may be offset through startup programs or cloud marketplace credits.",
    color: "from-amber-500 to-orange-400",
  },
  {
    icon: GitBranch,
    title: "Overlap detection",
    body: "Find tools covering the same writing, research, support, sales, ops, design, or coding workflows.",
    color: "from-rose-500 to-pink-400",
  },
  {
    icon: LockKeyhole,
    title: "No black-box cuts",
    body: "Every recommendation includes short reasoning founders can explain to finance, ops, and team leads.",
    color: "from-slate-700 to-slate-500",
  },
];

export const steps = [
  {
    icon: Sparkles,
    title: "Map the stack",
    body: "Add tools, plans, seats, monthly spend, utilization, and use cases in one focused workflow.",
  },
  {
    icon: BrainCircuit,
    title: "Run deterministic rules",
    body: "The engine checks pricing, overlap, low utilization, alternative tools, and credit eligibility.",
  },
  {
    icon: CheckCircle2,
    title: "Share the result",
    body: "Send a shareable audit URL with monthly savings, annual impact, and founder-friendly reasoning.",
  },
];

export const faqs = [
  {
    question: "Can I trust this enough to change a real renewal decision?",
    answer:
      "Yes, as a first-pass audit. The savings math is deterministic and tied to plan pricing, seat counts, and tool fit rather than AI guesses. It is meant to help a founder or finance lead decide what deserves review before renewal, not replace final procurement approval.",
  },
  {
    question: "What if my team pushes back and says they need every tool?",
    answer:
      "That is exactly why the tool avoids blanket cancellation advice. Recommendations are framed as specific reviews: downgrade a small team off a collaboration tier, remove excess seats, compare overlapping tools, or check credits. It gives you a defensible starting point for discussion instead of forcing a hard cut.",
  },
  {
    question: "Will this tell me to cut tools that are actually business-critical?",
    answer:
      "No, not automatically. The engine is intentionally conservative. It highlights where spend looks mismatched or duplicative, but the result is meant to trigger review, not silently remove a tool your team relies on.",
  },
  {
    question: "How should I use this if we have custom enterprise pricing or heavy API usage?",
    answer:
      "Use your actual monthly bill as the source of truth. For enterprise contracts and API-direct spend, the product is less about exact list-price matching and more about finding plan mismatch, overlap, and credit opportunities that still create defendable savings.",
  },
  {
    question: "When should I talk to Credex instead of just using the audit myself?",
    answer:
      "If the audit shows meaningful monthly savings, especially several hundred dollars or more, Credex becomes useful when the opportunity needs negotiation, credits, vendor restructuring, or a cleaner company-wide AI spend policy. The self-serve audit is the signal; Credex is the deeper execution path.",
  },
];
