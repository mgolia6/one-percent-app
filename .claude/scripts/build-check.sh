#!/usr/bin/env bash
# Stop — run the mandatory build check before the session ends. Clean build
# reports success; a broken build blocks the stop and feeds the error back so
# the session doesn't end on a broken build (CLAUDE.md). The stop_hook_active
# guard prevents an infinite block loop if the build can't be fixed.
set -uo pipefail

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
input="$(cat 2>/dev/null || true)"
active="$(printf '%s' "$input" | jq -r '.stop_hook_active // false')"

if [ ! -d "$root/app-next/node_modules" ]; then
  jq -n '{systemMessage: "⚠️ Build check skipped: app-next/node_modules missing (run npm install)."}'
  exit 0
fi

out="$(cd "$root/app-next" && npm run build 2>&1)"
rc=$?

if [ "$rc" -eq 0 ]; then
  jq -n '{systemMessage: "✅ Build check passed (npm run build clean)."}'
elif [ "$active" = "true" ]; then
  # Already blocked once this stop-cycle — don't loop; just warn and let it end.
  jq -n '{systemMessage: "❌ Build still failing after a retry — ending anyway. Fix before pushing."}'
else
  tailout="$(printf '%s' "$out" | tail -20)"
  jq -n --arg t "$tailout" '{
    decision: "block",
    reason: ("Build check FAILED before session end. Per CLAUDE.md, do not end on a broken build — fix it.\n--- last lines of npm run build ---\n" + $t)
  }'
fi
exit 0
