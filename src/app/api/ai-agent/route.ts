import { callN8nAgent } from "@/lib/n8nClient";
import { N8nAgentRequest } from "@/types/n8nAgent";

export async function POST(req: Request) {
  let body: N8nAgentRequest;

  try {
    body = await req.json();
  } catch {
    return Response.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body?.prompt || typeof body.prompt !== "string") {
    return Response.json({ success: false, error: "Missing prompt" }, { status: 400 });
  }

  // Optional: add user identity from your auth/session here
  const payload: N8nAgentRequest = {
    userId: body.userId, // or your real session user id
    prompt: body.prompt.trim(),
    context: body.context || {},
  };

  const result = await callN8nAgent(payload);

  if (!result.success) {
    return Response.json(result, { status: 502 }); // Bad gateway (upstream failure)
  }

  return Response.json(result);
}
