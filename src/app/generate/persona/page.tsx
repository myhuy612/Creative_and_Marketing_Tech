// src/app/generate/persona/page.tsx

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  GeneratePersonaRequest,
  GeneratePersonaResponse,
  Persona,
  TargetAudience,
} from "@/types/persona";
import type { ListPresetsResponse, PersonaPreset } from "@/types/personaPreset";

type Mode = "targetAudienceJson" | "manual";

const LS_LAST_PRESET_ID = "persona:lastPresetId";

// Keep your original default JSON template so "Reset" doesn't break your current UX
const DEFAULT_TA_JSON = `{
  "summary": "Young professionals who value convenience and quality",
  "ageRange": { "min": 25, "max": 35 },
  "incomeLevel": "Mid to upper-mid",
  "demographics": "Urban, time-poor, research-driven buyers",
  "interests": ["tech", "fitness", "travel"],
  "preferredChannels": ["Instagram", "TikTok", "YouTube"]
}`;

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

function safeJsonStringify(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return "";
  }
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
    <div className="rounded-xl border p-3">
      <div className="text-xs font-semibold tracking-wide text-gray-500">{title.toUpperCase()}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function PersonaView({ persona }: { persona: Persona }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="rounded-xl border bg-gray-50 p-3">
        <div className="text-sm font-semibold">{persona.personaName}</div>
        <div className="mt-1 text-sm text-gray-700">{persona.tagline}</div>
      </div>

      <Section title="Demographics">
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{persona.demographics}</p>
      </Section>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Section title="Goals">
          {persona.goals?.length ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
              {persona.goals.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">—</p>
          )}
        </Section>

        <Section title="Pains">
          {persona.pains?.length ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
              {persona.pains.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">—</p>
          )}
        </Section>

        <Section title="Motivations">
          {persona.motivations?.length ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
              {persona.motivations.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">—</p>
          )}
        </Section>

        <Section title="Recommended tone">
          {persona.recommendedTone?.trim() ? (
            <div className="flex flex-wrap gap-2">
              <Chip>{persona.recommendedTone}</Chip>
            </div>
          ) : (
            <p className="text-sm text-gray-500">—</p>
          )}
        </Section>
      </div>

      <Section title="Preferred channels">
        {persona.channels?.length ? (
          <div className="flex flex-wrap gap-2">
            {persona.channels.map((x, i) => (
              <Chip key={i}>{x}</Chip>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">—</p>
        )}
      </Section>

      <Section title="Key message">
        {persona.keyMessage?.trim() ? (
          <p className="text-sm font-medium text-gray-800 whitespace-pre-wrap">{persona.keyMessage}</p>
        ) : (
          <p className="text-sm text-gray-500">—</p>
        )}
      </Section>

      <Section title="Objections">
        {persona.objections?.length ? (
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
            {persona.objections.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">—</p>
        )}
      </Section>
    </div>
  );
}

export default function PersonaGeneratorPage() {
  const searchParams = useSearchParams();

  // -------- Presets (NEW) --------
  const [presets, setPresets] = useState<PersonaPreset[]>([]);
  const [presetError, setPresetError] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");

  // avoid overriding user edits repeatedly
  const didInitialAutoApplyRef = useRef(false);

  // -------- Existing state (KEEP) --------
  const [mode, setMode] = useState<Mode>("targetAudienceJson");

  // context
  const [brandName, setBrandName] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");

  // TargetAudience JSON input
  const [targetAudienceJson, setTargetAudienceJson] = useState<string>(DEFAULT_TA_JSON);

  // manual input
  const [audienceSummary, setAudienceSummary] = useState("");
  const [goals, setGoals] = useState("");
  const [pains, setPains] = useState("");
  const [motivations, setMotivations] = useState("");
  const [channels, setChannels] = useState("");

  const [numPersonas, setNumPersonas] = useState<1 | 2 | 3>(1);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratePersonaResponse | null>(null);

  const context = useMemo<GeneratePersonaRequest["context"]>(() => {
    const ctx: GeneratePersonaRequest["context"] = {};
    if (brandName.trim()) ctx.brandName = brandName.trim();
    if (productName.trim()) ctx.productName = productName.trim();
    if (category.trim()) ctx.category = category.trim();
    if (tone.trim()) ctx.tone = tone.trim();
    return ctx;
  }, [brandName, productName, category, tone]);

  const selectedPreset = useMemo(
    () => presets.find((p) => p.id === selectedPresetId) || null,
    [presets, selectedPresetId]
  );

  function applyPreset(p: PersonaPreset) {
    // Do NOT clear result automatically; user may want to compare; but keep errors clean
    setError(null);

    // Mode & number
    setMode(p.mode);
    if (p.payload.numPersonas) setNumPersonas(p.payload.numPersonas);

    // Context mapping (preserve existing UX: these are editable)
    const ctx = p.payload.context ?? {};
    setBrandName(ctx.brandName ?? "");
    setProductName(ctx.productName ?? "");
    setCategory(ctx.category ?? "");
    setTone(ctx.tone ?? "");

    // Data mapping
    if (p.mode === "targetAudienceJson") {
      const ta = p.payload.targetAudience ?? { summary: "" };
      setTargetAudienceJson(safeJsonStringify(ta));

      // clear manual fields to avoid confusion
      setAudienceSummary("");
      setGoals("");
      setPains("");
      setMotivations("");
      setChannels("");
    } else {
      const m = p.payload.manualTargetInfo ?? {};
      setAudienceSummary(m.audienceSummary ?? "");
      setGoals(listToMultiline(m.goals));
      setPains(listToMultiline(m.pains));
      setMotivations(listToMultiline(m.motivations));
      setChannels(listToMultiline(m.preferredChannels));

      // clear TA JSON to avoid confusion (keeps validation sane)
      setTargetAudienceJson("");
    }

    // persist last used preset id
    try {
      localStorage.setItem(LS_LAST_PRESET_ID, p.id);
    } catch {
      // ignore
    }
  }

  function resetAll() {
    // Keep behavior safe: reset inputs without breaking existing logic
    setError(null);
    setResult(null);

    setMode("targetAudienceJson");

    setBrandName("");
    setProductName("");
    setCategory("");
    setTone("");

    setTargetAudienceJson(DEFAULT_TA_JSON);

    setAudienceSummary("");
    setGoals("");
    setPains("");
    setMotivations("");
    setChannels("");

    setNumPersonas(1);
  }

  function applyTargetAudienceFromSessionKey(taKey: string) {
    // Future integration path (Target Audience page -> persona page):
    // sessionStorage.setItem(`ta:${taKey}`, JSON.stringify(targetAudienceObj))
    try {
      const raw = sessionStorage.getItem(`ta:${taKey}`);
      if (!raw) return false;

      const obj = JSON.parse(raw) as TargetAudience;
      if (!obj?.summary || typeof obj.summary !== "string") return false;

      setMode("targetAudienceJson");
      setTargetAudienceJson(safeJsonStringify(obj));

      // clear manual fields
      setAudienceSummary("");
      setGoals("");
      setPains("");
      setMotivations("");
      setChannels("");

      return true;
    } catch {
      return false;
    }
  }

  // -------- Presets fetch (NEW) --------
  useEffect(() => {
    let cancelled = false;

    async function loadPresets() {
      setPresetError(null);
      try {
        const res = await fetch("/api/presets/persona", { method: "GET" });
        const data = (await res.json()) as ListPresetsResponse;

        if (!res.ok) {
          throw new Error((data as any)?.message || "Failed to load persona presets.");
        }
        if (!data?.presets || !Array.isArray(data.presets)) {
          throw new Error("Invalid presets response.");
        }

        if (!cancelled) {
          setPresets(data.presets);
        }
      } catch (e: any) {
        if (!cancelled) setPresetError(e?.message || "Failed to load persona presets.");
      }
    }

    loadPresets();
    return () => {
      cancelled = true;
    };
  }, []);

  // -------- Initial auto apply (NEW) --------
  useEffect(() => {
    if (didInitialAutoApplyRef.current) return;

    // Always allow taKey without requiring presets loaded
    const taKey = searchParams.get("taKey")?.trim();
    if (taKey) {
      const ok = applyTargetAudienceFromSessionKey(taKey);
      if (ok) {
        didInitialAutoApplyRef.current = true;
        return;
      }
    }

    if (!presets.length) return;

    // priority: presetId in URL
    const presetIdFromUrl = searchParams.get("presetId")?.trim();
    if (presetIdFromUrl && presets.some((p) => p.id === presetIdFromUrl)) {
      setSelectedPresetId(presetIdFromUrl);
      applyPreset(presets.find((p) => p.id === presetIdFromUrl)!);
      didInitialAutoApplyRef.current = true;
      return;
    }

    // then last used preset
    let last = "";
    try {
      last = localStorage.getItem(LS_LAST_PRESET_ID) || "";
    } catch {
      last = "";
    }
    if (last && presets.some((p) => p.id === last)) {
      setSelectedPresetId(last);
      applyPreset(presets.find((p) => p.id === last)!);
      didInitialAutoApplyRef.current = true;
      return;
    }

    // else do nothing (keep your current default UX)
    // You can optionally auto-select first preset if you want:
    // const first = presets[0];
    // setSelectedPresetId(first.id);
    // applyPreset(first);

    didInitialAutoApplyRef.current = true;
  }, [presets, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  function validate(): string | null {
    if (![1, 2, 3].includes(numPersonas)) return "numPersonas must be 1, 2, or 3.";

    if (mode === "targetAudienceJson") {
      try {
        const obj = JSON.parse(targetAudienceJson) as TargetAudience;
        if (!obj?.summary || typeof obj.summary !== "string") {
          return "TargetAudience JSON must include a summary (string).";
        }
      } catch {
        return "TargetAudience JSON is not valid JSON.";
      }
    } else {
      const anyManual =
        audienceSummary.trim() ||
        goals.trim() ||
        pains.trim() ||
        motivations.trim() ||
        channels.trim();
      if (!anyManual)
        return "Manual mode: please fill at least one target field (e.g., audience summary).";
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    const payload: GeneratePersonaRequest = {
      schemaVersion: 1,
      numPersonas,
      context,
    };

    if (mode === "targetAudienceJson") {
      payload.targetAudience = JSON.parse(targetAudienceJson);
    } else {
      payload.manualTargetInfo = {
        audienceSummary: audienceSummary.trim() || undefined,
        goals: goals.trim() ? splitLinesToList(goals) : undefined,
        pains: pains.trim() ? splitLinesToList(pains) : undefined,
        motivations: motivations.trim() ? splitLinesToList(motivations) : undefined,
        preferredChannels: channels.trim() ? splitLinesToList(channels) : undefined,
      };
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/generate/persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to generate persona.");
        return;
      }
      setResult(data as GeneratePersonaResponse);
    } catch {
      setError("Failed to call the API. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Persona Generator (Stage 0)</h1>
      <p className="mt-2 text-sm text-gray-600">
        Generate personas from TargetAudience JSON or manual target inputs. The UI shows normal cards, while
        structured JSON is kept for future DB/links.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="rounded-2xl border p-4 shadow-sm">
          {/* -------- Presets UI (NEW, non-breaking) -------- */}
          <div className="mb-4 space-y-2 rounded-xl border bg-gray-50 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Persona presets</div>
              <button
                type="button"
                onClick={resetAll}
                className="rounded-lg border bg-white px-3 py-1 text-xs hover:bg-gray-100"
              >
                Reset
              </button>
            </div>

            {presetError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {presetError}
              </div>
            )}

            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <select
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm md:flex-1"
                value={selectedPresetId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedPresetId(id);
                  const p = presets.find((x) => x.id === id);
                  if (p) applyPreset(p);
                }}
                disabled={!presets.length}
              >
                {!presets.length ? (
                  <option value="">Loading presets...</option>
                ) : (
                  <>
                    <option value="">— Select a preset —</option>
                    {presets.map((p) => (
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
                onClick={() => {
                  if (selectedPreset) applyPreset(selectedPreset);
                }}
                disabled={!selectedPreset}
                title="Re-apply preset to overwrite current inputs"
              >
                Apply
              </button>
            </div>

            {selectedPreset && (
              <div className="text-xs text-gray-700">
                <div className="font-medium">{selectedPreset.description}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Chip>mode: {selectedPreset.mode}</Chip>
                  {typeof selectedPreset.payload.numPersonas === "number" && (
                    <Chip># personas: {selectedPreset.payload.numPersonas}</Chip>
                  )}
                  {selectedPreset.tags?.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Tip: open with <code>?presetId=...</code> to auto-apply. For Target Audience linking use{" "}
                  <code>?taKey=...</code> (reads from sessionStorage).
                </p>
              </div>
            )}
          </div>

          {/* -------- Existing form (KEEP) -------- */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Brand name (optional)</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Nike"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Product name (optional)</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Waterproof Jacket"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category (optional)</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Outdoor"
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

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">Input mode:</span>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={mode === "targetAudienceJson"}
                  onChange={() => setMode("targetAudienceJson")}
                />
                TargetAudience JSON
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={mode === "manual"} onChange={() => setMode("manual")} />
                Manual target info
              </label>

              <div className="ml-auto flex items-center gap-2">
                <label className="text-sm font-medium"># Personas</label>
                <select
                  className="rounded-lg border px-2 py-2 text-sm"
                  value={numPersonas}
                  onChange={(e) => setNumPersonas(Number(e.target.value) as 1 | 2 | 3)}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>
            </div>

            {mode === "targetAudienceJson" ? (
              <div>
                <label className="text-sm font-medium">TargetAudience JSON</label>
                <textarea
                  className="mt-1 h-56 w-full rounded-lg border px-3 py-2 font-mono text-xs"
                  value={targetAudienceJson}
                  onChange={(e) => setTargetAudienceJson(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Paste output from Target Audience Generator (must include at least <code>summary</code>).
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Audience summary</label>
                  <textarea
                    className="mt-1 h-20 w-full rounded-lg border px-3 py-2"
                    value={audienceSummary}
                    onChange={(e) => setAudienceSummary(e.target.value)}
                    placeholder="e.g. Female in her 20s who loves athleisure and cares about comfort + style"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Goals (comma or newline)</label>
                    <textarea
                      className="mt-1 h-20 w-full rounded-lg border px-3 py-2"
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      placeholder="e.g. Stay active, Look stylish, Buy durable"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Pains (comma or newline)</label>
                    <textarea
                      className="mt-1 h-20 w-full rounded-lg border px-3 py-2"
                      value={pains}
                      onChange={(e) => setPains(e.target.value)}
                      placeholder="e.g. Too bulky, Uncomfortable, Hard to find good fit"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Motivations (comma or newline)</label>
                    <textarea
                      className="mt-1 h-20 w-full rounded-lg border px-3 py-2"
                      value={motivations}
                      onChange={(e) => setMotivations(e.target.value)}
                      placeholder="e.g. Reviews, Brand trust, Long-term value"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Preferred channels (comma or newline)</label>
                    <textarea
                      className="mt-1 h-20 w-full rounded-lg border px-3 py-2"
                      value={channels}
                      onChange={(e) => setChannels(e.target.value)}
                      placeholder="e.g. Instagram, TikTok, YouTube"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate Persona"}
            </button>
          </form>
        </div>

        {/* Right: Result */}
        <div className="rounded-2xl border p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Persona output</h2>

          {!result && !isLoading && (
            <p className="mt-2 text-sm text-gray-600">
              Fill the form and generate persona. The result will appear here as normal cards.
            </p>
          )}

          {isLoading && <p className="mt-2 text-sm text-gray-600">AI is generating personas...</p>}

          {result && (
            <div className="mt-3 space-y-4">
              {result.personas.map((p, idx) => (
                <div key={idx} className="rounded-2xl border p-4">
                  <PersonaView persona={p} />
                </div>
              ))}

              {(result.assumptions?.length ?? 0) > 0 && (
                <Section title="Assumptions">
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                    {result.assumptions!.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Debug JSON (kept for DB / integration needs) */}
              <details className="rounded-xl border bg-gray-50 p-3">
                <summary className="cursor-pointer text-sm font-medium">Show JSON (debug)</summary>
                <pre className="mt-2 max-h-80 overflow-auto text-xs">{JSON.stringify(result, null, 2)}</pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
