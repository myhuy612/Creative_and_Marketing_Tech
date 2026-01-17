// src/data/personaPresets.seed.ts

import type { PersonaPreset } from "@/types/personaPreset";

export const PERSONA_PRESETS_SEED: PersonaPreset[] = [
  {
    id: "d2c-fitness-urban",
    name: "D2C Fitness (Urban Professionals)",
    description: "Time-poor young professionals who want convenient, premium fitness solutions.",
    tags: ["D2C", "Fitness", "Urban"],
    mode: "targetAudienceJson",
    version: 1,
    updatedAt: new Date().toISOString(),
    payload: {
      numPersonas: 1,
      context: { category: "Fitness", tone: "energetic, premium, concise" },
      targetAudience: {
        summary: "Young professionals (25–35) in urban areas who value convenience, quality, and modern design.",
        ageRange: { min: 25, max: 35 },
        incomeLevel: "Mid to upper-mid",
        demographics: "Urban, time-poor, research-driven buyers",
        interests: ["fitness", "tech", "wellness", "productivity"],
        preferredChannels: ["Instagram", "TikTok", "YouTube", "Google Search"],
      },
    },
  },
  {
    id: "eco-home-family",
    name: "Eco Home (Family Buyers)",
    description: "Family households seeking sustainable, safe, and affordable home products.",
    tags: ["Eco", "Home", "Family"],
    mode: "manual",
    version: 1,
    updatedAt: new Date().toISOString(),
    payload: {
      numPersonas: 1,
      context: { category: "Home & Living", tone: "trustworthy, warm, practical" },
      manualTargetInfo: {
        audienceSummary:
          "Families (30–45) looking for eco-friendly home products that are safe for kids and pets, without paying luxury prices.",
        goals: ["Reduce waste at home", "Keep family safe", "Buy long-lasting products"],
        pains: ["Greenwashing and unclear labels", "Higher upfront cost", "Hard to compare options"],
        motivations: ["Health and safety", "Long-term value", "Social proof and reviews"],
        preferredChannels: ["Facebook", "Instagram", "YouTube", "Email newsletters"],
        geography: "Australia (metro + suburban)",
      },
    },
  },
  {
    id: "b2b-saas-ops",
    name: "B2B SaaS (SMB Ops Manager)",
    description: "Ops/IT managers who need simple, reliable tools that reduce admin overhead.",
    tags: ["B2B", "SaaS", "SMB"],
    mode: "manual",
    version: 1,
    updatedAt: new Date().toISOString(),
    payload: {
      numPersonas: 1,
      context: { category: "B2B SaaS", tone: "clear, confident, benefit-led" },
      manualTargetInfo: {
        audienceSummary:
          "Operations/IT managers at small-to-mid businesses who are responsible for adopting tools that save time and reduce risk.",
        goals: ["Automate repetitive tasks", "Reduce errors", "Deliver quick wins to leadership"],
        pains: ["Tool sprawl", "Long onboarding time", "Security/compliance concerns"],
        motivations: ["ROI clarity", "Ease of adoption", "Reliable support and documentation"],
        preferredChannels: ["LinkedIn", "Google Search", "Webinars", "Product comparison sites"],
        geography: "Australia / APAC",
      },
    },
  },
  {
    id: "local-cafe-community",
    name: "Local Café (Community Regulars)",
    description: "Locals who value atmosphere, consistency, and small treats in daily routines.",
    tags: ["Local", "Hospitality", "Community"],
    mode: "targetAudienceJson",
    version: 1,
    updatedAt: new Date().toISOString(),
    payload: {
      numPersonas: 1,
      context: { category: "Hospitality", tone: "friendly, welcoming, playful" },
      targetAudience: {
        summary:
          "Local residents and nearby office workers who visit cafés for daily coffee rituals and social connection.",
        demographics: "Mix of students, office workers, and nearby residents; convenience-driven",
        interests: ["coffee", "brunch", "local events", "Instagrammable food"],
        preferredChannels: ["Instagram", "Google Maps", "TikTok", "Word of mouth"],
      },
    },
  },
  {
    id: "travel-app-weekenders",
    name: "Travel App (Weekend Explorers)",
    description: "People planning short trips who want curated recommendations fast.",
    tags: ["Travel", "App", "Lifestyle"],
    mode: "manual",
    version: 1,
    updatedAt: new Date().toISOString(),
    payload: {
      numPersonas: 2,
      context: { category: "Travel", tone: "optimistic, inspiring, actionable" },
      manualTargetInfo: {
        audienceSummary:
          "Adults (20–40) planning weekend getaways who want curated itineraries and stress-free bookings.",
        goals: ["Save planning time", "Discover hidden gems", "Stay within budget"],
        pains: ["Too many options", "Unreliable reviews", "Last-minute price jumps"],
        motivations: ["Convenience", "Experiences and memories", "Social sharing"],
        preferredChannels: ["Instagram", "TikTok", "YouTube", "Search"],
        geography: "Australia (domestic travel)",
      },
    },
  },
  {
    id: "luxury-fashion-high-income",
    name: "Luxury Fashion (High Income)",
    description: "High-income buyers seeking exclusivity, craftsmanship, and status signals.",
    tags: ["Luxury", "Fashion", "Premium"],
    mode: "targetAudienceJson",
    version: 1,
    updatedAt: new Date().toISOString(),
    payload: {
      numPersonas: 1,
      context: { category: "Luxury Fashion", tone: "minimal, refined, aspirational" },
      targetAudience: {
        summary:
          "High-income professionals and style enthusiasts who value craftsmanship, exclusivity, and brand heritage.",
        incomeLevel: "High",
        demographics: "Metro-based; quality-first; brand-aware; status-sensitive",
        interests: ["fashion", "design", "luxury travel", "fine dining"],
        preferredChannels: ["Instagram", "High-end magazines", "YouTube", "Private events"],
      },
    },
  },
];
