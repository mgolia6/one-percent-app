# One Percent — Layout & Design State
**Last updated:** 2026-06-15

---

## App Status
- **Live at:** one-percent-app.vercel.app
- **Stage:** Beta — 6 active testers (DonRobbo, Erin, Justin, Brian, Landon, Andrew)
- **Framework:** Next.js 16 (App Router), React 19, Tailwind v4
- **Primary surface:** Mobile (iOS) — layout decisions mobile-first
- **Desktop:** Supported via sidebar layout

---

## Design System — Non-Negotiable

### Aesthetic
Dark, minimal, high-contrast. Not terminal — clean and editorial. Navy/dark blue base with neon category accents. DM Sans for body, DM Mono for labels and metadata.

### Core Colors
- `#0e141c` — page background
- `#1a2a3a` — card/panel background
- `rgba(11,17,25,0.97)` — header background
- `#e8eef5` — primary text
- `rgba(232,238,245,0.45)` — muted text
- `rgba(255,255,255,0.06)` — borders

### Category Accent Colors (non-negotiable)
- AI: `#47FFE8`
- Sales Craft: `#E8FF47`
- Vocab & Language: `#FF8C47`
- Mental Models: `#C847FF`
- Philosophy: `#FF4778`
- Neuroscience & Cognition: `#47C8FF`
- Communication: `#FF8C00`

### Fonts
- **Body:** DM Sans — headings, body copy, buttons
- **Mono:** DM Mono — labels, tags, metadata, letterSpacing heavy

### Key UI Patterns
- Section labels: `fontSize: 15px`, `fontWeight: 600`, `color: #e8eef5`
- Metadata/tags: DM Mono, `fontSize: 8–10px`, `letterSpacing: 0.1–0.2em`
- Cards: `background: #1a2a3a`, `borderRadius: 14–18px`
- Buttons (primary): solid background in category accent color, DM Mono, all-caps, `letterSpacing: 0.1em`
- Chips/pills: `borderRadius: 100px`, category color bg at 10–15% opacity, colored border

---

## Mobile Layout

### Header (sticky, top)
- Left: `ONE PERCENT` wordmark (DM Mono) + BETA chip (yellow-green `#c8d800`) + ADMIN chip (`#00c4ad`) if admin
- Right: Avatar button → `/profile` route
- Action strip below wordmark: CHANGELOG · BUG (pink) · FEEDBACK · INFO · SIGN OUT
- ABOUT removed Jun 15 — now lives in profile Account tab footer
- Header is `op-header` class — hidden on desktop (≥768px)

### Bottom Tab Nav (`op-bottom-nav`)
4 tabs: **TODAY · LIBRARY · PROMPTS · PROGRESS**
- Background: `#1a2a3a`
- Active tab: colored underline pip at top, icon stroke bright
- Hidden on desktop (≥768px)

### Main Content
Full-width, scrolls independently per tab. `padding: 18px 18px 0`, plus paddingBottom needed to clear bottom nav (open debt).

---

## Desktop Layout (≥768px)

### Shell
`op-desktop-shell` — flex row, full height

### Left Sidebar (`op-sidebar`)
- Width: 240px, fixed/sticky, `background: #1a2a3a`, full viewport height
- Top: ONE PERCENT wordmark + BETA/ADMIN chips
- Nav items: Today · Library · Prompt Vault · Progress (icon + label, active state = `rgba(255,255,255,0.08)` bg)
- Bottom: BUG · FEEDBACK · ADMIN (if admin) · SIGN OUT links (ABOUT removed Jun 15)

### Main Content (`op-main`)
- `flex: 1`, `maxWidth: 680px`, `paddingBottom: 60px`
- Header (`op-header`) hidden — wordmark lives in sidebar
- Tab scroll containers: `paddingBottom: 90px` (clears bottom nav, fixed Jun 15)

---

## Surfaces

### Welcome Overlay
- Fires once per session (sessionStorage flag)
- Full-screen dark overlay (`#0a0a0f` gradient)
- Typewriter animation: "Welcome back," types first (italic, muted), 300ms pause, then name types at 65ms/char
- Stats chips: streak chip (color varies by streak length) + vault count chip
- Nudge line: context-aware (streak, count, goal, etc.)
- TAP TO CONTINUE hint at bottom
- Fades out over 700ms

### Badge Earn Overlay
- Fires when `earnedBadgeQueue` has items — one badge at a time
- Full screen, `rgba(0,0,0,0.88)` + `backdropFilter: blur(12px)`
- Large emoji icon (64px), category color, badge name + description
- Scale-in animation on emoji, fade-in on text
- Tap to dismiss, queues next badge

### TODAY Tab
Layout (top to bottom):
1. **WHY I'M HERE** — commitment strip, no card box, target icon + text, pencil edit affordance bottom-right, bottom divider
2. **KPI Row** — 3-column grid: Completed / Day Streak / Avg Score
3. **Today card** — `borderRadius: 18px`, color top border strip (3px, category accent), entry number + edition ID + UNLOCKED/COMPLETE status, concept title (27px bold), category label, BEGIN/REVIEW button, 3-moment strip at bottom (CONCEPT / IN THE WILD / LOCK IT IN)
4. **On Deck** — muted card, lock icon if next entry locked, chevron if incomplete entry
5. **Last Learned** — colored left border (3px), entry meta, revisit CTA

### LIBRARY Tab
Layout (top to bottom):
1. **Category chips** — 4×2 grid: SAVED (bookmarks) + 7 category chips. Each chip: icon + short label + count. No background boxes — transparent bg, colored label, active = subtle indicator
2. **Divider**
3. **Entry rows** — vertical stack, each: category icon (34px rounded) + concept name + edition ID + status (LOCKED / START / NOW / score). Bookmark star right. Locked entries at 28% opacity.

### PROMPTS Tab (Prompt Vault)
- Compact single-row hero: lock icon (44px, purple bg) + title + subtitle
- Same category chips as Library (4-col grid)
- Prompt cards per completed entry: left border (category color), category + concept label, USE PROMPT → CTA
- Per-entry DEEP CUT buttons removed Jun 15 — Deep Cut now lives as an app-level FAB

### PROGRESS Tab
Layout (top to bottom):
1. **Streak section** — no card box, floats on page. Large 🔥 + number + DAY STREAK label. Personal best below. Full month calendar grid (replaced 7-day row Jun 15): Mon-first, colored dot per completed day in category accent color, today highlighted with faint border. Powered by real `completed_at` data. Streak freeze strip (🧊 inline, shows count)
2. **Concepts + Time** — 2-col grid: completed count (cyan) + total time (yellow)
3. **Quiz score trend** — `#1a2a3a` card, bar chart of last 7 scores, avg callout
4. **Leaderboard** — tappable card → `/leaderboard`, shows current rank
5. **Category mastery rings** — 4-col grid, SVG ring per category, fill % = completion rate

### ADMIN Tab (`/admin` route)
5 tabs: USERS · BUGS · FEEDBACK · API HEALTH · EMAIL

**USERS:** Non-admin users list. Each card: status dot (engagement color) + name + email + completions count + streak + last seen. Expand → signed up date, avg score, best streak, progress bar, feedback count, reset actions (RESET DATA / HARD RESET with confirm step). NUDGE button → SMS modal.

**BUGS:** Filter (OPEN / RESOLVED / ALL). Bug cards with page chip, timestamp, description, browser info. RESOLVE button.

**FEEDBACK:** Filter by user. Per-user: total items, post-lesson count, avg ratings (topic/clarity/quiz). Comments with feedback type chip.

**API HEALTH:** Manual check button. Hits: Supabase DB, Resend edge function, Practice reminder, Supabase Auth. Results: OK/FAIL chip + latency + detail.

**EMAIL:** Edge function cards (Daily Reminder / Practice Reminder / Weekly Wrap) + runbook for email failures.

---

## Deep Cut

**Entry point:** Circle FAB, bottom right, 82px above bottom nav. Floats across all tabs. Cycles through all 7 category accent colors every 2.5s with pulse ring + outer ring animation. Scissors icon.

**Drawer:** Slide-up, 92dvh, `#070c12` background.

**State A — Entry picker:**
- "WHAT DO YOU WANT TO GO DEEPER ON?" label
- Category filter chips (same accent colors as rest of app)
- Completed entries list: colored left bar, concept name, category, score
- GO DEEP button activates in selected entry's accent color

**State B — Chat:**
- EXPLORING context pill at top — shows selected concept, tap to SWITCH back to picker
- Source pills row — tappable links to all verified sources for the entry
- Today's `ai_prompt` surfaces as first suggestion chip: TODAY'S PROMPT badge in entry accent color, italic text, accent-tinted background
- Standard explore prompts below: real example / connections / counterargument / apply to work
- Streaming response from `/api/deep-cut` (server-side, claude-sonnet-4-6)
- Out-of-source answers flagged inline in orange by Claude
- User message bubbles pick up entry accent color

**API:** `/api/deep-cut` — server-side Next.js route. Injects full entry JSON (morning, midday, sources, quiz) + user context into system prompt. Explicit source grounding rules. Requires `ANTHROPIC_API_KEY` in Vercel env vars.

**Files:** `app-next/components/DeepCut.jsx` (component + FAB export), `app-next/app/api/deep-cut/route.js`

---

## Modals & Overlays

### How It Works Modal
- 7-step card flow, light theme (`#f0f4f8` gradient — intentionally different from app aesthetic)
- Progress bar at top, step dots, prev/next nav
- Dismissable via ✕ or clicking outside

### Feedback Modal
- Star rating 1–5 + comment textarea + screenshot attach
- Dark modal (`#111827` bg, rgba white border, 14px radius)
- Cyan eyebrow (#47FFE8), DM Mono buttons, accent-colored active state on send

### Bug Modal
- Page selector dropdown + description textarea + screenshot attach
- Dark modal (`#111827` bg, rgba white border, 14px radius)
- Pink eyebrow (#FF4778), DM Mono buttons, accent-colored active state on report

### Weekly Survey Modal (`/survey` trigger)
- Full-screen scroll, dark bg
- Fires at day 7, 14, 21 after signup (if completions exist)
- Sections: Usage / Content / Experience / Positioning / Signal

### End of Beta Modal
- Full-screen scroll, pink accent `#FF4778`
- Fires when `completions.length >= TOTAL_ENTRIES` and survey not done
- Comprehensive debrief: Overall / Content / Habit / Product / Positioning / GTM / Final Word

### What's New Modal
- Pulls from `changelog` Supabase table
- Shows latest version if not seen (`last_seen_changelog_version` on profile)
- Yellow accent `#E8FF47`

### Badge Earn Overlay
- See Surfaces section above

### Profile Page (`/profile`)
Two tabs: **ACCOUNT | BADGES**

**ACCOUNT tab:**
- Avatar (60px circle, upload via Supabase Storage, + badge in bottom right)
- First name, last name (editable)
- Email (read-only)
- Phone (optional, for future SMS)
- NOTIFICATIONS section: email reminders toggle (saves to `profiles.email_reminders`)
- Save + Sign Out buttons
- Footer links: About One Percent → `/about`, Privacy Policy → `/privacy`

**BADGES tab:**
- Streak freeze card (count + description)
- EARNED badges list (date earned)
- LOCKED badges list (hidden badge names replaced with ???)

**Removed Jun 15:** Progress tab — all that data lives in the main Progress tab.

---

### Goal Commitment Flow
- Bottom sheet (`op-goal-sheet`), light bg, slides up
- 3-step sequence: What needs to change / When will you know / What will proof look like
- Chip selectors + free-text input per step
- On complete → Commit Ritual overlay

### Commit Ritual Overlay
- Full screen dark bg
- Paper card animates in (DM Mono header, Caveat cursive body)
- Typewriter writes commitment sentence
- Signature + date appears, paper folds away
- "Committed." confirmation screen

---

## Routes

| Route | Component | Notes |
|---|---|---|
| `/` | `app/page.js` | Main app — all 4 tabs |
| `/login` | `app/login/page.js` | Auth |
| `/onboarding` | `app/onboarding/page.js` | First-run flow |
| `/entry/[id]` | `app/entry/[id]/page.js` + `components/EntryViewer.jsx` | Lesson viewer |
| `/admin` | `app/admin/page.js` | Admin panel |
| `/profile` | `app/profile/page.js` | User profile — Account tab + Badges tab |
| `/privacy` | `app/privacy/page.js` | Privacy policy (added Jun 15) |
| `/leaderboard` | `app/leaderboard/page.js` | Leaderboard |
| `/about` | `app/about/page.js` | About page — dark styled (fixed Jun 15) |
| `/changelog` | `app/changelog/page.js` | Changelog — dark styled (fixed Jun 15) |
| `/survey/[userId]` | `app/survey/[userId]/page.js` | Survey |

---

## Key Layout Decisions (Do Not Revisit Without Good Reason)
- **Dark aesthetic is locked** — `#0e141c` bg, `#1a2a3a` cards. Not negotiable.
- **WHY I'M HERE has no card box** — commitment floats on page, bottom divider only
- **Category chips in Library are transparent** — no background boxes, colored labels only
- **Streak section has no card** — number and week grid float directly on page bg
- **Shop tab does not exist** — One Percent has no shop surface
- **How It Works uses light theme** — intentional contrast, not a bug
- **Bottom nav background is `#1a2a3a`** — matches cards, not page bg

---

## Open Layout Debt
~~1. All tabs need `paddingBottom` to clear bottom nav~~ ✅ Fixed Jun 15
~~2. About + Changelog pages need dark style treatment~~ ✅ Fixed Jun 15
~~3. Bug + Feedback modals need visual liveliness~~ ✅ Fixed Jun 15
~~4. Tab scroll position should reset to top~~ ✅ Fixed Jun 15
~~5. Profile page needs rethink~~ ✅ Fixed Jun 15

**Current open debt:**
- HITL icon not appearing in app (ISSUE-007)
- Deep Cut device test — verify source grounding + orange flag behavior (ISSUE-008)

---

## Files That Own Each Surface

| Surface | File |
|---|---|
| Main app shell + all tabs | `app-next/app/page.js` |
| Entry / lesson viewer | `app-next/components/EntryViewer.jsx` |
| Admin panel | `app-next/app/admin/page.js` |
| Global styles | `app-next/app/globals.css` |
| Auth | `app-next/lib/supabase.js` |
| Entry unlock logic | `app-next/lib/unlock.js` |
| Config (TOTAL_ENTRIES etc.) | `app-next/lib/config.js` |
| Edge functions (email) | `supabase/functions/` |
| Entry content | `app-next/public/entries/[NNN].json` |
| Deep Cut component + FAB | `app-next/components/DeepCut.jsx` |
| Deep Cut API route | `app-next/app/api/deep-cut/route.js` |
| Lock It In (conversational) | `app-next/components/LockItIn.jsx` + `app-next/app/api/lock-it-in/route.js` |
| Spaced-repetition review page | `app-next/app/review/page.js` |
| SR scheduling helpers | `app-next/lib/lockins.js` |
| Category registry (single source) | `app-next/lib/categories.js` |

---

## Layout changes — 2026-06-28 (Lock It In + Keep It Sharp)

- **Evening tab ("LOCK IT IN"):** mode chooser now shows for **all users** (was admin-only) — "Lock it in with AI →" vs "Take the quick quiz". Conversational flow renders inline.
- **Entry completion card ("WHAT'S NEXT"):** new **"Keep this one sharp"** card at the top — enrolls the lesson into spaced repetition; flips to an enrolled-confirmation state with a "Remove from rotation" link.
- **New route `/review`:** dark (`#0e141c`) recall surface. Per-card: category eyebrow (accent), concept, Leitner box dots, REVEAL → keeper/hook → "Got it" / "Still fuzzy". Finish state shows graduated count + "coming up" queue. Max width 560.
- **Home REVIEW entry point:** action strip button (top, mobile/header) + desktop sidebar nav item, both with a due-count badge (`• N`) in accent when reviews are due.
- **Welcome/boot overlay:** wordmark + "TAP TO CONTINUE" recolored from `#2a2a2a` (invisible on near-black) to `rgba(255,255,255,0.3)` / `0.4`. Overlay still gated to once per browser session (`sessionStorage 'welcomed'`), auto-dismiss ~6.7s.
- No changes to the light screens (welcome typewriter background, streak ritual, goal sheet).

## Layout changes — 2026-06-28 Session 2 (On This Day + admin overhaul)

- **Today tab — "On This Day" card:** between KPIs and today's lesson. History-gold (`#E0A93D`) left border, "ON THIS DAY · MON DD" eyebrow, "BONUS" tag, year + blurb. Tap → "WHY IT STICKS" + Wikipedia source + "VIEW THE ARCHIVE →". Live for all users.
- **New route `/on-this-day`:** dark archive of all cards, newest first, each expandable. Admin-only **BACKFILL** control (7/30/90-day buttons) at top.
- **Admin section — now DARK.** Converted from the leftover light theme to the app system: `#0e141c` page, `#1a2a3a` cards, light text (`#e8eef5` / muted whites), dark blurred header, subtle elevated inner surfaces (`rgba(255,255,255,0.05)`). Primary buttons/active tabs use slate `#33506e`; category accents + white-on-color-button text unchanged.
- **Admin user cards — responsive:** identity + nudge/chevron on top, the 3 stats reflow to a full-width row below a divider on mobile (`.au-head`/`.au-stats`/`.au-actions` + media query). KPI grid 2-col on mobile.
- **Admin feedback tab:** summary card (rating avgs + recommend breakdown + ✦ Summarize with AI), **CHECK-IN SURVEYS** section (7/14/21/30-day), weekly survey blob parsed into a **key/value table** (`SurveyDetail`), **✓ Addressed** toggle per item, post-entry items show **ENTRY #N**.
- **Admin user card — phone editor** in the expanded detail (CELL PHONE field + SAVE).
- **Admin systems strip** (Keep It Sharp / Lock It In / On This Day) above the tab nav.
- **Admin bugs tab:** Won't-Fix + Reopen actions, filter chips with counts, status-tinted cards, mobile reflow.

## 2026-06-28 Session 3 — No layout changes
Content-only session (60 drafts generated; "Why Today" rewritten across live entries 001–060). No UI/layout changes.
