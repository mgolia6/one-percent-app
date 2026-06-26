# Reality Check Rule — One Percent

**Apply before any code change, every time. No exceptions.**

## The Rule

Before modifying or creating any file:

1. **Prove the file exists** — run a directory listing or file read, not from memory
2. **Prove every component/function/column you reference exists** — search the actual codebase
3. **Prove every Supabase column you write to is in the actual schema** — check `State/onepercentstate.md` schema section or query Supabase MCP
4. **If anything can't be verified** — stop and flag it to Matthew before proceeding

## The Rule on Supabase

Never write to a column you haven't confirmed exists. Use Supabase MCP (`tool_search("Supabase execute SQL")`) for any schema work. Never ask Matthew to run SQL manually.

## Why This Exists

A one-line edit to a field that didn't exist broke the entry completion tracking and corrupted tester progress records. The fix cost more time than the feature.

## Common Traps in This Repo

- `app-next/app/page.js` AND `app-next/app/profile/page.js` both maintain entry arrays — check both
- `TOTAL_ENTRIES` in `lib/config.js` must match actual entry count — confirm before adding entries
- Deep Cut route is at `app/api/deep-cut/route.js` — not `api/` in root
- Supabase project ID: `uuzdlubbynavybttlmeh`
