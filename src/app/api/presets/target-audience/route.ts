// src/app/api/presets/target-audience/route.ts
import { NextResponse } from "next/server";
import { getTargetAudiencePresetRepository } from "@/server/presets/targetAudiencePresetRepository";
import type { ApiErrorResponse, ListTargetAudiencePresetsResponse } from "@/types/targetAudiencePreset";

export async function GET() {
  try {
    const repo = getTargetAudiencePresetRepository();
    const presets = await repo.list();

    const body: ListTargetAudiencePresetsResponse = { presets };
    return NextResponse.json(body, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load presets. Please try again.";

    const body: ApiErrorResponse = { message };
    return NextResponse.json(body, { status: 500 });
  }
}
