import { CheckCircle2, Sparkles, TrendingDown, WalletCards } from "lucide-react";

export function ProductVisual() {
  return (
    <div className="relative mx-auto mt-12 max-w-5xl lg:mt-0">
      <div className="absolute -inset-6 rounded-[2rem] bg-[linear-gradient(120deg,rgba(20,184,166,.28),rgba(59,130,246,.22),rgba(244,114,182,.18))] blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-audit backdrop-blur">
        <div className="flex items-center justify-between border-b bg-slate-950 px-4 py-3 text-white">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-teal-300" aria-hidden="true" />
            Live audit preview
          </div>
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
        </div>
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3 border-b bg-slate-50/80 p-4 lg:border-b-0 lg:border-r">
            {["ChatGPT Team", "Cursor Pro", "Claude Pro"].map((tool, index) => (
              <div
                key={tool}
                className="group rounded-lg border bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-950">{tool}</p>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {index === 0 ? "$240/mo" : index === 1 ? "$100/mo" : "$90/mo"}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-sky-500 transition-all duration-700 group-hover:w-[88%]"
                    style={{ width: index === 0 ? "45%" : index === 1 ? "82%" : "50%" }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Monthly spend" value="$430" icon={WalletCards} />
              <Metric label="Likely savings" value="$194" icon={TrendingDown} accent />
              <Metric label="Savings rate" value="45%" icon={CheckCircle2} />
            </div>
            <div className="mt-4 space-y-3">
              {[
                "Move low-collaboration users to ChatGPT Plus",
                "Check startup credits for API-heavy usage",
                "Consolidate duplicate research workflows",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border bg-white p-3 transition hover:-translate-y-0.5 hover:border-sky-300"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-teal-600" aria-hidden="true" />
                  <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: typeof WalletCards;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 transition hover:-translate-y-1 ${
        accent ? "bg-slate-950 text-white shadow-lg" : "bg-white text-slate-950"
      }`}
    >
      <Icon className={`h-4 w-4 ${accent ? "text-teal-300" : "text-teal-700"}`} aria-hidden="true" />
      <p className={`mt-3 text-xs ${accent ? "text-slate-300" : "text-slate-500"}`}>{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
