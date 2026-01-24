"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InsightPayload = {
  preset?: string;
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
};

const PRESETS: Array<{
  id: string;
  label: string;
  values: Partial<InsightPayload>;
}> = [
  {
    id: "eco-backpack",
    label: "Eco-friendly waterproof backpack",
    values: {
      brandName: "AeroStride",
      productName: "Eco-friendly waterproof backpack",
      category: "Fashion / Outdoor",
      region: "US / Canada",
      priceMin: "79",
      priceMax: "129",
      features: "Waterproof, recycled materials, lightweight, laptop sleeve",
      competitors: "Patagonia, Herschel, The North Face",
      goal: "Positioning + channel recommendations + content plan",
      notes:
        "Focus on commuters + weekend hikers. Emphasize sustainability + durability.",
    },
  },
  {
    id: "saas",
    label: "SaaS: AI meeting notes",
    values: {
      brandName: "NotePilot",
      productName: "AI meeting notes assistant",
      category: "B2B SaaS",
      region: "Global (EN)",
      priceMin: "12",
      priceMax: "29",
      features: "Auto transcription, action items, CRM sync, templates",
      competitors: "Otter, Fireflies, Notion AI",
      goal: "ICP + messaging + landing page angles",
      notes: "Target: sales + CS teams. Objection: accuracy and security.",
    },
  },
];

// NOTE: This is a client-side mock generator for the "combined-mock" page.
// Later you can replace this with a server API (e.g., /api/generate/marketing-insights).
function buildMockInsights(p: InsightPayload) {
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

  const featureLine = features.length > 0 ? features.join(", ") : "No features provided";

  return [
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
    `### Likely ICP (Primary)`,
    `- Who: People actively searching for a solution in "${p.category}" with clear pain points.`,
    `- Why now: Triggered by a recent change (new job/season/project deadline) + desire for quick results.`,
    `- Key value: ${features.length ? `(${features[0]})` : "(clarity, quality, convenience)"}`,
    ``,
    `### Positioning`,
    `- Category framing: “${p.category}” with a clear differentiator: ${features.length ? features[0] : "one standout benefit"}.`,
    `- Competitive context: ${competitorLine}.`,
    `- Simple line: “${p.productName} helps you achieve [Outcome] without [Common pain].”`,
    ``,
    `### Messaging Angles (3)`,
    `1) Outcome-first: “Get [Outcome] in less time.”`,
    `2) Proof/Trust: “Built for reliability—show the why (materials, security, process).”`,
    `3) Lifestyle/Identity: “For people who care about ${features.length ? features[features.length - 1] : "quality"}.”`,
    ``,
    `### Channel Suggestions`,
    `- Organic: Instagram Reels / TikTok (short demos), SEO (comparison + how-to), communities (problem-led).`,
    `- Paid: Meta (UGC-style), Google Search (high intent keywords), retargeting (feature proof).`,
    ``,
    `### Content Ideas`,
    `- “3 mistakes people make when choosing ${p.category}”`,
    `- “${p.productName} vs ${competitors[0] || "top alternative"}: what’s different?”`,
    `- “Behind the scenes: why ${features[0] || "our key feature"} matters”`,
    ``,
    `### KPIs`,
    `- CTR → Landing conversion rate → CAC (paid)`,
    `- Saves/Shares → Profile visits → Link clicks (organic)`,
    ``,
    `### Goal / Notes`,
    `- Goal: ${p.goal || "—"}`,
    `- Notes: ${p.notes || "—"}`,
  ].join("\n");
}

export default function MarketingInsightsPanel() {
  const [payload, setPayload] = useState<InsightPayload>({
    preset: "",
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
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const presetMap = useMemo(() => {
    const map = new Map<string, (typeof PRESETS)[number]>();
    PRESETS.forEach((p) => map.set(p.id, p));
    return map;
  }, []);

  const applyPreset = (id: string) => {
    const preset = presetMap.get(id);
    if (!preset) return;

    setPayload((prev) => ({
      ...prev,
      preset: id,
      brandName: preset.values.brandName ?? prev.brandName,
      productName: preset.values.productName ?? prev.productName,
      category: preset.values.category ?? prev.category,
      region: preset.values.region ?? prev.region,
      priceMin: preset.values.priceMin ?? prev.priceMin,
      priceMax: preset.values.priceMax ?? prev.priceMax,
      features: preset.values.features ?? prev.features,
      competitors: preset.values.competitors ?? prev.competitors,
      goal: preset.values.goal ?? prev.goal,
      notes: preset.values.notes ?? prev.notes,
    }));
  };

  const reset = () => {
    setPayload({
      preset: "",
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
    });
    setResult("");
  };

  const onGenerate = async () => {
    // Minimal required checks (keep it lightweight for combined-mock).
    if (!payload.productName.trim() || !payload.category.trim()) {
      setResult("Product name and Category are required.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      // Simulate latency for a more realistic mock experience.
      await new Promise((r) => setTimeout(r, 600));
      setResult(buildMockInsights(payload));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* LEFT: FORM */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Product information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preset */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium">Preset (optional)</p>
                <Select
                  value={payload.preset || ""}
                  onValueChange={(v) => applyPreset(v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="button" variant="secondary" onClick={reset}>
                Reset
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Brand name</p>
            <Input
              value={payload.brandName}
              onChange={(e) =>
                setPayload({ ...payload, brandName: e.target.value })
              }
              placeholder="e.g. AeroStride"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
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
            <p className="text-sm font-medium">
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
            <p className="text-sm font-medium">Region (optional)</p>
            <Input
              value={payload.region}
              onChange={(e) => setPayload({ ...payload, region: e.target.value })}
              placeholder="e.g. Japan, US, Global"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Price range (optional)</p>
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
            <p className="text-sm font-medium">
              Features (comma separated, optional)
            </p>
            <Input
              value={payload.features}
              onChange={(e) =>
                setPayload({ ...payload, features: e.target.value })
              }
              placeholder="e.g. waterproof, eco-friendly, lightweight"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Competitors (comma separated, optional)
            </p>
            <Input
              value={payload.competitors}
              onChange={(e) =>
                setPayload({ ...payload, competitors: e.target.value })
              }
              placeholder="e.g. BrandA, BrandB"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Goal (optional)</p>
            <Input
              value={payload.goal}
              onChange={(e) => setPayload({ ...payload, goal: e.target.value })}
              placeholder="e.g. Messaging, channel plan, launch strategy"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Notes (optional)</p>
            <Textarea
              value={payload.notes}
              onChange={(e) => setPayload({ ...payload, notes: e.target.value })}
              placeholder="What makes this product special?"
              className="min-h-[96px]"
            />
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={onGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate insights"}
          </Button>
        </CardContent>
      </Card>

      {/* RIGHT: RESULT */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Marketing insights</CardTitle>
        </CardHeader>
        <CardContent>
          {!result && !loading && (
            <p className="text-sm text-muted-foreground">
              Fill in the product information and click “Generate insights” to
              see the result here.
            </p>
          )}

          {loading && (
            <p className="text-sm text-muted-foreground">
              Generating insights…
            </p>
          )}

          {result && (
            <pre className="whitespace-pre-wrap text-sm leading-6">
              {result}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
