import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const REVIEW_ANALYTICS_SESSION_COOKIE = "review_analytics_session_id";

/**
 * Get the Review Analytics session_id from an httpOnly cookie.
 */
export async function getReviewAnalyticsSessionId(): Promise<string | null> {
  // cookies() may return a Promise depending on Next.js version, so always await it.
  const jar = await cookies();
  return jar.get(REVIEW_ANALYTICS_SESSION_COOKIE)?.value ?? null;
}

/**
 * Attach the Review Analytics session cookie to a NextResponse.
 * Uses an httpOnly cookie for better security.
 */
export function attachReviewAnalyticsSessionCookie(res: NextResponse, sessionId: string) {
  res.cookies.set({
    name: REVIEW_ANALYTICS_SESSION_COOKIE,
    value: sessionId,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
}
