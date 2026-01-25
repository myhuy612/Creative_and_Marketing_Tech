"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type InsightPayload = {
  // product/campaign
  brandName: string;
  productName: string;
  category: string;
  region: string;
  priceMin: string;
  priceMax: string;
  features: string;
  competitors: string;
  goal: string;
  notes: string;

  // pasted outputs + extra context
  platform: string;
  contentType: string;
  keywords: string;
  generatedText: string;
  generatedImageUrl: string;
};

type InsightMetrics = {
  views: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
};

const DEFAULT_METRICS: InsightMetrics = {
  views: 7818,
  reach: 6654,
  likes: 224,
  comments: 12,
  shares: 12,
  saves: 15,
};

function formatNumber(n: number) {
  return Number.isFinite(n) ? n.toLocaleString() : "—";
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function safeDiv(num: number, den: number) {
  return den <= 0 ? 0 : num / den;
}

function pct(n: number, digits = 1) {
  return `${(n * 100).toFixed(digits)}%`;
}

function StatCard({
  title,
  value,
  subtitle,
  emphasis = false,
}: {
  title: string;
  value: string;
  subtitle?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl bg-white shadow-sm border border-border/50",
        emphasis ? "p-5" : "p-4",
      ].join(" ")}
    >
      <p className="text-xs text-muted-foreground">{title}</p>
      <p
        className={[
          "mt-1 font-semibold tracking-tight text-slate-900",
          emphasis ? "text-2xl" : "text-xl",
        ].join(" ")}
      >
        {value}
      </p>
      {subtitle ? (
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}

/**
 * Horizontal bar row (better for comparisons than vertical bars).
 */
function CompareBars({
  rows,
}: {
  rows: Array<{ label: string; value: number; hint?: string }>;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="space-y-3">
      {rows.map((r) => {
        const w = clamp((r.value / max) * 100, 2, 100);
        return (
          <div key={r.label} className="space-y-1">
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">{r.label}</p>
                {r.hint ? (
                  <p className="text-xs text-muted-foreground">{r.hint}</p>
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatNumber(r.value)}
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-black/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-[hsl(var(--primary))]"
                style={{ width: `${w}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Engagement breakdown: focuses on actions (likes/comments/shares/saves).
 */
function EngagementBreakdown({ metrics }: { metrics: InsightMetrics }) {
  const total =
    metrics.likes + metrics.comments + metrics.shares + metrics.saves || 1;

  const parts = [
    { label: "Likes", value: metrics.likes },
    { label: "Saves", value: metrics.saves },
    { label: "Shares", value: metrics.shares },
    { label: "Comments", value: metrics.comments },
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-3">
      {parts.map((p) => {
        const w = clamp((p.value / total) * 100, 2, 100);
        return (
          <div key={p.label} className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{p.label}</span>
              <span>
                {formatNumber(p.value)} · {pct(p.value / total)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-black/5 overflow-hidden">
              <div
                className="h-full bg-[hsl(var(--primary))]"
                style={{ width: `${w}%` }}
              />
            </div>
          </div>
        );
      })}
      <p className="text-xs text-muted-foreground">
        Shows the distribution of expected interactions (higher-intent actions
        are typically saves + shares).
      </p>
    </div>
  );
}

function ScorePill({
  label,
  tone,
}: {
  label: string;
  tone: "good" | "mid" | "low";
}) {
  const cls =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : tone === "mid"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-rose-50 text-rose-800 border-rose-200";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

function buildInterpretation(m: InsightMetrics) {
  const engagement = m.likes + m.comments + m.shares + m.saves;
  const er = safeDiv(engagement, m.views);
  const shareSave = m.shares + m.saves;
  const highIntentRatio = safeDiv(shareSave, engagement || 1);
  const reachToViews = safeDiv(m.reach, m.views);

  let quality: "Strong" | "Medium" | "Needs work" = "Medium";
  if (er >= 0.06) quality = "Strong";
  else if (er < 0.03) quality = "Needs work";

  const bullets: string[] = [];

  if (reachToViews >= 0.9) {
    bullets.push("Reach is close to views → strong distribution potential.");
  } else if (reachToViews < 0.75) {
    bullets.push("Reach is low relative to views → discovery may be limited.");
  } else {
    bullets.push("Reach-to-views looks balanced for a typical post.");
  }

  if (highIntentRatio >= 0.22) {
    bullets.push(
      "Saves/Shares are relatively high → content may feel useful or shareable."
    );
  } else if (highIntentRatio < 0.12) {
    bullets.push(
      "Saves/Shares are low → consider clearer value or stronger hook/CTA."
    );
  } else {
    bullets.push(
      "High-intent actions are moderate → room to improve “save/share” value."
    );
  }

  if (safeDiv(m.comments, m.views) < 0.001) {
    bullets.push("Comments are low → try a question-based CTA to invite replies.");
  }

  return { quality, er, highIntentRatio, bullets };
}

/**
 * Mock generator (client-side) — later swap with API call
 */
function buildMockInsights(p: InsightPayload): {
  insightsText: string;
  metrics: InsightMetrics;
} {
  const price =
    p.priceMin || p.priceMax
      ? `$${p.priceMin || "—"}–$${p.priceMax || "—"}`
      : "—";

  const competitors = p.competitors
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const features = p.features
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const competitorLine =
    competitors.length > 0 ? competitors.join(", ") : "No competitors provided";
  const featureLine =
    features.length > 0 ? features.join(", ") : "No features provided";

  const completeness =
    0.6 +
    (p.generatedText.trim() ? 0.15 : 0) +
    (p.generatedImageUrl.trim() ? 0.15 : 0) +
    (p.keywords.trim() ? 0.1 : 0);

  const baseViews = Math.round(4500 * completeness + 1800);
  const baseReach = Math.round(baseViews * 0.85);
  const likes = Math.round(baseViews * 0.03);
  const comments = Math.round(baseViews * 0.0018);
  const shares = Math.round(baseViews * 0.0016);
  const saves = Math.round(baseViews * 0.002);

  const insightsText = [
    `### Snapshot`,
    `- Brand: ${p.brandName || "—"}`,
    `- Product: ${p.productName}`,
    `- Category: ${p.category}`,
    `- Region: ${p.region || "—"}`,
    `- Price: ${price}`,
    ``,
    `### Key features`,
    `- ${featureLine}`,
    ``,
    `### Positioning`,
    `- Competitive context: ${competitorLine}.`,
    `- Simple line: “${p.productName} helps you achieve [Outcome] without [Common pain].”`,
    ``,
    `### Channel suggestions`,
    `- Platform focus: ${p.platform || "—"} (${p.contentType || "—"})`,
    `- Organic: short demos + comparisons + proof`,
    `- Paid: retargeting + high intent keywords`,
    ``,
    `### Goal / Notes`,
    `- Goal: ${p.goal || "—"}`,
    `- Notes: ${p.notes || "—"}`,
  ].join("\n");

  return {
    insightsText,
    metrics: {
      views: baseViews,
      reach: baseReach,
      likes,
      comments,
      shares,
      saves,
    },
  };
}

export default function MarketingInsightsPanel() {
  const [inputMode, setInputMode] = useState<"product" | "paste">("product");

  const [payload, setPayload] = useState<InsightPayload>({
    brandName: "",
    productName: "",
    category: "",
    region: "",
    priceMin: "",
    priceMax: "",
    features: "",
    competitors: "",
    goal: "",
    notes: "",
    platform: "Instagram",
    contentType: "Instagram Caption",
    keywords: "",
    generatedText: "",
    generatedImageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState<string>("");
  const [metrics, setMetrics] = useState<InsightMetrics | null>(null);

  const reset = () => {
    setPayload({
      brandName: "",
      productName: "",
      category: "",
      region: "",
      priceMin: "",
      priceMax: "",
      features: "",
      competitors: "",
      goal: "",
      notes: "",
      platform: "Instagram",
      contentType: "Instagram Caption",
      keywords: "",
      generatedText: "",
      generatedImageUrl: "",
    });
    setResultText("");
    setMetrics(null);
    setInputMode("product");
  };

  const onGenerate = async () => {
    if (!payload.productName.trim() || !payload.category.trim()) {
      setResultText("Product name and category are required.");
      setMetrics(null);
      return;
    }

    setLoading(true);
    setResultText("");
    setMetrics(null);

    try {
      await new Promise((r) => setTimeout(r, 450));
      const out = buildMockInsights(payload);
      setResultText(out.insightsText);
      setMetrics(out.metrics);
    } finally {
      setLoading(false);
    }
  };

  const shown = metrics ?? DEFAULT_METRICS;

  const engagementTotal =
    shown.likes + shown.comments + shown.shares + shown.saves;

  const er = safeDiv(engagementTotal, shown.views);
  const highIntentRatio = safeDiv(
    shown.shares + shown.saves,
    engagementTotal || 1
  );

  const interpretation = buildInterpretation(shown);
  const qualityTone =
    interpretation.quality === "Strong"
      ? "good"
      : interpretation.quality === "Needs work"
      ? "low"
      : "mid";

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* LEFT: INPUT PANEL (toggle inside) */}
      <Card className="lg:col-span-4 border-border/60 bg-white">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-lg text-slate-900">Inputs</CardTitle>
            <Button type="button" variant="secondary" onClick={reset}>
              Reset
            </Button>
          </div>

          {/* Mode switch */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border/50 bg-black/[0.02] p-2">
            <button
              type="button"
              onClick={() => setInputMode("product")}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                inputMode === "product"
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-muted-foreground hover:text-slate-900"
              }`}
            >
              Product
            </button>
            <button
              type="button"
              onClick={() => setInputMode("paste")}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                inputMode === "paste"
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-muted-foreground hover:text-slate-900"
              }`}
            >
              Paste outputs
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {inputMode === "product" ? (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">Brand name</p>
                <Input
                  value={payload.brandName}
                  onChange={(e) =>
                    setPayload({ ...payload, brandName: e.target.value })
                  }
                  placeholder="e.g. AeroStride"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">
                  Product name <span className="text-destructive">*</span>
                </p>
                <Input
                  value={payload.productName}
                  onChange={(e) =>
                    setPayload({ ...payload, productName: e.target.value })
                  }
                  placeholder="e.g. Eco-friendly waterproof backpack"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">
                  Category <span className="text-destructive">*</span>
                </p>
                <Input
                  value={payload.category}
                  onChange={(e) =>
                    setPayload({ ...payload, category: e.target.value })
                  }
                  placeholder="e.g. Fashion, Gadget, Home, Beauty..."
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">Region</p>
                <Input
                  value={payload.region}
                  onChange={(e) =>
                    setPayload({ ...payload, region: e.target.value })
                  }
                  placeholder="e.g. Japan, US, Global"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">Price range</p>
                <div className="flex gap-3">
                  <Input
                    value={payload.priceMin}
                    onChange={(e) =>
                      setPayload({ ...payload, priceMin: e.target.value })
                    }
                    placeholder="Min"
                    inputMode="numeric"
                  />
                  <Input
                    value={payload.priceMax}
                    onChange={(e) =>
                      setPayload({ ...payload, priceMax: e.target.value })
                    }
                    placeholder="Max"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">Features</p>
                <Input
                  value={payload.features}
                  onChange={(e) =>
                    setPayload({ ...payload, features: e.target.value })
                  }
                  placeholder="e.g. waterproof, eco-friendly, lightweight"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">Competitors</p>
                <Input
                  value={payload.competitors}
                  onChange={(e) =>
                    setPayload({ ...payload, competitors: e.target.value })
                  }
                  placeholder="e.g. BrandA, BrandB"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">Goal</p>
                <Input
                  value={payload.goal}
                  onChange={(e) => setPayload({ ...payload, goal: e.target.value })}
                  placeholder="e.g. Messaging, channel plan, launch strategy"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">Notes</p>
                <Textarea
                  value={payload.notes}
                  onChange={(e) =>
                    setPayload({ ...payload, notes: e.target.value })
                  }
                  placeholder="What makes this product special?"
                  className="min-h-[96px]"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900">Platform</p>
                  <Input
                    value={payload.platform}
                    onChange={(e) =>
                      setPayload({ ...payload, platform: e.target.value })
                    }
                    placeholder="e.g. Instagram"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900">
                    Content type
                  </p>
                  <Input
                    value={payload.contentType}
                    onChange={(e) =>
                      setPayload({ ...payload, contentType: e.target.value })
                    }
                    placeholder="e.g. Instagram Caption"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">Keywords</p>
                <Input
                  value={payload.keywords}
                  onChange={(e) =>
                    setPayload({ ...payload, keywords: e.target.value })
                  }
                  placeholder="e.g. #fitness #running"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">
                  Generated text (paste)
                </p>
                <Textarea
                  value={payload.generatedText}
                  onChange={(e) =>
                    setPayload({ ...payload, generatedText: e.target.value })
                  }
                  placeholder="Paste generated caption/blog/ad copy here…"
                  className="min-h-[220px]"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">
                  Generated image URL (paste)
                </p>
                <Input
                  value={payload.generatedImageUrl}
                  onChange={(e) =>
                    setPayload({ ...payload, generatedImageUrl: e.target.value })
                  }
                  placeholder="https://…"
                />
              </div>

              {payload.generatedImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={payload.generatedImageUrl}
                  alt="Preview"
                  className="mt-2 w-full rounded-xl border border-border/50 object-cover"
                />
              ) : (
                <p className="text-xs text-muted-foreground">
                  Paste an image URL to preview it here.
                </p>
              )}
            </>
          )}

          <Button
            type="button"
            className="
              w-full rounded-full py-4 text-lg font-semibold
              bg-[hsl(var(--primary))] text-white
              shadow-[0_8px_24px_rgba(255,115,0,0.35)]
              transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(255,115,0,0.45)]
            "
            onClick={onGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate insights"}
          </Button>
        </CardContent>
      </Card>

      {/* RIGHT: OUTPUT */}
      <div className="lg:col-span-8 space-y-6">
        <Card className="border-border/60 bg-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg text-slate-900">
              Marketing insights
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Engagement-style metrics based on the provided inputs.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* AT A GLANCE */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <StatCard
                title="Estimated views"
                value={formatNumber(shown.views)}
                subtitle="Total expected impressions"
                emphasis
              />
              <StatCard
                title="Estimated reach"
                value={formatNumber(shown.reach)}
                subtitle="Unique accounts reached"
                emphasis
              />
              <StatCard
                title="Engagement quality"
                value={pct(er, 1)}
                subtitle={`High-intent: ${pct(highIntentRatio, 0)}`}
                emphasis
              />
            </div>

            {/* SECONDARY */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatCard title="Likes" value={formatNumber(shown.likes)} />
              <StatCard title="Saves" value={formatNumber(shown.saves)} />
              <StatCard title="Shares" value={formatNumber(shown.shares)} />
              <StatCard title="Comments" value={formatNumber(shown.comments)} />
            </div>

            {/* COMPARISON + BREAKDOWN */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border/50 bg-black/[0.02] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Distribution signals
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Quick comparison of reach vs views.
                    </p>
                  </div>
                  <ScorePill label={interpretation.quality} tone={qualityTone} />
                </div>

                <div className="mt-4">
                  <CompareBars
                    rows={[
                      {
                        label: "Views",
                        value: shown.views,
                        hint: "Expected total impressions",
                      },
                      {
                        label: "Reach",
                        value: shown.reach,
                        hint: "Expected unique accounts",
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-black/[0.02] p-5">
                <p className="text-sm font-semibold text-slate-900">
                  Engagement pattern
                </p>
                <p className="text-xs text-muted-foreground">
                  Relative distribution of expected interactions.
                </p>
                <div className="mt-4">
                  <EngagementBreakdown metrics={shown} />
                </div>
              </div>
            </div>

            {/* INTERPRETATION */}
            <div className="rounded-2xl border border-border/50 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">
                What this suggests
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {interpretation.bullets.slice(0, 3).map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                These notes are heuristic (mock) and will improve when the API is
                connected.
              </p>
            </div>

            {/* STATUS + DETAILS */}
            {loading && (
              <p className="text-sm text-muted-foreground">
                Generating insights…
              </p>
            )}

            {!resultText && !loading && (
              <p className="text-sm text-muted-foreground">
                Fill in required fields and click <b>Generate insights</b>.
              </p>
            )}

            {resultText && (
              <details className="rounded-2xl border border-border/50 bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                  Show generated insights (text)
                </summary>
                <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-900">
                  {resultText}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}