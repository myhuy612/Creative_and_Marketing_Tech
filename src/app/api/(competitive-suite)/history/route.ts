import { NextResponse } from "next/server";
import { getOrCreateSessionId, attachSessionCookie } from "@/lib/session";
import { storage } from "@/storage";
import type { FeatureType } from "@/storage/types";

export async function GET(req: Request) {
  const { sessionId, setCookie } = await getOrCreateSessionId();
  const url = new URL(req.url);

  const featureType = (url.searchParams.get("feature_type") || undefined) as
    | FeatureType
    | undefined;

  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 10), 1), 50);

  const items = await storage.listHistory(sessionId, { featureType, limit });

  const res = NextResponse.json({ items });
  if (setCookie) attachSessionCookie(res, sessionId);
  return res;
}
