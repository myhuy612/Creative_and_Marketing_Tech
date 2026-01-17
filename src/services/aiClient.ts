import { extractJsonObject } from "@/lib/json";

type ChatMessage = { role: "system" | "user"; content: string };

function pickTextFromGemini(resp: any): string {
  const text =
    resp?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p?.text)
      ?.filter(Boolean)
      ?.join("") ?? "";
  return text;
}

export async function generateJson(params: {
  messages: ChatMessage[];
  temperature?: number;
}): Promise<{ jsonText: string; model: string; rawText: string; latencyMs: number }> {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  if (!apiKey) throw new Error("Missing GOOGLE_API_KEY");

  const system = params.messages.find((m) => m.role === "system")?.content ?? "";
  const user = params.messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n\n");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    systemInstruction: system ? { parts: [{ text: system }] } : undefined,
    contents: [{ role: "user", parts: [{ text: user }] }],
    generationConfig: {
      temperature: params.temperature ?? 0.4,
      responseMimeType: "application/json",
    },
  };

  const t0 = Date.now();
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const latencyMs = Date.now() - t0;

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`Gemini error ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  const rawText = pickTextFromGemini(data);
  const jsonText = extractJsonObject(rawText);

  return { jsonText, model, rawText, latencyMs };
}
