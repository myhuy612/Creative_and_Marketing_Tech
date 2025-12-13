// src/app/api/target-audience/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  GenerateTargetAudienceRequest,
  TargetAudience,
  GenerateTargetAudienceResponse,
  ApiErrorResponse,
} from "@/types/targetAudience";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ============ AI client initialization ============
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.warn(
    "[target-audience API] GOOGLE_API_KEY is not set. Requests will fail at runtime."
  );
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Use a current, supported model name.
// You can override this via GOOGLE_MODEL_NAME in .env.local.
const MODEL_NAME = process.env.GOOGLE_MODEL_NAME || "gemini-2.0-flash";

export async function POST(
  req: NextRequest
): Promise<NextResponse<GenerateTargetAudienceResponse | ApiErrorResponse>> {
  try {
    const body = (await req.json()) as GenerateTargetAudienceRequest;

    // ---- 1. Request validation ----
    const validationError = validateRequest(body);
    if (validationError) {
      return NextResponse.json(
        { message: validationError },
        { status: 400 }
      );
    }

    if (!genAI) {
      return NextResponse.json(
        {
          message:
            "Server AI client is not configured. Please check GOOGLE_API_KEY.",
        },
        { status: 500 }
      );
    }

    // ---- 2. Build prompt ----
    const prompt = buildPrompt(body);

    // ---- 3. Call AI model ----
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // ---- 4. Extract and parse JSON ----
    const jsonString = extractJson(text);
    const raw = JSON.parse(jsonString) as TargetAudience;

    const targetAudience: TargetAudience = {
      summary: raw.summary ?? "",
      ageRange: raw.ageRange,
      incomeLevel: raw.incomeLevel,
      demographics: raw.demographics,
      interests: raw.interests ?? [],
      preferredChannels: raw.preferredChannels ?? [],
    };

    return NextResponse.json(
      { targetAudience },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("[target-audience API] Error:", err);

    let message = "Failed to generate target audience.";
    const msg =
      typeof err === "object" && err !== null && "message" in err
        ? String((err as any).message)
        : typeof err === "string"
        ? err
        : "";

    // Show a clearer message for quota-related errors
    if (
      msg.includes("Quota exceeded") ||
      msg.includes("You exceeded your current quota") ||
      msg.includes("429 Too Many Requests")
    ) {
      message =
        "Gemini API quota has been exceeded or is not available. Please check your plan and billing settings for this API key.";
    } else if (msg) {
      message = msg;
    }

    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

// ========================
// Helper: Request validation
// ========================
function validateRequest(body: GenerateTargetAudienceRequest): string | null {
  if (!body.productName || body.productName.trim().length === 0) {
    return "productName is required.";
  }
  if (!body.category || body.category.trim().length === 0) {
    return "category is required.";
  }
  if (!body.luxuryLevel) {
    return "luxuryLevel is required.";
  }

  if (body.priceRange) {
    const { min, max } = body.priceRange;
    if (min != null && max != null && min > max) {
      return "priceRange.min must be less than or equal to priceRange.max.";
    }
  }

  return null;
}

// ========================
// Helper: Prompt builder
// ========================
function buildPrompt(body: GenerateTargetAudienceRequest): string {
  const {
    productName,
    category,
    priceRange,
    luxuryLevel,
    features,
    colourStyle,
    notes,
  } = body;

  return `
You are a senior marketing strategist.

Based on the following product information, infer an ideal target audience for marketing this product.

Return ONLY a JSON object with the following shape, no additional explanation:

{
  "summary": string,
  "ageRange": { "min": number, "max": number },
  "incomeLevel": string,
  "demographics": string,
  "interests": string[],
  "preferredChannels": string[]
}

Product information:
- Name: ${productName}
- Category: ${category}
- Price range: ${
    priceRange
      ? `${priceRange.min ?? "N/A"} - ${priceRange.max ?? "N/A"}`
      : "N/A"
  }
- Luxury level: ${luxuryLevel}
- Features: ${
    features && features.length > 0 ? features.join(", ") : "N/A"
  }
- Colour / style: ${colourStyle ?? "N/A"}
- Notes / selling points: ${notes ?? "N/A"}

Please ensure the JSON is valid and can be parsed by JSON.parse in JavaScript.
`;
}

// ========================
// Helper: Extract JSON from AI text
// ========================
function extractJson(text: string): string {
  // Pattern: ```json ... ```
  const jsonMatch = text.match(/```json([\s\S]*?)```/i);
  if (jsonMatch && jsonMatch[1]) {
    return jsonMatch[1].trim();
  }

  // Pattern: ``` ... ```
  const genericMatch = text.match(/```([\s\S]*?)```/);
  if (genericMatch && genericMatch[1]) {
    return genericMatch[1].trim();
  }

  // Otherwise, return as-is
  return text;
}
