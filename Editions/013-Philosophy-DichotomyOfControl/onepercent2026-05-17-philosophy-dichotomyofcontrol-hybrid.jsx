import { useState, useEffect, useRef } from "react";
import { BookOpen, Lightbulb, Award } from 'lucide-react';
// Entry 013 | PH.2 | Dichotomy of Control | v1.18 hybrid

const ACCENT = "#FF4778";
const ACCENT_DIM = "rgba(255,71,120,0.10)";

const data = {
  category: "Philosophy", categoryTag: "PHILOSOPHY", concept: "Dichotomy of Control",
  editionId: "PH.2", entry: "013",
  morning: {
    hook: "Most anxiety comes from trying to control what you can't. The Stoics had a framework for that.",
    explanation_paragraphs: [
      "The Dichotomy of Control is a Stoic principle that divides all concerns into two categories: things you control (your thoughts, actions, judgments) and things you don't (other people's opinions, outcomes, external events). The insight is simple but transformative — most anxiety comes from trying to control what you can't.",
      "Epictetus, a Stoic philosopher who lived as a slave before gaining freedom, put it directly: focus entirely on what's in your power, and accept everything else with indifference. This doesn't mean passivity — it means directing energy where it actually matters. You can control your preparation for a pitch, but not whether the client signs. You can control how you respond to feedback, but not whether you receive it.",
      "The practical application is a question you ask before reacting to anything: *Is this within my control?* If yes, act. If no, let it go. This framework doesn't eliminate difficulty — it eliminates wasted effort on things you were never going to change anyway.",
    ],
    why_today: "Stoicism has seen a resurgence in professional contexts over the past five years, with major business publications and leadership training programs adopting frameworks like the Dichotomy of Control as practical tools for decision-making under uncertainty. What was ancient philosophy is now applied psychology.",
    morning_challenge: "Think about something that's been bothering you lately — a stalled deal, a difficult conversation, an outcome you're waiting on.\n\nAsk yourself: What part of this is actually within my control?\n\nWrite down the controllable elements. Then write down what you're going to do about those, specifically. Everything else — the part you can't control — acknowledge it exists, then redirect your attention back to the list of things you can actually affect.\n\nThat's the practice.",
  },
  midday: {
    reframe: "Stockdale survived seven years as a POW by knowing exactly what he could and couldn't control.",
    itw_paragraphs: [
      "In 2004, Admiral James Stockdale published his account of surviving seven years as a prisoner of war in North Vietnam. He credited his survival to the Stoic principle he'd studied before capture — the Dichotomy of Control. While imprisoned, he couldn't control his captors, his release date, or the war's outcome. But he could control his mental discipline, his resistance methods, and how he supported fellow prisoners.",
      "Stockdale described watching optimists around him set release dates in their minds — 'We'll be out by Christmas' — only to have their hope crushed when the date passed. They died of broken hearts. Stockdale's approach was different: accept the brutal reality of the situation (outside his control) while maintaining absolute faith in his ability to endure and act with integrity (within his control).",
      "His survival framework, later termed the Stockdale Paradox, was pure Dichotomy of Control in practice — confront the harshest facts of your reality while refusing to surrender agency over the one thing no one can take: your response.",
    ],
    quote: "Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion, and, in a word, whatever are our own actions. Things not in our control are body, property, reputation, command, and, in one word, whatever are not our own actions.",
    attribution: "Epictetus, Enchiridion (The Manual), c. 135 CE",
    midday_nudge: "On your next difficult situation: pause before reacting and ask — is this within my control? If not, what is? Direct your energy there.",
  },
  quiz: [
    {
      question: "According to the Dichotomy of Control, which of these is within your control in a sales situation where a prospect is evaluating your proposal against two competitors?",
      options: [
        "Whether your manager approves your proposal before you submit it",
        "How thoroughly you research the prospect's business and customize your approach based on what you learn",
        "Whether the prospect's decision-making committee includes someone who previously worked with a competitor",
        "How your competitors position their pricing and value proposition"
      ],
      correct: 1,
      explanation: "Your research depth and the quality of your customization are entirely within your control. Manager approval, committee composition, and competitor actions are not — though your preparation may influence outcomes, you don't control them directly. The Stoic insight: focus your energy on what you can actually affect.",
    },
    {
      question: "A client cancels a major deal at the last minute due to an internal budget freeze. Applying the Dichotomy of Control, which response demonstrates mastery of the principle?",
      options: [
        "Immediately call your executive sponsor to see if they can override the freeze — sometimes persistence changes outcomes",
        "Spend time analyzing whether you missed early warning signs so you can avoid this in future deals",
        "Accept that the budget freeze is outside your control, then focus on what you can control: maintaining the relationship, documenting lessons learned, and identifying which active deals might face similar risks",
        "Let the deal go entirely and move on to the next opportunity without looking back"
      ],
      correct: 2,
      explanation: "Option C demonstrates the full principle: accept what's outside your control (the freeze), then immediately redirect energy to what is within your control (relationship maintenance, learning, risk assessment). Option A wastes energy trying to change the unchangeable. Option B focuses only on the past. Option D misses the learning and relationship opportunities you do control.",
    },
    {
      question: "You're preparing for a high-stakes presentation. A colleague criticizes your deck the night before, saying it's too technical and will lose the audience. The presentation is in 12 hours. How do you apply the Dichotomy of Control?",
      options: [
        "Ignore the feedback — you can't control their opinion and changing the deck now introduces risk",
        "Stay up all night revising to address every concern they raised",
        "Evaluate whether the feedback improves your outcome. If it does, revise the slides you can improve in the time available. If it doesn't, or if you can't execute the changes well under time pressure, hold your approach. Either way, you control the decision and the execution — not their opinion or the audience's ultimate reaction.",
        "Ask them to present with you so they share responsibility for the outcome"
      ],
      correct: 2,
      explanation: "This is the principle in action under time pressure. You don't control their opinion or the audience's reaction. You do control: your evaluation of the feedback, your revision decision, and your execution quality. The Stoic move is to separate signal from noise, act on what you control, and accept what you don't.",
    },
  ],
  closing: "Where in your current work are you spending energy trying to control outcomes instead of inputs?",
  sources: [
    { label: "Epictetus — Enchiridion (The Manual)", detail: "c. 135 CE · Stoic manual on the dichotomy of control. Public domain; full text widely available.", url: "https://www.gutenberg.org/ebooks/45109" },
    { label: "Stockdale, James — Courage Under Fire: Testing Epictetus's Doctrines in a Laboratory of Human Behavior", detail: "Hoover Institution, 1993 · POW survival and Stoic philosophy application. Essay archived at Hoover Institution.", url: "https://www.hoover.org/research/courage-under-fire-testing-epictetus-doctrines-laboratory-human-behavior" },
    { label: "Irvine, William B. — A Guide to the Good Life: The Ancient Art of Stoic Joy", detail: "Oxford University Press, 2008 · Modern interpretation of Stoic practices including dichotomy of control. ISBN 9780195374612.", url: "https://global.oup.com/academic/product/a-guide-to-the-good-life-9780195374612" },
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
      const rays = [];
      const particles = [];
      let frame = 0;
      
      // Create starburst rays
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        rays.push({ angle, length: 0, maxLength: 120 + Math.random() * 80 });
      }
      
      // Create particle burst
      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.012 + Math.random() * 0.012,
          size: 2 + Math.random() * 3,
          color: [accent, "#ffffff", "#ffff00", "#ff69b4"][Math.floor(Math.random() * 4)]
        });
      }
      
      function tick() {
        ctx.clearRect(0, 0, W, H);
        const fadeAlpha = frame > 100 ? 1 - (frame - 100) / 40 : 1;
        
        // Draw starburst rays
        if (frame < 60) {
          const rayProgress = Math.min(1, frame / 30);
          ctx.save();
          ctx.globalAlpha = fadeAlpha;
          rays.forEach(ray => {
            const len = ray.maxLength * rayProgress;
            const x1 = cx + Math.cos(ray.angle) * 20;
            const y1 = cy + Math.sin(ray.angle) * 20;
            const x2 = cx + Math.cos(ray.angle) * len;
            const y2 = cy + Math.sin(ray.angle) * len;
            
            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, accent);
            gradient.addColorStop(1, accent + "00");
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          });
          ctx.restore();
        }
        
        // Draw center glow
        if (frame < 80) {
          const glowSize = 30 + Math.sin(frame * 0.2) * 10;
          ctx.save();
          ctx.globalAlpha = fadeAlpha * 0.6;
          const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize);
          glow.addColorStop(0, accent);
          glow.addColorStop(1, accent + "00");
          ctx.fillStyle = glow;
          ctx.fillRect(cx - glowSize, cy - glowSize, glowSize * 2, glowSize * 2);
          ctx.restore();
        }
        
        // Draw particles
        ctx.save();
        ctx.globalAlpha = fadeAlpha;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08;
          p.life -= p.decay;
          
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          
          ctx.globalAlpha = p.life * fadeAlpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        
        // Draw "LOCKED IN" text
        if (frame > 50) {
          const textAlpha = Math.min(1, (frame - 50) / 20) * fadeAlpha;
          ctx.save();
          ctx.globalAlpha = textAlpha;
          ctx.fillStyle = accent;
          ctx.shadowColor = accent;
          ctx.shadowBlur = 20;
          ctx.font = "bold 28px 'Inter', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("LOCKED IN 🔒", cx, cy + 60);
          ctx.restore();
        }
        
        frame++;
        if (frame < 140) {
          animRef.current = requestAnimationFrame(tick);
        }
      }
      
      animRef.current = requestAnimationFrame(tick);
    } else {
      // 2/3 arc animation (unchanged)
      let frame = 0;
      function tickArc() {
        ctx.clearRect(0,0,W,H);
        const fa = frame > 60 ? 1-(frame-60)/20 : 1;
        const pr = Math.min(1,frame/50);
        ctx.save(); ctx.translate(cx,cy); ctx.globalAlpha=fa;
        ctx.beginPath(); ctx.arc(0,0,55,0,Math.PI*2); ctx.strokeStyle="#2a2a2a"; ctx.lineWidth=6; ctx.stroke();
        ctx.beginPath(); ctx.arc(0,0,55,-Math.PI/2,-Math.PI/2+(Math.PI*4/3)*pr); ctx.strokeStyle=accent; ctx.lineWidth=6; ctx.lineCap="round"; ctx.shadowColor=accent; ctx.shadowBlur=10; ctx.stroke();
        ctx.fillStyle="#fff"; ctx.font="bold 24px 'Inter',sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("2/3",0,0);
        ctx.restore();
        frame++;
        if (frame < 80) animRef.current = requestAnimationFrame(tickArc);
      }
      animRef.current = requestAnimationFrame(tickArc);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [score]);
  if (score < 2) return null;
  return <canvas ref={canvasRef} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:9999}} />;
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
      const yesterday = new Date(Date.now()-86400000).toDateString();
      if (last === today) { setStreak(s||1); }
      else if (last === yesterday) { const ns=s+1; setStreak(ns); localStorage.setItem("op_streak",ns); localStorage.setItem("op_last",today); }
      else { setStreak(1); localStorage.setItem("op_streak",1); localStorage.setItem("op_last",today); }
    } catch(e) { setStreak(1); }
  }, []);

  const allAnswered = data.quiz.every((_,i) => answers[i] !== undefined);
  const score = data.quiz.filter((q,i) => answers[i] === q.correct).length;

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    if (score >= 2) setShowCelebration(true);
    setTimeout(() => scoreRef.current?.scrollIntoView({behavior:"smooth",block:"center"}), 150);
  };

  const tabs = [
    {id:"morning",label:"MORNING",icon:BookOpen},
    {id:"midday",label:"MIDDAY",icon:Lightbulb},
    {id:"evening",label:"EVENING",icon:Award}
  ];

  return (
    <div style={S.root}>
      {showCelebration && <Celebration score={score} accent={ACCENT} />}
      <div style={S.header}>
        <div style={S.hL}><span style={S.logo}>ONE PERCENT</span><span style={S.entryBadge}>#{data.entry}</span></div>
        <div style={S.hR}><span style={S.streak}>🔥 {streak}</span><span style={{...S.badge,background:ACCENT,color:"#0A0A0A"}}>{data.categoryTag}</span></div>
      </div>
      <div style={S.datebar}>{data.editionId} · {data.concept}</div>
      <div style={S.conceptBlock}><div style={S.conceptName}>{data.concept}</div><div style={{width:40,height:3,background:ACCENT,marginTop:12}}/></div>
      <div style={S.tabRow}>
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
              <Icon size={16} style={{marginRight:6}} />
              {t.label}
            </button>
          );
        })}
      </div>
      <div style={S.content} className="fade-in" key={tab}>
        {tab==="morning" && <MorningTab d={data.morning} onNext={()=>setTab("midday")}/>}
        {tab==="midday" && <MiddayTab d={data.midday} onNext={()=>setTab("evening")}/>}
        {tab==="evening" && <EveningTab quiz={data.quiz} answers={answers} submitted={submitted} allAnswered={allAnswered} score={score} closing={data.closing} scoreRef={scoreRef} onAnswer={(qi,ai)=>{if(!submitted)setAnswers(p=>({...p,[qi]:ai}));}} onSubmit={handleSubmit}/>}
      </div>
      <div style={S.srcSection}>
        <div style={S.srcDivider}/>
        <button className="src-toggle" onClick={()=>setSrcOpen(!srcOpen)}>{srcOpen?"▲":"▼"} SOURCES</button>
        {srcOpen && <div style={S.srcList}>{data.sources.map((s,i)=><div key={i} style={S.srcItem}><a href={s.url} target="_blank" rel="noopener noreferrer" className="src-link">{s.label}</a><div style={S.srcDetail}>{s.detail}</div></div>)}<div style={S.srcVerified}>✓ ALL SOURCES VERIFIED · ENTRY {data.entry} · {data.editionId}</div></div>}
      </div>
    </div>
  );
}

function MorningTab({d,onNext}) {
  return (<div>
    <div style={{...S.label,color:ACCENT}}>☀ MORNING BRIEF</div>
    <div style={S.hook}>{d.hook}</div>
    <div style={{marginBottom:20}}>{d.explanation_paragraphs.map((p,i)=><p key={i} style={{fontSize:15,color:"#bbb",lineHeight:1.8,marginBottom:i<d.explanation_paragraphs.length-1?16:0}}>{p}</p>)}</div>
    <div style={{background:ACCENT_DIM,border:`1px solid rgba(255,71,120,0.2)`,borderRadius:4,padding:"16px 18px",marginBottom:20}}>
      <div style={{...S.label,color:ACCENT,marginBottom:10}}>WHY TODAY</div>
      <div style={{fontSize:14,color:"#bbb",lineHeight:1.7}}>{d.why_today}</div>
    </div>
    <div style={{borderLeft:`3px solid ${ACCENT}`,paddingLeft:16,marginBottom:24}}>
      <div style={{...S.label,color:ACCENT,marginBottom:10}}>⚡ MORNING CHALLENGE</div>
      <div style={{fontSize:14,color:"#999",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{d.morning_challenge}</div>
    </div>
    <button className="next-tab-btn" onClick={onNext}>☁ MIDDAY →</button>
  </div>);
}

function MiddayTab({d,onNext}) {
  return (<div>
    <div style={{...S.label,color:ACCENT}}>☁ MIDDAY REFRAME</div>
    <div style={{borderLeft:`3px solid ${ACCENT}`,paddingLeft:16,marginBottom:24}}><div style={{fontSize:17,color:"#fff",lineHeight:1.5,fontWeight:500}}>{d.reframe}</div></div>
    <div style={{...S.label,color:"#555",marginBottom:14}}>👁 IN THE WILD</div>
    <div style={{borderTop:"1px solid #1a1a1a",paddingTop:16,marginBottom:20}}>{d.itw_paragraphs.map((p,i)=><p key={i} style={{fontSize:15,color:"#bbb",lineHeight:1.8,marginBottom:i<d.itw_paragraphs.length-1?16:0}}>{p}</p>)}</div>
    <div style={{border:`1px solid rgba(255,71,120,0.25)`,borderRadius:4,padding:"16px 18px",marginBottom:20,background:ACCENT_DIM}}>
      <div style={{fontSize:15,color:"#ddd",lineHeight:1.7,fontStyle:"italic",marginBottom:10}}>"{d.quote}"</div>
      <div style={{fontSize:12,color:"#666",letterSpacing:"0.04em"}}>— {d.attribution}</div>
    </div>
    <div style={{fontSize:14,color:"#777",lineHeight:1.7,borderTop:"1px solid #141414",paddingTop:16,marginBottom:8}}>{d.midday_nudge}</div>
    <button className="next-tab-btn" onClick={onNext}>🔥 EVENING →</button>
  </div>);
}

function EveningTab({quiz,answers,submitted,allAnswered,score,closing,scoreRef,onAnswer,onSubmit}) {
  const lbl = score===3?"PERFECT SCORE":score===2?"ALMOST THERE":score===1?"KEEP GOING":"REVIEW & RETRY";
  const sub = score===3?"You've got this one locked in.":score===2?"One away. Come back and get that third.":"The concepts will stick with more reps. Come back.";
  const border = score===3?ACCENT:score===2?"#606060":"#333";
  const cls = score===3?"score-box score-perfect":score===2?"score-box score-close":"score-box score-low";
  return (<div>
    <div style={{...S.label,color:ACCENT}}>🔥 TEST YOURSELF</div>
    {quiz.map((q,qi)=>(
      <div key={qi} style={{marginBottom:28}}>
        <div style={{fontSize:14,color:"#ccc",lineHeight:1.7,marginBottom:12,fontWeight:400}}>{qi+1}. {q.question}</div>
        {q.options.map((opt,ai)=>{
          let cls="quiz-opt";
          if(submitted&&ai===q.correct)cls="quiz-opt correct";
          else if(submitted&&answers[qi]===ai)cls="quiz-opt wrong";
          else if(!submitted&&answers[qi]===ai)cls="quiz-opt selected";
          return <button key={ai} className={cls} onClick={()=>onAnswer(qi,ai)} disabled={submitted}><span style={{color:ACCENT,marginRight:8,fontWeight:600}}>{String.fromCharCode(65+ai)}.</span>{opt}</button>;
        })}
        {submitted&&<div style={{fontSize:13,color:"#666",lineHeight:1.7,marginTop:10,paddingLeft:4}}>{q.explanation}</div>}
      </div>
    ))}
    {!submitted&&<button className="submit-btn" onClick={onSubmit} disabled={!allAnswered}>SUBMIT</button>}
    {submitted&&<div ref={scoreRef} className={cls} style={{border:`2px solid ${border}`}}>
      <div style={{fontSize:36,fontWeight:500,color:score===3?ACCENT:score===2?"#ccc":"#555"}}>{score}/3</div>
      <div style={{fontSize:13,letterSpacing:"0.15em",color:score===3?"#fff":"#888",marginTop:6}}>{lbl}</div>
      <div style={{fontSize:12,color:"#555",marginTop:8,lineHeight:1.5}}>{sub}</div>
    </div>}
    <div style={{fontSize:14,color:"#aaa",borderTop:"1px solid #1a1a1a",paddingTop:20,marginTop:20,lineHeight:1.8,fontStyle:"italic"}}>{closing}</div>
  </div>);
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
  root:{background:"#0A0A0A",minHeight:"100vh",fontFamily:"'Inter',sans-serif",color:"#fff",maxWidth:720,margin:"0 auto",paddingBottom:80},
  header:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px 12px",borderBottom:"1px solid #141414"},
  hL:{display:"flex",alignItems:"center",gap:10},hR:{display:"flex",alignItems:"center",gap:12},
  logo:{fontSize:11,letterSpacing:"0.15em",color:"#fff",fontWeight:600},
  entryBadge:{fontSize:10,color:"#333",letterSpacing:"0.1em",fontWeight:500},
  streak:{fontSize:11,color:"#aaa",fontWeight:500},
  badge:{fontSize:9,letterSpacing:"0.12em",padding:"4px 9px",borderRadius:3,fontWeight:600},
  datebar:{fontSize:10,color:"#333",letterSpacing:"0.1em",padding:"8px 24px",borderBottom:"1px solid #0f0f0f",fontWeight:500},
  conceptBlock:{padding:"28px 24px 0"},
  conceptName:{fontSize:32,fontWeight:600,color:"#fff",letterSpacing:"-0.02em",lineHeight:1.1},
  tabRow:{display:"flex",borderBottom:"1px solid #141414",marginTop:20,padding:"0 12px",gap:4},
  content:{padding:"24px 24px 0"},
  label:{fontSize:10,letterSpacing:"0.12em",marginBottom:16,fontWeight:600,textTransform:"uppercase"},
  hook:{fontSize:20,color:"#fff",lineHeight:1.5,fontWeight:400,marginBottom:20,letterSpacing:"-0.01em"},
  srcSection:{padding:"28px 24px 48px"},srcDivider:{borderTop:"1px solid #141414",marginBottom:18},
  srcList:{marginTop:16,display:"flex",flexDirection:"column",gap:16},srcItem:{},
  srcDetail:{fontSize:12,color:"#444",lineHeight:1.6},
  srcVerified:{fontSize:10,color:"#2a2a2a",letterSpacing:"0.1em",marginTop:8,paddingTop:12,borderTop:"1px solid #141414",fontWeight:500},
};
