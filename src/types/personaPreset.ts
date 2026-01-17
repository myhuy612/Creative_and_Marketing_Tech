// src/types/personaPreset.ts

import type { GeneratePersonaRequest, TargetAudience } from "@/types/persona";

export type PersonaPresetMode = "targetAudienceJson" | "manual";

export interface PersonaPreset {
  id: string; // stable id (UUID推奨だがseed段階はslugでもOK)
  name: string;
  description: string;
  tags?: string[];
  mode: PersonaPresetMode;

  payload: {
    numPersonas?: 1 | 2 | 3;
    context?: GeneratePersonaRequest["context"];
    targetAudience?: TargetAudience; // mode=targetAudienceJson の場合に使用
    manualTargetInfo?: GeneratePersonaRequest["manualTargetInfo"]; // mode=manual の場合に使用
  };

  // 将来DB導入時に更新の追跡をしやすくするためのメタ
  version?: number;
  updatedAt?: string; // ISO string
}

export interface ListPresetsResponse {
  schemaVersion: 1;
  presets: PersonaPreset[];
}
