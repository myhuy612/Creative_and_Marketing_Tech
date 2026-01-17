export const SYSTEM_JSON_ONLY = `
You are a marketing analyst assistant.
Return ONLY a valid JSON object. No markdown. No extra keys beyond requested schema.
Avoid defamatory or unverified claims about competitors. If evidence is weak, add caution text.
`;

export function promptDifferentiation(input: any) {
  return `
Task: Suggest differentiation vs competitors.

Input:
ownDescription: ${input.ownDescription}
competitors: ${JSON.stringify(input.competitors)}
options: ${JSON.stringify(input.options ?? {})}

Output JSON schema:
{
  "differentiators":[{"axis":"...","description":"...","evidence":["..."],"caution": "... or null"}],
  "messages":[{"headline":"...","body":"...","axis":"... or null"}],
  "slogans":[{"text":"...","axis":"... or null"}]
}

Rules:
- Provide 3-8 differentiators.
- Messages 2-5.
- Slogans 3-5.
- If a claim is not grounded in input, add caution like "Verification required".
`;
}

export function promptChecklist(input: any) {
  return `
Task: Create comparison checklist + copy for own advantage.

Input:
ownFeatures: ${input.ownFeatures}
competitorFeatures: ${input.competitorFeatures}
options: ${JSON.stringify(input.options ?? {})}

Output JSON schema:
{
  "checklist":[
    {"category":"...","ownAdvantage":"...","copyVariants":["..."],"tableBullets":["..."],"caution":"... or null"}
  ]
}

Rules:
- 5-10 checklist items.
- 1-3 copyVariants per item.
- If advantage is not grounded, set caution "Verification required".
`;
}

export function promptGapAnalyze(input: any) {
  return `
Task: Competitor Gap Analyzer.
You will receive extracted gap terms and own copy samples.
Cluster terms into marketing axes and propose copy ideas.

Input:
options: ${JSON.stringify(input.options ?? {})}
gap_terms: ${JSON.stringify(input.gapTerms)}
own_copies_sample: ${JSON.stringify(input.ownCopiesSample)}

Output JSON schema:
{
  "gaps":{
    "vocab":[{"term":"...","direction":"add_to_own|differentiate_more","rationale":"..."}],
    "axes":[{"axis":"...","description":"...","supporting_terms":["..."]}]
  },
  "recommendations":[{"type":"bridge_gap","copy":"...","axis":"... or null"}],
  "risks":[{"risk":"...","mitigation":"..."}]
}

Rules:
- vocab: at least 5 items.
- axes: 3-6 items.
- recommendations: 2-5 items.
- Avoid aggressive competitor bashing.
`;
}
