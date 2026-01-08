import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

<<<<<<< HEAD
export const runtime = "nodejs";          // ensure Node runtime (not Edge)
export const dynamic = "force-dynamic";   // avoid caching during dev
=======
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3

const API_KEY =
  process.env.GOOGLE_API_KEY ||
  process.env.GEMINI_API_KEY ||
  "";

<<<<<<< HEAD
console.log("[/api/generate] key present?", Boolean(API_KEY), API_KEY?.slice(0,6)); // temp debug; remove later

const genAI = new GoogleGenerativeAI(API_KEY);

type Input = {
  brandName?: string;
  brandTone?: "Witty" | "Professional" | "Friendly";
  contentType?: "Instagram Caption" | "Blog Post" | "Ad Copy";
  campaignGoal?: string;
  keywords?: string;
  contentLength?: "Short" | "Medium" | "Long";
};

// normalize + defaults + trimming
function normalize(body: Input) {
=======
const genAI = new GoogleGenerativeAI(API_KEY);

// -----------------------------
// normalize() — keep original logic
// -----------------------------
function normalize(body: any) {
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
  const brandName = String(body.brandName ?? "").trim();

  const brandTone =
    (["Witty", "Professional", "Friendly"].includes(String(body.brandTone))
      ? body.brandTone
      : "Friendly") as "Witty" | "Professional" | "Friendly";

  const contentType =
    (["Instagram Caption", "Blog Post", "Ad Copy"].includes(String(body.contentType))
      ? body.contentType
<<<<<<< HEAD
      : "Instagram Caption") as "Instagram Caption" | "Blog Post" | "Ad Copy";
=======
      : "Instagram Caption") as
      | "Instagram Caption"
      | "Blog Post"
      | "Ad Copy";
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3

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

<<<<<<< HEAD
function buildPrompt(p: ReturnType<typeof normalize>) {
  const target =
    p.contentLength === "Short" ? "50–80" :
    p.contentLength === "Long"  ? "250–350" : "120–180";
=======
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
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3

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
<<<<<<< HEAD
  ].filter(Boolean).join(" ");
}

=======
  ]
    .filter(Boolean)
    .join(" ");
}

// -----------------------------
// NEW POST handler (modern SDK)
// -----------------------------
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
export async function POST(req: Request) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
<<<<<<< HEAD
        { error: "Server misconfig: GOOGLE_API_KEY/GEMINI_API_KEY not set" },
=======
        { error: "Missing GOOGLE_API_KEY" },
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
        { status: 500 }
      );
    }

<<<<<<< HEAD
    const raw = (await req.json()) as Input;
    const data = normalize(raw);

    if (!data.brandName) {
      return NextResponse.json({ error: "brandName is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(buildPrompt(data));
    return NextResponse.json({ content: result.response.text() });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
=======
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
>>>>>>> d3d25fc13c77d45b70638227b3b954774d26e9f3
  }
}
