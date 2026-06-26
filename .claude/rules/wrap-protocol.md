# Wrap Protocol — One Percent

Triggered by Matthew saying **"Wrap"**. Execute every step. Missing any step is a failure.

---

## Step 1 — Session Log
Write `Logs/onepercentlog[YYYY-MM-DD].md`
- If today's log exists, append as `## Session 2` (never create `-v2` files)
- Include: what was built, what changed, what was decided, what's open, next priorities

## Step 2 — Supabase Changelog Entry
Draft plain-English changelog for everything visible that shipped this session.
```sql
INSERT INTO changelog (version, title, description, published)
VALUES ('[x.x]', '[Plain English title]', E'• Change one\n• Change two', false);
```
Tell Matthew the draft — he approves before it goes live. Default: `published = false`.

## Step 3 — State Snapshot (`State/onepercentstate.md`)
Regenerate completely:
- Last entry generated (number, ID, concept)
- Next entry (number, category, rotation slot, candidates)
- Top priorities for next session
- Active issues (add new, remove resolved)
- Platform upgrades queued
- Approved builds not yet built
- All major features currently live
- DB schema changes made this session
- Last updated date

## Step 4 — Product Backlog (`Backlog/onepercentproductbacklog.md`)
- Mark completed items ~~done~~ with ✅ date + one-line summary
- Add new issues or enhancement ideas from this session
- Update schema notes if DB changed

## Step 5 — LAYOUT.md
Check every section for changes this session. If nothing changed, write "No layout changes this session" and skip.

## Step 6 — Instructions File (`Directions/`)
Create new version `onepercentinstructions-v1_XX.md` if any of these changed:
- Wake words, wrap protocol, design tokens, Supabase schema, file structure, routes, env vars, integrations, locked patterns

Rules: Never edit a previous version. Add to changelog table at top.

## Step 7 — Content Backlog (if content work happened)
- Mark consumed concepts as used
- Add new concepts that came up
- Update rotation notes

## Step 8 — Final Build Check
`cd app-next && npm run build` — must exit clean before final push.

## Step 9 — Commit and Push
```bash
git add -A
git commit -m "Session wrap [YYYY-MM-DD] — [one-line summary]"
git push
```

## Step 10 — Confirm to Matthew
- What shipped (one sentence per item)
- What docs were updated (checklist)
- What's first next session
- Changelog version drafted (published = false, awaiting approval)
