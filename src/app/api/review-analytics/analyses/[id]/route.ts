import { NextResponse } from "next/server";
import { getReviewAnalyticsSessionId } from "@/app/review-analytics/lib/reviewsSession";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session_id = await getReviewAnalyticsSessionId();
  if (!session_id) return new NextResponse("No session.", { status: 401 });

  const base = process.env.FASTAPI_BASE_URL!;
  const res = await fetch(
    `${base}/analyses/${params.id}?session_id=${encodeURIComponent(session_id)}`,
    { method: "GET" }
  );

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
