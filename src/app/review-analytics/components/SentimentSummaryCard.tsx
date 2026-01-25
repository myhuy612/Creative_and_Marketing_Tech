import type { SentimentSummary } from "../types/analysis";

export default function SentimentSummaryCard({ summary }: { summary: SentimentSummary }) {
  const { counts, ratios } = summary;
  return (
    <div className="border rounded p-4 space-y-2">
      <h3 className="font-semibold">Sentiment Summary</h3>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="border rounded p-2">
          <div className="font-medium">Positive</div>
          <div>
            {counts.pos} ({Math.round(ratios.pos * 100)}%)
          </div>
        </div>
        <div className="border rounded p-2">
          <div className="font-medium">Neutral</div>
          <div>
            {counts.neu} ({Math.round(ratios.neu * 100)}%)
          </div>
        </div>
        <div className="border rounded p-2">
          <div className="font-medium">Negative</div>
          <div>
            {counts.neg} ({Math.round(ratios.neg * 100)}%)
          </div>
        </div>
      </div>
    </div>
  );
}
