# One Percent — Session Log
**Date:** 2026-06-10
**Entries published this session:** 031–040 (10 entries)

---

## What Happened

### Content — Batch of 10
Produced entries 031–040 in a single session using Option A workflow: topics confirmed upfront, then generate → verify → next sequentially.

| # | Edition | Concept | Category |
|---|---|---|---|
| 031 | NC.4 | Spaced Repetition | Neuroscience & Cognition |
| 032 | CM.4 | The BLUF Principle | Communication |
| 033 | PH.4 | Memento Mori | Philosophy |
| 034 | SC.3 | Calibrated Questions | Sales Craft |
| 035 | AI.4.1 | System Prompts | AI |
| 036 | VL.4.1 | The Overton Window | Vocab & Language |
| 037 | SC.5 | The Accusation Audit | Sales Craft |
| 038 | MM.5 | First Principles Thinking | Mental Models |
| 039 | AI.4.2 | Temperature & Sampling | AI |
| 040 | PH.5 | Epistemic Humility | Philosophy |

All 10 verified by Matthew via Dead Drop protocol.

### Verification Protocol — Claude in Chrome
Adopted Claude in Chrome as the preferred Dead Drop verification method this session. Claude navigates source URLs directly, reads page content, reports findings. Matthew reviews and gives explicit human sign-off per claim. Significantly faster than manual search while preserving the human-in-the-loop requirement. Formalized in Directions v1.36.

### EditionId Conflicts Caught and Fixed
Four new entries had editionId conflicts with existing catalog:
- 035: AI.3.1 → AI.4.1 (conflict with 023 RAG)
- 036: VL.3 → VL.4.1 (conflict with 024 Nominalization)
- 037: SC.4 → SC.5 (conflict with 029 Labeling SC.4.1)
- 039: AI.3.2 → AI.4.2 (conflict with 027 AI Agents)

### Source Correction — 039
arXiv 2402.05201 actual finding: temperature changes 0.0–1.0 do not have statistically significant impact on problem-solving accuracy. Entry source detail updated to reflect this accurately. Core mechanism description (explore/exploit framing, creative vs. deterministic tasks) remains accurate.

### App Wiring
- Entries 031–040 added to page.js ENTRIES manifest
- Entries 031–040 added to profile/page.js ENTRIES manifest
- TOTAL_ENTRIES updated: 30 → 40
- Clean build confirmed

### Directions
- v1.35 → v1.36
- Updated Dead Drop Step 2 to formalize Claude in Chrome as preferred verification method with fallback to manual search

---

## Notable Content Decisions
- **033 Memento Mori:** Left out the Roman triumph slave-whisper anecdote — historical sourcing confirmed as tenuous (Wikipedia: "in some accounts"). Used Marcus Aurelius Meditations and Seneca Letters as primary sources instead.
- **036 Overton Window:** Used Joseph Lehman's firsthand account from Mackinac Center as primary source — strongest possible attribution (original notes in folder labeled "Shifting Windows").
- **039 Temperature:** Flagged that the arXiv paper's empirical finding is more nuanced than its popular interpretation — corrected in source detail.

---

## State
- Total entries: 040
- Next rotation starts at: 041 (CM)
- Directions: v1.36
- Build: clean
