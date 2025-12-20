// src/app/api/generate/persona/route.ts

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  ApiErrorResponse,
  GeneratePersonaRequest,
  GeneratePersonaResponse,
  Persona,
} from "@/types/persona";

function badRequest(message: string) {
  return NextResponse.json<ApiErrorResponse>({ message }, { status: 400 });
}

function serverError(message: string) {
  return NextResponse.json<ApiErrorResponse>({ message }, { status: 500 });
}

function extractJson(text: string): string {
  // Prefer fenced JSON blocks
  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i) || text.match(/```\s*([\s\S]*?)\s*```/);
  if (fenced?.[1]) return fenced[1].trim();

  // Fallback: find first { ... last }
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    return text.slice(first, last + 1).trim();
  }
  return text.trim();
}

function validateRequest(body: any): GeneratePersonaRequest | null {
  if (!body || body.schemaVersion !== 1) return null;

  const num = body.numPersonas ?? 1;
  if (![1, 2, 3].includes(num)) return null;

  const hasTA = !!body.targetAudience;
  const hasManual = !!body.manualTargetInfo;

  if (!hasTA && !hasManual) return null;

  return {
    schemaVersion: 1,
    targetAudience: body.targetAudience,
    manualTargetInfo: body.manualTargetInfo,
    context: body.context,
    numPersonas: num,
  };
}

function buildPrompt(req: GeneratePersonaRequest): string {
  const schema = {
    schemaVersion: 1,
    personas: [
      {
        personaName: "string",
        tagline: "string",
        demographics: "string",
        goals: ["string", "string", "string"],
        pains: ["string", "string", "string"],
        motivations: ["string", "string", "string"],
        channels: ["string", "string", "string"],
        keyMessage: "string",
        objections: ["string", "string"],
        recommendedTone: "string",
      },
    ],
    assumptions: ["string"],
    provenance: {
      usedTargetAudience: true,
      usedManualTargetInfo: false,
    },
  };

  return [
    "You are a senior marketing strategist.",
    "Generate realistic but fictional marketing personas based on the provided audience information.",
    "The persona must be a fictional archetype (not a real person).",
    "",
    "Return ONLY a single JSON object that strictly matches this schema (no markdown, no extra text):",
    JSON.stringify(schema, null, 2),
    "",
    "Rules:",
    "- personas array length must equal numPersonas.",
    "- goals/pains/motivations should each have 3 items.",
    "- objections should have 2 items.",
    "- If information is missing, make reasonable assumptions and list them in assumptions.",
    "- provenance.usedTargetAudience and usedManualTargetInfo must reflect inputs actually used.",
    "",
    "Inputs:",
    `numPersonas: ${req.numPersonas ?? 1}`,
    `context: ${JSON.stringify(req.context ?? {}, null, 2)}`,
    `targetAudience: ${JSON.stringify(req.targetAudience ?? null, null, 2)}`,
    `manualTargetInfo: ${JSON.stringify(req.manualTargetInfo ?? null, null, 2)}`,
  ].join("\n");
}

function normalizeResponse(obj: any, usedTA: boolean, usedManual: boolean, num: number): GeneratePersonaResponse {
  const personasRaw = Array.isArray(obj?.personas) ? obj.personas : [];
  const personas: Persona[] = personasRaw.slice(0, num).map((p: any) => ({
    personaName: String(p?.personaName ?? "Persona"),
    tagline: String(p?.tagline ?? ""),
    demographics: String(p?.demographics ?? ""),
    goals: Array.isArray(p?.goals) ? p.goals.map(String).slice(0, 3) : [],
    pains: Array.isArray(p?.pains) ? p.pains.map(String).slice(0, 3) : [],
    motivations: Array.isArray(p?.motivations) ? p.motivations.map(String).slice(0, 3) : [],
    channels: Array.isArray(p?.channels) ? p.channels.map(String).slice(0, 5) : [],
    keyMessage: String(p?.keyMessage ?? ""),
    objections: Array.isArray(p?.objections) ? p.objections.map(String).slice(0, 3) : [],
    recommendedTone: String(p?.recommendedTone ?? ""),
  }));

  // Ensure length == num (pad if needed)
  while (personas.length < num) {
    personas.push({
      personaName: `Persona ${personas.length + 1}`,
      tagline: "",
      demographics: "",
      goals: [],
      pains: [],
      motivations: [],
      channels: [],
      keyMessage: "",
      objections: [],
      recommendedTone: "",
    });
  }

  return {
    schemaVersion: 1,
    personas,
    assumptions: Array.isArray(obj?.assumptions) ? obj.assumptions.map(String).slice(0, 10) : [],
    provenance: {
      usedTargetAudience: usedTA,
      usedManualTargetInfo: usedManual,
    },
  };
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return serverError("Missing GOOGLE_API_KEY in environment variables.");

    const raw = await req.json().catch(() => null);
    const parsed = validateRequest(raw);
    if (!parsed) {
      return badRequest(
        "Invalid request. Provide schemaVersion=1 and either targetAudience or manualTargetInfo. numPersonas must be 1, 2, or 3."
      );
    }

    const usedTA = !!parsed.targetAudience;
    const usedManual = !!parsed.manualTargetInfo;
    const num = parsed.numPersonas ?? 1;

    const modelName = process.env.GOOGLE_MODEL_NAME || "gemini-2.0-flash";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = buildPrompt(parsed);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonText = extractJson(text);
    let obj: any;
    try {
      obj = JSON.parse(jsonText);
    } catch {
      return serverError("AI returned an invalid JSON response. Please try again.");
    }

    const response = normalizeResponse(obj, usedTA, usedManual, num);
    return NextResponse.json<GeneratePersonaResponse>(response, { status: 200 });
  } catch (e: any) {
    return serverError(e?.message || "Unexpected error while generating persona.");
  }
}
