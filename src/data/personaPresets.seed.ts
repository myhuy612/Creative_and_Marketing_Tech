// src/data/personaPresets.seed.ts

import type { PersonaPreset } from "@/types/personaPreset";

export const PERSONA_PRESETS_SEED: PersonaPreset[] = [
  {
    id: "d2c-fitness-urban",
    name: "D2C Fitness (Urban Professionals)",
    description: "Time-poor young professionals who want convenient, premium fitness solutions.",
    tags: ["D2C", "Fitness", "Urban"],
    version: 1,
    updatedAt: new Date().toISOString(),
    payload: {
      numPersonas: 1,
      context: { category: "Fitness", tone: "energetic, premium, concise" },
      manualTargetInfo: {
        audienceSummary:
          "Young urban professionals (25–35) who value convenience, quality, and modern design in fitness products/services.",
        goals: ["Stay healthy with minimal time", "Use products that feel premium", "Track progress easily"],
        pains: ["Too busy to plan workouts", "Low-quality products feel wasteful", "Overwhelmed by choices"],
        motivations: ["Convenience and time savings", "Performance and measurable results", "Social proof and reviews"],
        preferredChannels: ["Instagram", "TikTok", "YouTube", "Google Search"],
        geography: "Urban (metro areas)",
      },
    },
  },
  {
    id: "eco-home-family",
    name: "Eco Home (Family Buyers)",
    description: "Family households seeking sustainable, safe, and affordable home products.",
    tags: ["Eco", "Home", "Family"],
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
    version: 1,
    updatedAt: new Date().toISOString(),
    payload: {
      numPersonas: 1,
      context: { category: "Hospitality", tone: "friendly, welcoming, playful" },
      manualTargetInfo: {
        audienceSummary:
          "Local residents and nearby office workers who visit cafés for daily coffee rituals, convenience, and social connection.",
        goals: ["Find a reliable daily coffee spot", "Enjoy a cozy atmosphere", "Discover small treats and seasonal specials"],
        pains: ["Inconsistent coffee quality", "Long wait times during rush", "Limited seating or noisy environment"],
        motivations: ["Habit and routine", "Friendly staff and community feel", "Shareable experiences (photos, friends)"],
        preferredChannels: ["Instagram", "Google Maps", "TikTok", "Word of mouth"],
        geography: "Local neighborhood catchment",
      },
    },
  },
  {
    id: "travel-app-weekenders",
    name: "Travel App (Weekend Explorers)",
    description: "People planning short trips who want curated recommendations fast.",
    tags: ["Travel", "App", "Lifestyle"],
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
    version: 1,
    updatedAt: new Date().toISOString(),
    payload: {
      numPersonas: 1,
      context: { category: "Luxury Fashion", tone: "minimal, refined, aspirational" },
      manualTargetInfo: {
        audienceSummary:
          "High-income professionals and style enthusiasts who value craftsmanship, exclusivity, and brand heritage.",
        goals: ["Own timeless pieces", "Signal taste and status subtly", "Buy from trusted heritage brands"],
        pains: ["Too many mass-market ‘luxury’ options", "Concern about authenticity", "Hard to find truly unique pieces"],
        motivations: ["Exclusivity and scarcity", "Craftsmanship and materials", "Brand story and legacy"],
        preferredChannels: ["Instagram", "High-end magazines", "YouTube", "Private events"],
        geography: "Metro / international travelers",
      },
    },
  },
];
