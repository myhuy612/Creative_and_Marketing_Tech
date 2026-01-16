"use client";
import { useState } from "react";

export default function Page() {
  const [ownFeatures, setOwn] = useState("");
  const [competitorFeatures, setComp] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownFeatures, competitorFeatures }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Comparison Checklist</h1>

      <textarea
        className="w-full border rounded p-2"
        rows={5}
        placeholder="Your features (bullet points recommended)"
        value={ownFeatures}
        onChange={(e) => setOwn(e.target.value)}
      />
      <textarea
        className="w-full border rounded p-2"
        rows={5}
        placeholder="Competitor features (bullet points recommended)"
        value={competitorFeatures}
        onChange={(e) => setComp(e.target.value)}
      />

      <button
        onClick={run}
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <div className="text-red-600">{error}</div>}

      {data?.result && (
        <div className="space-y-3">
          <div className="text-sm text-gray-500">requestId: {data.requestId}</div>
          {data.result.checklist.map((c: any, i: number) => (
            <div key={i} className="border rounded p-3 space-y-2">
              <div className="font-semibold">{c.category}</div>
              <div>
                {c.ownAdvantage}
                {c.caution ? <span className="text-gray-500"> ({c.caution})</span> : null}
              </div>
              <div className="text-sm text-gray-600">
                {c.tableBullets.map((b: string, j: number) => (
                  <div key={j}>• {b}</div>
                ))}
              </div>
              <div>
                <div className="text-sm font-medium">Copy variants</div>
                <ul className="list-disc pl-5">
                  {c.copyVariants.map((v: string, j: number) => (
                    <li key={j}>{v}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
