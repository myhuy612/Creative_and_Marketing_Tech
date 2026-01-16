import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getOrCreateSessionId, attachSessionCookie } from "@/lib/session";
import {
  DifferentiationInputSchema,
  DifferentiationOutputSchema,
} from "@/schemas/differentiationSchema";
import { generateJson } from "@/services/aiClient";
import { SYSTEM_JSON_ONLY, promptDifferentiation } from "@/services/prompts";
import { storage } from "@/storage";

export async function POST(req: Request) {
  const { sessionId, setCookie } = await getOrCreateSessionId();

  try {
    const input = DifferentiationInputSchema.parse(await req.json());

    const requestId = randomUUID();
    await storage.insertRequest({
      id: requestId,
      sessionId,
      featureType: "differentiation",
      input,
    });

    const { jsonText, model, latencyMs } = await generateJson({
      messages: [
        { role: "system", content: SYSTEM_JSON_ONLY },
        { role: "user", content: promptDifferentiation(input) },
      ],
      temperature: 0.5,
    });

    const result = DifferentiationOutputSchema.parse(JSON.parse(jsonText));

    await storage.insertResult({
      id: randomUUID(),
      requestId,
      sessionId,
      status: "success",
      output: result,
      model,
      latencyMs,
    });

    const res = NextResponse.json({ requestId, result });
    if (setCookie) attachSessionCookie(res, sessionId);
    return res;
  } catch (e: any) {
    const res = NextResponse.json({ error: e?.message ?? "Bad request" }, { status: 400 });
    if (setCookie) attachSessionCookie(res, sessionId);
    return res;
  }
}
