export type AnalysisStatus = "queued" | "running" | "done" | "error";
export type SentimentLabel = "pos" | "neu" | "neg";

export type ReviewItem = {
  id: string;
  text: string;
  sentiment_label: SentimentLabel | null;
  sentiment_score: number | null;
};

export type SentimentSummary = {
  counts: { pos: number; neu: number; neg: number };
  ratios: { pos: number; neu: number; neg: number };
  top_positive: ReviewItem[];
  top_negative: ReviewItem[];
};

export type AnalysisDetail = {
  analysis_id: string;
  status: AnalysisStatus;
  error_message?: string | null;
  modules_status?: Record<string, AnalysisStatus>;
  sentiment_summary?: SentimentSummary | null;
  review_items?: ReviewItem[] | null;
};

export type HistoryItem = {
  analysis_id: string;
  status: AnalysisStatus;
  created_at: string;
  review_count: number;
};
