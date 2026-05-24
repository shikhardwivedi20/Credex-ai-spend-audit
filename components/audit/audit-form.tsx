"use client";

import { Check, ChevronDown, Plus, Search, Sparkles, Trash2, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { aiToolOptions, auditStorageKey, buildTool, defaultAuditTools, primaryUseCases, type AiToolOption } from "@/config/audit";
import { analyzeAudit } from "@/lib/audit/engine";
import type { AuditInput, AuditTool, PrimaryUseCase, ToolPlanId } from "@/types/audit";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AuditResults } from "./audit-results";
import { ToolLogo } from "./tool-logo";

type StoredAuditState = AuditInput;

export function AuditForm() {
  const [companyName, setCompanyName] = useState("Acme AI");
  const [teamSize, setTeamSize] = useState(12);
  const [primaryUseCase, setPrimaryUseCase] = useState<PrimaryUseCase>("coding");
  const [tools, setTools] = useState<AuditTool[]>(defaultAuditTools);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(auditStorageKey);
      if (!raw) {
        setHydrated(true);
        return;
      }

      const saved = JSON.parse(raw) as Partial<StoredAuditState>;
      if (saved.companyName) setCompanyName(saved.companyName);
      if (typeof saved.teamSize === "number") setTeamSize(saved.teamSize);
      if (saved.primaryUseCase && primaryUseCases.includes(saved.primaryUseCase)) {
        setPrimaryUseCase(saved.primaryUseCase);
      }
      if (Array.isArray(saved.tools) && saved.tools.length > 0) {
        setTools(saved.tools);
      }
    } catch {
      // Ignore invalid persisted state and continue with defaults.
    } finally {
      setHydrated(true);
    }
  }, []);

  const input: AuditInput = useMemo(
    () => ({ companyName, teamSize, primaryUseCase, tools }),
    [companyName, primaryUseCase, teamSize, tools],
  );
  const result = useMemo(() => analyzeAudit(input), [input]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(auditStorageKey, JSON.stringify(input));
  }, [hydrated, input]);

  function updateTool(id: string, patch: Partial<AuditTool>) {
    setTools((current) => current.map((tool) => (tool.id === id ? { ...tool, ...patch } : tool)));
  }

  function applyToolOption(id: string, option: AiToolOption) {
    setTools((current) =>
      current.map((tool) =>
        tool.id === id
          ? {
              ...tool,
              toolKey: option.key,
              planId: option.defaultPlanId,
              seats: option.defaultSeats,
              monthlySpend: option.defaultMonthlySpend,
            }
          : tool,
      ),
    );
  }

  function updatePlan(id: string, planId: ToolPlanId) {
    setTools((current) =>
      current.map((tool) => {
        if (tool.id !== id) return tool;
        const option = aiToolOptions.find((item) => item.key === tool.toolKey);
        const selectedPlan = option?.supportedPlans.find((plan) => plan.id === planId);
        const monthlySpend =
          selectedPlan?.monthlySeatPrice === undefined ? tool.monthlySpend : Math.round(selectedPlan.monthlySeatPrice * tool.seats);

        return {
          ...tool,
          planId,
          monthlySpend,
        };
      }),
    );
  }

  function updateSeats(id: string, seats: number) {
    setTools((current) =>
      current.map((tool) => {
        if (tool.id !== id) return tool;
        const option = aiToolOptions.find((item) => item.key === tool.toolKey);
        const selectedPlan = option?.supportedPlans.find((plan) => plan.id === tool.planId);
        const monthlySpend =
          selectedPlan?.monthlySeatPrice === undefined ? tool.monthlySpend : Math.round(selectedPlan.monthlySeatPrice * seats);

        return {
          ...tool,
          seats,
          monthlySpend,
        };
      }),
    );
  }

  function addTool() {
    setTools((current) => [...current, buildTool("claude")]);
  }

  function removeTool(id: string) {
    setTools((current) => current.filter((tool) => tool.id !== id));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(420px,1fr)] lg:items-start">
      <Card className="overflow-hidden border-white/70 bg-white/85 shadow-audit backdrop-blur">
        <div className="border-b bg-[linear-gradient(120deg,rgba(20,184,166,.12),rgba(59,130,246,.10),rgba(244,114,182,.10))] p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm">
                <Wand2 className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Spend input</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Exact tools, exact plans, persistent state, deterministic math.
                </p>
              </div>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={addTool}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add tool
            </Button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Field label="Company name">
              <Input value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
            </Field>
            <Field label="Team size">
              <Input
                type="number"
                min={1}
                value={teamSize}
                onChange={(event) => setTeamSize(Math.max(1, Number(event.target.value) || 1))}
              />
            </Field>
            <Field label="Primary use case">
              <Select value={primaryUseCase} onChange={(event) => setPrimaryUseCase(event.target.value as PrimaryUseCase)}>
                {primaryUseCases.map((useCase) => (
                  <option key={useCase} value={useCase}>
                    {formatLabel(useCase)}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="rounded-lg border bg-white/70 px-3 py-2.5 text-sm text-slate-600">
              Form state persists automatically across page reloads.
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {tools.map((tool) => {
            const option = aiToolOptions.find((item) => item.key === tool.toolKey) ?? aiToolOptions[0];
            const currentPlan = option.supportedPlans.find((plan) => plan.id === tool.planId) ?? option.supportedPlans[0];

            return (
              <div
                key={tool.id}
                className="group overflow-hidden rounded-xl border bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-audit"
              >
                <div className={`h-1 bg-gradient-to-r ${option.accent}`} />
                <div className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <ToolPicker value={tool.toolKey} onChange={(selected) => applyToolOption(tool.id, selected)} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${option.name}`}
                      onClick={() => removeTool(tool.id)}
                      disabled={tools.length === 1}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {option.category}
                    </span>
                    <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-800">
                      {option.description}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <Field label="Plan">
                      <Select value={tool.planId} onChange={(event) => updatePlan(tool.id, event.target.value as ToolPlanId)}>
                        {option.supportedPlans.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.label}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Monthly spend">
                      <Input
                        type="number"
                        min={0}
                        value={tool.monthlySpend}
                        onChange={(event) => updateTool(tool.id, { monthlySpend: Math.max(0, Number(event.target.value) || 0) })}
                      />
                    </Field>
                    <Field label="Seats">
                      <Input
                        type="number"
                        min={1}
                        value={tool.seats}
                        onChange={(event) => updateSeats(tool.id, Math.max(1, Number(event.target.value) || 1))}
                      />
                    </Field>
                  </div>

                  <div className="mt-3 rounded-lg border bg-slate-50/80 px-3 py-2 text-xs leading-5 text-slate-600">
                    <span className="font-medium text-slate-900">{currentPlan.label}:</span>{" "}
                    {currentPlan.pricingModel === "seat" && currentPlan.monthlySeatPrice !== undefined
                      ? `public list price is about $${currentPlan.monthlySeatPrice}/seat/month.`
                      : currentPlan.pricingModel === "usage"
                        ? "usage-based plan; keep the actual monthly spend entered here."
                        : "custom-priced plan; keep the actual monthly spend entered here."}{" "}
                    {currentPlan.notes}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-xl border bg-slate-950 p-5 text-white shadow-audit">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(20,184,166,.28),transparent_28%),radial-gradient(circle_at_90%_20%,rgba(59,130,246,.24),transparent_30%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 text-sm text-teal-200">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Credex audit preview
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Find defensible AI savings before the next renewal.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              The savings engine is deterministic and rule-based. AI is used only to write the summary paragraph.
            </p>
          </div>
        </div>
        <AuditResults result={result} />
      </div>
    </div>
  );
}

function ToolPicker({
  value,
  onChange,
}: {
  value: AuditTool["toolKey"];
  onChange: (option: AiToolOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = aiToolOptions.find((option) => option.key === value) ?? aiToolOptions[0];
  const filtered = aiToolOptions.filter((option) => {
    const haystack = `${option.name} ${option.category} ${option.description}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <div className="relative min-w-0 flex-1">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 rounded-lg border bg-white px-3 py-3 text-left shadow-sm transition hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-3">
          <ToolLogo
            name={selected.name}
            accent={selected.accent}
            logoBg={selected.logoBg}
            logoSlug={selected.logoSlug}
          />
          <span className="min-w-0">
            <span className="block truncate font-semibold text-slate-950">{selected.name}</span>
            <span className="block truncate text-xs text-slate-500">{selected.category}</span>
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 flex-none text-slate-400 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border bg-white shadow-audit">
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              className="h-9 w-full bg-transparent text-sm outline-none"
              placeholder="Search Cursor, Claude, OpenAI API..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-72 overflow-y-auto p-2">
            {filtered.map((option) => (
              <button
                key={option.key}
                type="button"
                className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50"
                onClick={() => {
                  onChange(option);
                  setQuery("");
                  setOpen(false);
                }}
              >
                <ToolLogo
                  name={option.name}
                  accent={option.accent}
                  logoBg={option.logoBg}
                  logoSlug={option.logoSlug}
                  className="mt-0.5 h-9 w-9"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-950">{option.name}</span>
                    {option.key === value && <Check className="h-4 w-4 text-teal-700" aria-hidden="true" />}
                  </span>
                  <span className="mt-0.5 block text-xs font-medium text-teal-700">{option.category}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{option.description}</span>
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-slate-500">No app found. Try another search.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  );
}

function formatLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
