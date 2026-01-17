// src/app/api/presets/persona/route.ts

import { NextResponse } from "next/server";
import type { ListPresetsResponse } from "@/types/personaPreset";
import { PERSONA_PRESETS_SEED } from "@/data/personaPresets.seed";

export async function GET() {
  const res: ListPresetsResponse = {
    schemaVersion: 1,
    presets: PERSONA_PRESETS_SEED,
  };
  return NextResponse.json(res, { status: 200 });
}
