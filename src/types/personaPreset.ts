// src/types/personaPreset.ts

import type { GeneratePersonaRequest } from "@/types/persona";

// Manual-only presets
export interface PersonaPreset {
  id: string;
  name: string;
  description: string;
  tags?: string[];

  payload: {
    numPersonas?: 1 | 2 | 3;
    context?: GeneratePersonaRequest["context"];
    manualTargetInfo: NonNullable<GeneratePersonaRequest["manualTargetInfo"]>;
  };

  // DB導入後に便利なメタ
  version?: number;
  updatedAt?: string; // ISO string
}

export interface ListPresetsResponse {
  schemaVersion: 1;
  presets: PersonaPreset[];
}
