const STOP = new Set([
  "the","and","or","to","of","in","for","on","with","a","an","is","are","as","at","by",
  "we","our","you","your","from","that","this","it",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => w.length >= 3)
    .filter((w) => !STOP.has(w));
}

function freqMap(texts: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of texts) {
    for (const tok of tokenize(t)) m.set(tok, (m.get(tok) ?? 0) + 1);
  }
  return m;
}

export function extractGapTerms(params: { competitorCopies: string[]; ownCopies: string[] }) {
  const comp = freqMap(params.competitorCopies);
  const own = freqMap(params.ownCopies);

  const scored: Array<{ term: string; score: number; comp: number; own: number }> = [];
  for (const [term, c] of comp.entries()) {
    const o = own.get(term) ?? 0;
    scored.push({ term, score: c - o, comp: c, own: o });
  }
  scored.sort((a, b) => b.score - a.score);

  const addToOwn = scored
    .filter((x) => x.score > 0)
    .slice(0, 20)
    .map((x) => ({
      term: x.term,
      direction: "add_to_own" as const,
      rationale: `competitor:${x.comp} vs own:${x.own}`,
    }));

  const scoredOwn: Array<{ term: string; score: number; own: number; comp: number }> = [];
  for (const [term, o] of own.entries()) {
    const c = comp.get(term) ?? 0;
    scoredOwn.push({ term, score: o - c, own: o, comp: c });
  }
  scoredOwn.sort((a, b) => b.score - a.score);

  const differentiate = scoredOwn
    .filter((x) => x.score > 0)
    .slice(0, 10)
    .map((x) => ({
      term: x.term,
      direction: "differentiate_more" as const,
      rationale: `own:${x.own} vs competitor:${x.comp}`,
    }));

  return [...addToOwn, ...differentiate].slice(0, 25);
}
