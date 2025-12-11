import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_KEY =
  process.env.GOOGLE_API_KEY ||
  process.env.GEMINI_API_KEY ||
  "";

const genAI = new GoogleGenerativeAI(API_KEY);

// -----------------------------
// normalize() — keep original logic
// -----------------------------
function normalize(body: any) {
  const brandName = String(body.brandName ?? "").trim();

  const brandTone =
    (["Witty", "Professional", "Friendly"].includes(String(body.brandTone))
      ? body.brandTone
      : "Friendly") as "Witty" | "Professional" | "Friendly";

  const contentType =
    (["Instagram Caption", "Blog Post", "Ad Copy"].includes(String(body.contentType))
      ? body.contentType
      : "Instagram Caption") as
      | "Instagram Caption"
      | "Blog Post"
      | "Ad Copy";

  const contentLength =
    (["Short", "Medium", "Long"].includes(String(body.contentLength))
      ? body.contentLength
      : "Medium") as "Short" | "Medium" | "Long";

  return {
    brandName,
    brandTone,
    contentType,
    contentLength,
    campaignGoal: String(body.campaignGoal ?? "").trim(),
    keywords: String(body.keywords ?? "").trim(),
  };
}

// -----------------------------
// buildPrompt() — original logic preserved
// -----------------------------
function buildPrompt(p: ReturnType<typeof normalize>) {
  const target =
    p.contentLength === "Short"
      ? "50–80"
      : p.contentLength === "Long"
      ? "250–350"
      : "120–180";

  const kws = p.keywords
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");

  return [
    `You are a marketing copywriter.`,
    `Write a ${p.contentType} for the brand "${p.brandName}" in a ${p.brandTone.toLowerCase()} voice.`,
    p.campaignGoal ? `Campaign objective: ${p.campaignGoal}.` : ``,
    kws ? `Incorporate these keywords/hashtags where natural: ${kws}.` : ``,
    `Length ~${target} words.`,
    `Output plain text only (no markdown).`,
  ]
    .filter(Boolean)
    .join(" ");
}

// -----------------------------
// NEW POST handler (modern SDK)
// -----------------------------
export async function POST(req: Request) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: "Missing GOOGLE_API_KEY" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const data = normalize(body);
    const prompt = buildPrompt(data);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ content: text });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
