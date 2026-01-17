"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [feature, setFeature] = useState<string>("");

  async function load() {
    const qs = new URLSearchParams();
    if (feature) qs.set("feature_type", feature);
    qs.set("limit", "10");
    const res = await fetch(`/api/history?${qs.toString()}`);
    const json = await res.json();
    setItems(json.items ?? []);
  }

  useEffect(() => {
    load();
  }, [feature]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">History</h1>

      <select
        className="border rounded p-2"
        value={feature}
        onChange={(e) => setFeature(e.target.value)}
      >
        <option value="">All</option>
        <option value="differentiation">differentiation</option>
        <option value="comparisonChecklist">comparisonChecklist</option>
        <option value="competitorGapAnalyzer">competitorGapAnalyzer</option>
      </select>

      <div className="space-y-3">
        {items.map((it, i) => (
          <a
            key={i}
            href={`/history/${it.request.id}`}
            className="block border rounded p-3 hover:bg-gray-50"
          >
            <div className="text-sm text-gray-500">
              {it.request.createdAt} / {it.request.featureType}
            </div>
            <div className="text-sm">requestId: {it.request.id}</div>
            <div className="text-sm text-gray-600 truncate">
              {JSON.stringify(it.request.input).slice(0, 140)}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
