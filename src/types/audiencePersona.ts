// src/types/audiencePersona.ts

import type { GenerateTargetAudienceRequest, TargetAudience } from "@/types/targetAudience";
import type { GeneratePersonaRequest, GeneratePersonaResponse } from "@/types/persona";
import type { TargetAudiencePreset } from "@/types/targetAudiencePreset";
import type { PersonaPreset } from "@/types/personaPreset";

export type AudiencePersonaPageState = {
  // Target Audience
  taForm: GenerateTargetAudienceRequest;
  taFeaturesInput: string;
  taResult: TargetAudience | null;
  taError: string | null;
  taLoading: boolean;

  // Persona (manual-only)
  personaNum: 1 | 2 | 3;
  personaContext: GeneratePersonaRequest["context"];
  personaManual: NonNullable<GeneratePersonaRequest["manualTargetInfo"]>;
  personaResult: GeneratePersonaResponse | null;
  personaError: string | null;
  personaLoading: boolean;

  // Presets
  taPresets: TargetAudiencePreset[];
  personaPresets: PersonaPreset[];
  presetsError: { ta?: string | null; persona?: string | null };
};
