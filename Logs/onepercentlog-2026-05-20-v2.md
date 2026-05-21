# One Percent — Session Log (continued)
**Date:** May 20, 2026
**Instructions version at start:** v1.24
**Instructions version at end:** v1.25

---

## Session type
Platform upgrades continued — no content generation.

---

## Work completed

### Collapsible changelog page
- Entries now collapsible — latest open by default, rest collapsed
- Collapsed state shows version badge, title, first bullet as preview
- NEW badge on latest entry, chevron rotates on expand

### What's New modal + dot badge
- Library fetches latest published changelog version on load
- Compares against `profiles.last_seen_changelog_version`
- Yellow dot badge on CHANGELOG button when unseen — clears on tap
- What's New modal for entries where `show_modal = true`
- GOT IT dismisses modal and marks version seen in profiles
- Matthew tells Claude when modal should deploy — Claude sets show_modal, no Supabase access needed

### Schema additions
- `changelog.show_modal` boolean — admin controls per release
- `profiles.last_seen_changelog_version` text — tracks what user has seen

### Changelog version fix
- v0.4 corrected to v0.3 (was the 3rd release, not 4th)
- Next release will be v0.4

### Changelog descriptions reformatted
- v0.2 and v0.3 both updated to bulleted format in Supabase
- Changelog page renderer updated to split on newlines

---

## Commits this session (continued)
- `1286381` — Changelog: render description as bulleted lines
- `ab24efa` — Fix changelog version: 0.4 → 0.3
- `13b1068` — Collapsible changelog + What's New modal + dot badge

---

## Changelog entry
Version 0.3 published. show_modal = true per Matthew's instruction.

---

## Open items / next session candidates
- ENH-002: Profile page build-out
- ENH-003: Weekly quiz standalone mode
- ENH-005: Admin changelog UI
- Entry 018: AI.3.1 — candidates: RAG, AI Agents, Temperature/Sampling
- Founders Club badge + badge system schema
- Next changelog version: v0.4
