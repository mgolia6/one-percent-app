# /verify claim data — schema

Each `<category>.json` is an array of entry objects rendered by `app-next/app/verify/page.js`.
Register a new file as a tab in that page's `CATEGORIES` array.

```jsonc
{
  "edition_id": "HS.2",            // matches draft editionId
  "concept": "Gutenberg's Printing Press",
  "verdict": "PASS",              // PASS | FLAG (from the two AI passes)
  "fix": "",                      // short phrase if FLAG / a correction was made; "" otherwise
  "caveat": "…",                  // REQUIRED: the residual adversarial concern (see below)
  "weakest_claim_no": 1,          // REQUIRED: which claim to scrutinize first
  "claims": [
    {
      "no": 0,                    // 0-based
      "kind": "THESIS",          // "THESIS" for the central claim, "" otherwise (also FIGURES, etc.)
      "text": "plain-words claim the reader is checking",
      "snippet": "short EXACT quote from the source — verbatim (see paraphrase)",
      "url": "https://… authoritative source",
      "locate": "WHERE on the page to find it — REQUIRED",
      "tier": 1,                  // REQUIRED source tier 1|2|3 (see below)
      "paraphrase": false         // true if snippet is NOT verbatim on the page
    }
  ]
}
```

## The two passes (don't skip the adversarial one)

1. **Confirm** — for each claim, find an authoritative source + the exact supporting snippet + URL + `locate`.
2. **Adversarial** — actively try to DISPROVE each claim: wrong number/date, debated attribution,
   overstated mechanism, weak source, study finding being broadened. This pass is the point of the tool.

## `caveat` + `weakest_claim_no` — mandatory

Even when an entry PASSes, the adversarial pass MUST surface its residual concern:
- `caveat`: ONE crisp sentence naming the single weakest link or the thing to double-check.
  Be specific to the entry's claims (e.g. "headline math rests on an SEO blog, not a regulator").
  If truly nothing stands out: "Solid; spot-check the headline figure."
- `weakest_claim_no`: the claim the human should check first.

This is the highest-value output — never drop it. It renders as the ⚠ WATCH callout.

## `tier` — source quality, mandatory per claim

- **1 — Primary**: regulator (.gov, SEC, Fed, IRS, BLS), peer-reviewed journal (JAMA, Lancet, BMJ,
  PNAS, Nature, NCBI/PMC), primary data/org (S&P SPIVA, Nobel), `.edu`, primary historical texts.
- **2 — Reputable secondary**: Wikipedia, Britannica, Investopedia, Vanguard/Fidelity, Mayo/Cleveland
  Clinic, professional bodies (NSCA/ACSM), quality journalism, primary calculators.
- **3 — Secondary/weak**: blogs, SEO sites, vendor pages, practitioner sites. Prefer to REPLACE a
  tier-3 source with a tier-1/2 one during the adversarial pass; if none exists, keep it and say so
  in the caveat. Tier 3 renders orange so the human checks it hardest.

## `snippet` must be verbatim; mark paraphrases

The human Ctrl-Fs the snippet, so it must be an EXACT quote from the page. If you can only paraphrase
(source is a PDF, the support is spread across sentences, etc.), set `"paraphrase": true` and make
`locate` point precisely — the UI then warns the quote won't match literally.

## `locate` — where to look, mandatory

Concrete pointer: section/heading + a Ctrl-F phrase. Examples:
`"§ 'Statistical data' → search 'twenty million'"`, `"Table 3, large-cap row, 15-yr column"`,
`"PDF p.7 under 'Results'"`. Absent `locate`, the UI falls back to a find-phrase from the snippet.

When generating with subagents, instruct each to return ALL of: `snippet, url, locate, tier,
paraphrase` per claim, and `caveat` + `weakest_claim_no` per entry.
