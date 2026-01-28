import { NextResponse } from "next/server";
import { GenerateBrandContentInputSchema } from "@/ai/schemas/generate-brand-content";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input (same schema you use in the form)
    const values = GenerateBrandContentInputSchema.parse(body);

    // OPTION A: Call n8n webhook (recommended if agent is in n8n)
    const n8nUrl = process.env.N8N_WEBHOOK_URL; // e.g. https://.../webhook/ai-agent
    const secret = process.env.N8N_WEBHOOK_SECRET;

    if (!n8nUrl) {
      return NextResponse.json(
        { success: false, error: "Missing N8N_WEBHOOK_URL" },
        { status: 500 }
      );
    }

    const res = await fetch(n8nUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "x-n8n-secret": secret } : {}),
      },
      body: JSON.stringify(values),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data?.error || "n8n failed", raw: data },
        { status: 502 }
      );
    }

    // Return to frontend
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    // zod validation errors will land here too
    return NextResponse.json(
      { success: false, error: err?.message ?? "Unknown error" },
      { status: 400 }
    );
  }
}
