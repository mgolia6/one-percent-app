# Entry System — One Percent

## Edition ID Format: `[CategoryCode].[Cycle].[Slot]`

| Code | Category | Accent Color |
|---|---|---|
| SC | Sales Craft | #E8FF47 |
| AI | AI | #47FFE8 |
| VL | Vocab & Language | #FF8C47 |
| MM | Mental Models | #C847FF |
| PH | Philosophy | #FF4778 |
| NC | Neuroscience & Cognition | #47C8FF |
| CM | Communication | #FF8C00 |

## Rotation (9-slot cycle — LOCKED)
`SC → AI → VL → SC → MM → AI → PH → NC → CM` → repeat

## Current State
- ~40 entries published. See `State/onepercentstate.md` for exact count and rotation position.
- Next entry: check state snapshot.

## Pre-Generation Checklist (MANDATORY)
1. Read most recent log (last 7 entries minimum)
2. Identify next category in rotation
3. Real-time search signal (1-2 queries)
4. Check backlog
5. Select concept — not previously covered, temporal relevance confirmed
6. Verify 2-3 sources
7. Confirm quotes verbatim
8. AI nudge check
9. In the Wild — confirm sourcing rule met
10. Midday escalation check
11. Quiz Q3 application check
12. Measurable behavior rule if applicable
13. State transparency statement
14. Tester feedback rules:
    - Quiz questions test understanding/application — never recall of specific numbers
    - Morning section must include concrete scenario, example, or story
    - Quiz questions must be role-agnostic

## ai_prompt Field — REQUIRED for all new entries
Every entry must include a pre-written, copyable prompt for users to take the concept into Claude.
- Specific to the concept, not generic
- Instruct Claude to ask user for context before advising
- End with `[describe your situation]`

## File Naming Convention — LOCKED
| File | Format |
|---|---|
| Entry JSON | `public/entries/[NNN].json` |
| React artifact | `onepercent[YYYY-MM-DD]-[categoryslug]-[conceptslug].jsx` |
| LinkedIn post | `onepercentpost[YYYY-MM-DD]-[categoryslug]-[conceptslug].md` |
| Verify receipt | `onepercentverify[YYYY-MM-DD]-[categoryslug]-[conceptslug].md` |

Category slugs: `salecraft` · `ai` · `vocablanguage` · `mentalmodels` · `philosophy` · `neuroscience` · `communication`

## NEVER insert mid-catalog during active beta
Always append to end. If insertion is unavoidable: remap all tester `completions.entry_number` records in Supabase first, confirm the remap, then push JSON files.
