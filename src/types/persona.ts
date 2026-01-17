// src/types/persona.ts

export interface TargetAudience {
  summary: string;
  ageRange?: { min: number; max: number };
  incomeLevel?: string;
  demographics?: string;
  interests?: string[];
  preferredChannels?: string[];
}

export interface Persona {
  personaName: string;
  tagline: string;
  demographics: string;
  goals: string[];
  pains: string[];
  motivations: string[];
  channels: string[];
  keyMessage: string;
  objections: string[];
  recommendedTone: string;
}

export interface GeneratePersonaRequest {
  schemaVersion: 1;

  // 連携モード（TargetAudienceをそのまま渡す）
  targetAudience?: TargetAudience;

  // 単体モード（TargetAudienceが無くても生成できる）
  manualTargetInfo?: {
    audienceSummary?: string;
    goals?: string[];
    pains?: string[];
    motivations?: string[];
    preferredChannels?: string[];
    geography?: string;
  };

  // 文脈補強（任意）
  context?: {
    brandName?: string;
    productName?: string;
    category?: string;
    valueProposition?: string;
    tone?: string;
  };

  numPersonas?: 1 | 2 | 3;
}

export interface GeneratePersonaResponse {
  schemaVersion: 1;
  personas: Persona[];
  assumptions?: string[];
  provenance?: {
    usedTargetAudience: boolean;
    usedManualTargetInfo: boolean;
  };
}

export interface ApiErrorResponse {
  message: string;
}
