// types/targetAudience.ts

export type LuxuryLevel = "luxury" | "mid" | "budget";

export interface GenerateTargetAudienceRequest {
  productName: string;
  category: string;
  priceRange?: {
    min?: number | null;
    max?: number | null;
  };
  luxuryLevel: LuxuryLevel;
  features?: string[];
  colourStyle?: string;
  notes?: string;
}

export interface TargetAudience {
  summary: string;

  ageRange?: {
    min?: number;
    max?: number;
  };

  incomeLevel?: string;
  demographics?: string;
  interests?: string[];
  preferredChannels?: string[];
}

export interface GenerateTargetAudienceResponse {
  targetAudience: TargetAudience;
}

export interface ApiErrorResponse {
  message: string;
  fieldErrors?: Record<string, string>;
}
