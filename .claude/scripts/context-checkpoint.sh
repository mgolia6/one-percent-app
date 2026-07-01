#!/usr/bin/env bash
# PreCompact — Context Checkpoint. Fires JUST BEFORE the conversation is
# compacted (auto, near the ~1M token limit, or manual /compact). Compaction is
# lossy, and the container is ephemeral, so the irreplaceable thing to protect
# is UNCOMMITTED work in the tree. This commits it to the feature branch (never
# main) and pushes, so nothing is lost across a compaction or a dropped session.
# It also reminds the assistant to flush open decisions into State/ — the soft
# part the hook can't do for it.
set -uo pipefail

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$root" 2>/dev/null || { jq -n '{systemMessage: "⚠️ Checkpoint: project dir not found."}'; exit 0; }

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
dirty="$(git status --porcelain 2>/dev/null)"

# Nothing uncommitted -> nothing to protect.
if [ -z "$dirty" ]; then
  jq -n --arg b "$branch" '{systemMessage: ("🟢 Context checkpoint: working tree clean on " + $b + " — nothing to commit. Reminder: before the window compacts, flush any open decisions/threads into State/onepercentstate.md so they survive.")}'
  exit 0
fi

# Never auto-commit to main (production auto-deploys). Warn instead.
if [ "$branch" = "main" ] || [ "$branch" = "master" ]; then
  jq -n '{systemMessage: "⚠️ Context checkpoint: uncommitted changes on MAIN — NOT auto-committing (main auto-deploys). Stash or move to the feature branch, and flush open decisions into State/onepercentstate.md before compaction."}'
  exit 0
fi

# Feature branch: commit the in-flight work as a WIP checkpoint and push.
git add -A 2>/dev/null
git commit -q -m "WIP context checkpoint (pre-compaction) — safe to squash" 2>/dev/null
committed=$?

pushout=""
if [ "$committed" -eq 0 ]; then
  for delay in 0 2 4 8; do
    [ "$delay" -gt 0 ] && sleep "$delay"
    if git push -u origin "$branch" >/dev/null 2>&1; then
      pushout="pushed"
      break
    fi
    pushout="commit OK but push failed (retry manually)"
  done
fi

files="$(printf '%s\n' "$dirty" | wc -l | tr -d ' ')"
jq -n --arg b "$branch" --arg n "$files" --arg p "$pushout" '{systemMessage: ("💾 Context checkpoint: committed " + $n + " changed path(s) to " + $b + " as a WIP checkpoint (" + $p + "). Nothing lost. Now flush any open decisions/threads into State/onepercentstate.md before the window compacts, and tell Matthew a checkpoint ran.")}'
exit 0
