// src/lib/mappers/targetAudienceToManualTargetInfo.ts

import type { TargetAudience } from "@/types/targetAudience";
import type { GeneratePersonaRequest } from "@/types/persona";

/**
 * Map TargetAudience result -> Persona manualTargetInfo (Manual-only UI)
 * - Keep it minimal and safe (no extra inference here).
 */
export function targetAudienceToManualTargetInfo(
  ta: TargetAudience
): NonNullable<GeneratePersonaRequest["manualTargetInfo"]> {
  return {
    audienceSummary: ta.summary,
    preferredChannels: ta.preferredChannels ?? [],
    goals: [],
    pains: [],
    motivations: [],
    geography: undefined,
  };
}
