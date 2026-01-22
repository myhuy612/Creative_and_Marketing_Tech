import { N8nAgentRequest, N8nAgentResponse } from "@/types/n8nAgent";

export async function callN8nAgent(payload: N8nAgentRequest): Promise<N8nAgentResponse> {
  const url = process.env.N8N_WEBHOOK_URL;
  const secret = process.env.N8N_WEBHOOK_SECRET;

  if (!url) return { success: false, error: "Missing N8N_WEBHOOK_URL" };
  if (!secret) return { success: false, error: "Missing N8N_WEBHOOK_SECRET" };

  // Timeout protection (important)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-n8n-secret": secret,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const text = await res.text();

    // If n8n returns non-JSON sometimes
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      return {
        success: false,
        error: data?.error || `n8n request failed (${res.status})`,
      };
    }

    return { success: true, data };
  } catch (err: any) {
    const msg =
      err?.name === "AbortError"
        ? "n8n request timed out"
        : err?.message || "Unknown error calling n8n";
    return { success: false, error: msg };
  } finally {
    clearTimeout(timeout);
  }
}
