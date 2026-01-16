export type FeatureType =
  | "differentiation"
  | "comparisonChecklist"
  | "competitorGapAnalyzer";

export type StoredRequest = {
  id: string;
  sessionId: string;
  featureType: FeatureType;
  input: unknown;
  createdAt: string;
};

export type StoredResult = {
  id: string;
  requestId: string;
  sessionId: string;
  status: "success" | "error";
  output: unknown;
  errorMessage?: string | null;
  model?: string | null;
  latencyMs?: number | null;
  createdAt: string;
};

export type OwnCopy = {
  id: string;
  sessionId: string;
  copyText: string;
  tags?: unknown;
  createdAt: string;
};

export interface Storage {
  insertRequest(r: Omit<StoredRequest, "createdAt">): Promise<StoredRequest>;
  insertResult(r: Omit<StoredResult, "createdAt">): Promise<StoredResult>;

  listHistory(
    sessionId: string,
    opts: { featureType?: FeatureType; limit: number }
  ): Promise<Array<{ request: StoredRequest; result?: StoredResult }>>;

  getHistoryDetail(
    sessionId: string,
    requestId: string
  ): Promise<{ request?: StoredRequest; result?: StoredResult }>;

  addOwnCopy(c: Omit<OwnCopy, "createdAt">): Promise<OwnCopy>;
  listOwnCopies(sessionId: string, limit: number): Promise<OwnCopy[]>;
}
