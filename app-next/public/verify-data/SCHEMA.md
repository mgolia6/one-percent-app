# /verify claim data — schema

Each `<category>.json` is an array of entry objects rendered by `app-next/app/verify/page.js`.
Register a new file as a tab in that page's `CATEGORIES` array.

```jsonc
{
  "edition_id": "HS.2",            // matches draft editionId
  "concept": "Gutenberg's Printing Press",
  "verdict": "PASS",              // PASS | FLAG (from the two AI passes)
  "fix": "",                      // short phrase if FLAG / a correction was made; "" otherwise
  "claims": [
    {
      "no": 0,                    // 0-based
      "kind": "THESIS",          // "THESIS" for the central claim, "" otherwise (also FIGURES, etc.)
      "text": "plain-words claim the reader is checking",
      "snippet": "short EXACT quote from the source that backs the claim",
      "url": "https://… authoritative source",
      "locate": "WHERE on the page to find it — REQUIRED going forward"
    }
  ]
}
```

## `locate` — mandatory for new claims

The human has to find the snippet fast. Always give a concrete pointer, e.g.:
- `"Wikipedia 'Incunable' → search 'twenty million'"`
- `"§ 'Authorization', 2nd paragraph"`
- `"Table 3, row 'large-cap', 15-yr column"`
- `"PDF p.7, under 'Results'"`

Prefer a section/heading + a Ctrl-F phrase. If `locate` is absent, the UI falls back to a
"find: <first words of snippet>" hint, but an explicit pointer is the standard.

When generating with subagents, instruct each to return `locate` for every claim.
