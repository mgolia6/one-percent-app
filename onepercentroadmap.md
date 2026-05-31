# One Percent — Roadmap
**Generated:** May 31, 2026 | **Beta end target:** ~30 days from May 20 launch (~June 19)

This is the single source of sequenced priorities. Not a wish list — a working order. Everything is either Before Beta Ends, Post-Beta Pre-Launch, or Long-Term.

---

## 🔴 Before Beta Ends
*Must ship while testers are active and giving feedback.*

| Priority | Item | Why now | Status |
|---|---|---|---|
| 1 | **Quiz backfill — entries 001–008** | Testers hitting old recall-format quizzes. Actively undermines the quiz revamp we told them about in the emails. | Open |
| 2 | **Entry bookmarking / favorites** | Approved. Landon asked for it explicitly. Quick win — `bookmarks` table + star icon on entry card + Saved tab in library. | Open |
| 3 | **Personalized goal-setting** | Promised in all 5 emails as "coming before end of beta." Has to ship. Addresses Brian's accountability gap and the retention problem. | Open |
| 4 | **Admin — beta check-in responses tab** | Survey responses are landing in `beta_checkin`. Need a way to read them without going into Supabase raw. | Open |
| 5 | **Zero-completion gate** | Weekly wrap modal still fires for users with no completions. Approved fix, not yet built. | Open |
| 6 | **Email consistency fix** | At least 2 users flagged missing emails. Audit the daily reminder edge function — confirm it's not skipping users. | Open |
| 7 | **Early entry quiz backfill (001–008)** | Same as priority 1 — application-based questions need to replace the old format across the first 8 entries. | Open |
| 8 | **Verify Jahic quote — Entry 017** | Still open from last session. Dead Drop protocol required before this entry is clean. | Open |

---

## 🟡 Post-Beta, Pre-Launch
*Ship before any public-facing growth. These are table stakes for a real product.*

| Priority | Item | Why it matters |
|---|---|---|
| 1 | **Email allowlist / beta gate** | ENH-007. Close the door before expanding. Only pre-approved emails can sign in. |
| 2 | **Gate entry JSON behind auth** | Entries are in `/public` — anyone can read them without an account. ENH-008. |
| 3 | **Rate limiting on feedback/bug submissions** | ENH-009. Fine for closed beta, not fine in public. |
| 4 | **CAN-SPAM compliance** | Add `email_reminders` boolean + unsubscribe link to email footer before any growth. |
| 5 | **Audience framing** | Landon's "who is this for" is unanswered. Onboarding or library header needs a clearer POV statement. |
| 6 | **Button audit** | All buttons need loading/disabled/feedback states. Sign-out button flagged May 20. |
| 7 | **Firefox Focus login fix** | Privacy browser wipes session — users forced to re-auth every visit. ISSUE-006. |
| 8 | **Design sprint — full v3 rollout** | Sand palette, reveal transitions, dimensional today card, goal callback. Validated in prototype. Implement admin section as sandbox first. |
| 9 | **Profile page build-out** | Streak, completed count, category breakdown, joined date. ENH-002. |
| 10 | **Badges & Founder's Club** | Founder's Club badge for all beta testers. Schema: `badges` + `user_badges` tables. |

---

## 🟢 Long-Term (Post-Launch)
*Real features that require real infrastructure. Don't touch until post-beta feedback is fully synthesized.*

| Item | Notes |
|---|---|
| **Push notifications** | Custom timing per user. User-requested x2. Requires native app or PWA push infrastructure. |
| **Audio lessons** | Text-to-speech or recorded audio for Morning Brief. User-requested x2 (Erin). |
| **Home screen widget + streak counter** | Habit surface. Requires native app. |
| **Prompt Farm** | Library of ready-to-use AI prompts organized by concept. Pending survey signal from beta users. |
| **Weekly retention quiz** | Standalone quiz mode across all completed entries. ENH-003. |
| **SMS notifications** | `phone` column on profiles + Twilio integration. |
| **Profile picture upload** | Supabase Storage. ENH-001. |
| **Admin changelog UI** | Write/publish entries without touching Supabase. ENH-005. |
| **Voice input for feedback** | Extend current audio recording to cover more feedback surfaces. |

---

## Content Roadmap

| Item | Status |
|---|---|
| Entry 018 — AI.3.1 (RAG — lead candidate) | Next up |
| SC.3.2 — Sales Craft | Queue |
| Backlog review and concept pipeline refresh | Next session |
| Entry 017 (SC.3.1) — Jahic quote verification | Blocked — open |

**Rotation:** Sales Craft → AI → Vocab & Language → Sales Craft → Mental Models → AI → Philosophy → repeat

---

## What We're Not Doing Until Post-Beta
- No new feature categories
- No major UX pattern changes (beyond goal-setting, which is promised)
- No monetization decisions
- No public launch prep until all beta feedback is synthesized

---

*Owner: Matthew Golia | Maintained by Claude | Updated: May 31, 2026*
