"use client";
import { useState } from "react";

export default function Page() {
  const [ownDescription, setOwn] = useState("");
  const [c1, setC1] = useState({ name: "", description: "" });
  const [c2, setC2] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const competitors = [c1, c2].filter((c) => c.name.trim().length > 0);
      const res = await fetch("/api/differentiation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownDescription, competitors }),
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
      <h1 className="text-2xl font-semibold">Differentiation</h1>

      <textarea
        className="w-full border rounded p-2"
        rows={5}
        placeholder="Your brand description (required)"
        value={ownDescription}
        onChange={(e) => setOwn(e.target.value)}
      />

      <div className="grid gap-3">
        <div className="border rounded p-3 space-y-2">
          <div className="font-medium">Competitor 1</div>
          <input
            className="w-full border rounded p-2"
            placeholder="Competitor name"
            value={c1.name}
            onChange={(e) => setC1({ ...c1, name: e.target.value })}
          />
          <textarea
            className="w-full border rounded p-2"
            rows={3}
            placeholder="Competitor description (optional)"
            value={c1.description}
            onChange={(e) => setC1({ ...c1, description: e.target.value })}
          />
        </div>

        <div className="border rounded p-3 space-y-2">
          <div className="font-medium">Competitor 2 (optional)</div>
          <input
            className="w-full border rounded p-2"
            placeholder="Competitor name"
            value={c2.name}
            onChange={(e) => setC2({ ...c2, name: e.target.value })}
          />
          <textarea
            className="w-full border rounded p-2"
            rows={3}
            placeholder="Competitor description (optional)"
            value={c2.description}
            onChange={(e) => setC2({ ...c2, description: e.target.value })}
          />
        </div>
      </div>

      <button
        onClick={run}
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <div className="text-red-600">{error}</div>}

      {data?.result && (
        <div className="space-y-4">
          <div className="text-sm text-gray-500">requestId: {data.requestId}</div>

          <section className="border rounded p-3">
            <h2 className="font-semibold">Differentiators</h2>
            <ul className="list-disc pl-5">
              {data.result.differentiators.map((d: any, i: number) => (
                <li key={i}>
                  <b>{d.axis}</b>: {d.description}
                  {d.caution ? <span className="text-gray-500"> ({d.caution})</span> : null}
                </li>
              ))}
            </ul>
          </section>

          <section className="border rounded p-3">
            <h2 className="font-semibold">Message examples</h2>
            <ul className="list-disc pl-5">
              {data.result.messages.map((m: any, i: number) => (
                <li key={i}>
                  <b>{m.headline}</b> — {m.body}
                </li>
              ))}
            </ul>
          </section>

          <section className="border rounded p-3">
            <h2 className="font-semibold">Slogan candidates</h2>
            <ul className="list-disc pl-5">
              {data.result.slogans.map((s: any, i: number) => (
                <li key={i}>{s.text}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
