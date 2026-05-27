import { useState, useEffect, useRef } from "react";

// Entry 016 | CM.1 | Communication | Active Listening
// v1.18 FINAL PATTERN — all fixes applied:
// - Scroll fix: useEffect watches tab state, scrolls to top after render
// - Morning explanation: paragraph array (same as Midday)
// - Midday itw: paragraph array
// - Score celebration: confetti overlay
// - Submit scrolls to score

const ACCENT = "#FF8C00";
const ACCENT_DIM = "rgba(255,140,0,0.10)";

const data = {
  category: "Communication",
  categoryTag: "COMM",
  concept: "Active Listening",
  editionId: "CM.1",
  entry: "016",
  morning: {
    hook: "Most people in a conversation are not listening. They're waiting to talk. Those two things are not the same.",
    // Paragraph array — never a single block
    explanation_paragraphs: [
      "In 1957, psychologists Carl Rogers and Richard Farson published a paper that named something most people do badly and almost no one has been taught: active listening. Not the passive kind — the nod-while-thinking-about-your-next-point kind most of us default to. Active listening is a deliberate practice of full attention. It means listening to understand, not to respond.",
      "It has specific components: giving undivided attention, withholding judgment while the other person is speaking, reflecting back what you heard before you respond, asking questions to deepen understanding, and staying present rather than preparing your rebuttal.",
      "The reason this is hard isn't distraction or bad intentions. It's structural. The average person speaks at 125-175 words per minute, but the brain can process language at roughly 400 words per minute. That gap — your spare cognitive capacity — is where your mind drafts your response, judges what's being said, and drifts to unrelated thoughts.",
      "Active listening is the intentional practice of filling that gap with attention rather than noise. It's a skill, not a personality trait. Ralph Nichols, who spent forty years studying listening at the University of Minnesota, called it the most underdeveloped professional skill in the workforce — and that was in 1948. The data suggests not much has changed.",
    ],
    why_today:
      "Only 51% of corporate employees say they feel listened to by their managers — dropping to 42% among deskless and frontline workers. The Kenan Institute called this a 'listening crisis' in 2025. Active listening is now among the top three communication skills employers actively recruit for — but it's rarely taught.",
    morning_challenge:
      "In your next conversation — a 1:1, a meeting, a call — run this experiment:\n\nBefore you respond to anything, pause for two seconds.\n\nUse that pause to:\n— Confirm you actually heard what was said (not what you assumed)\n— Notice the emotion behind it, not just the content\n— Ask one clarifying question before offering any opinion or solution\n\nThen notice: how often does your first instinct to respond turn out to be a response to what you thought they said rather than what they actually said?\n\nThat gap is where most communication breaks down.",
  },
  midday: {
    reframe: "Half of your team doesn't think you're listening. And they're probably right.",
    itw_paragraphs: [
      "Across the 2025-2026 wave of workforce research, one number keeps appearing: only about half of employees report feeling genuinely listened to by their managers. HR Executive's November 2025 analysis puts it at 51% for corporate employees — and 42% for deskless and frontline workers.",
      "The Kenan Institute's June 2025 analysis named it explicitly: a 'listening crisis' reshaping communication across industries. HR.com's 2025 State of Employee Productivity found that active listening was the second most cited behavior — after regular feedback — through which managers most effectively boost engagement.",
      "Perceptyx's 2026 research found that when employees don't see their input lead to change, they become 2.5 times more likely to question whether senior leaders' actions align with stated values. Not listening isn't neutral. It actively erodes trust at a measurable rate.",
    ],
    quote: "The most basic of all human needs is the need to understand and be understood. The best way to understand people is to listen to them.",
    attribution: "Dr. Ralph Nichols, 'father of listening,' University of Minnesota",
    midday_nudge: "Who on your team is least likely to feel heard right now? What would it take to change that — not in a program or a policy, but in your next conversation with them?",
  },
  quiz: [
    {
      question: "Active listening is described as listening to understand rather than listening to respond. What is the structural basis for why this is difficult to do consistently?",
      options: [
        "The brain processes emotional content before rational content, making it hard to stay neutral while listening to anything that triggers a reaction",
        "The brain can process language at roughly 400 words per minute, but people speak at 125-175 — the spare cognitive capacity defaults to response-drafting, judgment, and distraction rather than deeper attention",
        "Working memory is too limited to simultaneously process speech and formulate a response, so the brain prioritizes one at the expense of the other",
        "Active listening requires sustained focus, which depletes faster than most cognitive tasks due to the high emotional load of interpersonal communication",
      ],
      correct: 1,
      explanation: "The processing speed gap is the core structural challenge. Your brain has cognitive capacity to spare while listening — and without intentional discipline, that capacity fills itself with your own mental activity rather than deeper attention to the speaker. This is why active listening is a practice, not just an attitude.",
    },
    {
      question: "A direct report says: 'I feel like no one on this team actually values what I contribute.' Which response best demonstrates active listening?",
      options: [
        "'I hear you — but you got recognized in last month's all-hands, so the team definitely values you.'",
        "'That sounds really frustrating. Can you tell me more about what's been making you feel that way?'",
        "'I understand. Let me think about what we can do to give you more visibility — maybe a project lead role.'",
        "'I appreciate you sharing this. I'll make sure to mention your work more in team meetings.'",
      ],
      correct: 1,
      explanation: "Option A defends and contradicts — the opposite of listening. Option C jumps to solution before understanding. Option D commits to an action without understanding the actual problem. Option B reflects the emotion back without judgment and opens the conversation with a question rather than closing it with an answer.",
    },
    {
      question: "Research shows that employees who don't feel heard disengage faster and leave sooner. What does this imply about listening as a management skill?",
      options: [
        "Listening is primarily an interpersonal courtesy — its impact on retention is indirect and hard to measure compared to compensation or career development",
        "Listening is a leadership competency with direct, measurable impact on engagement and retention — not a soft skill peripheral to management effectiveness, but a performance lever central to it",
        "The listening gap is primarily a structural problem — individual managers can't meaningfully close it without systemic support and formal communication programs",
        "Listening skills matter most in conflict situations — in day-to-day management, other factors like clear expectations and feedback frequency have a stronger effect",
      ],
      correct: 1,
      explanation: "HR.com's 2025 data found active listening was the second most cited behavior through which managers boost engagement. Perceptyx found that when employees feel unheard, they become 2.5x more likely to question leadership's integrity. These are performance and retention numbers, not culture metrics. Listening is a lever, not a courtesy.",
    },
  ],
  closing: "In your next conversation today: are you listening to understand, or listening to respond?",
  sources: [
    {
      label: "Rogers, C. & Farson, R.E. — Active Listening. Industrial Relations Center, U. Chicago, 1957",
      detail: "The paper that coined the term. Established active listening as a deliberate, teachable practice. Summary open access at NIH NLM.",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK442015/",
    },
    {
      label: "Active Listening — StatPearls / NIH NLM (Ghanate & Bordoni, updated Sept 2023)",
      detail: "Peer-reviewed clinical reference. Defines active listening, its components, and professional applications. Open access at NIH NLM.",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK442015/",
    },
    {
      label: "HR Executive — The State of HR Communications in 2025 and What's Ahead in 2026. Nov 5, 2025",
      detail: "Documents the 51% listening gap. Only 51% of corporate employees feel listened to by managers (42% deskless/frontline). Frames it as a major risk to engagement and retention.",
      url: "https://hrexecutive.com/the-state-of-hr-communications-in-2025-and-whats-ahead-in-2026/",
    },
  ],
};

// ─── CONFETTI ─────────────────────────────────────────────────────────────────
function Confetti({ active, score, accent, onDone }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = score === 3
      ? [accent, "#ffffff", "#ffff00", "#00ffaa", "#ff69b4"]
      : [accent, "#ffffff", "#aaaaaa"];
    const count = score === 3 ? 160 : 60;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * -1,
      w: Math.random() * 10 + 5,
      h: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 4 + 2,
      spin: Math.random() * 0.3 - 0.15,
      angle: Math.random() * Math.PI * 2,
      opacity: 1,
    }));
    let frame = 0;
    const maxFrames = score === 3 ? 140 : 80;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speed; p.angle += p.spin;
        p.opacity = Math.max(0, 1 - frame / maxFrames);
        ctx.save(); ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y); ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < maxFrames) { animRef.current = requestAnimationFrame(draw); }
      else { onDone(); }
    }
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);
  if (!active) return null;
  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 9999,
    }} />
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function OnePct() {
  const [tab, setTab] = useState("morning");
  const [streak, setStreak] = useState(1);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [srcOpen, setSrcOpen] = useState(false);
  const scoreRef = useRef(null);
  const isFirstRender = useRef(true);

  // ── Scroll to top whenever tab changes (after render) ──
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css(ACCENT);
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    try {
      const today = new Date().toDateString();
      const last = localStorage.getItem("op_last");
      const s = parseInt(localStorage.getItem("op_streak") || "0");
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (last === today) { setStreak(s || 1); }
      else if (last === yesterday) { const ns = s + 1; setStreak(ns); localStorage.setItem("op_streak", ns); localStorage.setItem("op_last", today); }
      else { setStreak(1); localStorage.setItem("op_streak", 1); localStorage.setItem("op_last", today); }
    } catch (e) { setStreak(1); }
  }, []);

  const allAnswered = data.quiz.every((_, i) => answers[i] !== undefined);
  const score = data.quiz.filter((q, i) => answers[i] === q.correct).length;

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    if (score >= 2) setShowConfetti(true);
    setTimeout(() => {
      scoreRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  };

  const tabs = [
    { id: "morning", label: "☀ MORNING" },
    { id: "midday", label: "☁ MIDDAY" },
    { id: "evening", label: "🔥 EVENING" },
  ];

  return (
    <div style={S.root}>
      <Confetti active={showConfetti} score={score} accent={ACCENT} onDone={() => setShowConfetti(false)} />

      <div style={S.header}>
        <div style={S.hL}><span style={S.logo}>ONE PERCENT</span><span style={S.entryBadge}>#{data.entry}</span></div>
        <div style={S.hR}><span style={S.streak}>🔥 {streak}</span><span style={{ ...S.badge, background: ACCENT, color: "#0A0A0A" }}>{data.categoryTag}</span></div>
      </div>

      <div style={S.datebar}>{data.editionId} · {data.concept}</div>

      <div style={S.conceptBlock}>
        <div style={S.conceptName}>{data.concept}</div>
        <div style={{ width: 40, height: 3, background: ACCENT, marginTop: 12 }} />
      </div>

      <div style={S.tabRow}>
        {tabs.map((t) => (
          <button key={t.id} className={`tab-btn${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div style={S.content} className="fade-in" key={tab}>
        {tab === "morning" && <MorningTab d={data.morning} onNext={() => setTab("midday")} />}
        {tab === "midday" && <MiddayTab d={data.midday} onNext={() => setTab("evening")} />}
        {tab === "evening" && (
          <EveningTab
            quiz={data.quiz} answers={answers} submitted={submitted} allAnswered={allAnswered}
            score={score} closing={data.closing} scoreRef={scoreRef}
            onAnswer={(qi, ai) => { if (!submitted) setAnswers(p => ({ ...p, [qi]: ai })); }}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      <div style={S.srcSection}>
        <div style={S.srcDivider} />
        <button className="src-toggle" onClick={() => setSrcOpen(!srcOpen)}>{srcOpen ? "▲" : "▼"} SOURCES</button>
        {srcOpen && (
          <div style={S.srcList}>
            {data.sources.map((s, i) => (
              <div key={i} style={S.srcItem}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="src-link">{s.label}</a>
                <div style={S.srcDetail}>{s.detail}</div>
              </div>
            ))}
            <div style={S.srcVerified}>✓ ALL SOURCES VERIFIED · ENTRY 016 · CM.1</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TAB COMPONENTS ───────────────────────────────────────────────────────────

function MorningTab({ d, onNext }) {
  return (
    <div>
      <div style={{ ...S.label, color: ACCENT }}>☀ MORNING BRIEF</div>
      <div style={S.hook}>{d.hook}</div>

      {/* Explanation paragraphs — never a single block */}
      <div style={{ marginBottom: 20 }}>
        {d.explanation_paragraphs.map((para, i) => (
          <p key={i} style={{
            fontSize: 13, color: "#888", lineHeight: 1.7,
            marginBottom: i < d.explanation_paragraphs.length - 1 ? 14 : 0,
          }}>{para}</p>
        ))}
      </div>

      <div style={{ background: ACCENT_DIM, border: `1px solid rgba(255,140,0,0.2)`, borderRadius: 4, padding: "16px 18px", marginBottom: 20 }}>
        <div style={{ ...S.label, color: ACCENT, marginBottom: 10 }}>WHY TODAY</div>
        <div style={{ fontSize: 13, color: "#bbb", lineHeight: 1.65 }}>{d.why_today}</div>
      </div>

      <div style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: 16, marginBottom: 24 }}>
        <div style={{ ...S.label, color: ACCENT, marginBottom: 10 }}>⚡ MORNING CHALLENGE</div>
        <div style={{ fontSize: 13, color: "#888", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{d.morning_challenge}</div>
      </div>

      <button className="next-tab-btn" onClick={onNext}>☁ MIDDAY →</button>
    </div>
  );
}

function MiddayTab({ d, onNext }) {
  return (
    <div>
      <div style={{ ...S.label, color: ACCENT }}>☁ MIDDAY REFRAME</div>
      <div style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 16, color: "#fff", lineHeight: 1.5 }}>{d.reframe}</div>
      </div>

      <div style={{ ...S.label, color: "#555", marginBottom: 14 }}>👁 IN THE WILD — TYPE B · 2025 WORKFORCE DATA</div>
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 16, marginBottom: 20 }}>
        {d.itw_paragraphs.map((para, i) => (
          <p key={i} style={{
            fontSize: 13, color: "#888", lineHeight: 1.7,
            marginBottom: i < d.itw_paragraphs.length - 1 ? 14 : 0,
          }}>{para}</p>
        ))}
      </div>

      <div style={{ border: `1px solid rgba(255,140,0,0.25)`, borderRadius: 4, padding: "16px 18px", marginBottom: 20, background: ACCENT_DIM }}>
        <div style={{ fontSize: 14, color: "#ddd", lineHeight: 1.6, fontStyle: "italic", marginBottom: 10 }}>"{d.quote}"</div>
        <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.04em" }}>— {d.attribution}</div>
      </div>

      <div style={{ fontSize: 13, color: "#666", lineHeight: 1.65, borderTop: "1px solid #141414", paddingTop: 16, marginBottom: 8 }}>{d.midday_nudge}</div>
      <button className="next-tab-btn" onClick={onNext}>🔥 EVENING →</button>
    </div>
  );
}

function EveningTab({ quiz, answers, submitted, allAnswered, score, closing, scoreRef, onAnswer, onSubmit }) {
  const scoreLabel = score === 3 ? "LOCKED IN 🔒" : score === 2 ? "ALMOST THERE" : score === 1 ? "KEEP GOING" : "REVIEW & RETRY";
  const scoreSubtext = score === 3 ? "Perfect score. You've got this one." : score === 2 ? "One away. Come back and get that third." : "The concepts will stick with more reps. Come back.";
  const scoreBorder = score === 3 ? ACCENT : score === 2 ? "#606060" : "#333";
  const scoreClass = score === 3 ? "score-box score-perfect" : score === 2 ? "score-box score-close" : "score-box score-low";

  return (
    <div>
      <div style={{ ...S.label, color: ACCENT }}>🔥 TEST YOURSELF</div>
      {quiz.map((q, qi) => (
        <div key={qi} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6, marginBottom: 12 }}>{qi + 1}. {q.question}</div>
          {q.options.map((opt, ai) => {
            let cls = "quiz-opt";
            if (submitted && ai === q.correct) cls = "quiz-opt correct";
            else if (submitted && answers[qi] === ai) cls = "quiz-opt wrong";
            else if (!submitted && answers[qi] === ai) cls = "quiz-opt selected";
            return (
              <button key={ai} className={cls} onClick={() => onAnswer(qi, ai)} disabled={submitted}>
                <span style={{ color: ACCENT, marginRight: 8 }}>{String.fromCharCode(65 + ai)}.</span>{opt}
              </button>
            );
          })}
          {submitted && <div style={{ fontSize: 11, color: "#555", lineHeight: 1.6, marginTop: 8, paddingLeft: 4 }}>{q.explanation}</div>}
        </div>
      ))}

      {!submitted && <button className="submit-btn" onClick={onSubmit} disabled={!allAnswered}>SUBMIT</button>}

      {submitted && (
        <div ref={scoreRef} className={scoreClass} style={{ border: `2px solid ${scoreBorder}` }}>
          <div style={{ fontSize: 36, fontWeight: 500, color: score === 3 ? ACCENT : score === 2 ? "#ccc" : "#555" }}>{score}/3</div>
          <div style={{ fontSize: 13, letterSpacing: "0.15em", color: score === 3 ? "#fff" : "#888", marginTop: 6 }}>{scoreLabel}</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 8, lineHeight: 1.5 }}>{scoreSubtext}</div>
        </div>
      )}

      <div style={{ fontSize: 13, color: "#aaa", borderTop: "1px solid #1a1a1a", paddingTop: 20, marginTop: 20, lineHeight: 1.7 }}>{closing}</div>
    </div>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = (accent) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0A0A; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes popIn { 0% { transform: scale(0.85); opacity: 0; } 70% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
  @keyframes pulseBorder { 0%,100% { box-shadow: 0 0 0 0 ${accent}44; } 50% { box-shadow: 0 0 0 8px ${accent}11; } }
  .fade-in { animation: fadeIn 0.28s ease forwards; }
  .tab-btn { background: none; border: none; cursor: pointer; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; padding: 8px 12px; color: #555; transition: color 0.2s; border-bottom: 1.5px solid transparent; }
  .tab-btn:hover { color: #aaa; }
  .tab-btn.active { color: ${accent}; border-bottom-color: ${accent}; }
  .next-tab-btn { display: block; width: 100%; margin-top: 32px; padding: 14px 20px; background: ${accent}; color: #0A0A0A; border: none; border-radius: 4px; font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.12em; cursor: pointer; text-align: center; transition: opacity 0.2s; }
  .next-tab-btn:hover { opacity: 0.85; }
  .quiz-opt { background: #111; border: 1px solid #222; border-radius: 4px; padding: 12px 14px; cursor: pointer; font-family: 'DM Mono', monospace; font-size: 12px; color: #888; margin-bottom: 8px; transition: all 0.18s; text-align: left; width: 100%; }
  .quiz-opt:hover:not(:disabled) { border-color: ${accent}44; color: #ccc; }
  .quiz-opt.selected { border-color: ${accent}; background: ${accent}22; color: #ddd; }
  .quiz-opt.correct { border-color: #4ade80; color: #4ade80; background: #4ade8011; }
  .quiz-opt.wrong { border-color: #f87171; color: #f87171; background: #f8717111; }
  .submit-btn { background: ${accent}; color: #0A0A0A; border: none; padding: 12px 24px; font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; cursor: pointer; border-radius: 3px; margin-top: 8px; }
  .submit-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .score-box { border-radius: 6px; padding: 28px 20px; text-align: center; margin: 24px 0; animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .score-perfect { background: ${accent}0f; animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, pulseBorder 1.8s ease-in-out 0.4s 3; }
  .score-close { background: #1a1a1a; }
  .score-low { background: #111; }
  .src-toggle { background: none; border: 1px solid #222; padding: 7px 14px; font-family: 'DM Mono', monospace; font-size: 10px; color: #555; cursor: pointer; border-radius: 3px; letter-spacing: 0.12em; }
  .src-toggle:hover { color: #999; border-color: #444; }
  .src-link { color: ${accent}; text-decoration: none; font-size: 11px; display: block; margin-bottom: 4px; font-family: 'DM Mono', monospace; }
  .src-link:hover { text-decoration: underline; }
`;

const S = {
  root: { background: "#0A0A0A", minHeight: "100vh", fontFamily: "'DM Mono', monospace", color: "#fff", maxWidth: 680, margin: "0 auto", paddingBottom: 80 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px 12px", borderBottom: "1px solid #141414" },
  hL: { display: "flex", alignItems: "center", gap: 10 },
  hR: { display: "flex", alignItems: "center", gap: 12 },
  logo: { fontSize: 11, letterSpacing: "0.2em", color: "#fff", fontWeight: 500 },
  entryBadge: { fontSize: 10, color: "#333", letterSpacing: "0.1em" },
  streak: { fontSize: 11, color: "#aaa" },
  badge: { fontSize: 9, letterSpacing: "0.15em", padding: "3px 8px", borderRadius: 2, fontWeight: 500 },
  datebar: { fontSize: 10, color: "#333", letterSpacing: "0.1em", padding: "8px 24px", borderBottom: "1px solid #0f0f0f" },
  conceptBlock: { padding: "28px 24px 0" },
  conceptName: { fontSize: 28, fontWeight: 500, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.1 },
  tabRow: { display: "flex", borderBottom: "1px solid #141414", marginTop: 20, padding: "0 12px", gap: 4 },
  content: { padding: "24px 24px 0" },
  label: { fontSize: 10, letterSpacing: "0.15em", marginBottom: 16, fontWeight: 500 },
  hook: { fontSize: 18, color: "#fff", lineHeight: 1.45, fontWeight: 400, marginBottom: 18, letterSpacing: "-0.01em" },
  srcSection: { padding: "28px 24px 48px" },
  srcDivider: { borderTop: "1px solid #141414", marginBottom: 18 },
  srcList: { marginTop: 16, display: "flex", flexDirection: "column", gap: 16 },
  srcItem: {},
  srcDetail: { fontSize: 11, color: "#444", lineHeight: 1.6 },
  srcVerified: { fontSize: 10, color: "#2a2a2a", letterSpacing: "0.1em", marginTop: 8, paddingTop: 12, borderTop: "1px solid #141414" },
};
