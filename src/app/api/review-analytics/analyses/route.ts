import { NextResponse } from "next/server";
import { getReviewAnalyticsSessionId } from "@/app/review-analytics/lib/reviewsSession";

export async function POST(req: Request) {
  const session_id = await getReviewAnalyticsSessionId();
  if (!session_id) return new NextResponse("No session.", { status: 401 });

  const body = await req.json();
  const base = process.env.FASTAPI_BASE_URL!;
  const res = await fetch(`${base}/analyses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, session_id }),
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
