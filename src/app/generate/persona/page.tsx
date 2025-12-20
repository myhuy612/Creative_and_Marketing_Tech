// src/app/generate/persona/page.tsx

"use client";

import { useMemo, useState } from "react";
import type {
  GeneratePersonaRequest,
  GeneratePersonaResponse,
  Persona,
  TargetAudience,
} from "@/types/persona";

type Mode = "targetAudienceJson" | "manual";

function splitLinesToList(s: string): string[] {
  return s
    .split(/\r?\n|,/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 20);
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
  const [mode, setMode] = useState<Mode>("targetAudienceJson");

  // context
  const [brandName, setBrandName] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");

  // TargetAudience JSON input
  const [targetAudienceJson, setTargetAudienceJson] = useState<string>(
    `{
  "summary": "Young professionals who value convenience and quality",
  "ageRange": { "min": 25, "max": 35 },
  "incomeLevel": "Mid to upper-mid",
  "demographics": "Urban, time-poor, research-driven buyers",
  "interests": ["tech", "fitness", "travel"],
  "preferredChannels": ["Instagram", "TikTok", "YouTube"]
}`
  );

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
      if (!anyManual) return "Manual mode: please fill at least one target field (e.g., audience summary).";
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
        Generate personas from TargetAudience JSON or manual target inputs. The UI shows normal cards, while structured JSON is kept for future DB/links.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="rounded-2xl border p-4 shadow-sm">
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
                <pre className="mt-2 max-h-80 overflow-auto text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
