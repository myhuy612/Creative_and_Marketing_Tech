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
  platform: string;
  contentType: string;
  campaignObjective: string;
  keywords: string;

  // pull from text/image generators
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

function formatNumber(n: number) {
  return n.toLocaleString();
}

function MetricCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-border/50">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">
        {formatNumber(value)}
      </p>
    </div>
  );
}

/**
 * Simple "mini bar chart" (no external libraries).
 * Shows 6 bars with labels.
 */
function MiniBarChart({
  metrics,
  height = 220,
}: {
  metrics: InsightMetrics;
  height?: number;
}) {
  const entries = [
    { key: "views", label: "Views", value: metrics.views },
    { key: "reach", label: "Reach", value: metrics.reach },
    { key: "likes", label: "Likes", value: metrics.likes },
    { key: "comments", label: "Comments", value: metrics.comments },
    { key: "shares", label: "Shares", value: metrics.shares },
    { key: "saves", label: "Saves", value: metrics.saves },
  ] as const;

  const max = Math.max(...entries.map((e) => e.value), 1);

  return (
    <div className="w-full">
      <div className="grid grid-cols-6 items-end gap-3" style={{ height }}>
        {entries.map((e) => {
          const pct = Math.max(0.06, e.value / max); // keep visible
          return (
            <div key={e.key} className="flex flex-col items-center gap-2">
              <div className="relative w-full flex-1 rounded-xl bg-black/5 overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 w-full rounded-xl bg-[hsl(var(--primary))]"
                  style={{ height: `${pct * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground text-center leading-tight">
                {e.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * "Split chart": top two huge metrics (views/reach) + 4 small metrics.
 */
function SplitBars({ metrics }: { metrics: InsightMetrics }) {
  const topMax = Math.max(metrics.views, metrics.reach, 1);

  const top = [
    { label: "Views", value: metrics.views },
    { label: "User Reached", value: metrics.reach },
  ];

  const bottom = [
    { label: "Likes", value: metrics.likes },
    { label: "Comments", value: metrics.comments },
    { label: "Shares", value: metrics.shares },
    { label: "Saves", value: metrics.saves },
  ];

  return (
    <div className="space-y-4">
      {top.map((t) => {
        const pct = (t.value / topMax) * 100;
        return (
          <div key={t.label} className="space-y-2">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-medium text-slate-900">{t.label}</p>
              <p className="text-sm text-muted-foreground">
                {formatNumber(t.value)}
              </p>
            </div>
            <div className="h-4 w-full rounded-full bg-black/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-[hsl(var(--primary))]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}

      <div className="grid grid-cols-2 gap-4">
        {bottom.map((b) => (
          <div
            key={b.label}
            className="rounded-2xl bg-white p-4 border border-border/50"
          >
            <p className="text-sm text-muted-foreground">{b.label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">
              {formatNumber(b.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarketingInsightDashboardPage() {
  const [layoutMode, setLayoutMode] = useState<"compact" | "spacious">(
    "spacious"
  );
  const [chartHeight, setChartHeight] = useState<180 | 240 | 320>(240);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<InsightMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<InsightRequest>({
    brandName: "Nike",
    platform: "Instagram",
    contentType: "Instagram Caption",
    campaignObjective: "Improve selling",
    keywords: "#sport #shoes #nike #running",
    generatedText: "",
    generatedImageUrl: "",
  });

  const shown = metrics ?? MOCK;

  const wrapperGap = useMemo(() => {
    return layoutMode === "compact" ? "gap-6" : "gap-10";
  }, [layoutMode]);

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
              Marketing Insights
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Paste generated text and image outputs to preview engagement-style metrics.
            </p>
          </header>

          {/* TOP CONTROLS */}
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">
              Uses mock engagement values when no data is provided.
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Layout</label>
                <select
                  className="h-9 rounded-lg border border-border/50 bg-white px-3 text-sm focus:border-orange-500 focus:outline-none"
                  value={layoutMode}
                  onChange={(e) =>
                    setLayoutMode(e.target.value as "compact" | "spacious")
                  }
                >
                  <option value="compact">Compact</option>
                  <option value="spacious">Spacious</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">
                  Chart height
                </label>
                <select
                  className="h-9 rounded-lg border border-border/50 bg-white px-3 text-sm focus:border-orange-500 focus:outline-none"
                  value={chartHeight}
                  onChange={(e) =>
                    setChartHeight(Number(e.target.value) as 180 | 240 | 320)
                  }
                >
                  <option value={180}>Small</option>
                  <option value={240}>Medium</option>
                  <option value={320}>Large</option>
                </select>
              </div>
            </div>
          </div>

          <div className={`grid lg:grid-cols-12 ${wrapperGap}`}>
            {/* LEFT: INPUTS */}
            <div className="lg:col-span-5 rounded-2xl bg-white p-6 shadow-sm border border-border/50">
              <h2 className="text-lg font-semibold text-slate-900">Inputs</h2>
              <p className="text-sm text-muted-foreground">
                Paste results from <b>Generate Text</b> and <b>Generate Image</b>.
                The insights endpoint accepts this same input shape.
              </p>

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
                </div>

                <div className="grid gap-4 md:grid-cols-2">
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
                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      Keywords
                    </label>
                    <input
                      className="mt-2 w-full rounded-xl border border-border/50 px-3 py-2 text-sm bg-white focus:border-orange-500 focus:outline-none"
                      value={form.keywords}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, keywords: e.target.value }))
                      }
                    />
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
                    Generated Text (paste)
                  </label>
                  <textarea
                    className="mt-2 w-full rounded-xl border border-border/50 px-3 py-2 text-sm bg-white focus:border-orange-500 focus:outline-none"
                    rows={5}
                    value={form.generatedText ?? ""}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, generatedText: e.target.value }))
                    }
                    placeholder="Paste caption/blog/ad copy here…"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">
                    Generated Image URL (paste)
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
                  {loading ? "Generating…" : "View Insights"}
                </button>

                {error && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                    {error}
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT: DASHBOARD */}
            <div className="lg:col-span-7 space-y-6">
              {/* TOP CARDS */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <MetricCard title="Views" value={shown.views} />
                <MetricCard title="User Reached" value={shown.reach} />
                <MetricCard title="Likes" value={shown.likes} />
                <MetricCard title="Comments" value={shown.comments} />
                <MetricCard title="Shares" value={shown.shares} />
                <MetricCard title="Saves" value={shown.saves} />
              </div>

              {/* CHARTS */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-border/50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Overview
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Mini bar chart of all 6 metrics.
                      </p>
                    </div>

                    {form.generatedImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.generatedImageUrl}
                        alt="Generated"
                        className="h-14 w-14 rounded-xl border border-border/50 object-cover bg-white"
                      />
                    ) : null}
                  </div>

                  <div className="mt-6">
                    <MiniBarChart metrics={shown} height={chartHeight} />
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-border/50">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Key Drivers
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Focus on Views + Reach, with remaining metrics as cards.
                  </p>

                  <div className="mt-6">
                    <SplitBars metrics={shown} />
                  </div>
                </div>
              </div>

              {/* RAW JSON (debug) */}
              <details className="rounded-2xl bg-white p-6 shadow-sm border border-border/50">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                  Show JSON (debug)
                </summary>
                <pre className="mt-4 overflow-auto rounded-xl bg-black/[0.03] p-4 text-xs">
{JSON.stringify(shown, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}