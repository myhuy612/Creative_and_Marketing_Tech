import { z } from "zod";

export const DifferentiationInputSchema = z.object({
  ownDescription: z.string().min(10).max(2000),
  competitors: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        description: z.string().max(2000).optional().default(""),
      })
    )
    .min(1)
    .max(2),
  options: z
    .object({
      industry: z.string().max(120).optional(),
      target: z.string().max(120).optional(),
      tone: z.string().max(120).optional(),
    })
    .optional(),
});

export const DifferentiationOutputSchema = z.object({
  differentiators: z
    .array(
      z.object({
        axis: z.string(),
        description: z.string(),
        evidence: z.array(z.string()).default([]),
        caution: z.string().optional().nullable(),
      })
    )
    .min(1),
  messages: z
    .array(
      z.object({
        headline: z.string(),
        body: z.string(),
        axis: z.string().optional().nullable(),
      })
    )
    .min(1),
  slogans: z
    .array(
      z.object({
        text: z.string(),
        axis: z.string().optional().nullable(),
      })
    )
    .min(1),
});
