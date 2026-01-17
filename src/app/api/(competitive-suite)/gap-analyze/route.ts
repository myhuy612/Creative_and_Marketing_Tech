import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getOrCreateSessionId, attachSessionCookie } from "@/lib/session";
import {
  CompetitorGapAnalyzerInputSchema,
  CompetitorGapAnalyzerOutputSchema,
} from "@/schemas/competitorGapAnalyzerSchema";
import { extractGapTerms } from "@/services/analysisService";
import { generateJson } from "@/services/aiClient";
import { SYSTEM_JSON_ONLY, promptGapAnalyze } from "@/services/prompts";
import { storage } from "@/storage";

export async function POST(req: Request) {
  const { sessionId, setCookie } = await getOrCreateSessionId();

  try {
    const input = CompetitorGapAnalyzerInputSchema.parse(await req.json());

    const ownCopies = await storage.listOwnCopies(sessionId, 50);
    const ownTexts = ownCopies.map((x) => x.copyText);

    const gapTerms = extractGapTerms({
      competitorCopies: input.competitorCopies,
      ownCopies: ownTexts.length ? ownTexts : ["(no own copies yet)"],
    });

    const requestId = randomUUID();
    await storage.insertRequest({
      id: requestId,
      sessionId,
      featureType: "competitorGapAnalyzer",
      input: { ...input, gapTermsUsed: gapTerms },
    });

    const { jsonText, model, latencyMs } = await generateJson({
      messages: [
        { role: "system", content: SYSTEM_JSON_ONLY },
        {
          role: "user",
          content: promptGapAnalyze({
            options: input.options,
            gapTerms,
            ownCopiesSample: ownTexts.slice(0, 10),
          }),
        },
      ],
      temperature: 0.4,
    });

    const result = CompetitorGapAnalyzerOutputSchema.parse(JSON.parse(jsonText));

    await storage.insertResult({
      id: randomUUID(),
      requestId,
      sessionId,
      status: "success",
      output: result,
      model,
      latencyMs,
    });

    const res = NextResponse.json({ requestId, result, gapTerms });
    if (setCookie) attachSessionCookie(res, sessionId);
    return res;
  } catch (e: any) {
    const res = NextResponse.json({ error: e?.message ?? "Bad request" }, { status: 400 });
    if (setCookie) attachSessionCookie(res, sessionId);
    return res;
  }
}
