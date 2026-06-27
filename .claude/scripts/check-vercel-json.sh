#!/usr/bin/env bash
# PreToolUse / Write — before creating a NEW file under an api/ directory,
# make sure a vercel.json exists (API routes often need runtime/region/
# maxDuration config) and is valid JSON. Missing -> ask; invalid -> deny.
set -euo pipefail

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
input="$(cat)"
f="$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')"

# Only gate new files whose path runs through an api/ directory.
case "$f" in
  */api/*) ;;
  *) exit 0 ;;
esac
# Overwriting an existing file is not "creating a new api/ file" -> allow.
[ -n "$f" ] && [ -e "$f" ] && exit 0

# Locate a vercel.json (repo root or the app-next/ Vercel project root).
vj=""
for cand in "$root/vercel.json" "$root/app-next/vercel.json"; do
  [ -f "$cand" ] && vj="$cand" && break
done

if [ -z "$vj" ]; then
  jq -n --arg f "$f" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "ask",
      permissionDecisionReason: ("New API route " + $f + " but no vercel.json was found. API routes often need runtime/region/maxDuration config. Add a vercel.json (or confirm none is needed) before creating this route.")
    }
  }'
  exit 0
fi

if ! jq -e . "$vj" >/dev/null 2>&1; then
  jq -n --arg f "$f" --arg vj "$vj" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: ($vj + " is not valid JSON — fix it before adding API route " + $f + ".")
    }
  }'
  exit 0
fi

# vercel.json exists and parses -> allow.
exit 0
