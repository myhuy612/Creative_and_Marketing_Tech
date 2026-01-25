// src/app/generate/audience-persona/page.tsx

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import type {
  ApiErrorResponse as TargetAudienceApiError,
  GenerateTargetAudienceRequest,
  GenerateTargetAudienceResponse,
  LuxuryLevel,
  TargetAudience,
} from "@/types/targetAudience";
import type {
  ListTargetAudiencePresetsResponse,
  TargetAudiencePreset,
} from "@/types/targetAudiencePreset";

import type {
  GeneratePersonaRequest,
  GeneratePersonaResponse,
  Persona,
} from "@/types/persona";
import type { ListPresetsResponse, PersonaPreset } from "@/types/personaPreset";

import { targetAudienceToManualTargetInfo } from "@/lib/mappers/targetAudienceToManualTargetInfo";

const LS_LAST_PERSONA_PRESET_ID = "persona:lastPresetId";

const defaultTaForm: GenerateTargetAudienceRequest = {
  productName: "",
  category: "",
  priceRange: { min: null, max: null },
  luxuryLevel: "mid",
  features: [],
  colourStyle: "",
  notes: "",
};

// preset.form is merged with default to prevent partial crashes
function normalizeTaForm(input: Partial<GenerateTargetAudienceRequest>): GenerateTargetAudienceRequest {
  return {
    ...defaultTaForm,
    ...input,
    priceRange: input.priceRange ?? { min: null, max: null },
    features: input.features ?? [],
    colourStyle: input.colourStyle ?? "",
    notes: input.notes ?? "",
  };
}

function splitLinesToList(s: string): string[] {
  return s
    .split(/\r?\n|,/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function listToMultiline(list?: string[]): string {
  if (!list?.length) return "";
  return list.join("\n");
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border bg-gray-50 px-3 py-1 text-xs">
      {children}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function PersonaCard({ persona }: { persona: Persona }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border bg-gray-50 p-3">
        <div className="text-sm font-semibold">{persona.personaName}</div>
        <div className="mt-1 text-sm text-gray-700">{persona.tagline}</div>
      </div>

      <div className="rounded-xl border p-3">
        <div className="text-xs font-semibold tracking-wide text-gray-500">DEMOGRAPHICS</div>
        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{persona.demographics}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border p-3">
          <div className="text-xs font-semibold tracking-wide text-gray-500">GOALS</div>
          {persona.goals?.length ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
              {persona.goals.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-gray-500">—</p>
          )}
        </div>

        <div className="rounded-xl border p-3">
          <div className="text-xs font-semibold tracking-wide text-gray-500">PAINS</div>
          {persona.pains?.length ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
              {persona.pains.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-gray-500">—</p>
          )}
        </div>

        <div className="rounded-xl border p-3">
          <div className="text-xs font-semibold tracking-wide text-gray-500">MOTIVATIONS</div>
          {persona.motivations?.length ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
              {persona.motivations.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-gray-500">—</p>
          )}
        </div>

        <div className="rounded-xl border p-3">
          <div className="text-xs font-semibold tracking-wide text-gray-500">RECOMMENDED TONE</div>
          {persona.recommendedTone?.trim() ? (
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip>{persona.recommendedTone}</Chip>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">—</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border p-3">
        <div className="text-xs font-semibold tracking-wide text-gray-500">PREFERRED CHANNELS</div>
        {persona.channels?.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {persona.channels.map((c, i) => (
              <Chip key={i}>{c}</Chip>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-500">—</p>
        )}
      </div>

      <div className="rounded-xl border p-3">
        <div className="text-xs font-semibold tracking-wide text-gray-500">KEY MESSAGE</div>
        {persona.keyMessage?.trim() ? (
          <p className="mt-2 whitespace-pre-wrap text-sm font-medium text-gray-800">
            {persona.keyMessage}
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-500">—</p>
        )}
      </div>

      <div className="rounded-xl border p-3">
        <div className="text-xs font-semibold tracking-wide text-gray-500">OBJECTIONS</div>
        {persona.objections?.length ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            {persona.objections.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500">—</p>
        )}
      </div>
    </div>
  );
}

export default function AudiencePersonaPage() {
  const searchParams = useSearchParams();

  // -------------------------
  // Target Audience state
  // -------------------------
  const [taForm, setTaForm] = useState<GenerateTargetAudienceRequest>(defaultTaForm);
  const [taFeaturesInput, setTaFeaturesInput] = useState<string>("");
  const [taLoading, setTaLoading] = useState(false);
  const [taError, setTaError] = useState<string | null>(null);
  const [taResult, setTaResult] = useState<TargetAudience | null>(null);

  // TA presets
  const [taPresets, setTaPresets] = useState<TargetAudiencePreset[]>([]);
  const [taPresetLoading, setTaPresetLoading] = useState(false);
  const [taPresetError, setTaPresetError] = useState<string | null>(null);
  const [selectedTaPresetId, setSelectedTaPresetId] = useState<string>("");

  // -------------------------
  // Persona state (manual-only)
  // -------------------------
  const [personaPresets, setPersonaPresets] = useState<PersonaPreset[]>([]);
  const [personaPresetError, setPersonaPresetError] = useState<string | null>(null);
  const [selectedPersonaPresetId, setSelectedPersonaPresetId] = useState<string>("");

  const [personaNum, setPersonaNum] = useState<1 | 2 | 3>(1);

  // context
  const [brandName, setBrandName] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");

  // manual inputs (multiline text UI)
  const [audienceSummary, setAudienceSummary] = useState("");
  const [goals, setGoals] = useState("");
  const [pains, setPains] = useState("");
  const [motivations, setMotivations] = useState("");
  const [channels, setChannels] = useState("");

  const [personaLoading, setPersonaLoading] = useState(false);
  const [personaError, setPersonaError] = useState<string | null>(null);
  const [personaResult, setPersonaResult] = useState<GeneratePersonaResponse | null>(null);

  // avoid auto-apply overriding edits repeatedly
  const didInitialPersonaAutoApplyRef = useRef(false);

  const personaContext = useMemo<GeneratePersonaRequest["context"]>(() => {
    const ctx: GeneratePersonaRequest["context"] = {};
    if (brandName.trim()) ctx.brandName = brandName.trim();
    if (productName.trim()) ctx.productName = productName.trim();
    if (category.trim()) ctx.category = category.trim();
    if (tone.trim()) ctx.tone = tone.trim();
    return ctx;
  }, [brandName, productName, category, tone]);

  const selectedPersonaPreset = useMemo(
    () => personaPresets.find((p) => p.id === selectedPersonaPresetId) || null,
    [personaPresets, selectedPersonaPresetId]
  );

  // -------------------------
  // Load presets (TA + Persona)
  // -------------------------
  useEffect(() => {
    let cancelled = false;

    async function loadTaPresets() {
      setTaPresetLoading(true);
      setTaPresetError(null);
      try {
        const res = await fetch("/api/presets/target-audience", { method: "GET" });
        const data = (await res.json()) as ListTargetAudiencePresetsResponse | TargetAudienceApiError;

        if (!res.ok) throw new Error((data as any)?.message || "Failed to load target audience presets.");
        if (!cancelled) setTaPresets((data as ListTargetAudiencePresetsResponse).presets ?? []);
      } catch (e: any) {
        if (!cancelled) setTaPresetError(e?.message || "Failed to load target audience presets.");
      } finally {
        if (!cancelled) setTaPresetLoading(false);
      }
    }

    async function loadPersonaPresets() {
      setPersonaPresetError(null);
      try {
        const res = await fetch("/api/presets/persona", { method: "GET" });
        const data = (await res.json()) as ListPresetsResponse | { message?: string };

        if (!res.ok) throw new Error((data as any)?.message || "Failed to load persona presets.");
        if (!data || !Array.isArray((data as ListPresetsResponse).presets)) {
          throw new Error("Invalid persona presets response.");
        }

        if (!cancelled) setPersonaPresets((data as ListPresetsResponse).presets);
      } catch (e: any) {
        if (!cancelled) setPersonaPresetError(e?.message || "Failed to load persona presets.");
      }
    }

    loadTaPresets();
    loadPersonaPresets();

    return () => {
      cancelled = true;
    };
  }, []);

  // Persona preset auto-apply: URL personaPresetId > localStorage
  useEffect(() => {
    if (didInitialPersonaAutoApplyRef.current) return;
    if (!personaPresets.length) return;

    const fromUrl = searchParams.get("personaPresetId")?.trim();
    if (fromUrl && personaPresets.some((p) => p.id === fromUrl)) {
      setSelectedPersonaPresetId(fromUrl);
      applyPersonaPreset(personaPresets.find((p) => p.id === fromUrl)!);
      didInitialPersonaAutoApplyRef.current = true;
      return;
    }

 let last = "";

if (typeof window !== "undefined") {
  try {
    last = localStorage.getItem(LS_LAST_PERSONA_PRESET_ID) || "";
  } catch {
    last = "";
  }
}


    if (last && personaPresets.some((p) => p.id === last)) {
      setSelectedPersonaPresetId(last);
      applyPersonaPreset(personaPresets.find((p) => p.id === last)!);
      didInitialPersonaAutoApplyRef.current = true;
      return;
    }

    didInitialPersonaAutoApplyRef.current = true;
  }, [personaPresets, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------
  // TA handlers
  // -------------------------
  const applyTaPreset = (preset: TargetAudiencePreset) => {
    setTaError(null);
    setTaResult(null);

    const next = normalizeTaForm(preset.form);
    setTaForm(next);
    setTaFeaturesInput((next.features ?? []).join(", "));
  };

  const resetTa = () => {
    setSelectedTaPresetId("");
    setTaError(null);
    setTaResult(null);
    setTaFeaturesInput("");
    setTaForm(defaultTaForm);
  };

  const handleTaInputChange =
    (field: keyof GenerateTargetAudienceRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setTaForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleTaLuxuryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaForm((prev) => ({ ...prev, luxuryLevel: e.target.value as LuxuryLevel }));
  };

  const handleTaPriceChange =
    (field: "min" | "max") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setTaForm((prev) => ({
        ...prev,
        priceRange: {
          ...(prev.priceRange ?? { min: null, max: null }),
          [field]: v === "" ? null : Number(v),
        },
      }));
    };

  const handleTaFeaturesBlur = () => {
    if (!taFeaturesInput.trim()) {
      setTaForm((prev) => ({ ...prev, features: [] }));
      return;
    }
    const features = taFeaturesInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    setTaForm((prev) => ({ ...prev, features }));
  };

  const validateTaForm = (): string | null => {
    if (!taForm.productName.trim()) return "Product name is required.";
    if (!taForm.category.trim()) return "Category is required.";
    if (!taForm.luxuryLevel) return "Luxury level is required.";

    const min = taForm.priceRange?.min;
    const max = taForm.priceRange?.max;
    if (min != null && max != null && min > max) {
      return "Min price should be less than or equal to max price.";
    }
    return null;
  };

  const submitTargetAudience = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaError(null);
    setTaResult(null);

    const v = validateTaForm();
    if (v) {
      setTaError(v);
      return;
    }

    setTaLoading(true);
    try {
      const res = await fetch("/api/generate/target-audience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taForm),
      });

      const data = (await res.json()) as GenerateTargetAudienceResponse | TargetAudienceApiError;
      if (!res.ok) {
        setTaError((data as TargetAudienceApiError).message || "Failed to generate target audience.");
        return;
      }

      setTaResult((data as GenerateTargetAudienceResponse).targetAudience);
    } catch {
      setTaError("Failed to call the API. Please try again.");
    } finally {
      setTaLoading(false);
    }
  };

  // -------------------------
  // Persona handlers
  // -------------------------
  function applyPersonaPreset(p: PersonaPreset) {
    setPersonaError(null);
    setPersonaResult(null);

    if (p.payload.numPersonas) setPersonaNum(p.payload.numPersonas);

    const ctx = p.payload.context ?? {};
    setBrandName(ctx.brandName ?? "");
    setProductName(ctx.productName ?? "");
    setCategory(ctx.category ?? "");
    setTone(ctx.tone ?? "");

    const m = p.payload.manualTargetInfo;
    setAudienceSummary(m.audienceSummary ?? "");
    setGoals(listToMultiline(m.goals));
    setPains(listToMultiline(m.pains));
    setMotivations(listToMultiline(m.motivations));
    setChannels(listToMultiline(m.preferredChannels));

    try {
      localStorage.setItem(LS_LAST_PERSONA_PRESET_ID, p.id);
    } catch {
      // ignore
    }
  }

  const resetPersona = () => {
    setPersonaError(null);
    setPersonaResult(null);

    setSelectedPersonaPresetId("");
    setPersonaNum(1);

    setBrandName("");
    setProductName("");
    setCategory("");
    setTone("");

    setAudienceSummary("");
    setGoals("");
    setPains("");
    setMotivations("");
    setChannels("");
  };

  const validatePersona = (): string | null => {
    if (![1, 2, 3].includes(personaNum)) return "numPersonas must be 1, 2, or 3.";

    const anyManual =
      audienceSummary.trim() ||
      goals.trim() ||
      pains.trim() ||
      motivations.trim() ||
      channels.trim();

    if (!anyManual) {
      return "Please fill at least one target field (e.g., audience summary).";
    }
    return null;
  };

  const submitPersona = async (e: React.FormEvent) => {
    e.preventDefault();
    setPersonaError(null);
    setPersonaResult(null);

    const v = validatePersona();
    if (v) {
      setPersonaError(v);
      return;
    }

    const payload: GeneratePersonaRequest = {
      schemaVersion: 1,
      numPersonas: personaNum,
      context: personaContext,
      manualTargetInfo: {
        audienceSummary: audienceSummary.trim() || undefined,
        goals: goals.trim() ? splitLinesToList(goals) : undefined,
        pains: pains.trim() ? splitLinesToList(pains) : undefined,
        motivations: motivations.trim() ? splitLinesToList(motivations) : undefined,
        preferredChannels: channels.trim() ? splitLinesToList(channels) : undefined,
      },
    };

    setPersonaLoading(true);
    try {
      const res = await fetch("/api/generate/persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setPersonaError(data?.message || "Failed to generate persona.");
        return;
      }
      setPersonaResult(data as GeneratePersonaResponse);
    } catch {
      setPersonaError("Failed to call the API. Please try again.");
    } finally {
      setPersonaLoading(false);
    }
  };

  // TA -> Persona apply
  const applyTargetAudienceToPersona = () => {
    if (!taResult) return;

    const manual = targetAudienceToManualTargetInfo(taResult);

    // Overwrite manual fields (simple and predictable)
    setAudienceSummary(manual.audienceSummary ?? "");
    setChannels(listToMultiline(manual.preferredChannels));

    // Optionally help context a bit (safe defaults)
    // If context.category is empty, borrow from TA input category.
    if (!category.trim() && taForm.category.trim()) setCategory(taForm.category.trim());
    if (!productName.trim() && taForm.productName.trim()) setProductName(taForm.productName.trim());

    // Clear persona result to avoid confusion
    setPersonaResult(null);
    setPersonaError(null);
  };

  // Full reset
  const resetAll = () => {
    resetTa();
    resetPersona();
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Audience & Persona Generator</h1>
          <p className="mt-2 text-sm text-slate-600">
            Generate Target Audience from product info, then generate Personas (manual-only) — with presets and one-click handoff.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetAll}
              className="rounded-xl border bg-white px-4 py-2 text-sm hover:bg-slate-100"
            >
              Reset all
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LEFT: Inputs */}
          <div className="space-y-6">
            {/* Target Audience Inputs */}
            <Section title="Step A — Target Audience (Product inputs)">
              {/* Presets */}
              <div className="rounded-xl border bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Target Audience presets</div>
                  <button
                    type="button"
                    onClick={resetTa}
                    className="rounded-lg border bg-white px-3 py-1 text-xs hover:bg-gray-100"
                  >
                    Reset
                  </button>
                </div>

                <div className="mt-2 flex gap-2">
                  <select
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                    value={selectedTaPresetId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedTaPresetId(id);
                      const p = taPresets.find((x) => x.id === id);
                      if (p) applyTaPreset(p);
                    }}
                    disabled={taPresetLoading}
                  >
                    <option value="">
                      {taPresetLoading ? "Loading presets..." : "— Select a preset —"}
                    </option>
                    {taPresets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedTaPresetId && (
                  <p className="mt-2 text-xs text-gray-700">
                    {taPresets.find((p) => p.id === selectedTaPresetId)?.description}
                  </p>
                )}

                {taPresetError && (
                  <p className="mt-2 text-sm text-red-700">
                    {taPresetError} (You can still type inputs manually.)
                  </p>
                )}
              </div>

              {taError && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {taError}
                </div>
              )}

              <form onSubmit={submitTargetAudience} className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Product name<span className="text-red-500">*</span>
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    value={taForm.productName}
                    onChange={handleTaInputChange("productName")}
                    placeholder="e.g. Eco-friendly waterproof backpack"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Category<span className="text-red-500">*</span>
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    value={taForm.category}
                    onChange={handleTaInputChange("category")}
                    placeholder="e.g. Outdoor / Beauty / Tech..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Price range (optional)</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="number"
                      className="w-full rounded-lg border px-3 py-2"
                      value={taForm.priceRange?.min ?? ""}
                      onChange={handleTaPriceChange("min")}
                      placeholder="Min"
                    />
                    <span className="text-sm text-gray-500">〜</span>
                    <input
                      type="number"
                      className="w-full rounded-lg border px-3 py-2"
                      value={taForm.priceRange?.max ?? ""}
                      onChange={handleTaPriceChange("max")}
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Luxury level<span className="text-red-500">*</span>
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    value={taForm.luxuryLevel}
                    onChange={handleTaLuxuryChange}
                  >
                    <option value="luxury">Luxury / premium</option>
                    <option value="mid">Mid-range</option>
                    <option value="budget">Budget / affordable</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Features (comma separated, optional)</label>
                  <input
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    value={taFeaturesInput}
                    onChange={(e) => setTaFeaturesInput(e.target.value)}
                    onBlur={handleTaFeaturesBlur}
                    placeholder="e.g. waterproof, eco-friendly, lightweight"
                  />
                  {taForm.features?.length ? (
                    <p className="mt-1 text-xs text-gray-500">
                      Parsed: <span className="font-mono">{taForm.features.join(", ")}</span>
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="text-sm font-medium">Colour / Style (optional)</label>
                  <input
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    value={taForm.colourStyle ?? ""}
                    onChange={handleTaInputChange("colourStyle")}
                    placeholder="e.g. Minimal, sporty, neutral colors"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Notes / Selling points (optional)</label>
                  <textarea
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    rows={3}
                    value={taForm.notes ?? ""}
                    onChange={handleTaInputChange("notes")}
                    placeholder="What makes this product special?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={taLoading}
                  className="w-full rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                  {taLoading ? "Generating..." : "Generate target audience"}
                </button>
              </form>
            </Section>

            {/* Persona Inputs */}
            <Section title="Step B — Persona (Manual-only)">
              {/* Presets */}
              <div className="rounded-xl border bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Persona presets</div>
                  <button
                    type="button"
                    onClick={resetPersona}
                    className="rounded-lg border bg-white px-3 py-1 text-xs hover:bg-gray-100"
                  >
                    Reset
                  </button>
                </div>

                {personaPresetError && (
                  <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {personaPresetError}
                  </div>
                )}

                <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center">
                  <select
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm md:flex-1"
                    value={selectedPersonaPresetId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedPersonaPresetId(id);
                      const p = personaPresets.find((x) => x.id === id);
                      if (p) applyPersonaPreset(p);
                    }}
                    disabled={!personaPresets.length}
                  >
                    {!personaPresets.length ? (
                      <option value="">Loading presets...</option>
                    ) : (
                      <>
                        <option value="">— Select a preset —</option>
                        {personaPresets.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>

                  <button
                    type="button"
                    className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-100"
                    onClick={() => selectedPersonaPreset && applyPersonaPreset(selectedPersonaPreset)}
                    disabled={!selectedPersonaPreset}
                    title="Re-apply preset to overwrite current inputs"
                  >
                    Apply
                  </button>
                </div>

                {selectedPersonaPreset && (
                  <div className="mt-2 text-xs text-gray-700">
                    <div className="font-medium">{selectedPersonaPreset.description}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {typeof selectedPersonaPreset.payload.numPersonas === "number" && (
                        <Chip># personas: {selectedPersonaPreset.payload.numPersonas}</Chip>
                      )}
                      {selectedPersonaPreset.tags?.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Handoff */}
              <div className="mt-4 rounded-xl border bg-white p-3">
                <div className="text-sm font-semibold">Handoff</div>
                <p className="mt-1 text-xs text-gray-600">
                  Use the generated Target Audience to pre-fill Persona manual inputs (no copy/paste).
                </p>

                <button
                  type="button"
                  onClick={applyTargetAudienceToPersona}
                  disabled={!taResult}
                  className="mt-3 w-full rounded-xl border bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  title={!taResult ? "Generate Target Audience first" : "Apply Target Audience to Persona inputs"}
                >
                  {taResult ? "Use Target Audience for Persona" : "Generate Target Audience first"}
                </button>
              </div>

              {personaError && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {personaError}
                </div>
              )}

              {/* Persona form */}
              <form onSubmit={submitPersona} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Brand name (optional)</label>
                    <input
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Brand"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Product name (optional)</label>
                    <input
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. Product"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category (optional)</label>
                    <input
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Fitness"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tone (optional)</label>
                    <input
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      placeholder="e.g. premium / playful / concise"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Manual target info</div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium"># Personas</label>
                    <select
                      className="rounded-lg border px-2 py-2 text-sm"
                      value={personaNum}
                      onChange={(e) => setPersonaNum(Number(e.target.value) as 1 | 2 | 3)}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Audience summary</label>
                  <textarea
                    className="mt-1 h-20 w-full rounded-lg border px-3 py-2"
                    value={audienceSummary}
                    onChange={(e) => setAudienceSummary(e.target.value)}
                    placeholder="e.g. Operations/IT managers at SMBs who need tools that save time and reduce risk"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Goals (comma or newline)</label>
                    <textarea
                      className="mt-1 h-24 w-full rounded-lg border px-3 py-2"
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      placeholder="e.g. Save time, Improve quality, Reduce risk"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Pains (comma or newline)</label>
                    <textarea
                      className="mt-1 h-24 w-full rounded-lg border px-3 py-2"
                      value={pains}
                      onChange={(e) => setPains(e.target.value)}
                      placeholder="e.g. Tool sprawl, Hard onboarding, Compliance concerns"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Motivations (comma or newline)</label>
                    <textarea
                      className="mt-1 h-24 w-full rounded-lg border px-3 py-2"
                      value={motivations}
                      onChange={(e) => setMotivations(e.target.value)}
                      placeholder="e.g. ROI clarity, Ease of use, Trusted support"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Preferred channels (comma or newline)</label>
                    <textarea
                      className="mt-1 h-24 w-full rounded-lg border px-3 py-2"
                      value={channels}
                      onChange={(e) => setChannels(e.target.value)}
                      placeholder="e.g. LinkedIn, Search, YouTube"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={personaLoading}
                  className="w-full rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                  {personaLoading ? "Generating..." : "Generate persona"}
                </button>
              </form>
            </Section>
          </div>

          {/* RIGHT: Outputs */}
          <div className="space-y-6">
            <Section title="Target Audience output">
              {!taResult && !taLoading && (
                <p className="text-sm text-gray-600">
                  Generate target audience to see the result here.
                </p>
              )}
              {taLoading && <p className="text-sm text-gray-600">AI is analysing your product...</p>}

              {taResult && (
                <div className="space-y-4">
                  <div className="rounded-xl border bg-gray-50 p-3">
                    <div className="text-sm font-semibold">Summary</div>
                    <p className="mt-1 text-sm text-gray-800">{taResult.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-xl border p-3">
                      <div className="text-xs font-semibold tracking-wide text-gray-500">AGE RANGE</div>
                      <p className="mt-2 text-sm text-gray-800">
                        {taResult.ageRange?.min != null && taResult.ageRange?.max != null
                          ? `${taResult.ageRange.min} - ${taResult.ageRange.max}`
                          : "Not specified"}
                      </p>
                    </div>
                    <div className="rounded-xl border p-3">
                      <div className="text-xs font-semibold tracking-wide text-gray-500">INCOME LEVEL</div>
                      <p className="mt-2 text-sm text-gray-800">{taResult.incomeLevel ?? "Not specified"}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border p-3">
                    <div className="text-xs font-semibold tracking-wide text-gray-500">DEMOGRAPHICS</div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-800">
                      {taResult.demographics ?? "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl border p-3">
                    <div className="text-xs font-semibold tracking-wide text-gray-500">INTERESTS</div>
                    {taResult.interests?.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {taResult.interests.map((x, i) => (
                          <Chip key={i}>{x}</Chip>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500">Not specified</p>
                    )}
                  </div>

                  <div className="rounded-xl border p-3">
                    <div className="text-xs font-semibold tracking-wide text-gray-500">PREFERRED CHANNELS</div>
                    {taResult.preferredChannels?.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {taResult.preferredChannels.map((x, i) => (
                          <Chip key={i}>{x}</Chip>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500">Not specified</p>
                    )}
                  </div>
                </div>
              )}
            </Section>

            <Section title="Persona output">
              {!personaResult && !personaLoading && (
                <p className="text-sm text-gray-600">
                  Generate persona to see the result here.
                </p>
              )}
              {personaLoading && <p className="text-sm text-gray-600">AI is generating personas...</p>}

              {personaResult && (
                <div className="space-y-4">
                  {personaResult.personas.map((p, idx) => (
                    <div key={idx} className="rounded-2xl border p-4">
                      <PersonaCard persona={p} />
                    </div>
                  ))}

                  {(personaResult.assumptions?.length ?? 0) > 0 && (
                    <div className="rounded-2xl border p-4">
                      <div className="text-sm font-semibold">Assumptions</div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                        {personaResult.assumptions!.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <details className="rounded-2xl border bg-gray-50 p-4">
                    <summary className="cursor-pointer text-sm font-semibold">Show JSON (debug)</summary>
                    <pre className="mt-3 max-h-96 overflow-auto text-xs">
                      {JSON.stringify(personaResult, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}