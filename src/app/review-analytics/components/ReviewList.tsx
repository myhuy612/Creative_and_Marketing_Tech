import type { ReviewItem } from "../types/analysis";

export default function ReviewList({ items }: { items: ReviewItem[] }) {
  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold mb-3">Reviews</h3>
      <ul className="space-y-2">
        {items.map((r) => (
          <li key={r.id} className="border rounded p-3">
            <div className="text-sm whitespace-pre-wrap">{r.text}</div>
            <div className="text-xs mt-2 opacity-80">
              label: {r.sentiment_label ?? "-"} / score:{" "}
              {r.sentiment_score != null ? r.sentiment_score.toFixed(3) : "-"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
