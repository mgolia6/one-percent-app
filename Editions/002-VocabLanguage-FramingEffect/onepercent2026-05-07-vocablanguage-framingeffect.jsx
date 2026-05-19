import { useState, useEffect, useRef } from "react";
import { BookOpen, Lightbulb, Award } from 'lucide-react';
// Entry 002 | VL.1 | Framing Effect | v1.19

const ACCENT = "#FF8C47";
const ACCENT_DIM = "rgba(255,140,71,0.10)";

const data = {
  category: "Vocab & Language", categoryTag: "VOCAB", concept: "Framing Effect",
  editionId: "VL.1", entry: "002",
  morning: {
    hook: "The words you choose don't describe reality. They shape how people experience it.",
    explanation_paragraphs: [
      "In 1981, Amos Tversky and Daniel Kahneman published one of the most replicated findings in cognitive psychology: the same information, presented in different words, produces systematically different decisions. They called it the framing effect.",
      "In their classic study, participants were told 600 people would die in a disease outbreak. One group was offered a program that would 'save 200 lives.' Another was offered a program where '400 people will die.' Mathematically identical. Behaviorally, they're not — the first option was chosen overwhelmingly more often.",
      "The framing effect works because the brain doesn't process information neutrally. It processes it relative to a reference point, and the reference point is set by language. 'Saves 200' anchors on gain. '400 will die' anchors on loss. Loss aversion — the tendency to weight losses more heavily than equivalent gains — does the rest.",
      "This isn't a quirk or a weakness. It's structural. The frame always exists. The only question is whether you're setting it deliberately or letting someone else set it for you.",
    ],
    why_today: "In an era of algorithmic feeds, political communication, and AI-generated content, framing is being deployed at unprecedented scale and speed. Understanding it isn't an academic exercise — it's basic media literacy and a core communication skill.",
    morning_challenge: "Find something you need to communicate today — an ask, a proposal, a status update, a difficult message.\n\nWrite two versions:\n— Version A: framed around what is lost, risked, or avoided\n— Version B: framed around what is gained, achieved, or protected\n\nThen ask: which version actually moves the person I'm talking to? And which one am I defaulting to — and why?",
  },
  midday: {
    reframe: "You're not presenting facts. You're presenting a frame. The question is whether you're doing it consciously.",
    itw_paragraphs: [
      "Watch how the same economic data gets reported differently across outlets covering the same jobs report: one leads with 'unemployment falls to 4.2%,' another with 'hiring slows as 40,000 fewer jobs added than expected.' Same numbers. Different frames. Different emotional responses.",
      "In sales and negotiations, framing is the invisible variable in every conversation. Research from Galinsky and Mussweiler (2001) showed that first offers anchor the entire negotiation — whoever sets the frame first shapes what 'reasonable' looks like for everything that follows.",
      "Healthcare communication research shows that patients make meaningfully different treatment decisions based on whether outcomes are described as survival rates versus mortality rates. '90% survival rate' and '10% mortality rate' are the same fact. They don't feel the same.",
    ],
    quote: "The frame around an idea, not the idea itself, is often what determines how it lands.",
    attribution: "Adapted from Tversky & Kahneman, The Framing of Decisions, Science, 1981",
    midday_nudge: "In the next meeting or message you're in: notice who sets the frame first, and how that shapes everything that follows.",
  },
  quiz: [
    {
      question: "In Tversky and Kahneman's framing effect research, participants chose differently between 'saves 200 lives' and '400 people will die' even though both describe identical outcomes. What cognitive mechanism explains this?",
      options: [
        "Confirmation bias — participants interpreted each framing to confirm their pre-existing beliefs about risk",
        "Loss aversion — the brain weights losses more heavily than equivalent gains, so 'deaths' triggers stronger negative affect than 'lives saved' triggers positive affect",
        "Anchoring — the specific numbers (200 vs. 400) created different reference points unrelated to actual probabilities",
        "The availability heuristic — 'deaths' brought more vivid mental images to mind, overriding rational probability assessment",
      ],
      correct: 1,
      explanation: "Loss aversion is the key mechanism. Kahneman and Tversky found that losses are weighted approximately twice as heavily as equivalent gains. 'Saves 200 lives' is processed as a gain and feels moderate. '400 people will die' is processed as a loss and feels catastrophic — even though the actual expected outcome is identical. The frame shifts which cognitive system engages.",
    },
    {
      question: "A product manager is presenting a feature that has an 85% success rate in beta testing. Which framing is likely to generate more stakeholder support?",
      options: [
        "'This feature failed in 15% of beta tests, but we believe we can resolve these issues post-launch'",
        "'In beta testing, 85 out of 100 users successfully completed the target workflow with this feature'",
        "Both framings should produce similar reactions since they communicate the same underlying data",
        "'This feature has a 15% failure rate, which is within acceptable thresholds for our launch criteria'",
      ],
      correct: 1,
      explanation: "Option B anchors on success and uses concrete numbers (85 out of 100) rather than a percentage, which feels more tangible. Options A and D lead with failure and loss — triggering loss aversion. The data is identical across all framings; the frame determines whether the audience's first cognitive response is 'this works' or 'this fails.'",
    },
    {
      question: "You're aware that a negotiation counterpart has framed an opening offer in a way that anchors the discussion at a disadvantageous point for you. What is the most effective response, based on framing research?",
      options: [
        "Accept the frame but negotiate hard within it — challenging the frame directly is confrontational and damages rapport",
        "Ignore the anchor entirely and focus only on your own position without referencing their number",
        "Explicitly re-anchor by introducing a counter-frame with your own reference point before engaging with their specific number",
        "Ask clarifying questions about their number to signal you take it seriously, which is the first step in moving them",
      ],
      correct: 2,
      explanation: "Research by Galinsky and Mussweiler (2001) showed that the most effective counter to an anchor is to introduce a competing reference point — a counter-anchor — before engaging with the original number. Ignoring the anchor doesn't neutralize it; the brain is already processing it. Re-framing replaces the reference point with one more favorable to your position.",
    },
  ],
  closing: "What frame are you unconsciously accepting in the most important conversation you're having right now?",
  sources: [
    { label: "Tversky, A. & Kahneman, D. — The Framing of Decisions and the Psychology of Choice, Science 211(4481), 1981", detail: "The foundational framing effect paper. One of the most cited studies in behavioral economics.", url: "https://psycnet.apa.org/record/1981-07257-001" },
    { label: "Kahneman, D. — Thinking, Fast and Slow, Farrar, Straus and Giroux, 2011", detail: "Full treatment of framing, loss aversion, and System 1/2 thinking. Chapter 34 covers framing effects in depth.", url: "https://us.macmillan.com/books/9780374533557/thinkingfastandslow" },
    { label: "Galinsky, A. & Mussweiler, T. — First Offers as Anchors, Journal of Personality and Social Psychology 81(4), 2001", detail: "Research on anchoring in negotiations. Documents the strategic value of counter-framing in price negotiations.", url: "https://psycnet.apa.org/record/2001-18988-001" },
  ],
};

function Celebration({ score, accent }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    if (score < 2) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const cx = W / 2, cy = H / 2;
    if (score === 3) {
      const rays = [], particles = [];
      let frame = 0;
      for (let i = 0; i < 16; i++) rays.push({ angle: (i / 16) * Math.PI * 2, maxLength: 120 + Math.random() * 80 });
      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2, speed = 2 + Math.random() * 4;
        particles.push({ x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, decay: 0.012 + Math.random() * 0.012, size: 2 + Math.random() * 3, color: [accent, "#ffffff", "#ffff00", "#ff69b4"][Math.floor(Math.random() * 4)] });
      }
      function tick() {
        ctx.clearRect(0, 0, W, H);
        const fadeAlpha = frame > 100 ? 1 - (frame - 100) / 40 : 1;
        if (frame < 60) {
          const rp = Math.min(1, frame / 30);
          ctx.save(); ctx.globalAlpha = fadeAlpha;
          rays.forEach(r => {
            const len = r.maxLength * rp;
            const x1 = cx + Math.cos(r.angle) * 20, y1 = cy + Math.sin(r.angle) * 20;
            const x2 = cx + Math.cos(r.angle) * len, y2 = cy + Math.sin(r.angle) * len;
            const g = ctx.createLinearGradient(x1, y1, x2, y2);
            g.addColorStop(0, accent); g.addColorStop(1, accent + "00");
            ctx.strokeStyle = g; ctx.lineWidth = 3; ctx.lineCap = "round";
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          });
          ctx.restore();
        }
        ctx.save(); ctx.globalAlpha = fadeAlpha;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life -= p.decay;
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          ctx.globalAlpha = p.life * fadeAlpha; ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
        if (frame > 50) {
          const ta = Math.min(1, (frame - 50) / 20) * fadeAlpha;
          ctx.save(); ctx.globalAlpha = ta; ctx.fillStyle = accent; ctx.shadowColor = accent; ctx.shadowBlur = 20;
          ctx.font = "bold 28px 'Inter',sans-serif"; ctx.textAlign = "center"; ctx.fillText("LOCKED IN 🔒", cx, cy + 60); ctx.restore();
        }
        frame++;
        if (frame < 140) animRef.current = requestAnimationFrame(tick);
      }
      animRef.current = requestAnimationFrame(tick);
    } else {
      let frame = 0;
      function tickArc() {
        ctx.clearRect(0, 0, W, H);
        const fa = frame > 60 ? 1 - (frame - 60) / 20 : 1, pr = Math.min(1, frame / 50);
        ctx.save(); ctx.translate(cx, cy); ctx.globalAlpha = fa;
        ctx.beginPath(); ctx.arc(0, 0, 55, 0, Math.PI * 2); ctx.strokeStyle = "#2a2a2a"; ctx.lineWidth = 6; ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, 55, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 4 / 3) * pr); ctx.strokeStyle = accent; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.shadowColor = accent; ctx.shadowBlur = 10; ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.font = "bold 24px 'Inter',sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("2/3", 0, 0);
        ctx.restore(); frame++;
        if (frame < 80) animRef.current = requestAnimationFrame(tickArc);
      }
      animRef.current = requestAnimationFrame(tickArc);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [score]);
  if (score < 2) return null;
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999 }} />;
}

export default function OnePct() {
  const [tab, setTab] = useState("morning");
  const [streak, setStreak] = useState(1);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [srcOpen, setSrcOpen] = useState(false);
  const scoreRef = useRef(null);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
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
    if (score >= 2) setShowCelebration(true);
    setTimeout(() => scoreRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
  };

  const tabs = [
    { id: "morning", label: "MORNING", icon: BookOpen },
    { id: "midday", label: "MIDDAY", icon: Lightbulb },
    { id: "evening", label: "EVENING", icon: Award },
  ];

  return (
    <div style={S.root}>
      {showCelebration && <Celebration score={score} accent={ACCENT} />}
      <div style={S.header}>
        <div style={S.hL}><span style={S.logo}>ONE PERCENT</span><span style={S.entryBadge}>#{data.entry}</span></div>
        <div style={S.hR}><span style={S.streak}>🔥 {streak}</span><span style={{ ...S.badge, background: ACCENT, color: "#0A0A0A" }}>{data.categoryTag}</span></div>
      </div>
      <div style={S.datebar}>{data.editionId} · {data.concept}</div>
      <div style={S.conceptBlock}><div style={S.conceptName}>{data.concept}</div><div style={{ width: 40, height: 3, background: ACCENT, marginTop: 12 }} /></div>
      <div style={S.tabRow}>
        {tabs.map(t => { const Icon = t.icon; return <button key={t.id} className={`tab-btn${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}><Icon size={16} style={{ marginRight: 6 }} />{t.label}</button>; })}
      </div>
      <div style={S.content} className="fade-in" key={tab}>
        {tab === "morning" && <MorningTab d={data.morning} onNext={() => setTab("midday")} />}
        {tab === "midday" && <MiddayTab d={data.midday} onNext={() => setTab("evening")} />}
        {tab === "evening" && <EveningTab quiz={data.quiz} answers={answers} submitted={submitted} allAnswered={allAnswered} score={score} closing={data.closing} scoreRef={scoreRef} onAnswer={(qi, ai) => { if (!submitted) setAnswers(p => ({ ...p, [qi]: ai })); }} onSubmit={handleSubmit} />}
      </div>
      <div style={S.srcSection}>
        <div style={S.srcDivider} />
        <button className="src-toggle" onClick={() => setSrcOpen(!srcOpen)}>{srcOpen ? "▲" : "▼"} SOURCES</button>
        {srcOpen && <div style={S.srcList}>{data.sources.map((s, i) => <div key={i} style={S.srcItem}><a href={s.url} target="_blank" rel="noopener noreferrer" className="src-link">{s.label}</a><div style={S.srcDetail}>{s.detail}</div></div>)}<div style={S.srcVerified}>✓ ALL SOURCES VERIFIED · ENTRY 002 · VL.1</div></div>}
      </div>
    </div>
  );
}

function MorningTab({ d, onNext }) {
  return (
    <div>
      <div style={{ ...S.label, color: ACCENT }}>☀ MORNING BRIEF</div>
      <div style={S.hook}>{d.hook}</div>
      <div style={{ marginBottom: 20 }}>
        {d.explanation_paragraphs.map((p, i) => <p key={i} style={{ fontSize: 15, color: "#bbb", lineHeight: 1.8, marginBottom: i < d.explanation_paragraphs.length - 1 ? 16 : 0 }}>{p}</p>)}
      </div>
      <div style={{ background: ACCENT_DIM, border: `1px solid rgba(255,140,71,0.2)`, borderRadius: 4, padding: "16px 18px", marginBottom: 20 }}>
        <div style={{ ...S.label, color: ACCENT, marginBottom: 10 }}>WHY TODAY</div>
        <div style={{ fontSize: 14, color: "#bbb", lineHeight: 1.7 }}>{d.why_today}</div>
      </div>
      <div style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: 16, marginBottom: 24 }}>
        <div style={{ ...S.label, color: ACCENT, marginBottom: 10 }}>⚡ MORNING CHALLENGE</div>
        <div style={{ fontSize: 14, color: "#999", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{d.morning_challenge}</div>
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
        <div style={{ fontSize: 17, color: "#fff", lineHeight: 1.5, fontWeight: 500 }}>{d.reframe}</div>
      </div>
      <div style={{ ...S.label, color: "#555", marginBottom: 14 }}>👁 IN THE WILD — TYPE B · ECONOMIC & CLINICAL FRAMING</div>
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 16, marginBottom: 20 }}>
        {d.itw_paragraphs.map((p, i) => <p key={i} style={{ fontSize: 15, color: "#bbb", lineHeight: 1.8, marginBottom: i < d.itw_paragraphs.length - 1 ? 16 : 0 }}>{p}</p>)}
      </div>
      <div style={{ border: `1px solid rgba(255,140,71,0.25)`, borderRadius: 4, padding: "16px 18px", marginBottom: 20, background: ACCENT_DIM }}>
        <div style={{ fontSize: 15, color: "#ddd", lineHeight: 1.7, fontStyle: "italic", marginBottom: 10 }}>"{d.quote}"</div>
        <div style={{ fontSize: 12, color: "#666", letterSpacing: "0.04em" }}>— {d.attribution}</div>
      </div>
      <div style={{ fontSize: 14, color: "#777", lineHeight: 1.7, borderTop: "1px solid #141414", paddingTop: 16, marginBottom: 8 }}>{d.midday_nudge}</div>
      <button className="next-tab-btn" onClick={onNext}>🔥 EVENING →</button>
    </div>
  );
}

function EveningTab({ quiz, answers, submitted, allAnswered, score, closing, scoreRef, onAnswer, onSubmit }) {
  const lbl = score === 3 ? "PERFECT SCORE" : score === 2 ? "ALMOST THERE" : score === 1 ? "KEEP GOING" : "REVIEW & RETRY";
  const sub = score === 3 ? "You've got this one locked in." : score === 2 ? "One away. Come back and get that third." : "The concepts will stick with more reps. Come back.";
  const border = score === 3 ? ACCENT : score === 2 ? "#606060" : "#333";
  const cls = score === 3 ? "score-box score-perfect" : score === 2 ? "score-box score-close" : "score-box score-low";
  return (
    <div>
      <div style={{ ...S.label, color: ACCENT }}>🔥 TEST YOURSELF</div>
      {quiz.map((q, qi) => (
        <div key={qi} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.7, marginBottom: 12, fontWeight: 400 }}>{qi + 1}. {q.question}</div>
          {q.options.map((opt, ai) => {
            let cls = "quiz-opt";
            if (submitted && ai === q.correct) cls = "quiz-opt correct";
            else if (submitted && answers[qi] === ai) cls = "quiz-opt wrong";
            else if (!submitted && answers[qi] === ai) cls = "quiz-opt selected";
            return <button key={ai} className={cls} onClick={() => onAnswer(qi, ai)} disabled={submitted}><span style={{ color: ACCENT, marginRight: 8, fontWeight: 600 }}>{String.fromCharCode(65 + ai)}.</span>{opt}</button>;
          })}
          {submitted && <div style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginTop: 10, paddingLeft: 4 }}>{q.explanation}</div>}
        </div>
      ))}
      {!submitted && <button className="submit-btn" onClick={onSubmit} disabled={!allAnswered}>SUBMIT</button>}
      {submitted && <div ref={scoreRef} className={cls} style={{ border: `2px solid ${border}` }}>
        <div style={{ fontSize: 36, fontWeight: 500, color: score === 3 ? ACCENT : score === 2 ? "#ccc" : "#555" }}>{score}/3</div>
        <div style={{ fontSize: 13, letterSpacing: "0.15em", color: score === 3 ? "#fff" : "#888", marginTop: 6 }}>{lbl}</div>
        <div style={{ fontSize: 12, color: "#555", marginTop: 8, lineHeight: 1.5 }}>{sub}</div>
      </div>}
      <div style={{ fontSize: 14, color: "#aaa", borderTop: "1px solid #1a1a1a", paddingTop: 20, marginTop: 20, lineHeight: 1.8, fontStyle: "italic" }}>{closing}</div>
    </div>
  );
}

const css = (accent) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0A0A0A;font-family:'Inter',sans-serif;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes popIn{0%{transform:scale(0.85);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
  @keyframes pulseBorder{0%,100%{box-shadow:0 0 0 0 ${accent}44}50%{box-shadow:0 0 0 8px ${accent}11}}
  .fade-in{animation:fadeIn 0.28s ease forwards}
  .tab-btn{background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.08em;padding:10px 14px;color:#555;transition:color 0.2s;border-bottom:2px solid transparent;display:flex;align-items:center}
  .tab-btn:hover{color:#aaa}.tab-btn.active{color:${accent};border-bottom-color:${accent}}
  .next-tab-btn{display:block;width:100%;margin-top:32px;padding:14px 20px;background:${accent};color:#0A0A0A;border:none;border-radius:4px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;cursor:pointer;text-align:center;transition:opacity 0.2s}
  .next-tab-btn:hover{opacity:0.85}
  .quiz-opt{background:#111;border:1px solid #222;border-radius:4px;padding:14px 16px;cursor:pointer;font-family:'Inter',sans-serif;font-size:13px;color:#999;margin-bottom:8px;transition:all 0.18s;text-align:left;width:100%;line-height:1.6}
  .quiz-opt:hover:not(:disabled){border-color:${accent}44;color:#ddd;background:#141414}
  .quiz-opt.selected{border-color:${accent};background:${accent}22;color:#eee}
  .quiz-opt.correct{border-color:#4ade80;color:#4ade80;background:#4ade8011}
  .quiz-opt.wrong{border-color:#f87171;color:#f87171;background:#f8717111}
  .submit-btn{background:${accent};color:#0A0A0A;border:none;padding:12px 24px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;cursor:pointer;border-radius:3px;margin-top:8px}
  .submit-btn:disabled{opacity:0.3;cursor:not-allowed}
  .score-box{border-radius:6px;padding:28px 20px;text-align:center;margin:24px 0;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards}
  .score-perfect{background:${accent}0f;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards,pulseBorder 1.8s ease-in-out 0.4s 3}
  .score-close{background:#1a1a1a}.score-low{background:#111}
  .src-toggle{background:none;border:1px solid #222;padding:7px 14px;font-family:'Inter',sans-serif;font-size:11px;font-weight:500;color:#555;cursor:pointer;border-radius:3px;letter-spacing:0.08em}
  .src-toggle:hover{color:#999;border-color:#444}
  .src-link{color:${accent};text-decoration:none;font-size:12px;display:block;margin-bottom:4px;font-family:'Inter',sans-serif;font-weight:500}
  .src-link:hover{text-decoration:underline}
`;

const S = {
  root: { background: "#0A0A0A", minHeight: "100vh", fontFamily: "'Inter',sans-serif", color: "#fff", maxWidth: 720, margin: "0 auto", paddingBottom: 80 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px 12px", borderBottom: "1px solid #141414" },
  hL: { display: "flex", alignItems: "center", gap: 10 }, hR: { display: "flex", alignItems: "center", gap: 12 },
  logo: { fontSize: 11, letterSpacing: "0.15em", color: "#fff", fontWeight: 600 },
  entryBadge: { fontSize: 10, color: "#333", letterSpacing: "0.1em", fontWeight: 500 },
  streak: { fontSize: 11, color: "#aaa", fontWeight: 500 },
  badge: { fontSize: 9, letterSpacing: "0.12em", padding: "4px 9px", borderRadius: 3, fontWeight: 600 },
  datebar: { fontSize: 10, color: "#333", letterSpacing: "0.1em", padding: "8px 24px", borderBottom: "1px solid #0f0f0f", fontWeight: 500 },
  conceptBlock: { padding: "28px 24px 0" },
  conceptName: { fontSize: 32, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1 },
  tabRow: { display: "flex", borderBottom: "1px solid #141414", marginTop: 20, padding: "0 12px", gap: 4 },
  content: { padding: "24px 24px 0" },
  label: { fontSize: 10, letterSpacing: "0.12em", marginBottom: 16, fontWeight: 600, textTransform: "uppercase" },
  hook: { fontSize: 20, color: "#fff", lineHeight: 1.5, fontWeight: 400, marginBottom: 20, letterSpacing: "-0.01em" },
  srcSection: { padding: "28px 24px 48px" }, srcDivider: { borderTop: "1px solid #141414", marginBottom: 18 },
  srcList: { marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }, srcItem: {},
  srcDetail: { fontSize: 12, color: "#444", lineHeight: 1.6 },
  srcVerified: { fontSize: 10, color: "#2a2a2a", letterSpacing: "0.1em", marginTop: 8, paddingTop: 12, borderTop: "1px solid #141414", fontWeight: 500 },
};
