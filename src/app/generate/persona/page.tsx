// src/app/generate/persona/page.tsx

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { GeneratePersonaRequest, GeneratePersonaResponse, Persona } from "@/types/persona";
import type { ListPresetsResponse, PersonaPreset } from "@/types/personaPreset";

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

const LS_LAST_PRESET_ID = "persona:lastPresetId";

export default function PersonaGeneratorPage() {
  const searchParams = useSearchParams();

  // ---- presets ----
  const [presets, setPresets] = useState<PersonaPreset[]>([]);
  const [presetError, setPresetError] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");

  // avoid overriding user's edits repeatedly
  const didInitialAutoApplyRef = useRef(false);

  // context
  const [brandName, setBrandName] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");

  // manual input (ONLY)
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
    setError(null);

    if (p.payload.numPersonas) setNumPersonas(p.payload.numPersonas);

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
      localStorage.setItem(LS_LAST_PRESET_ID, p.id);
    } catch {
      // ignore
    }
  }

  function resetAll() {
    setError(null);
    setResult(null);

    setBrandName("");
    setProductName("");
    setCategory("");
    setTone("");

    setAudienceSummary("");
    setGoals("");
    setPains("");
    setMotivations("");
    setChannels("");

    setNumPersonas(1);
  }

  // fetch presets
  useEffect(() => {
    let cancelled = false;

    async function loadPresets() {
      setPresetError(null);
      try {
        const res = await fetch("/api/presets/persona", { method: "GET" });
        const data = (await res.json()) as ListPresetsResponse;

        if (!res.ok) throw new Error((data as any)?.message || "Failed to load persona presets.");
        if (!data?.presets || !Array.isArray(data.presets)) throw new Error("Invalid presets response.");

        if (!cancelled) setPresets(data.presets);
      } catch (e: any) {
        if (!cancelled) setPresetError(e?.message || "Failed to load persona presets.");
      }
    }

    loadPresets();
    return () => {
      cancelled = true;
    };
  }, []);

  // initial auto-apply: presetId > lastPresetId (Manual-only)
  useEffect(() => {
    if (didInitialAutoApplyRef.current) return;
    if (!presets.length) return;

    const presetIdFromUrl = searchParams.get("presetId")?.trim();
    if (presetIdFromUrl && presets.some((p) => p.id === presetIdFromUrl)) {
      setSelectedPresetId(presetIdFromUrl);
      applyPreset(presets.find((p) => p.id === presetIdFromUrl)!);
      didInitialAutoApplyRef.current = true;
      return;
    }

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

    didInitialAutoApplyRef.current = true;
  }, [presets, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  function validate(): string | null {
    if (![1, 2, 3].includes(numPersonas)) return "numPersonas must be 1, 2, or 3.";

    const anyManual =
      audienceSummary.trim() || goals.trim() || pains.trim() || motivations.trim() || channels.trim();

    if (!anyManual) {
      return "Please fill at least one target field (e.g., audience summary).";
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
      manualTargetInfo: {
        audienceSummary: audienceSummary.trim() || undefined,
        goals: goals.trim() ? splitLinesToList(goals) : undefined,
        pains: pains.trim() ? splitLinesToList(pains) : undefined,
        motivations: motivations.trim() ? splitLinesToList(motivations) : undefined,
        preferredChannels: channels.trim() ? splitLinesToList(channels) : undefined,
      },
    };

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
      <h1 className="text-2xl font-semibold">Persona Generator (Manual only)</h1>
      <p className="mt-2 text-sm text-gray-600">
        Manual target info only. Presets can auto-fill typical use cases. Structured JSON output is kept for future DB/links.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="rounded-2xl border p-4 shadow-sm">
          {/* Presets */}
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
                onClick={() => selectedPreset && applyPreset(selectedPreset)}
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
                  {typeof selectedPreset.payload.numPersonas === "number" && (
                    <Chip># personas: {selectedPreset.payload.numPersonas}</Chip>
                  )}
                  {selectedPreset.tags?.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Tip: open with <code>?presetId=...</code> to auto-apply.
                </p>
              </div>
            )}
          </div>

          {/* Main form */}
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

            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Manual target info</div>
              <div className="flex items-center gap-2">
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

            <div className="space-y-3">
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
                    className="mt-1 h-20 w-full rounded-lg border px-3 py-2"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    placeholder="e.g. Save time, Improve quality, Reduce risk"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Pains (comma or newline)</label>
                  <textarea
                    className="mt-1 h-20 w-full rounded-lg border px-3 py-2"
                    value={pains}
                    onChange={(e) => setPains(e.target.value)}
                    placeholder="e.g. Too many tools, Hard onboarding, Compliance concerns"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Motivations (comma or newline)</label>
                  <textarea
                    className="mt-1 h-20 w-full rounded-lg border px-3 py-2"
                    value={motivations}
                    onChange={(e) => setMotivations(e.target.value)}
                    placeholder="e.g. ROI, Ease of use, Trusted support"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Preferred channels (comma or newline)</label>
                  <textarea
                    className="mt-1 h-20 w-full rounded-lg border px-3 py-2"
                    value={channels}
                    onChange={(e) => setChannels(e.target.value)}
                    placeholder="e.g. LinkedIn, Search, YouTube"
                  />
                </div>
              </div>
            </div>

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
              Fill the form (or apply a preset) and generate persona. The result will appear here as normal cards.
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

              {/* Debug JSON */}
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
