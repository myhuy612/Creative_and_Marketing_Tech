// src/server/presets/staticTargetAudiencePresets.ts
import type { TargetAudiencePreset } from "@/types/targetAudiencePreset";

const nowIso = () => new Date().toISOString();

/**
 * 重要：
 * - 実在ブランド名は避ける
 * - GenerateTargetAudienceRequest の必須（productName/category/luxuryLevel）を必ず入れる
 * - ここは「サーバ側」から参照され、クライアント直importしない（将来DB差し替えを容易にする）
 */
export const STATIC_TARGET_AUDIENCE_PRESETS: TargetAudiencePreset[] = [
  {
    id: "eco-bottle",
    name: "Eco-friendly Water Bottle",
    description: "Reusable bottle for eco-conscious daily use.",
    tags: ["eco", "daily", "accessory"],
    isPublic: true,
    form: {
      productName: "Eco-friendly Water Bottle",
      category: "Lifestyle / Accessories",
      priceRange: { min: 20, max: 45 },
      luxuryLevel: "budget",
      features: ["BPA-free", "reusable", "leak-proof", "lightweight"],
      colourStyle: "Minimal, natural colors",
      notes: "Position as a sustainable everyday essential for commuting, gym, and travel.",
    },
    version: 1,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "premium-skincare-serum",
    name: "Premium Skincare Serum",
    description: "High-end serum focused on glow and hydration.",
    tags: ["beauty", "premium"],
    isPublic: true,
    form: {
      productName: "Premium Skincare Serum",
      category: "Beauty / Skincare",
      priceRange: { min: 60, max: 120 },
      luxuryLevel: "luxury",
      features: ["hydration", "brightening", "fragrance-free", "dermatologist-tested"],
      colourStyle: "Clean, premium, glossy look",
      notes: "Emphasize clinical credibility and visible results for busy professionals.",
    },
    version: 1,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "running-shoes-mid",
    name: "Mid-range Running Shoes",
    description: "Everyday running shoes for comfort and durability.",
    tags: ["fitness", "running"],
    isPublic: true,
    form: {
      productName: "Mid-range Running Shoes",
      category: "Sports / Footwear",
      priceRange: { min: 90, max: 160 },
      luxuryLevel: "mid",
      features: ["cushioning", "breathable", "durable outsole", "neutral support"],
      colourStyle: "Sporty, energetic tones",
      notes: "Target runners who want value-for-money and reliability for training.",
    },
    version: 1,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "kids-edu-toy",
    name: "Kids Educational Toy",
    description: "Hands-on toy that supports learning through play.",
    tags: ["kids", "education"],
    isPublic: true,
    form: {
      productName: "Kids Educational Toy",
      category: "Kids / Toys",
      priceRange: { min: 25, max: 60 },
      luxuryLevel: "mid",
      features: ["STEM", "hands-on", "safe materials", "age-appropriate"],
      colourStyle: "Bright, playful, friendly",
      notes: "Appeal to parents who value learning outcomes and screen-free play.",
    },
    version: 1,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "budget-phone-case",
    name: "Budget Phone Case",
    description: "Affordable case emphasizing protection and style.",
    tags: ["tech", "budget"],
    isPublic: true,
    form: {
      productName: "Budget Phone Case",
      category: "Tech / Accessories",
      priceRange: { min: 10, max: 25 },
      luxuryLevel: "budget",
      features: ["shock protection", "slim fit", "grip texture"],
      colourStyle: "Trendy colors, simple patterns",
      notes: "Position as a low-cost upgrade and impulse buy for students.",
    },
    version: 1,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];
