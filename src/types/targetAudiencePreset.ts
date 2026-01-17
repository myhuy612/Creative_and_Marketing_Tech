// src/types/targetAudiencePreset.ts
import type { GenerateTargetAudienceRequest } from "./targetAudience";

export type TargetAudiencePreset = {
  id: string; // 将来DBならuuid推奨。今はslugでもOK
  name: string;
  description?: string;
  tags?: string[];
  isPublic: boolean;

  // 将来DB導入時に使う（今は未使用でOK）
  ownerId?: string | null;
  teamId?: string | null;

  form: GenerateTargetAudienceRequest;

  // 将来DB導入時に使う（今は固定値でもOK）
  version: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type ListTargetAudiencePresetsResponse = {
  presets: TargetAudiencePreset[];
};

export type ApiErrorResponse = {
  message: string;
};
