import { NextResponse } from "next/server";
import {
  getReviewAnalyticsSessionId,
  attachReviewAnalyticsSessionCookie,
} from "@/app/review-analytics/lib/reviewsSession";

export async function POST() {
  const existing = await getReviewAnalyticsSessionId();
  if (existing) return NextResponse.json({ session_id: existing });

  const base = process.env.FASTAPI_BASE_URL!;
  const apiRes = await fetch(`${base}/sessions`, { method: "POST" });

  if (!apiRes.ok) return new NextResponse("Failed to create session.", { status: 500 });

  const data = await apiRes.json(); // { session_id }

  const res = NextResponse.json(data);
  attachReviewAnalyticsSessionCookie(res, data.session_id);

  return res;
}
