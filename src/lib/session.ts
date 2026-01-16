import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

const COOKIE_NAME = "cms_session_id";

export async function getOrCreateSessionId() {
  // cookies() may return a Promise depending on Next.js version, so we always await it.
  const jar = await cookies();

  const existing = jar.get(COOKIE_NAME)?.value;
  if (existing) return { sessionId: existing, setCookie: false };

  const sessionId = randomUUID();
  return { sessionId, setCookie: true };
}

export function attachSessionCookie(res: NextResponse, sessionId: string) {
  res.cookies.set({
    name: COOKIE_NAME,
    value: sessionId,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
}
