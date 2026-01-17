import { z } from "zod";

export const CompetitorGapAnalyzerInputSchema = z.object({
  competitorCopies: z.array(z.string().min(3).max(800)).min(2).max(20),
  options: z
    .object({
      industry: z.string().max(120).optional(),
      target: z.string().max(120).optional(),
      tone: z.string().max(120).optional(),
      forbiddenPhrases: z.string().max(400).optional(),
    })
    .optional(),
});

export const CompetitorGapAnalyzerOutputSchema = z.object({
  gaps: z.object({
    vocab: z
      .array(
        z.object({
          term: z.string(),
          direction: z.enum(["add_to_own", "differentiate_more"]),
          rationale: z.string(),
        })
      )
      .min(1),
    axes: z
      .array(
        z.object({
          axis: z.string(),
          description: z.string(),
          supporting_terms: z.array(z.string()).default([]),
        })
      )
      .min(1),
  }),
  recommendations: z
    .array(
      z.object({
        type: z.string(),
        copy: z.string(),
        axis: z.string().optional().nullable(),
      })
    )
    .min(1),
  risks: z
    .array(
      z.object({
        risk: z.string(),
        mitigation: z.string(),
      })
    )
    .default([]),
});
