# One Percent — Layout & Design State
**Last updated:** 2026-06-14

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
- Action strip below wordmark: ABOUT · CHANGELOG · BUG (pink) · FEEDBACK · INFO · SIGN OUT
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
- Bottom: ABOUT · BUG · FEEDBACK · ADMIN (if admin) · SIGN OUT links

### Main Content (`op-main`)
- `flex: 1`, `maxWidth: 680px`, `paddingBottom: 60px`
- Header (`op-header`) hidden — wordmark lives in sidebar

---

## Surfaces

### Welcome Overlay
- Fires once per session (sessionStorage flag)
- Full-screen dark overlay (`#0a0a0f` gradient)
- Typewriter animation: name typed out at 65ms/char
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
- Prompt cards per completed entry: left border (category color), category + concept label, "Open in Claude →" CTA

### PROGRESS Tab
Layout (top to bottom):
1. **Streak section** — no card box, floats on page. Large 🔥 + number + DAY STREAK label. Personal best below. 7-day week row (M–S dots). Streak freeze strip (🧊 inline, shows count)
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

## Modals & Overlays

### How It Works Modal
- 7-step card flow, light theme (`#f0f4f8` gradient — intentionally different from app aesthetic)
- Progress bar at top, step dots, prev/next nav
- Dismissable via ✕ or clicking outside

### Feedback Modal
- Star rating 1–5 + comment textarea + screenshot attach
- Dark modal (`#111` bg)

### Bug Modal
- Page selector dropdown + description textarea + screenshot attach
- Dark modal, REPORT button in pink `#FF4778`

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
| `/profile` | `app/profile/page.js` | User profile |
| `/leaderboard` | `app/leaderboard/page.js` | Leaderboard |
| `/about` | `app/about/page.js` | About page (needs dark style update) |
| `/changelog` | `app/changelog/page.js` | Changelog (needs dark style update) |
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
1. All tabs need `paddingBottom` to clear bottom nav (last card cut off)
2. About + Changelog pages need dark style treatment
3. Bug + Feedback modals need visual liveliness (too much gray)
4. Tab scroll position should reset to top when switching tabs
5. Profile page needs rethink — overlaps with Progress tab

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
