import { NextResponse } from "next/server";
import { getOrCreateSessionId, attachSessionCookie } from "@/lib/session";
import { storage } from "@/storage";

export async function GET(_: Request, ctx: { params: { requestId: string } }) {
  const { sessionId, setCookie } = await getOrCreateSessionId();
  const data = await storage.getHistoryDetail(sessionId, ctx.params.requestId);

  const res = NextResponse.json(data);
  if (setCookie) attachSessionCookie(res, sessionId);
  return res;
}
