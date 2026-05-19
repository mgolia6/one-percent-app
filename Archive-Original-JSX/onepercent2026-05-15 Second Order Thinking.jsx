import { useState, useEffect } from "react";

// ─── ENTRY METADATA ──────────────────────────────────────────────────────────
// Entry: 011 | Category: Mental Models | Concept: Second-Order Thinking
// Date: May 15, 2026
//
// SOURCES — verified via web search 2026-05-15:
// [1] Marks, H. — The Most Important Thing: Uncommon Sense for the Thoughtful Investor
//     Columbia University Press, New York, 2011
//     Chapter 2: "Understanding Second-Level Thinking" ✓
//     Coined "second-level thinking" as a named framework; first published in memos
//     starting 2003, formalized in the book.
//     us.columbia.edu/content/most-important-thing-uncommon-sense-thoughtful-investor
// [2] Parrish, S. — "Second-Order Thinking: What Smart People Use to Outperform"
//     Farnam Street / fs.blog, 2016 (continuously updated) ✓
//     Popularized the mental model framework for general decision-making.
//     fs.blog/second-order-thinking/
// [3] The Hanoi Rat Bounty, 1902 — French colonial Vietnam
//     Widely documented in historical and academic sources as a canonical example
//     of perverse incentives and failed first-order thinking. Type B.
//     Multiple verified sources: Michael Vann, "Of Rats, Rice, and Race" (2003),
//     French Colonial History, Vol. 4. Documented in Ness Labs, FEE, and broadly
//     cited in behavioral economics and policy literature.
//
// QUOTE — verified verbatim 2026-05-15:
// "First-level thinking is simplistic and superficial, and just about everyone
//  can do it (a bad sign for anything involving an attempt at superiority)."
// — Howard Marks, The Most Important Thing, Columbia University Press, 2011
// Confirmed verbatim: Illuminated edition text, Nat Eliason notes, Novel Investor,
// Ness Labs, multiple independent book summaries ✓
//
// AI NUDGE: Applicable — use AI to surface second and third-order consequences
// before committing to a decision
//
// IN THE WILD: Type B — Hanoi Rat Bounty, 1902. French colonial government
// offered a bounty for rats to control infestation. Rat catchers began catching
// rats, cutting off their tails for the reward, then releasing the rats to
// breed — increasing the rat population. Widely documented in academic sources.
//
// MIDDAY ESCALATION CHECK: Morning = the "And then what?" mechanism (how to
// think in second-order). Midday escalates to the compounding dimension:
// second-order effects don't arrive evenly — they arrive after a delay, then
// hit fast. By the time the second-order consequence is visible, the first-order
// decision is usually locked in. The Hanoi bounty shows this: by the time
// officials noticed tailless rats, the incentive was already embedded. ✓
//
// QUIZ Q3 APPLICATION CHECK: Q3 presents a real leadership decision (offering
// a team incentive for speed) and asks what second-order thinking predicts.
// Forces use of the model, not identification. ✓
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = "#C847FF";
const ACCENT_DIM = "#C847FF22";

const data = {
  category: "Mental Models",
  categoryTag: "MENTAL MODELS",
  concept: "Second-Order Thinking",
  date: "May 15, 2026",
  entry: "011",
  morning: {
    hook: "Most decisions fail not because the first move was wrong, but because nobody asked what happens after the first move works.",
    explanation:
      "Second-order thinking is the discipline of asking 'And then what?' — not once, but twice. First-order thinking is what everyone does: it's fast, it's obvious, and it points to the most direct path between problem and solution. Howard Marks, founder of Oaktree Capital, named this gap: first-level thinking is accessible to anyone, which is exactly why acting on it alone puts you in the same lane as everyone else. The second-order thinker doesn't just ask what an action will produce — they ask what that outcome will produce, and what happens in the ecosystem around it. Every decision lands in a system. Systems react. Those reactions become the real consequences, and they often arrive later, bigger, and harder to reverse than the first-order effect ever was.",
    why_today:
      "The decisions you're most confident about today — the ones with an obvious, clean answer — are exactly where second-order thinking pays off. The obvious answer is cheap because everyone can see it.",
    morning_challenge:
      "Find one decision you're facing this week — something you already have a first-order answer to.\n\nMap it out:\n- What is the immediate effect? (First order)\n- What happens because of that effect? (Second order)\n- Who else in the system is affected, and how will they respond? (Third order)\n\nThen run this prompt:\n\n\"I'm considering [describe the decision]. My first-order reasoning is [your obvious answer]. Act as a second-order thinker. List 5 second and third-order consequences I might not be accounting for — including unintended effects on people, incentives, and systems. Flag which ones are most likely to matter and which I can't easily reverse.\"\n\nIf the output changes what you do, that's the model working.",
  },
  midday: {
    reframe:
      "Second-order effects don't arrive gradually — they arrive after a delay and then all at once. By the time they're visible, the first-order decision is locked.",
    real_world:
      "In 1902, the French colonial government in Hanoi offered a bounty for rats to control an infestation. Payment was made per rat tail. The policy worked immediately — dead rat tails flooded in, and officials congratulated themselves. What they couldn't see: rat catchers were catching rats, cutting off their tails, and releasing the animals back into the sewer system to breed. More rats meant more tails, more tails meant more income. By the time officials noticed rats roaming the city with no tails, the incentive had been running for months. The rats' population had grown. When the bounty was cancelled, nothing was better — and a new population of rats had been optimized to survive the policy. This is the second-order structure: the first-order effect (tails submitted) was real and visible immediately. The second-order effect (breeding incentivized by the bounty) was invisible until it was already embedded in behavior. The third-order effect (rats optimized for detailing survival) arrived after the policy ended. They saw the first order. They never asked what came after it. (Michael Vann, 'Of Rats, Rice, and Race,' French Colonial History, Vol. 4, 2003)",
    quote:
      "First-level thinking is simplistic and superficial, and just about everyone can do it (a bad sign for anything involving an attempt at superiority).",
    attribution: "Howard Marks, The Most Important Thing, Columbia University Press, 2011",
    midday_nudge:
      "Think about a decision you made in the last 90 days where you had a clear, obvious first-order answer. What did the second-order play out as? Did you see it coming?",
  },
  quiz: [
    {
      question: "Howard Marks defined second-level thinking in contrast to first-level thinking. What is the core distinction?",
      options: [
        "First-level thinking uses intuition; second-level thinking uses data and analysis",
        "First-level thinking is simplistic and focuses on the obvious immediate outcome; second-level thinking accounts for what happens after that outcome, including how others will respond",
        "First-level thinking is reactive; second-level thinking requires slowing down and always choosing the contrarian position",
        "Second-level thinking is reserved for complex decisions; first-level thinking is appropriate for routine ones",
      ],
      correct: 1,
      explanation:
        "The core distinction is depth and system awareness, not intuition vs. data. Marks' point is that first-level answers are available to everyone, which means acting on them alone can't produce above-average outcomes. Second-order thinkers ask: what will happen after the first effect, and how will the system react?",
    },
    {
      question: "The Hanoi rat bounty (1902) demonstrates a specific failure mode of first-order thinking. Which of the following best describes what went wrong?",
      options: [
        "The bounty was set too low to incentivize behavior change",
        "Officials measured the wrong thing — tails instead of live rat population",
        "The policy solved the first-order problem (rats submitted) while creating a second-order consequence (breeding incentivized) that made the underlying problem worse",
        "The government failed to communicate the policy clearly, so rat catchers misunderstood it",
      ],
      correct: 2,
      explanation:
        "The bounty worked perfectly at the first order — it changed behavior immediately. But the second-order consequence was that it created an incentive to breed the very thing being eliminated. The policy solved a visible metric while worsening the underlying reality. This is the failure pattern second-order thinking is designed to catch.",
    },
    {
      question: "You're a team lead. To speed up delivery, you announce that whoever closes the most tickets this sprint gets a bonus. Output increases significantly. What does second-order thinking predict is likely happening — and what should you check?",
      options: [
        "Nothing — the incentive is working as intended; high output is the goal and it's being achieved",
        "The team is cutting corners on testing or documentation, or closing easy tickets ahead of complex ones — you should audit quality and backlog composition, not just velocity",
        "The bonus is probably too small; second-order thinking would suggest increasing it to sustain the behavior change",
        "Team morale will improve because recognition motivates people; the second-order effect is positive",
      ],
      correct: 1,
      explanation:
        "Ticket velocity is the first-order metric. The second-order consequence: when people are rewarded for volume, they route toward easy wins, defer hard problems, or reduce quality to close faster. The metric goes up; the system degrades. Second-order thinking says: check what's NOT being counted, not just what is.",
    },
  ],
  score_labels: ["REVIEW TOMORROW", "ALMOST THERE", "LOCKED IN"],
  closing_line:
    "Tomorrow you get 1% sharper. Tonight: pick the decision you're most confident about this week — and ask what happens after your obvious answer works.",
  linkedin_post: `Most decisions fail not because the first move was wrong.

They fail because nobody asked what happens after the first move works.

There's a name for that discipline: second-order thinking.

Howard Marks coined the term in his book The Most Important Thing. His point: first-level thinking is available to everyone, which means acting on it alone puts you in the same lane as everyone else. The obvious answer is cheap. The second-order question is where the edge lives.

A perfect case study: the Hanoi rat bounty, 1902. French colonial government offered payment per rat tail to control an infestation. Tails flooded in. Policy looked like a success.

Then officials started seeing rats without tails.

Rat catchers were catching them, clipping the tails, and releasing the rats to breed more. The bounty had turned the pest into an asset. By the time anyone saw it coming, the system had already adapted.

They got the first order right. They never asked what came second.

Today's One Percent: the model, how to use it before a decision (not after), and an AI prompt that surfaces the consequences you're probably not seeing.

Swipe through.

#OnePercent #MentalModels #DecisionMaking #Leadership #Thinking`,
  sources: [
    {
      label: "Marks, H. — The Most Important Thing, Columbia University Press (2011)",
      detail: "Chapter 2 introduces 'second-level thinking' as a named mental model. Marks applied it to investing, but the framework applies to any domain where systems react to decisions.",
      url: "https://cup.columbia.edu/book/the-most-important-thing/9780231153683",
    },
    {
      label: "Parrish, S. — 'Second-Order Thinking: What Smart People Use to Outperform,' Farnam Street (2016)",
      detail: "Popularized the framework beyond investing. Introduces the 'And then what?' question as the operative mechanism for second-order reasoning.",
      url: "https://fs.blog/second-order-thinking/",
    },
    {
      label: "Vann, M. — 'Of Rats, Rice, and Race,' French Colonial History, Vol. 4 (2003)",
      detail: "Academic documentation of the 1902 Hanoi rat bounty program and its perverse incentive structure — a canonical second-order thinking failure.",
      url: "https://muse.jhu.edu/article/42113",
    },
  ],
};

export default function OnePercent() {
  const [tab, setTab] = useState("morning");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [copied, setCopied] = useState(false);
  const [srcOpen, setSrcOpen] = useState(false);
  const [streak, setStreak] = useState(1);
  const [key, setKey] = useState(0);

  const accent = ACCENT;

  useEffect(() => {
    const today = new Date().toDateString();
    const last = localStorage.getItem("op_last");
    const s = parseInt(localStorage.getItem("op_streak") || "0");
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (last === today) {
      setStreak(s);
    } else if (last === yesterday) {
      const ns = s + 1;
      setStreak(ns);
      localStorage.setItem("op_streak", ns);
      localStorage.setItem("op_last", today);
    } else {
      setStreak(1);
      localStorage.setItem("op_streak", 1);
      localStorage.setItem("op_last", today);
    }
  }, []);

  useEffect(() => { setKey((k) => k + 1); }, [tab]);

  const handleAnswer = (qi, ai) => { if (!submitted) setAnswers((a) => ({ ...a, [qi]: ai })); };

  const handleSubmit = () => {
    let s = 0;
    data.quiz.forEach((q, i) => { if (answers[i] === q.correct) s++; });
    setScore(s);
    setSubmitted(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.linkedin_post).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const scoreLabel = score === 3 ? data.score_labels[2] : score === 2 ? data.score_labels[1] : data.score_labels[0];

  return (
    <>
      <style>{css(accent, ACCENT_DIM)}</style>
      <div style={S.root}>
        <div style={S.header}>
          <div style={S.hL}>
            <span style={S.logo}>ONE PERCENT</span>
            <span style={S.entry}>#{data.entry}</span>
          </div>
          <div style={S.hR}>
            <span style={S.streak}>🔥 {streak}</span>
            <span style={{ ...S.badge, background: accent }}>{data.categoryTag}</span>
          </div>
        </div>

        <div style={S.datebar}>
          <span>{data.date}</span>
          <span style={{ color: "#2a2a2a", margin: "0 6px" }}>·</span>
          <span style={{ color: accent, opacity: 0.7 }}>{data.category}</span>
          <span style={{ color: "#2a2a2a", margin: "0 6px" }}>·</span>
          <span style={{ color: "#555" }}>{data.concept}</span>
        </div>

        <div style={S.conceptBlock}>
          <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.15em", marginBottom: 10 }}>CONCEPT</div>
          <div style={S.conceptName}>{data.concept}</div>
          <div style={{ width: 40, height: 2, background: accent, marginTop: 14 }} />
        </div>

        <div style={S.tabRow}>
          {[
            { id: "morning", label: "🌱 MORNING" },
            { id: "midday", label: "👁 MIDDAY" },
            { id: "evening", label: "🔥 EVENING" },
            { id: "post", label: "📋 POST" },
          ].map((t) => (
            <button key={t.id} className={`tab-btn${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div key={key} className="fade-in" style={S.content}>
          {tab === "morning" && <MorningTab data={data.morning} accent={accent} />}
          {tab === "midday" && <MiddayTab data={data.midday} accent={accent} />}
          {tab === "evening" && (
            <EveningTab
              quiz={data.quiz}
              answers={answers}
              submitted={submitted}
              score={score}
              scoreLabel={scoreLabel}
              closing={data.closing_line}
              onAnswer={handleAnswer}
              onSubmit={handleSubmit}
              accent={accent}
            />
          )}
          {tab === "post" && <PostTab post={data.linkedin_post} copied={copied} onCopy={handleCopy} accent={accent} />}
        </div>

        <div style={S.srcSection}>
          <div style={S.srcDivider} />
          <button className="src-toggle" onClick={() => setSrcOpen((o) => !o)}>
            {srcOpen ? "▲" : "▼"} SOURCES
          </button>
          {srcOpen && (
            <div style={S.srcList}>
              {data.sources.map((s, i) => (
                <div key={i} style={S.srcItem}>
                  <a className="src-link" href={s.url} target="_blank" rel="noreferrer">
                    [{i + 1}] {s.label}
                  </a>
                  <div style={S.srcDetail}>{s.detail}</div>
                </div>
              ))}
              <div style={S.srcVerified}>✓ ALL SOURCES VERIFIED VIA WEB SEARCH · 2026-05-15</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MorningTab({ data, accent }) {
  const parts = data.morning_challenge.split("\n\n").filter(Boolean);
  return (
    <div>
      <div style={{ ...S.label, color: accent }}>🌱 PLANT THE SEED</div>
      <div style={S.hook}>{data.hook}</div>
      <div style={S.body}>{data.explanation}</div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.15em", marginBottom: 8 }}>WHY TODAY</div>
        <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6, marginTop: 6 }}>{data.why_today}</div>
      </div>
      <div style={{ background: accent + "12", border: `1px solid ${accent}33`, borderRadius: 4, padding: 16 }}>
        <div style={{ color: accent, fontSize: 10, letterSpacing: "0.12em", marginBottom: 10 }}>⚡ MORNING CHALLENGE · AI-ASSISTED</div>
        {parts.map((p, i) => (
          <div key={i} style={p.startsWith('"') || p.startsWith("\u201c")
            ? { fontSize: 12, color: "#ddd", lineHeight: 1.7, background: "#0A0A0A55", border: `1px solid ${accent}22`, borderRadius: 3, padding: "10px 12px", margin: "10px 0", fontStyle: "italic" }
            : { fontSize: 13, color: "#ccc", lineHeight: 1.7, marginBottom: i < parts.length - 1 ? 8 : 0 }
          }>{p}</div>
        ))}
      </div>
    </div>
  );
}

function MiddayTab({ data, accent }) {
  return (
    <div>
      <div style={{ ...S.label, color: accent }}>👁 SEE IT DIFFERENTLY</div>
      <div style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 17, color: "#fff", lineHeight: 1.5 }}>{data.reframe}</div>
      </div>
      <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.15em", marginBottom: 10 }}>IN THE WILD</div>
      <div style={S.body}>{data.real_world}</div>
      <div style={{ border: `1px solid ${accent}44`, borderRadius: 4, padding: "14px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#ddd", fontStyle: "italic", lineHeight: 1.6, marginBottom: 8 }}>"{data.quote}"</div>
        <div style={{ fontSize: 11, color: accent, letterSpacing: "0.08em" }}>— {data.attribution}</div>
      </div>
      <div style={{ borderLeft: `2px solid ${accent}66`, paddingLeft: 14 }}>
        <div style={{ color: accent, fontSize: 10, letterSpacing: "0.12em" }}>SIT WITH THIS</div>
        <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6, marginTop: 6 }}>{data.midday_nudge}</div>
      </div>
    </div>
  );
}

function EveningTab({ quiz, answers, submitted, score, scoreLabel, closing, onAnswer, onSubmit, accent }) {
  return (
    <div>
      <div style={{ ...S.label, color: accent }}>🔥 BURN IT IN</div>
      {quiz.map((q, qi) => (
        <div key={qi} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, color: accent, letterSpacing: "0.15em", marginBottom: 8 }}>Q{qi + 1}</div>
          <div style={{ fontSize: 13, color: "#ddd", lineHeight: 1.6, marginBottom: 12 }}>{q.question}</div>
          {q.options.map((opt, ai) => {
            let cls = "quiz-opt";
            if (!submitted && answers[qi] === ai) cls += " selected";
            if (submitted && ai === q.correct) cls = "quiz-opt correct";
            else if (submitted && answers[qi] === ai) cls = "quiz-opt wrong";
            return (
              <button key={ai} className={cls} onClick={() => onAnswer(qi, ai)} disabled={submitted}>
                <span style={{ color: accent, marginRight: 8 }}>{String.fromCharCode(65 + ai)}.</span>{opt}
              </button>
            );
          })}
          {submitted && <div style={{ fontSize: 11, color: "#555", lineHeight: 1.6, marginTop: 8, paddingLeft: 4 }}>{q.explanation}</div>}
        </div>
      ))}
      {!submitted && (
        <button className="submit-btn" onClick={onSubmit} disabled={Object.keys(answers).length < quiz.length}>
          SUBMIT
        </button>
      )}
      {submitted && (
        <div style={{ border: `1px solid ${accent}`, borderRadius: 4, padding: 20, textAlign: "center", margin: "20px 0" }}>
          <div style={{ color: accent, fontSize: 22, fontWeight: 500 }}>{score}/3</div>
          <div style={{ color: "#fff", fontSize: 13, letterSpacing: "0.15em", marginTop: 4 }}>{scoreLabel}</div>
        </div>
      )}
      <div style={{ fontSize: 13, color: "#aaa", borderTop: "1px solid #1a1a1a", paddingTop: 20, marginTop: 20, lineHeight: 1.7 }}>
        {closing}
      </div>
    </div>
  );
}

function PostTab({ post, copied, onCopy, accent }) {
  return (
    <div>
      <div style={{ ...S.label, color: accent }}>📋 READY TO POST</div>
      <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 4, padding: 20, fontSize: 13, color: "#aaa", lineHeight: 1.75, whiteSpace: "pre-wrap", marginBottom: 16 }}>
        {post}
      </div>
      <button className="copy-btn" onClick={onCopy}>{copied ? "✓ COPIED" : "COPY POST"}</button>
    </div>
  );
}

const css = (accent, dim) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0A0A; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.28s ease forwards; }
  .tab-btn {
    background: none; border: none; cursor: pointer; font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.12em; padding: 8px 12px; color: #555;
    transition: color 0.2s; border-bottom: 1.5px solid transparent;
  }
  .tab-btn:hover { color: #aaa; }
  .tab-btn.active { color: ${accent}; border-bottom-color: ${accent}; }
  .quiz-opt {
    background: #111; border: 1px solid #222; border-radius: 4px; padding: 12px 14px;
    cursor: pointer; font-family: 'DM Mono', monospace; font-size: 12px; color: #888;
    margin-bottom: 8px; transition: all 0.18s; text-align: left; width: 100%;
  }
  .quiz-opt:hover:not(:disabled) { border-color: ${accent}44; color: #ccc; }
  .quiz-opt.selected { border-color: ${accent}; color: #0A0A0A; background: ${accent}; }
  .quiz-opt.correct { border-color: #4ade80; color: #4ade80; background: #4ade8011; }
  .quiz-opt.wrong { border-color: #f87171; color: #f87171; background: #f8717111; }
  .submit-btn {
    background: ${accent}; color: #0A0A0A; border: none; padding: 12px 24px;
    font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500;
    letter-spacing: 0.1em; cursor: pointer; border-radius: 3px; margin-top: 8px;
    transition: opacity 0.2s;
  }
  .submit-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .copy-btn {
    background: ${accent}; color: #0A0A0A; border: none; padding: 12px 20px;
    font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500;
    letter-spacing: 0.1em; cursor: pointer; border-radius: 3px;
  }
  .src-toggle {
    background: none; border: 1px solid #222; padding: 7px 14px;
    font-family: 'DM Mono', monospace; font-size: 10px; color: #555;
    cursor: pointer; border-radius: 3px; letter-spacing: 0.12em;
    transition: color 0.2s, border-color 0.2s;
  }
  .src-toggle:hover { color: #999; border-color: #444; }
  .src-link {
    color: ${accent}; text-decoration: none; font-size: 11px; letter-spacing: 0.03em;
    display: block; margin-bottom: 4px; font-family: 'DM Mono', monospace;
  }
  .src-link:hover { text-decoration: underline; }
`;

const S = {
  root: { background: "#0A0A0A", minHeight: "100vh", fontFamily: "'DM Mono', monospace", color: "#fff", maxWidth: 680, margin: "0 auto", paddingBottom: 80 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px 12px", borderBottom: "1px solid #141414" },
  hL: { display: "flex", alignItems: "center", gap: 10 },
  hR: { display: "flex", alignItems: "center", gap: 12 },
  logo: { fontSize: 11, letterSpacing: "0.2em", color: "#fff", fontWeight: 500 },
  entry: { fontSize: 10, color: "#333", letterSpacing: "0.1em" },
  streak: { fontSize: 11, color: "#aaa" },
  badge: { fontSize: 9, letterSpacing: "0.15em", color: "#0A0A0A", padding: "3px 8px", borderRadius: 2, fontWeight: 500 },
  datebar: { fontSize: 10, color: "#333", letterSpacing: "0.1em", padding: "8px 24px", borderBottom: "1px solid #0f0f0f" },
  conceptBlock: { padding: "28px 24px 0" },
  conceptName: { fontSize: 32, fontWeight: 500, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.1 },
  tabRow: { display: "flex", borderBottom: "1px solid #141414", marginTop: 20, padding: "0 12px", gap: 4 },
  content: { padding: "24px 24px 0" },
  label: { fontSize: 10, letterSpacing: "0.15em", marginBottom: 16, fontWeight: 500 },
  hook: { fontSize: 18, color: "#fff", lineHeight: 1.45, fontWeight: 400, marginBottom: 18, letterSpacing: "-0.01em" },
  body: { fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 20 },
  srcSection: { padding: "28px 24px 48px" },
  srcDivider: { borderTop: "1px solid #141414", marginBottom: 18 },
  srcList: { marginTop: 16, display: "flex", flexDirection: "column", gap: 16 },
  srcItem: {},
  srcDetail: { fontSize: 11, color: "#444", lineHeight: 1.6 },
  srcVerified: { fontSize: 10, color: "#2a2a2a", letterSpacing: "0.1em", marginTop: 8, paddingTop: 12, borderTop: "1px solid #141414" },
};
