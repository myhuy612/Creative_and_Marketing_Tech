import { Storage, StoredRequest, StoredResult, OwnCopy } from "./types";

type DB = {
  requests: StoredRequest[];
  results: StoredResult[];
  ownCopies: OwnCopy[];
};

function getDB(): DB {
  const g = globalThis as any;
  if (!g.__CMS_MEM_DB__) {
    g.__CMS_MEM_DB__ = { requests: [], results: [], ownCopies: [] } satisfies DB;
  }
  return g.__CMS_MEM_DB__ as DB;
}

export const memoryStorage: Storage = {
  async insertRequest(r) {
    const db = getDB();
    const createdAt = new Date().toISOString();
    const row: StoredRequest = { ...r, createdAt };
    db.requests.push(row);
    return row;
  },

  async insertResult(r) {
    const db = getDB();
    const createdAt = new Date().toISOString();
    const row: StoredResult = { ...r, createdAt };
    db.results.push(row);
    return row;
  },

  async listHistory(sessionId, opts) {
    const db = getDB();
    const reqs = db.requests
      .filter((x) => x.sessionId === sessionId)
      .filter((x) => (opts.featureType ? x.featureType === opts.featureType : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, opts.limit);

    return reqs.map((request) => {
      const result = db.results
        .filter((x) => x.sessionId === sessionId && x.requestId === request.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
      return { request, result };
    });
  },

  async getHistoryDetail(sessionId, requestId) {
    const db = getDB();
    const request = db.requests.find((x) => x.sessionId === sessionId && x.id === requestId);
    const result = db.results
      .filter((x) => x.sessionId === sessionId && x.requestId === requestId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

    return { request, result };
  },

  async addOwnCopy(c) {
    const db = getDB();
    const createdAt = new Date().toISOString();
    const row: OwnCopy = { ...c, createdAt };
    db.ownCopies.push(row);
    return row;
  },

  async listOwnCopies(sessionId, limit) {
    const db = getDB();
    return db.ownCopies
      .filter((x) => x.sessionId === sessionId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  },
};
