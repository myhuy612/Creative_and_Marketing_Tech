import { z } from "zod";

export const ComparisonChecklistInputSchema = z.object({
  ownFeatures: z.string().min(10).max(2000),
  competitorFeatures: z.string().min(10).max(2000),
  options: z
    .object({
      industry: z.string().max(120).optional(),
      target: z.string().max(120).optional(),
      forbiddenPhrases: z.string().max(400).optional(),
    })
    .optional(),
});

export const ComparisonChecklistOutputSchema = z.object({
  checklist: z
    .array(
      z.object({
        category: z.string(),
        ownAdvantage: z.string(),
        copyVariants: z.array(z.string()).min(1),
        tableBullets: z.array(z.string()).min(1),
        caution: z.string().optional().nullable(),
      })
    )
    .min(1),
});
