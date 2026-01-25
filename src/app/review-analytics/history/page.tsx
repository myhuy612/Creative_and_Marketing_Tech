"use client";

import { useEffect, useState } from "react";
import type { HistoryItem } from "../types/analysis";
import { getHistory } from "../lib/client";
import StatusBadge from "../components/StatusBadge";

export default function Page() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHistory(10)
      .then((r) => setItems(r.items))
      .catch((e) => setError(e?.message ?? "Request failed."));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">History</h1>
      <div className="text-sm">
        <a className="underline" href="/review-analytics/analyze">
          Start a new analysis
        </a>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.analysis_id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">
                <a className="underline" href={`/review-analytics/analysis/${it.analysis_id}`}>
                  {it.analysis_id}
                </a>
              </div>
              <div className="text-xs opacity-70">
                {it.created_at} / reviews: {it.review_count}
              </div>
            </div>
            <StatusBadge status={it.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
