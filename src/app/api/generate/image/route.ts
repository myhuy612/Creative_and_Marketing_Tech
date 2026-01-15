import { NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROJECT_ID = "gen-lang-client-0226472054";
const LOCATION = "us-central1";

type ImageInput = {
  brandName: string;
  description: string;
  marketingStyle?: string;
};

function buildPrompt(input: ImageInput) {
  return `
Generate a high-quality marketing image.

Brand: ${input.brandName}
Description: ${input.description}
Style: ${input.marketingStyle || "clean, modern, elegant"}
`;
}

export async function POST(req: Request) {
  try {
    const input: ImageInput = await req.json();
    const prompt = buildPrompt(input);

    const auth = new GoogleAuth({
      keyFile: "keys/vertex-sa.json", 
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/imagen-4.0-fast-generate-001:predict`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          imageSize: "1024x1024",
        },
      }),
    });

    const result = await response.json();
    console.log("RAW RESPONSE:", result);

    const base64 = result?.predictions?.[0]?.bytesBase64Encoded;

    if (!base64) {
      return NextResponse.json({ error: "No image returned", result }, { status: 500 });
    }

    return NextResponse.json({ image: `data:image/png;base64,${base64}` });

  } catch (err: any) {
    console.error("IMAGE ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
