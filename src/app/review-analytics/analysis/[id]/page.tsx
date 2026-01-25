"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { AnalysisDetail } from "../../types/analysis";
import { getAnalysis, rerunAnalysis } from "../../lib/client";
import { poll } from "../../lib/polling";
import StatusBadge from "../../components/StatusBadge";
import SentimentSummaryCard from "../../components/SentimentSummaryCard";
import ReviewList from "../../components/ReviewList";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<AnalysisDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const result = await poll(
          () => getAnalysis(id),
          (v) => v.status === "done" || v.status === "error"
        );
        if (!cancelled) setData(result);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Request failed.");
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onRerun() {
    const res = await rerunAnalysis(id);
    router.push(`/review-analytics/analysis/${res.analysis_id}`);
  }

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Analysis Detail</h1>
        <StatusBadge status={data.status} />
      </div>

      {data.status === "error" && (
        <div className="border rounded p-4 text-red-700">
          error: {data.error_message ?? "Unknown error"}
        </div>
      )}

      {data.sentiment_summary && <SentimentSummaryCard summary={data.sentiment_summary} />}

      {data.review_items && <ReviewList items={data.review_items} />}

      <div className="flex gap-3">
        <button className="px-4 py-2 rounded border" onClick={() => router.push("/review-analytics/history")}>
          History
        </button>
        <button className="px-4 py-2 rounded bg-black text-white" onClick={onRerun}>
          Re-run
        </button>
      </div>
    </div>
  );
}
