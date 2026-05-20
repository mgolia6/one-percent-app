
## Session 2026-05-20 — Known Issues

### 1. Quiz tab too light (theme issue)
After day/night theme patch, Evening quiz tab text/options are rendering too light.
Likely: theme variables not fully propagating to quiz option CSS classes.
Fix: Audit quiz section in EntryViewer — op-quiz-opt background/border/color CSS using T vars.

### 2. "Locked in" celebration stuck on screen
Celebration confetti/overlay stays on screen during post-entry feedback, making it hard to interact.
Fix: Auto-dismiss Celebration after N seconds, or hide when showEntryFeedback is true.

### 3. Entry content mismatch — entries serving wrong content
Wrong JSON being served per entry. Confirmed mapping errors:
- Euphemism Treadmill → showing Chain of Thought content
- Second Order Thinking → showing Euphemism Treadmill content
- Chain of Thought Prompting → showing Anchoring content
- Anchoring → showing Second Order Thinking content
- Neuroplasticity → showing Tactical Empathy content
- Tactical Empathy → showing Neuroplasticity content
Root cause: likely entry number / filename mismatch in /entries/ JSON files or unlock logic.
Fix: Audit entry JSON files, verify entry numbers match filenames and content.

### 4. Multi-threading not working
Parallel/multi-thread entry loading or unlock logic failing.
Status: Not yet investigated.
