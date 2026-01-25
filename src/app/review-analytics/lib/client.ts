import type { AnalysisDetail, HistoryItem } from "../types/analysis";

const API_BASE = "/api/review-analytics";

export async function ensureSession() {
  const res = await fetch(`${API_BASE}/session`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to create session.");
  return res.json() as Promise<{ session_id: string }>;
}

export async function createAnalysis(params: {
  language: "auto" | "ja" | "en";
  reviews: string[];
}) {
  const res = await fetch(`${API_BASE}/analyses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: params.language,
      reviews: params.reviews,
      modules: ["sentiment"],
    }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Failed to create analysis.");
  }
  return res.json() as Promise<{ analysis_id: string; status: string }>;
}

export async function getAnalysis(id: string) {
  const res = await fetch(`${API_BASE}/analyses/${id}`, { method: "GET" });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Failed to fetch analysis details.");
  }
  return res.json() as Promise<AnalysisDetail>;
}

export async function getHistory(limit = 10) {
  const res = await fetch(`${API_BASE}/history?limit=${limit}`, { method: "GET" });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Failed to fetch history.");
  }
  return res.json() as Promise<{ items: HistoryItem[] }>;
}

export async function rerunAnalysis(id: string) {
  const res = await fetch(`${API_BASE}/rerun`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis_id: id, modules: ["sentiment"] }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Failed to rerun analysis.");
  }
  return res.json() as Promise<{ analysis_id: string; status: string }>;
}
