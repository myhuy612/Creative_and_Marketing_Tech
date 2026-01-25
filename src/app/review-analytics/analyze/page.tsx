"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReviewsInputSchema, splitReviews } from "../lib/validators";
import { ensureSession, createAnalysis } from "../lib/client";

export default function Page() {
  const router = useRouter();
  const [language, setLanguage] = useState<"auto" | "ja" | "en">("auto");
  const [reviewsText, setReviewsText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);

    const parsed = ReviewsInputSchema.safeParse({ language, reviewsText });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    const reviews = splitReviews(reviewsText);
    if (reviews.length === 0) return setError("No valid reviews found (each line must be at least 2 characters).");
    if (reviews.length > 100) return setError("Too many reviews (max 100).");
    if (reviewsText.length > 20000) return setError("Input is too large (max 20,000 characters).");

    setLoading(true);
    try {
      await ensureSession();
      const res = await createAnalysis({ language, reviews });
      router.push(`/review-analytics/analysis/${res.analysis_id}`);
    } catch (e: any) {
      setError(e?.message ?? "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Review Analytics</h1>

      <div className="flex items-center gap-2">
        <label className="text-sm">Language</label>
        <select
          className="border rounded px-2 py-1"
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
        >
          <option value="auto">auto</option>
          <option value="ja">ja</option>
          <option value="en">en</option>
        </select>
      </div>

      <textarea
        className="w-full border rounded p-3 min-h-[240px]"
        placeholder="Paste reviews separated by new lines..."
        value={reviewsText}
        onChange={(e) => setReviewsText(e.target.value)}
      />

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        disabled={loading}
        onClick={onSubmit}
      >
        {loading ? "Running..." : "Analyze"}
      </button>

      <div className="text-sm opacity-70">
        <a className="underline" href="/review-analytics/history">
          View history
        </a>
      </div>
    </div>
  );
}
