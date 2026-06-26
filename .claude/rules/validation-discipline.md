# Validation Discipline — One Percent

## Core Rules

1. **Build before commit** — `cd app-next && npm run build` must exit clean. Non-negotiable.
2. **Verify content before commit** — entry JSON does not get pushed until Dead Drop verification is complete and Matthew has given explicit sign-off
3. **Reproduce before fixing** — if a bug is reported, reproduce it locally before writing a fix
4. **Never weaken a guard to make something pass** — if a validation is failing, fix the root cause

## Entry Verification (Dead Drop Protocol)

For every verifiable claim in an entry:
1. Present the claim + exact search query (or use Claude in Chrome to navigate to source)
2. Wait for Matthew's explicit confirmation before moving to next claim
3. If a claim fails: remove or correct immediately, note in verify receipt
4. After all claims confirmed: add `"verified": true, "verified_by": "Matthew"` to entry JSON
5. Only then commit and push

Matthew's sign-off is always required. Claude finding a source does not constitute verification.

## Pre-Code Review Habit

Before writing code, surface:
- What files will be modified
- What the change does in plain English
- Any downstream effects (other files that depend on modified code)
- The rollback plan if it breaks

Then wait for Matthew's go-ahead on anything non-trivial.

## Four-File Sync Check

Before any entry-related commit, confirm all four are in sync:
- `lib/config.js` TOTAL_ENTRIES
- `app/page.js` entry manifest
- `app/profile/page.js` ENTRIES array  
- `public/entries/[NNN].json`

If any are out of sync — fix before committing.
