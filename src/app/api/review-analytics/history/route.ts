import { NextResponse } from "next/server";
import { getReviewAnalyticsSessionId } from "@/app/review-analytics/lib/reviewsSession";

export async function GET(req: Request) {
  const session_id = await getReviewAnalyticsSessionId();
  if (!session_id) return new NextResponse("No session.", { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") ?? "10";

  const base = process.env.FASTAPI_BASE_URL!;
  const res = await fetch(
    `${base}/history?session_id=${encodeURIComponent(session_id)}&limit=${encodeURIComponent(limit)}`,
    { method: "GET" }
  );

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
