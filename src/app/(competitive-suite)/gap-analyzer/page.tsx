"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [competitorText, setCompetitorText] = useState("");
  const [ownCopyText, setOwnCopyText] = useState("");
  const [ownCopies, setOwnCopies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshOwn() {
    const res = await fetch("/api/own-copy");
    const json = await res.json();
    setOwnCopies(json.items ?? []);
  }

  useEffect(() => {
    refreshOwn();
  }, []);

  async function addOwn() {
    if (!ownCopyText.trim()) return;
    await fetch("/api/own-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ copyText: ownCopyText }),
    });
    setOwnCopyText("");
    refreshOwn();
  }

  async function run() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const competitorCopies = competitorText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/gap-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitorCopies }),
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
      <h1 className="text-2xl font-semibold">Competitor Gap Analyzer</h1>

      <div className="border rounded p-3 space-y-2">
        <div className="font-medium">Your copy history (in-memory for now)</div>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded p-2"
            placeholder="Add a copy line"
            value={ownCopyText}
            onChange={(e) => setOwnCopyText(e.target.value)}
          />
          <button onClick={addOwn} className="px-3 py-2 rounded bg-gray-900 text-white">
            Add
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {ownCopies.length === 0 ? "No entries yet (adding copies improves analysis quality)." : null}
          {ownCopies.slice(0, 10).map((x, i) => (
            <div key={i} className="truncate">• {x.copyText}</div>
          ))}
        </div>
      </div>

      <textarea
        className="w-full border rounded p-2"
        rows={8}
        placeholder="Paste competitor copy lines (2+ lines recommended)"
        value={competitorText}
        onChange={(e) => setCompetitorText(e.target.value)}
      />

      <button
        onClick={run}
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && <div className="text-red-600">{error}</div>}

      {data?.result && (
        <div className="space-y-4">
          <div className="text-sm text-gray-500">requestId: {data.requestId}</div>

          <section className="border rounded p-3">
            <h2 className="font-semibold">Gap vocabulary</h2>
            <ul className="list-disc pl-5">
              {data.result.gaps.vocab.map((v: any, i: number) => (
                <li key={i}>
                  <b>{v.term}</b> — {v.direction} — {v.rationale}
                </li>
              ))}
            </ul>
          </section>

          <section className="border rounded p-3">
            <h2 className="font-semibold">Messaging axes</h2>
            <ul className="list-disc pl-5">
              {data.result.gaps.axes.map((a: any, i: number) => (
                <li key={i}>
                  <b>{a.axis}</b>: {a.description}
                  {a.supporting_terms?.length ? (
                    <span className="text-gray-500"> ({a.supporting_terms.join(", ")})</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <section className="border rounded p-3">
            <h2 className="font-semibold">Suggested copy</h2>
            <ul className="list-disc pl-5">
              {data.result.recommendations.map((r: any, i: number) => (
                <li key={i}>
                  <b>{r.type}</b>: {r.copy}
                </li>
              ))}
            </ul>
          </section>

          <section className="border rounded p-3">
            <h2 className="font-semibold">Risks & mitigations</h2>
            {data.result.risks.length === 0 ? (
              <div className="text-gray-600">None</div>
            ) : (
              <ul className="list-disc pl-5">
                {data.result.risks.map((r: any, i: number) => (
                  <li key={i}>
                    <b>{r.risk}</b> — {r.mitigation}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
