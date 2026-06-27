#!/usr/bin/env bash
# PreToolUse / Edit — enforce the Reality Check rule: never edit a file that
# doesn't exist. Reads the hook JSON on stdin, denies the Edit if tool_input
# .file_path points at a non-existent path.
set -euo pipefail

input="$(cat)"
f="$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')"

# No path, or the file exists -> allow (emit nothing = default allow).
[ -z "$f" ] && exit 0
[ -e "$f" ] && exit 0

jq -n --arg f "$f" '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "deny",
    permissionDecisionReason: ("Reality Check: " + $f + " does not exist. Edit only operates on existing files — create it with Write first, or fix the path.")
  }
}'
exit 0
