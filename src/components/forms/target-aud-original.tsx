// src/app/generate/product-target-audience/page.tsx
"use client";

import React, { useEffect, useState, FormEvent } from "react";
import {
  GenerateTargetAudienceRequest,
  TargetAudience,
  LuxuryLevel,
  GenerateTargetAudienceResponse,
  ApiErrorResponse,
} from "@/types/targetAudience";

import type {
  TargetAudiencePreset,
  ListTargetAudiencePresetsResponse,
} from "@/types/targetAudiencePreset";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const defaultForm: GenerateTargetAudienceRequest = {
  productName: "",
  category: "",
  priceRange: {
    min: null,
    max: null,
  },
  luxuryLevel: "mid",
  features: [],
  colourStyle: "",
  notes: "",
};

function normalizeForm(
  input: Partial<GenerateTargetAudienceRequest>
): GenerateTargetAudienceRequest {
  return {
    ...defaultForm,
    ...input,
    priceRange: input.priceRange ?? { min: null, max: null },
    features: input.features ?? [],
    colourStyle: input.colourStyle ?? "",
    notes: input.notes ?? "",
  };
}

export default function ProductTargetAudiencePage() {
  const [form, setForm] = useState<GenerateTargetAudienceRequest>(defaultForm);
  const [featuresInput, setFeaturesInput] = useState(""); // For comma-separated input
  const [isLoading, setIsLoading] = useState(false);
  const [targetAudience, setTargetAudience] = useState<TargetAudience | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Presets (DB導入前提：今はAPIから静的プリセット取得)
  const [presets, setPresets] = useState<TargetAudiencePreset[]>([]);
  const [presetLoading, setPresetLoading] = useState(false);
  const [presetError, setPresetError] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");

  // ------------------------------
  // Load presets (client-side)
  // ------------------------------
  useEffect(() => {
    let cancelled = false;

    async function loadPresets() {
      setPresetLoading(true);
      setPresetError(null);

      try {
        const res = await fetch("/api/presets/target-audience", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = (await res.json()) as
          | ListTargetAudiencePresetsResponse
          | ApiErrorResponse;

        if (!res.ok) {
          throw new Error(
            (data as ApiErrorResponse).message || "Failed to load presets."
          );
        }

        if (!cancelled) {
          setPresets((data as ListTargetAudiencePresetsResponse).presets ?? []);
        }
      } catch (e) {
        if (!cancelled) {
          setPresetError(
            e instanceof Error ? e.message : "Failed to load presets."
          );
        }
      } finally {
        if (!cancelled) setPresetLoading(false);
      }
    }

    loadPresets();

    return () => {
      cancelled = true;
    };
  }, []);

  // ------------------------------
  // Preset apply/reset
  // ------------------------------
  const applyPreset = (preset: TargetAudiencePreset) => {
    // 既存の生成結果/エラーをクリア（体験が分かりやすい）
    setError(null);
    setTargetAudience(null);

    const next = normalizeForm(preset.form);
    setForm(next);
    setFeaturesInput((next.features ?? []).join(", "));
  };

  const resetFormToDefault = () => {
    setSelectedPresetId("");
    setError(null);
    setTargetAudience(null);
    setFeaturesInput("");
    setForm(defaultForm);
  };

  // ------------------------------
  // Handlers: update form state
  // ------------------------------
  const handleInputChange =
    (field: keyof GenerateTargetAudienceRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };

  const handleLuxuryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      luxuryLevel: e.target.value as LuxuryLevel,
    }));
  };

  const handlePriceChange =
    (field: "min" | "max") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({
        ...prev,
        // priceRange が未定義でも落ちないように保険
        priceRange: {
          ...(prev.priceRange ?? { min: null, max: null }),
          [field]: value === "" ? null : Number(value),
        },
      }));
    };

  const handleFeaturesBlur = () => {
    // 既存実装を壊さないようにしつつ、空入力のときは features を空に戻せるようにする
    if (!featuresInput.trim()) {
      setForm((prev) => ({ ...prev, features: [] }));
      return;
    }
    const features = featuresInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    setForm((prev) => ({
      ...prev,
      features,
    }));
  };

  // ------------------------------
  // Validation (client-side)
  // ------------------------------
  const validateForm = (): string | null => {
    if (!form.productName.trim()) return "Product name is required.";
    if (!form.category.trim()) return "Category is required.";
    if (!form.luxuryLevel) return "Luxury level is required.";

    const min = form.priceRange?.min;
    const max = form.priceRange?.max;
    if (min != null && max != null && min > max) {
      return "Min price should be less than or equal to max price.";
    }
    return null;
  };

  // ------------------------------
  // Submit handler
  // ------------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setTargetAudience(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/generate/target-audience", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as
        | GenerateTargetAudienceResponse
        | ApiErrorResponse;

      if (!res.ok) {
        setError((data as ApiErrorResponse).message || "Unknown error.");
        return;
      }

      setTargetAudience(
        (data as GenerateTargetAudienceResponse).targetAudience
      );
    } catch (err) {
      console.error(err);
      setError("Failed to call the API. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-b from-[#fff7ef] via-[#ffe9d4] to-[#ffd9b3] text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline leading-tight tracking-tighter text-slate-900">
              Product Target Audience
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Enter product information and let AI infer an ideal target audience
              for your marketing.
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
          {/* Left: form */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Product information
            </h2>

            {/* Presets */}
            <div className="mb-4 rounded-lg border border-orange-200 bg-white p-4">
              <label className="block text-sm font-medium text-slate-700">
                Preset (optional)
              </label>

              <div className="mt-2 flex gap-2">
                <select
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  value={selectedPresetId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedPresetId(id);

                    const preset = presets.find((p) => p.id === id);
                    if (preset) applyPreset(preset);
                    // 未選択に戻した場合は何もしない（手入力を残す）
                  }}
                  disabled={presetLoading}
                >
                  <option value="">
                    {presetLoading ? "Loading presets..." : "Select a preset"}
                  </option>
                  {presets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100"
                  onClick={resetFormToDefault}
                >
                  Reset
                </button>
              </div>

              {selectedPresetId && (
                <p className="mt-2 text-xs text-slate-600">
                  {presets.find((p) => p.id === selectedPresetId)?.description}
                </p>
              )}

              {presetError && (
                <p className="mt-2 text-sm text-red-600">
                  {presetError} (You can still type inputs manually.)
                </p>
              )}
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Product name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Product name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.productName}
                  onChange={handleInputChange("productName")}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Eco-friendly waterproof backpack"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Category<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={handleCategoryChange}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Fashion, Gadget, Home, Beauty..."
                />
              </div>

              {/* Price range */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Price range (optional)
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    value={form.priceRange?.min ?? ""}
                    onChange={handlePriceChange("min")}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Min"
                  />
                  <span className="text-sm text-slate-500">〜</span>
                  <input
                    type="number"
                    value={form.priceRange?.max ?? ""}
                    onChange={handlePriceChange("max")}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Luxury level */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Luxury level<span className="text-red-500">*</span>
                </label>
                <select
                  value={form.luxuryLevel}
                  onChange={handleLuxuryChange}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="luxury">Luxury / premium</option>
                  <option value="mid">Mid-range</option>
                  <option value="budget">Budget / affordable</option>
                </select>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Features (comma separated, optional)
                </label>
                <input
                  type="text"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  onBlur={handleFeaturesBlur}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. waterproof, eco-friendly, lightweight"
                />
                {form.features && form.features.length > 0 && (
                  <p className="mt-1 text-xs text-slate-500">
                    Parsed features:{" "}
                    <span className="font-mono">
                      {form.features.join(", ")}
                    </span>
                  </p>
                )}
              </div>

              {/* Colour / style */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Colour / Style (optional)
                </label>
                <input
                  type="text"
                  value={form.colourStyle ?? ""}
                  onChange={handleInputChange("colourStyle")}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Red, minimal, sporty"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Notes / Selling points (optional)
                </label>
                <textarea
                  value={form.notes ?? ""}
                  onChange={handleInputChange("notes")}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="What makes this product special?"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    w-full rounded-full px-6 py-3 text-base font-semibold
                    bg-[hsl(var(--primary))] text-white
                    shadow-[0_8px_24px_rgba(255,115,0,0.35)]
                    transition-all duration-200
                    hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(255,115,0,0.45)]
                    disabled:cursor-not-allowed disabled:opacity-70
                  "
                >
                  {isLoading ? "Generating..." : "Generate target audience"}
                </button>
              </div>
            </form>
          </section>

          {/* Right: result panel */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Target audience
            </h2>

            {!targetAudience && !isLoading && (
              <p className="text-sm text-slate-500">
                Fill in the product information on the left and click
                &quot;Generate target audience&quot; to see the result here.
              </p>
            )}

            {isLoading && (
              <p className="text-sm text-slate-500">
                AI is analysing your product...
              </p>
            )}

            {targetAudience && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-medium text-slate-700">Summary</p>
                  <p className="mt-1 text-sm text-slate-900">
                    {targetAudience.summary}
                  </p>
                </div>

                {/* Age & income */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Age range
                    </p>
                    <p className="mt-1 text-sm text-slate-900">
                      {targetAudience.ageRange?.min != null &&
                      targetAudience.ageRange?.max != null
                        ? `${targetAudience.ageRange.min} - ${targetAudience.ageRange.max}`
                        : "Not specified"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Income level
                    </p>
                    <p className="mt-1 text-sm text-slate-900">
                      {targetAudience.incomeLevel ?? "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Demographics */}
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Demographics
                  </p>
                  <p className="mt-1 text-sm text-slate-900 whitespace-pre-line">
                    {targetAudience.demographics ?? "Not specified"}
                  </p>
                </div>

                {/* Interests */}
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Interests
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {targetAudience.interests &&
                    targetAudience.interests.length > 0 ? (
                      targetAudience.interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">Not specified</p>
                    )}
                  </div>
                </div>

                {/* Channels */}
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Preferred channels
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {targetAudience.preferredChannels &&
                    targetAudience.preferredChannels.length > 0 ? (
                      targetAudience.preferredChannels.map((channel) => (
                        <span
                          key={channel}
                          className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs text-indigo-700"
                        >
                          {channel}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">Not specified</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}

