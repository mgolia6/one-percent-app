import { useState, useEffect } from "react";

// ─── ENTRY METADATA ──────────────────────────────────────────────────────────
// Entry: 010 | Category: Sales Craft | Concept: Anchoring in Negotiation
// Date: May 14, 2026
//
// SOURCES — verified via web search 2026-05-14:
// [1] Tversky, A. & Kahneman, D. — "Judgment under Uncertainty: Heuristics and Biases"
//     Science, Vol. 185, No. 4157, pp. 1124–1131, September 27, 1974
//     DOI: 10.1126/science.185.4157.1124 ✓
//     Original identification of the anchoring heuristic. The founding study.
// [2] Galinsky, A.D. & Mussweiler, T. — "First Offers as Anchors: The Role of
//     Perspective-Taking and Negotiator Focus"
//     Journal of Personality and Social Psychology, Vol. 81, No. 4, pp. 657–669, 2001 ✓
//     Three experiments: whichever party made the first offer obtained a better outcome.
//     First offers were a strong predictor of final settlement price.
// [3] Kahneman, D. — Thinking, Fast and Slow
//     Farrar, Straus and Giroux, New York, 2011
//     Chapter 11 — Anchors ✓
//     Precision finding: precise anchors outperform round numbers; recipients adjust
//     less from precise anchors. Also: Loschelder et al. 2017 study documented via PON.
//
// QUOTE — verified verbatim 2026-05-14:
// "Any number that you're asked to consider as a possible solution to an
//  estimation problem will induce an anchoring effect."
// — Daniel Kahneman, Thinking, Fast and Slow, Farrar, Straus and Giroux, 2011
// Confirmed verbatim: multiple quote aggregators, chapter 11 summaries ✓
//
// AI NUDGE: Applicable — research your anchor number before a call; use AI
// to build a defensible, precise anchor from market data, comparables, value delivered
//
// IN THE WILD: Type A — Galinsky & Mussweiler (2001), JPSP. Across 3 experiments,
// whichever party (buyer OR seller) made the first offer obtained a better final outcome.
// First offers were a strong predictor of settlement price.
//
// MIDDAY ESCALATION CHECK: Morning = first-mover advantage (go first, set the
// anchor). Midday escalates to the precision finding — HOW you anchor matters as
// much as WHETHER you anchor. Precise numbers ($47,250) pull harder than round ones
// ($50,000) because they signal expertise and make the other side adjust in smaller
// increments. Not obvious from the morning concept. ✓
//
// QUIZ Q3 APPLICATION CHECK: Q3 presents a real pricing scenario — rep going into
// a renewal negotiation — and asks what the anchoring research says they should do.
// Forces use of concept (go first + precise anchor + ambitious), not identification. ✓
//
// MEASURABLE BEHAVIOR RULE: Applicable — direct reps to track whether they're
// going first in price conversations and what number they anchor with. Pull real
// data from CRM deal notes or call recordings where available.
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = "#E8FF47";
const ACCENT_DIM = "#E8FF4722";

const data = {
  category: "Sales Craft",
  categoryTag: "SALES CRAFT",
  concept: "Anchoring in Negotiation",
  date: "May 14, 2026",
  entry: "010",
  morning: {
    hook: "Whoever names a number first controls the negotiation — even if the number is wrong.",
    explanation:
      "Anchoring is one of the most documented effects in behavioral economics. The first number introduced in any price conversation becomes the cognitive reference point that every subsequent number is judged against. The other party adjusts from your anchor — not from some objective sense of fair value, not from what they were planning to pay, and not from what they think you'll accept. From your number. Galinsky and Mussweiler tested this across three experiments: whichever party — buyer or seller — made the first offer obtained a better final outcome. First offers were a strong predictor of settlement price. The rep waiting for the prospect to name a price first is playing defense in a game where offense has a structural advantage. Most salespeople wait. They worry about anchoring too high and insulting the buyer, or anchoring too low and leaving money. Meanwhile, the research says: the party who names the number wins.",
    why_today:
      "Every pricing conversation, renewal, and procurement negotiation you're in this week has an anchor moment. If you're not setting it, the buyer is — and they're not setting it in your favor.",
    morning_challenge:
      "Look at your next pricing conversation or renewal coming up this week. Find the anchor moment — the first time a number is likely to enter the conversation.\n\nBefore that call:\n1. Pull comparable deal data: what have you closed similar deals for? What's the high end of your range? What's the value delivered in real terms?\n2. Decide your anchor — it should be ambitious but defensible, and precise (more on why precision matters in Midday).\n3. Commit to naming it first.\n\nThen run this prompt:\n\n\"I'm preparing for a renewal negotiation with [describe the account type, deal size range, and what value they've received]. Build me a precise, defensible anchor price for this conversation — not a round number — with 3 supporting rationale points I can use if they push back. The anchor should be ambitious and grounded in value delivered, not just what I think they'll accept.\"\n\nBring that number and those rationale points into the call. Name your number first.",
  },
  midday: {
    reframe:
      "Going first is only half the insight. The other half is in the decimal places.",
    real_world:
      "Research on anchoring revealed something that most reps never use: precise anchors outperform round numbers. A rep who opens at $47,250 gets a better outcome than one who opens at $47,000 or $50,000 — even if the precise number is slightly higher than what they'd have accepted. Why? Precise numbers signal that the figure was calculated, not guessed. The other party infers expertise and data behind the number, which makes them less willing to challenge it aggressively. And because the number isn't round, they tend to adjust in smaller increments when they counteroffer — $47,000 rather than $45,000 or $40,000. The precision constrains the adjustment. Round numbers feel like placeholders, like there's obvious room to move. Precise numbers feel like they arrived from somewhere. David Loschelder and colleagues documented this in a 2017 study: more ambitious anchors produced better outcomes AND highly precise offers led recipients to make smaller counteroffers. Two findings that compound. Go first. Go high. Go specific. (Loschelder et al., 2017; Program on Negotiation, Harvard Law School)",
    quote:
      "Any number that you're asked to consider as a possible solution to an estimation problem will induce an anchoring effect.",
    attribution: "Daniel Kahneman, Thinking, Fast and Slow, Farrar, Straus and Giroux, 2011",
    midday_nudge:
      "Think about the last time you named a price in a negotiation. Was it a round number? Did you go first or wait for the prospect to move? What do you think the outcome would have been if you'd flipped both of those?",
  },
  quiz: [
    {
      question: "Galinsky and Mussweiler (2001) tested first offers across three experiments in buyer-seller negotiations. What did they find?",
      options: [
        "Sellers who made the first offer got better outcomes, but buyers who made the first offer were at a disadvantage",
        "First offers had minimal impact — final outcomes were primarily driven by BATNA strength",
        "Whichever party — buyer or seller — made the first offer obtained a better final outcome; first offers strongly predicted settlement price",
        "First offers only mattered in single-issue negotiations; multi-issue deals showed no anchoring advantage",
      ],
      correct: 2,
      explanation:
        "The advantage holds regardless of which side goes first. Buyer or seller — whoever anchors pulls the final number toward their opening position. This is why waiting for the prospect to name a price is a structural concession before the negotiation has even started.",
    },
    {
      question: "Research on anchoring precision found that $47,250 outperforms $47,000 or $50,000 as a first offer. Why does precision make an anchor more effective?",
      options: [
        "Odd numbers are psychologically harder to refuse than round numbers",
        "Precise numbers signal calculation and expertise, leading counterparts to infer a data-backed rationale — so they adjust in smaller increments",
        "Precise numbers are more memorable, which makes them harder to ignore during concession-making",
        "Round numbers trigger loss aversion more strongly, making buyers more resistant to the anchor",
      ],
      correct: 1,
      explanation:
        "Precision implies the number was derived from somewhere — a model, market data, a calculation. That perceived legitimacy constrains the adjustment. The other party doesn't know what the right number is, so they assume yours arrived from a defensible place. Round numbers feel like placeholders with obvious room to move. Precise numbers feel final.",
    },
    {
      question: "You're heading into a SaaS renewal negotiation. The customer hasn't mentioned price yet. You have a strong renewal at list price, but you expect them to push back. Based on anchoring research, what should you do?",
      options: [
        "Let the customer name a number first — understanding their budget anchor helps you calibrate your position",
        "Open with a round number slightly above list price so there's room to concede to list price and make them feel they won",
        "Name your anchor first — an ambitious, precise number with defensible rationale — before they introduce any figure into the conversation",
        "Anchor with a range rather than a specific number to avoid seeming inflexible",
      ],
      correct: 2,
      explanation:
        "Every moment you wait is a moment the customer is thinking about their number — which is lower than yours. Once they name it, it's in the room. Go first with a precise, ambitious anchor backed by value delivered. Even if they push back, the entire negotiation will happen in reference to your number, not theirs. That's the structural advantage.",
    },
  ],
  score_labels: ["REVIEW TOMORROW", "ALMOST THERE", "LOCKED IN"],
  closing_line:
    "Tomorrow you get 1% sharper. Tonight: find your next pricing conversation and decide — are you naming the number first, or leaving that to the buyer?",
  linkedin_post: `Most reps wait for the prospect to name a price first.

That's a structural concession before the negotiation starts.

Whoever sets the first number in a negotiation controls the reference point that every other number gets judged against. That's not intuition — it's one of the most replicated findings in behavioral psychology.

Galinsky and Mussweiler tested this across three experiments: buyer or seller, it didn't matter. Whoever made the first offer got a better final outcome. First offers predicted settlement price.

But here's the part most people miss:

Going first is only half of it. Precision is the other half.

$47,250 outperforms $47,000 or $50,000 — not because of the amount, but because precise numbers signal that something was calculated, not guessed. Your counterpart adjusts in smaller increments from a precise anchor. Round numbers feel like placeholders. Specific numbers feel like they arrived from somewhere real.

Today's One Percent: the anchoring research, why reps wait when they shouldn't, and how to set an anchor that actually holds.

Swipe through.

#OnePercent #SalesCraft #Negotiation #Sales #B2BSales`,
  sources: [
    {
      label: "Tversky & Kahneman — 'Judgment under Uncertainty: Heuristics and Biases,' Science (1974)",
      detail: "Vol. 185, No. 4157, pp. 1124–1131. Founding identification of the anchoring heuristic — the tendency to rely on the first number introduced when making estimates under uncertainty.",
      url: "https://www.science.org/doi/10.1126/science.185.4157.1124",
    },
    {
      label: "Galinsky & Mussweiler — 'First Offers as Anchors,' Journal of Personality and Social Psychology (2001)",
      detail: "Vol. 81, No. 4, pp. 657–669. Three experiments: whichever party made the first offer obtained a better outcome. First offers were a strong predictor of final settlement price.",
      url: "https://psycnet.apa.org/record/2001-07460-012",
    },
    {
      label: "Kahneman — Thinking, Fast and Slow, Farrar, Straus and Giroux (2011)",
      detail: "Chapter 11 covers the anchoring effect, precision research, and the two-system mechanism behind why anchors are so hard to escape even when we know they're there.",
      url: "https://us.macmillan.com/books/9780374533557/thinkingfastandslow",
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
              <div style={S.srcVerified}>✓ ALL SOURCES VERIFIED VIA WEB SEARCH · 2026-05-14</div>
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
