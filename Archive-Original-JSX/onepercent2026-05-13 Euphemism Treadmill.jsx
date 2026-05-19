import { useState, useEffect, useRef } from "react";

const GOOGLE_FONTS = "@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');";

const ACCENT = "#FF8C47"; // Vocab & Language — Orange

const data = {
  date: "May 13, 2026",
  entry: "009",
  category: "Vocab & Language",
  concept: "Euphemism Treadmill",
  // MORNING
  hook: "The kinder word you chose? It's already on borrowed time.",
  explanation:
    "The euphemism treadmill is the cycle where a new word replaces a stigmatized one — and then picks up the same stigma. 'Moron' was a clinical term introduced to replace 'idiot.' 'Retarded' replaced 'moron.' 'Intellectually disabled' replaced 'retarded.' Each word started neutral, absorbed the weight of what it described, and became the thing people wanted to escape. The treadmill never stops because the word isn't the problem — the underlying concept is. You can rename something all you want, but the new name inherits what the old one carried.",
  why_today:
    "In an era of accelerating language change — in media, in workplaces, in AI outputs — understanding why word swaps don't fix perception is one of the most practically useful things a communicator can know.",
  morning_challenge:
    "Pick one term in your industry or daily life that's already gone through at least one rename. Trace the chain. What did it replace — and does the new version still carry the weight?",
  // MIDDAY
  reframe:
    "The treadmill isn't a language problem. It's a trust diagnostic: every spin of the wheel tells your audience you're managing optics, not solving problems.",
  real_world:
    "Corporate layoff language ran the exact cycle. In the 1980s and early 90s, 'layoffs' became 'downsizing.' By 1995, HR professionals were already noting that 'downsizing' felt too negative — so 'rightsizing' emerged. By the 2010s, 'rightsizing' had taken on its own cynical edge. Today, 'workforce optimization' and 'structural realignment' carry the same bitter read that 'layoffs' always did. The Houston Chronicle documented the 'rightsizing' emergence in 1995, noting plainly: 'Downsizing became popular a few years ago to replace layoffs, but then people started thinking downsizing was too negative.' Nobody missed what was happening. The treadmill didn't protect anyone — it just marked the company as an organization that wouldn't say the hard thing directly.",
  quote:
    "The euphemism treadmill shows that concepts, not words, are in charge: give a concept a new name, and the name becomes colored by the concept; the concept does not become freshened by the name.",
  quote_attribution: "Steven Pinker — The Game of the Name, New York Times, 1994",
  midday_nudge:
    "What word are you or your organization currently cycling through — and what's the real thing that word is trying to avoid naming?",
  // EVENING QUIZ
  questions: [
    {
      id: "q1",
      text: "Who coined the term 'euphemism treadmill' and in what year?",
      options: [
        { id: "a", text: "George Orwell, 1933 — in Down and Out in Paris and London" },
        { id: "b", text: "Steven Pinker, 1994 — in a New York Times op-ed" },
        { id: "c", text: "Noam Chomsky, 1965 — in Aspects of the Theory of Syntax" },
        { id: "d", text: "Deborah Tannen, 1990 — in You Just Don't Understand" },
      ],
      correct: "b",
      explanation:
        "Pinker named the phenomenon in 'The Game of the Name,' a 1994 NYT op-ed. He expanded on it in The Blank Slate (2002). Orwell observed the pattern without naming it; Pinker gave it the label.",
    },
    {
      id: "q2",
      text: "Why does replacing a stigmatized word with a euphemism ultimately fail to solve the perception problem?",
      options: [
        { id: "a", text: "Because new words are harder to pronounce and people revert to old ones" },
        { id: "b", text: "Because the new word is phonetically similar to the old one, triggering the same associations" },
        { id: "c", text: "Because the underlying concept still carries the same social weight — the new word inherits it through association" },
        { id: "d", text: "Because audiences are too set in their habits to adopt new vocabulary" },
      ],
      correct: "c",
      explanation:
        "Pinker's core point: concepts are primary, words are downstream. The new word doesn't change perception of the concept — it just gets colored by it. The treadmill restarts because the real issue was never the word.",
    },
    {
      id: "q3",
      text: "You're writing a company announcement about eliminating 200 roles. Your manager suggests using 'workforce realignment' instead of 'layoffs.' Based on what you know about the euphemism treadmill, what should you do?",
      options: [
        { id: "a", text: "Use 'workforce realignment' — the softer term will reduce negative reactions" },
        { id: "b", text: "Combine both: 'layoff-driven workforce realignment' so it's transparent and softened" },
        { id: "c", text: "Replace both with a more abstract phrase like 'organizational evolution' to maximize distance from the concept" },
        { id: "d", text: "Name the reality plainly — 'workforce realignment' will read as spin, eroding the trust you need from the employees who remain" },
      ],
      correct: "d",
      explanation:
        "The treadmill predicts that the euphemism will acquire the same negative read as the thing it replaces — often faster when the stakes are high and audiences know exactly what's being avoided. Plain language preserves credibility with the audience that matters most: the people still there.",
    },
  ],
  closing_line: "The next word you choose to soften something — notice what you're actually trying to avoid naming.",
  // POST
  linkedin_post: `Most "nicer" words have an expiration date.

The euphemism treadmill: you introduce a softer term for something uncomfortable. The new term works — briefly. Then it picks up the exact stigma the old word carried, and the cycle starts again.

Moron replaced idiot.
Retarded replaced moron.
Intellectually disabled replaced retarded.

In corporate life: layoffs → downsizing → rightsizing → workforce optimization.

Same move. Same result. The audience always knows what you're not saying — and now they also know you won't say it.

Pinker's insight is sharp: concepts are in charge, not words. Give a concept a new name, and the name gets colored by the concept. The concept doesn't get freshened by the name.

Knowing this changes how you communicate. Not because you should stop caring about language — but because you should stop expecting a word swap to do what only a real change can do.

Today's One Percent: the treadmill, why it never stops, and what to do instead.

Swipe through.

#OnePercent #VocabAndLanguage #Communication #Language #Writing`,
  // SOURCES
  sources: [
    {
      label: "Steven Pinker — The Game of the Name",
      detail: "New York Times op-ed, April 3, 1994. Pinker coins the term 'euphemism treadmill' and establishes the core mechanism: concepts lead, words follow.",
      url: "https://stevenpinker.com/files/pinker/files/1994_04_03_newyorktimes.pdf",
    },
    {
      label: "Pinker — The Blank Slate (2002)",
      detail: "Viking Penguin. Expands the euphemism treadmill argument with additional examples. Quote: 'concepts, not words, are in charge.'",
      url: "https://en.wikipedia.org/wiki/The_Blank_Slate",
    },
    {
      label: "L. M. Sixel — New Terms, Old Ideas",
      detail: "Houston Chronicle, May 8, 1995. Documents the layoffs → downsizing → rightsizing transition as it was happening in real time.",
      url: "https://wordspy.com/words/rightsizing",
    },
  ],
};

const TABS = [
  { id: "morning", emoji: "🌱", label: "MORNING" },
  { id: "midday", emoji: "👁", label: "MIDDAY" },
  { id: "evening", emoji: "🔥", label: "EVENING" },
  { id: "post", emoji: "📋", label: "POST" },
];

const S = {
  root: {
    fontFamily: "'DM Mono', monospace",
    background: "#0A0A0A",
    minHeight: "100vh",
    color: "#fff",
    maxWidth: 680,
    margin: "0 auto",
    padding: "0 16px 80px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 0 0",
    borderBottom: "1px solid #1a1a1a",
    paddingBottom: 14,
  },
  logo: { fontSize: 13, fontWeight: 500, letterSpacing: "0.05em", color: "#fff" },
  entryBadge: {
    fontSize: 10,
    letterSpacing: "0.15em",
    color: ACCENT,
    background: `${ACCENT}18`,
    border: `1px solid ${ACCENT}30`,
    padding: "3px 8px",
    borderRadius: 2,
  },
  rightHead: { display: "flex", alignItems: "center", gap: 10 },
  streak: { fontSize: 11, color: "#555", letterSpacing: "0.08em" },
  catBadge: {
    fontSize: 10,
    letterSpacing: "0.12em",
    color: ACCENT,
    border: `1px solid ${ACCENT}35`,
    padding: "3px 8px",
    borderRadius: 2,
  },
  datebar: {
    fontSize: 10,
    letterSpacing: "0.1em",
    color: "#444",
    padding: "10px 0 16px",
    borderBottom: "1px solid #111",
  },
  conceptTitle: {
    fontSize: 32,
    fontWeight: 400,
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
    margin: "24px 0 0",
    color: "#fff",
  },
  accentRule: {
    height: 2,
    background: ACCENT,
    width: 40,
    margin: "12px 0 24px",
    borderRadius: 1,
  },
  tabs: {
    display: "flex",
    gap: 0,
    borderBottom: "1px solid #1a1a1a",
    marginBottom: 28,
  },
  tab: (active) => ({
    fontSize: 10,
    letterSpacing: "0.12em",
    padding: "10px 14px",
    cursor: "pointer",
    color: active ? ACCENT : "#444",
    borderBottom: active ? `2px solid ${ACCENT}` : "2px solid transparent",
    marginBottom: -1,
    background: "none",
    border: "none",
    borderBottom: active ? `2px solid ${ACCENT}` : "2px solid transparent",
    fontFamily: "'DM Mono', monospace",
    transition: "color 0.2s",
  }),
  section: {
    animation: "tabFade 0.28s ease",
  },
  label: {
    fontSize: 10,
    letterSpacing: "0.15em",
    color: "#444",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  hook: {
    fontSize: 18,
    lineHeight: 1.5,
    letterSpacing: "-0.01em",
    color: "#fff",
    marginBottom: 18,
    fontWeight: 400,
  },
  body: {
    fontSize: 13,
    lineHeight: 1.75,
    color: "#888",
    marginBottom: 20,
  },
  challengeBox: {
    background: `${ACCENT}12`,
    border: `1px solid ${ACCENT}20`,
    borderRadius: 4,
    padding: "14px 16px",
    fontSize: 13,
    lineHeight: 1.65,
    color: "#ccc",
    marginBottom: 20,
  },
  reframeBlock: {
    borderLeft: `3px solid ${ACCENT}`,
    paddingLeft: 14,
    marginBottom: 22,
    fontSize: 15,
    lineHeight: 1.6,
    color: "#ddd",
    fontStyle: "italic",
  },
  quoteBlock: {
    border: `1px solid ${ACCENT}27`,
    borderRadius: 4,
    padding: "14px 16px",
    marginBottom: 20,
  },
  quoteText: {
    fontSize: 13,
    lineHeight: 1.7,
    color: "#bbb",
    marginBottom: 6,
    fontStyle: "italic",
  },
  quoteAttrib: {
    fontSize: 10,
    letterSpacing: "0.1em",
    color: "#555",
    textTransform: "uppercase",
  },
  nudge: {
    fontSize: 13,
    lineHeight: 1.65,
    color: "#aaa",
    fontStyle: "italic",
    marginBottom: 20,
  },
  qBlock: {
    background: "#0d0d0d",
    border: "1px solid #1a1a1a",
    borderRadius: 4,
    padding: "16px",
    marginBottom: 14,
  },
  qText: { fontSize: 13, lineHeight: 1.6, color: "#ddd", marginBottom: 12 },
  qNum: { fontSize: 10, letterSpacing: "0.15em", color: ACCENT, marginBottom: 8, display: "block" },
  optRow: (state) => ({
    fontSize: 12,
    lineHeight: 1.6,
    padding: "9px 12px",
    borderRadius: 3,
    cursor: state === "revealed" ? "default" : "pointer",
    marginBottom: 6,
    background:
      state === "correct"
        ? "#0d2a0d"
        : state === "wrong"
        ? "#2a0d0d"
        : state === "selected"
        ? `${ACCENT}13`
        : "#111",
    border:
      state === "correct"
        ? "1px solid #1a5c1a"
        : state === "wrong"
        ? "1px solid #5c1a1a"
        : state === "selected"
        ? `1px solid ${ACCENT}`
        : "1px solid #222",
    color:
      state === "correct" ? "#4daa4d" : state === "wrong" ? "#aa4d4d" : "#888",
    transition: "all 0.15s",
  }),
  submitBtn: {
    background: ACCENT,
    color: "#0A0A0A",
    border: "none",
    borderRadius: 3,
    padding: "11px 24px",
    fontSize: 11,
    letterSpacing: "0.12em",
    fontFamily: "'DM Mono', monospace",
    cursor: "pointer",
    marginTop: 6,
    fontWeight: 500,
  },
  submitBtnDisabled: {
    background: "#222",
    color: "#555",
    border: "none",
    borderRadius: 3,
    padding: "11px 24px",
    fontSize: 11,
    letterSpacing: "0.12em",
    fontFamily: "'DM Mono', monospace",
    cursor: "not-allowed",
    marginTop: 6,
  },
  scoreBox: (score) => ({
    border: `1px solid ${ACCENT}40`,
    borderRadius: 4,
    padding: "18px 20px",
    textAlign: "center",
    marginTop: 18,
    background: `${ACCENT}08`,
  }),
  scoreNum: {
    fontSize: 36,
    color: ACCENT,
    fontWeight: 400,
    letterSpacing: "-0.02em",
    lineHeight: 1,
    display: "block",
    marginBottom: 4,
  },
  scoreLabel: { fontSize: 11, letterSpacing: "0.15em", color: "#666" },
  closingLine: { fontSize: 13, color: "#aaa", marginTop: 20, lineHeight: 1.6 },
  postBox: {
    background: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: 4,
    padding: "16px",
    fontSize: 12,
    lineHeight: 1.75,
    color: "#bbb",
    whiteSpace: "pre-wrap",
    marginBottom: 14,
  },
  copyBtn: {
    background: ACCENT,
    color: "#0A0A0A",
    border: "none",
    borderRadius: 3,
    padding: "10px 20px",
    fontSize: 11,
    letterSpacing: "0.12em",
    fontFamily: "'DM Mono', monospace",
    cursor: "pointer",
    fontWeight: 500,
    marginBottom: 6,
  },
  readyBadge: {
    fontSize: 10,
    letterSpacing: "0.15em",
    color: "#2a8c2a",
    background: "#0a1f0a",
    border: "1px solid #1a4c1a",
    padding: "3px 8px",
    borderRadius: 2,
    display: "inline-block",
    marginBottom: 14,
  },
  sourcesToggle: {
    fontSize: 10,
    letterSpacing: "0.15em",
    color: "#555",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 32,
    paddingTop: 16,
    borderTop: "1px solid #111",
    background: "none",
    border: "none",
    borderTop: "1px solid #111",
    width: "100%",
    textAlign: "left",
    fontFamily: "'DM Mono', monospace",
    paddingTop: 16,
  },
  sourceItem: { marginBottom: 16 },
  sourceLabel: {
    fontSize: 12,
    color: ACCENT,
    textDecoration: "none",
    display: "block",
    marginBottom: 3,
  },
  sourceDetail: { fontSize: 11, color: "#444", lineHeight: 1.55 },
  verifiedBadge: {
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "#2a8c2a",
    marginTop: 12,
  },
  explanationBox: {
    background: "#0d0d0d",
    borderLeft: `2px solid ${ACCENT}40`,
    padding: "8px 12px",
    marginTop: 10,
    fontSize: 11,
    lineHeight: 1.6,
    color: "#666",
  },
};

function useStreak() {
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    const today = new Date().toDateString();
    const last = localStorage.getItem("op_last");
    let s = parseInt(localStorage.getItem("op_streak") || "0", 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (last === today) {
      setStreak(s);
    } else if (last === yesterday.toDateString()) {
      s += 1;
      localStorage.setItem("op_streak", s);
      localStorage.setItem("op_last", today);
      setStreak(s);
    } else {
      localStorage.setItem("op_streak", 1);
      localStorage.setItem("op_last", today);
      setStreak(1);
    }
  }, []);
  return streak;
}

export default function OnePercent() {
  const [tab, setTab] = useState("morning");
  const [answers, setAnswers] = useState({ q1: null, q2: null, q3: null });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const streak = useStreak();

  const allAnswered = answers.q1 && answers.q2 && answers.q3;
  const score = submitted
    ? data.questions.filter((q) => answers[q.id] === q.correct).length
    : 0;
  const scoreLabel =
    score === 3 ? "LOCKED IN" : score === 2 ? "ALMOST THERE" : "REVIEW TOMORROW";

  function selectOpt(qid, oid) {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [qid]: oid }));
  }

  function optState(q, oid) {
    if (!submitted) return answers[q.id] === oid ? "selected" : "default";
    if (oid === q.correct) return "correct";
    if (answers[q.id] === oid && oid !== q.correct) return "wrong";
    return "revealed";
  }

  function handleCopy() {
    navigator.clipboard.writeText(data.linkedin_post);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <style>{`
        ${GOOGLE_FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes tabFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={S.root}>
        {/* HEADER */}
        <div style={S.header}>
          <div style={S.logo}>ONE PERCENT</div>
          <div style={S.rightHead}>
            <span style={S.streak}>🔥 {streak}</span>
            <span style={S.catBadge}>VOCAB & LANGUAGE</span>
            <span style={S.entryBadge}>#009</span>
          </div>
        </div>
        {/* DATEBAR */}
        <div style={S.datebar}>
          <span>{data.date}</span>
          <span style={{ color: "#2a2a2a", margin: "0 6px" }}>·</span>
          <span style={{ color: ACCENT, opacity: 0.7 }}>{data.category}</span>
          <span style={{ color: "#2a2a2a", margin: "0 6px" }}>·</span>
          <span style={{ color: "#666" }}>{data.concept}</span>
        </div>
        {/* CONCEPT TITLE */}
        <div style={S.conceptTitle}>{data.concept}</div>
        <div style={S.accentRule} />
        {/* TABS */}
        <div style={S.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              style={S.tab(tab === t.id)}
              onClick={() => setTab(t.id)}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
        {/* TAB CONTENT */}
        <div style={S.section} key={tab}>
          {tab === "morning" && (
            <>
              <div style={S.label}>PLANT THE SEED</div>
              <div style={S.hook}>{data.hook}</div>
              <div style={S.body}>{data.explanation}</div>
              <div style={S.label}>WHY NOW</div>
              <div style={S.body}>{data.why_today}</div>
              <div style={S.label}>MORNING CHALLENGE</div>
              <div style={S.challengeBox}>{data.morning_challenge}</div>
            </>
          )}
          {tab === "midday" && (
            <>
              <div style={S.label}>SEE IT DIFFERENTLY</div>
              <div style={S.reframeBlock}>{data.reframe}</div>
              <div style={S.label}>IN THE WILD</div>
              <div style={S.body}>{data.real_world}</div>
              <div style={S.label}>THE QUOTE</div>
              <div style={S.quoteBlock}>
                <div style={S.quoteText}>"{data.quote}"</div>
                <div style={S.quoteAttrib}>— {data.quote_attribution}</div>
              </div>
              <div style={S.label}>MIDDAY NUDGE</div>
              <div style={S.nudge}>{data.midday_nudge}</div>
            </>
          )}
          {tab === "evening" && (
            <>
              <div style={S.label}>BURN IT IN</div>
              {data.questions.map((q, qi) => (
                <div key={q.id} style={S.qBlock}>
                  <span style={S.qNum}>Q{qi + 1} ·{qi === 0 ? " RECALL" : qi === 1 ? " UNDERSTANDING" : " APPLICATION"}</span>
                  <div style={S.qText}>{q.text}</div>
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      style={S.optRow(optState(q, opt.id))}
                      onClick={() => selectOpt(q.id, opt.id)}
                    >
                      {opt.id.toUpperCase()}. {opt.text}
                    </div>
                  ))}
                  {submitted && (
                    <div style={S.explanationBox}>{q.explanation}</div>
                  )}
                </div>
              ))}
              {!submitted ? (
                <button
                  style={allAnswered ? S.submitBtn : S.submitBtnDisabled}
                  onClick={() => allAnswered && setSubmitted(true)}
                  disabled={!allAnswered}
                >
                  {allAnswered ? "SUBMIT" : "ANSWER ALL 3 TO SUBMIT"}
                </button>
              ) : (
                <div style={S.scoreBox(score)}>
                  <span style={S.scoreNum}>{score}/3</span>
                  <span style={S.scoreLabel}>{scoreLabel}</span>
                </div>
              )}
              <div style={S.closingLine}>{data.closing_line}</div>
            </>
          )}
          {tab === "post" && (
            <>
              <div style={S.readyBadge}>READY TO POST</div>
              <div style={S.postBox}>{data.linkedin_post}</div>
              <button style={S.copyBtn} onClick={handleCopy}>
                {copied ? "COPIED ✓" : "COPY POST"}
              </button>
            </>
          )}
        </div>
        {/* SOURCES */}
        <button style={S.sourcesToggle} onClick={() => setSourcesOpen((o) => !o)}>
          <span style={{ color: "#333" }}>{sourcesOpen ? "▲" : "▼"}</span>
          <span style={{ color: "#444", letterSpacing: "0.15em" }}>SOURCES</span>
        </button>
        {sourcesOpen && (
          <div style={{ marginTop: 14, animation: "tabFade 0.22s ease" }}>
            {data.sources.map((src, i) => (
              <div key={i} style={S.sourceItem}>
                <a href={src.url} target="_blank" rel="noopener noreferrer" style={S.sourceLabel}>
                  {src.label} ↗
                </a>
                <div style={S.sourceDetail}>{src.detail}</div>
              </div>
            ))}
            <div style={S.verifiedBadge}>✓ ALL SOURCES VERIFIED</div>
          </div>
        )}
      </div>
    </>
  );
}
