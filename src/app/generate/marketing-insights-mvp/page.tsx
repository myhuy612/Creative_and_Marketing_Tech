"use client";

import { useMemo, useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

type InsightMetrics = {
  views: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
};

type InsightRequest = {
  brandName: string;
  productName: string;
  category: string;
  priceMin?: number | null;
  priceMax?: number | null;
  luxuryLevel: "Budget" | "Mid-range" | "Premium";
  marketingStyle: string;
  brandTone: "Friendly" | "Professional" | "Witty";
  platform: string;
  contentType: string;
  campaignObjective: string;
  keywords: string;
  features: string;
  colorStyle: string;
  notesSellingPoints: string;

  // "Use results from generate text/image"
  generatedText?: string;
  generatedImageUrl?: string;
};

const MOCK: InsightMetrics = {
  views: 7818,
  reach: 6654,
  likes: 224,
  comments: 12,
  shares: 12,
  saves: 15,
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatNumber(n: number) {
  return n.toLocaleString();
}

function metricLabel(key: keyof InsightMetrics) {
  switch (key) {
    case "views":
      return "Views";
    case "reach":
      return "User Reached";
    case "likes":
      return "Likes";
    case "comments":
      return "Comments";
    case "shares":
      return "Shares";
    case "saves":
      return "Saves";
  }
}

function MetricBar({
  label,
  value,
  maxValue,
  size = "md",
}: {
  label: string;
  value: number;
  maxValue: number;
  size?: "sm" | "md" | "lg";
}) {
  const pct = maxValue <= 0 ? 0 : clamp((value / maxValue) * 100, 0, 100);

  const trackHeight =
    size === "sm" ? "h-2" : size === "lg" ? "h-5" : "h-3";
  const textSize =
    size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  return (
    <div className={size === "sm" ? "space-y-1.5" : "space-y-2"}>
      <div className="flex items-baseline justify-between">
        <p className={`${textSize} font-medium`}>{label}</p>
        <p className={`${textSize} text-muted-foreground`}>
          {formatNumber(value)}
        </p>
      </div>

      <div className={`${trackHeight} w-full rounded-full bg-black/5 overflow-hidden`}>
        <div
          className={`${trackHeight} rounded-full bg-[hsl(var(--primary))]`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function MarketingInsightMVPPage() {
  const [chartSize, setChartSize] = useState<"sm" | "md" | "lg">("md");
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<InsightMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<InsightRequest>({
    brandName: "Nike",
    productName: "Sport shoes",
    category: "Sport",
    priceMin: 1000,
    priceMax: 2000,
    luxuryLevel: "Mid-range",
    marketingStyle: "Clean",
    brandTone: "Professional",
    platform: "Instagram",
    contentType: "Instagram Caption",
    campaignObjective: "Improve selling",
    keywords: "#sport #shoes #nike #running",
    features: "best performance for jogging shoes",
    colorStyle: "Various",
    notesSellingPoints: "comfortable for daily but perform for sport",
    generatedText: "",
    generatedImageUrl: "",
  });

  const rightPanelClass = useMemo(() => {
    if (chartSize === "sm") return "min-h-[360px]";
    if (chartSize === "lg") return "min-h-[620px]";
    return "min-h-[480px]";
  }, [chartSize]);

  const shown = metrics ?? MOCK;

  const maxValue = useMemo(() => {
    return Math.max(
      shown.views,
      shown.reach,
      shown.likes,
      shown.comments,
      shown.shares,
      shown.saves,
      1
    );
  }, [shown]);

  async function generateInsights() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate/marketing-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = (await res.json()) as Partial<InsightMetrics>;

      const next: InsightMetrics = {
        views: Number(data.views ?? MOCK.views),
        reach: Number(data.reach ?? MOCK.reach),
        likes: Number(data.likes ?? MOCK.likes),
        comments: Number(data.comments ?? MOCK.comments),
        shares: Number(data.shares ?? MOCK.shares),
        saves: Number(data.saves ?? MOCK.saves),
      };

      setMetrics(next);
    } catch (e: any) {
      setMetrics(MOCK);
      setError(
        e?.message
          ? `${e.message} — showing mock data`
          : "Failed — showing mock data"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-b from-[#fff7ef] via-[#ffe9d4] to-[#ffd9b3] text-foreground">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          {/* PAGE HEADER */}
          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline leading-tight tracking-tighter text-slate-900">
              Marketing Insights (MVP)
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              More detailed inputs (product + pricing + tone) to preview the same
              6 engagement metrics.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* LEFT: FORM */}
            <div className="lg:col-span-5 rounded-2xl bg-white p-6 shadow-sm border border-border/50">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-900">Inputs</h2>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">
                    Chart size
                  </label>
                  <select
                    className="h-9 rounded-lg border border-border/50 bg-white px-3 text-sm focus:border-orange-500 focus:outline-none"
                    value={chartSize}
                    onChange={(e) =>
                      setChartSize(e.target.value as "sm" | "md" | "lg")
                    }
                  >
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      Brand Name
                    </label>
                    <input
                      className="mt-2 w-full rounded-xl border border-border/50 px-3 py-2 text-sm bg-white focus:border-orange-500 focus:outline-none"
                      value={form.brandName}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, brandName: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      Product Name
                    </label>
                    <input
                      className="mt-2 w-full rounded-xl border border-border/50 px-3 py-2 text-sm bg-white focus:border-orange-500 focus:outline-none"
                      value={form.productName}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, productName: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      Platform
                    </label>
                    <input
                      className="mt-2 w-full rounded-xl border border-border/50 px-3 py-2 text-sm bg-white focus:border-orange-500 focus:outline-none"
                      value={form.platform}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, platform: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      Content Type
                    </label>
                    <input
                      className="mt-2 w-full rounded-xl border border-border/50 px-3 py-2 text-sm bg-white focus:border-orange-500 focus:outline-none"
                      value={form.contentType}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, contentType: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      Category
                    </label>
                    <input
                      className="mt-2 w-full rounded-xl border border-border/50 px-3 py-2 text-sm bg-white focus:border-orange-500 focus:outline-none"
                      value={form.category}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, category: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      Price Min
                    </label>
                    <input
                      type="number"
                      className="mt-2 w-full rounded-xl border border-border/50 px-3 py-2 text-sm bg-white focus:border-orange-500 focus:outline-none"
                      value={form.priceMin ?? ""}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          priceMin:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      Price Max
                    </label>
                    <input
                      type="number"
                      className="mt-2 w-full rounded-xl border border-border/50 px-3 py-2 text-sm bg-white focus:border-orange-500 focus:outline-none"
                      value={form.priceMax ?? ""}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          priceMax:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      Brand Tone
                    </label>
                    <select
                      className="mt-2 h-10 w-full rounded-xl border border-border/50 bg-white px-3 text-sm focus:border-orange-500 focus:outline-none"
                      value={form.brandTone}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          brandTone: e.target.value as InsightRequest["brandTone"],
                        }))
                      }
                    >
                      <option value="Friendly">Friendly</option>
                      <option value="Professional">Professional</option>
                      <option value="Witty">Witty</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      Luxury Level
                    </label>
                    <select
                      className="mt-2 h-10 w-full rounded-xl border border-border/50 bg-white px-3 text-sm focus:border-orange-500 focus:outline-none"
                      value={form.luxuryLevel}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          luxuryLevel:
                            e.target.value as InsightRequest["luxuryLevel"],
                        }))
                      }
                    >
                      <option value="Budget">Budget</option>
                      <option value="Mid-range">Mid-range</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">
                    Campaign Objective
                  </label>
                  <textarea
                    className="mt-2 w-full rounded-xl border border-border/50 px-3 py-2 text-sm bg-white focus:border-orange-500 focus:outline-none"
                    rows={2}
                    value={form.campaignObjective}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        campaignObjective: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">
                    Keywords / Hashtags
                  </label>
                  <input
                    className="mt-2 w-full rounded-xl border border-border/50 px-3 py-2 text-sm bg-white focus:border-orange-500 focus:outline-none"
                    value={form.keywords}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, keywords: e.target.value }))
                    }
                  />
                </div>

                {/* Generated outputs */}
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      Generated Text (paste output)
                    </label>
                    <textarea
                      className="mt-2 w-full rounded-xl border border-border/50 px-3 py-2 text-sm bg-white focus:border-orange-500 focus:outline-none"
                      rows={4}
                      value={form.generatedText ?? ""}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, generatedText: e.target.value }))
                      }
                      placeholder="Paste generated caption/blog/ad copy here…"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      Generated Image URL (paste output)
                    </label>
                    <input
                      className="mt-2 w-full rounded-xl border border-border/50 px-3 py-2 text-sm bg-white focus:border-orange-500 focus:outline-none"
                      value={form.generatedImageUrl ?? ""}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          generatedImageUrl: e.target.value,
                        }))
                      }
                      placeholder="https://…"
                    />
                  </div>
                </div>

                <button
                  onClick={generateInsights}
                  disabled={loading}
                  className="
                    mt-2 w-full rounded-full py-4 text-lg font-semibold text-white
                    bg-[hsl(var(--primary))]
                    shadow-[0_8px_24px_rgba(255,115,0,0.35)]
                    transition-all duration-200
                    hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(255,115,0,0.45)]
                    disabled:opacity-60 disabled:cursor-not-allowed
                  "
                >
                  {loading ? "Generating…" : "Generate Marketing Insight"}
                </button>

                {error && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                    {error}
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT: CHARTS */}
            <div
              className={`lg:col-span-7 rounded-2xl bg-white p-6 shadow-sm border border-border/50 ${rightPanelClass}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Predicted Engagement
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Visual summary of 6 engagement metrics.
                  </p>
                </div>

                {form.generatedImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.generatedImageUrl}
                    alt="Generated"
                    className="h-16 w-16 rounded-xl border border-border/50 object-cover bg-white"
                  />
                ) : null}
              </div>

              <div className="mt-6 space-y-5">
                {(Object.keys(shown) as (keyof InsightMetrics)[]).map((k) => (
                  <MetricBar
                    key={k}
                    label={metricLabel(k)}
                    value={shown[k]}
                    maxValue={maxValue}
                    size={chartSize}
                  />
                ))}
              </div>

              <details className="mt-8 rounded-xl border border-border/50 bg-black/[0.02] p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                  Show raw values (debug)
                </summary>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <p>Views: {formatNumber(shown.views)}</p>
                  <p>User Reached: {formatNumber(shown.reach)}</p>
                  <p>Likes: {formatNumber(shown.likes)}</p>
                  <p>Comments: {formatNumber(shown.comments)}</p>
                  <p>Shares: {formatNumber(shown.shares)}</p>
                  <p>Saves: {formatNumber(shown.saves)}</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}