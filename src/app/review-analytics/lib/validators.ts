import { z } from "zod";

export const ReviewsInputSchema = z.object({
  language: z.enum(["auto", "ja", "en"]).default("auto"),
  reviewsText: z.string().min(1, "Please enter at least one review."),
});

export function splitReviews(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length >= 2);
}
