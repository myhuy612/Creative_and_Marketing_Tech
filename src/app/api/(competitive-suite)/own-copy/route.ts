import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { getOrCreateSessionId, attachSessionCookie } from "@/lib/session";
import { storage } from "@/storage";

const AddSchema = z.object({
  copyText: z.string().min(3).max(2000),
  tags: z.any().optional(),
});

export async function GET() {
  const { sessionId, setCookie } = await getOrCreateSessionId();
  const items = await storage.listOwnCopies(sessionId, 50);
  const res = NextResponse.json({ items });
  if (setCookie) attachSessionCookie(res, sessionId);
  return res;
}

export async function POST(req: Request) {
  const { sessionId, setCookie } = await getOrCreateSessionId();
  try {
    const body = AddSchema.parse(await req.json());
    await storage.addOwnCopy({
      id: randomUUID(),
      sessionId,
      copyText: body.copyText,
      tags: body.tags,
    });
    const items = await storage.listOwnCopies(sessionId, 50);
    const res = NextResponse.json({ items });
    if (setCookie) attachSessionCookie(res, sessionId);
    return res;
  } catch (e: any) {
    const res = NextResponse.json({ error: e?.message ?? "Bad request" }, { status: 400 });
    if (setCookie) attachSessionCookie(res, sessionId);
    return res;
  }
}
