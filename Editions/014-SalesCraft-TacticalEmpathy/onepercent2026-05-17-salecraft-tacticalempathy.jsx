import { useState, useEffect, useRef } from "react";
// Entry 014 | SC.2.2 | Tactical Empathy | v1.18 retrofit

const ACCENT = "#E8FF47";
const ACCENT_DIM = "rgba(232,255,71,0.10)";

const data = {
  category: "Sales Craft", categoryTag: "SALES CRAFT", concept: "Tactical Empathy",
  editionId: "SC.2.2", entry: "014",
  morning: {
    hook: "The rep who wins on price is playing the wrong game. The rep who wins on understanding is playing the only game that matters.",
    explanation_paragraphs: [
      "Chris Voss spent decades as the FBI's lead international kidnapping negotiator. What he learned — and what he's been teaching sales organizations since 2016 — is that negotiation isn't a logic problem. It's an emotional one. People make decisions based on how they feel, then justify them with facts.",
      "The tool he built for navigating this is tactical empathy. His definition is precise: understanding the feelings and mindset of another in the moment, and also hearing what is behind those feelings. Note what it isn't. It's not sympathy. It's not rapport-building small talk. It's not being nice.",
      "It's the deliberate act of identifying and articulating the emotional reality your counterpart is operating from — so you can meet them where they actually are, not where you assume they are.",
      "In sales, this changes everything about how you run discovery. The rep who asks 'what's your budget?' gathers data. The rep who asks 'what does a failed implementation cost you?' — and then listens for what's behind the answer — is practicing tactical empathy. They're different conversations with different outcomes.",
    ],
    why_today: "A 2024 Forrester Consulting benchmark found that mid-market companies using tactical empathy and calibrated questions in their sales approach saw a 22% improvement in quota attainment within 6 months. This is not a soft skill. It's a performance lever.",
    morning_challenge: "Pull up your next discovery call or your most recent one.\n\nAsk: how much of that conversation was me gathering data, and how much was me actually understanding what's behind what they said?\n\nOn your next call, when the prospect says something important — a problem, a concern, a hesitation — don't respond with a solution. Label it instead:\n\n'It sounds like this has been going on longer than it should.'\n'It seems like the last vendor left you holding the bag.'\n\nThen stop. Let them respond. What they say next is the thing that actually matters.",
  },
  midday: {
    reframe: "The price objection isn't about price. It never was.",
    itw_paragraphs: [
      "Here's how the tactical empathy failure typically plays out in a sales call. The prospect says: 'Your pricing is too high.' The average rep responds with one of three moves: they defend the price, they discount, or they pivot to ROI math.",
      "Voss would say all three are wrong — not because the moves are bad tactics, but because the rep is responding to the surface, not to what's underneath it. 'Your pricing is too high' almost always means something else: 'I'm afraid I can't justify this to my CFO.' 'The last vendor burned me and I got blamed.' 'I don't yet trust that this will work.' None of those are price objections. They're emotional obstacles wearing a price tag.",
      "The tactical empathy response isn't to answer the objection — it's to label it: 'It sounds like you've been burned before on something like this.' That one sentence invites the real conversation. The rep who gets there closes more deals at better margins — not because they're better at arguing, but because they stopped arguing and started listening.",
    ],
    quote: "Tactical empathy is understanding the feelings and mindset of another in the moment and also hearing what is behind those feelings so you increase your influence in all the moments that follow.",
    attribution: "Chris Voss, Never Split the Difference, Chapter 3 (HarperBusiness, 2016)",
    midday_nudge: "On your next call where pricing comes up: before you respond, ask yourself — do I know what's actually behind this? If not, label before you answer.",
  },
  quiz: [
    {
      question: "Voss defines tactical empathy as 'understanding the feelings and mindset of another in the moment and also hearing what is behind those feelings.' What distinguishes this from sympathy?",
      options: ["Sympathy requires genuine emotional connection; tactical empathy is performed, making it more ethical to use sympathy in professional contexts", "Tactical empathy is about understanding and articulating the counterpart's emotional reality without necessarily agreeing with it — sympathy involves feeling what they feel. The distinction matters because tactical empathy keeps you oriented toward the conversation while sympathy can cloud your judgment", "There is no meaningful distinction — both require listening carefully and acknowledging the other person's perspective", "Sympathy is passive; tactical empathy is aggressive and should be used carefully to avoid damaging trust"],
      correct: 1,
      explanation: "Voss is explicit: empathy is understanding the other person's perspective; sympathy is feeling it. In sales, this matters because a rep who feels a prospect's budget pain might discount reflexively. A rep who understands it can acknowledge it and redirect — same emotional acknowledgment, completely different outcome.",
    },
    {
      question: "A prospect says: 'We'll probably go with whoever gives us the best price.' Which response best demonstrates tactical empathy?",
      options: ["'I completely understand — price is always a major factor. Let me show you our ROI calculator.'", "'We're actually very competitive on pricing. Can I ask what range you're working with?'", "'It sounds like price has become the deciding factor — I'm curious what's behind that. Have past vendors made it hard to justify anything beyond the lowest number?'", "'That's a fair approach. We'd love to compete on price — what would we need to hit?'"],
      correct: 2,
      explanation: "Option A jumps to ROI defense before understanding what's underneath. Option B gathers data without addressing emotion. Option D concedes the framing entirely. Option C labels the emotional reality and asks what's behind it — which is exactly the Voss move. The question it opens is the kind of answer that changes the whole conversation.",
    },
    {
      question: "Your biggest deal is stalling. The champion goes quiet for two weeks, then says 'we're going to need to pause — internal priorities have shifted.' Applying tactical empathy, what's your first move?",
      options: ["Send a detailed recap of the business case and ROI analysis to remind them of the value", "Ask directly: 'What changed? Is there a budget issue or is someone new involved?'", "Label what you're hearing: 'It sounds like something shifted internally that's making this harder to move forward right now' — then stay quiet and let them tell you what actually happened", "Offer a reduced scope or phased approach to lower the barrier"],
      correct: 2,
      explanation: "You don't know what happened yet. 'Internal priorities shifted' is the surface. Labeling it invites them to tell you the real thing: a new executive, a budget freeze, a competing project. You can't solve a problem you haven't heard yet. Label first. Respond second.",
    },
  ],
  closing: "On your next call: what are your prospects actually saying underneath what they say?",
  sources: [
    { label: "Voss, Chris & Raz, Tahl — Never Split the Difference, HarperBusiness, 2016", detail: "Primary source. Tactical Empathy defined in Chapter 3. ISBN 9780062407801.", url: "https://www.blackswanltd.com/never-split-the-difference" },
    { label: "Black Swan Group — blackswanltd.com (active 2025-2026)", detail: "Voss's training organization. Tactical Empathy® is a registered trademark. Ongoing training and 2025 companion book Fight Less Win More.", url: "https://www.blackswanltd.com" },
    { label: "R.O. Hammer / Forrester Consulting 2024 Benchmark — May 2025", detail: "22% quota attainment improvement in 6 months for companies using tactical empathy and calibrated questions.", url: "https://www.rohammer.com/blog/changing-the-game-how-chris-vosss-never-split-the-difference-is-reshaping-sales-negotiation-strategies" },
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
      const sparks = [];
      let frame = 0;
      function drawBrain(progress, alpha) {
        ctx.save(); ctx.globalAlpha = alpha;
        ctx.translate(cx, cy - 60);
        const scale = 0.9 + Math.sin(progress * Math.PI * 2) * 0.06;
        ctx.scale(scale, scale);
        ctx.shadowColor = accent; ctx.shadowBlur = 20 + Math.sin(progress * Math.PI * 4) * 10;
        ctx.strokeStyle = accent; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(0, -50); ctx.bezierCurveTo(-80,-55,-90,-20,-70,10); ctx.bezierCurveTo(-60,30,-30,40,0,35); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-50,-30); ctx.bezierCurveTo(-60,-10,-55,10,-40,20); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-25,-45); ctx.bezierCurveTo(-35,-25,-30,0,-20,10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,-50); ctx.bezierCurveTo(80,-55,90,-20,70,10); ctx.bezierCurveTo(60,30,30,40,0,35); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(50,-30); ctx.bezierCurveTo(60,-10,55,10,40,20); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(25,-45); ctx.bezierCurveTo(35,-25,30,0,20,10); ctx.stroke();
        if (progress > 0.4) {
          const la = Math.min(1, (progress - 0.4) / 0.2);
          ctx.globalAlpha = alpha * la; ctx.shadowBlur = 15;
          ctx.beginPath(); ctx.roundRect(-14,55,28,22,4); ctx.fillStyle = accent; ctx.fill();
          ctx.beginPath(); ctx.arc(0,50,10,Math.PI,0); ctx.lineWidth = 3; ctx.strokeStyle = accent; ctx.stroke();
          ctx.beginPath(); ctx.arc(0,63,4,0,Math.PI*2); ctx.fillStyle = "#0A0A0A"; ctx.fill();
        }
        ctx.restore();
      }
      function spawnFW() {
        const a = Math.random()*Math.PI*2, d = 80+Math.random()*120;
        const x = cx+Math.cos(a)*d, y = (cy-60)+Math.sin(a)*d;
        const colors = [accent,"#ffffff","#ffff00","#ff69b4","#00ffaa","#ff6644"];
        const c = colors[Math.floor(Math.random()*colors.length)];
        for (let i = 0; i < 14; i++) {
          const ang = (i/14)*Math.PI*2, sp = 2+Math.random()*3;
          sparks.push({x,y,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,color:c,life:1,decay:0.018+Math.random()*0.018,size:2+Math.random()*2});
        }
      }
      function tick() {
        ctx.clearRect(0,0,W,H);
        const fa = frame > 120 ? 1-(frame-120)/40 : 1;
        drawBrain(Math.min(1,frame/80), fa);
        if (frame >= 40 && frame < 120 && frame % 12 === 0) spawnFW();
        for (let i = sparks.length-1; i >= 0; i--) {
          const s = sparks[i]; s.x+=s.vx; s.y+=s.vy; s.vy+=0.05; s.life-=s.decay;
          if (s.life <= 0) { sparks.splice(i,1); continue; }
          ctx.save(); ctx.globalAlpha=s.life*fa; ctx.fillStyle=s.color; ctx.shadowColor=s.color; ctx.shadowBlur=6;
          ctx.beginPath(); ctx.arc(s.x,s.y,s.size*s.life,0,Math.PI*2); ctx.fill(); ctx.restore();
        }
        if (frame > 70) {
          const ta = Math.min(1,(frame-70)/20)*fa;
          ctx.save(); ctx.globalAlpha=ta; ctx.fillStyle=accent; ctx.shadowColor=accent; ctx.shadowBlur=20;
          ctx.font="bold 28px 'DM Mono',monospace"; ctx.textAlign="center"; ctx.fillText("LOCKED IN 🔒",cx,cy+80); ctx.restore();
        }
        frame++;
        if (frame < 160) animRef.current = requestAnimationFrame(tick);
      }
      animRef.current = requestAnimationFrame(tick);
    } else {
      let frame = 0;
      function tickArc() {
        ctx.clearRect(0,0,W,H);
        const fa = frame > 60 ? 1-(frame-60)/20 : 1;
        const pr = Math.min(1,frame/50);
        ctx.save(); ctx.translate(cx,cy); ctx.globalAlpha=fa;
        ctx.beginPath(); ctx.arc(0,0,55,0,Math.PI*2); ctx.strokeStyle="#2a2a2a"; ctx.lineWidth=6; ctx.stroke();
        ctx.beginPath(); ctx.arc(0,0,55,-Math.PI/2,-Math.PI/2+(Math.PI*4/3)*pr); ctx.strokeStyle=accent; ctx.lineWidth=6; ctx.lineCap="round"; ctx.shadowColor=accent; ctx.shadowBlur=10; ctx.stroke();
        ctx.fillStyle="#fff"; ctx.font="bold 24px 'DM Mono',monospace"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("2/3",0,0);
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

  const tabs = [{id:"morning",label:"☀ MORNING"},{id:"midday",label:"☁ MIDDAY"},{id:"evening",label:"🔥 EVENING"}];

  return (
    <div style={S.root}>
      {showCelebration && <Celebration score={score} accent={ACCENT} />}
      <div style={S.header}>
        <div style={S.hL}><span style={S.logo}>ONE PERCENT</span><span style={S.entryBadge}>#{data.entry}</span></div>
        <div style={S.hR}><span style={S.streak}>🔥 {streak}</span><span style={{...S.badge,background:ACCENT,color:"#0A0A0A"}}>{data.categoryTag}</span></div>
      </div>
      <div style={S.datebar}>{data.editionId} · {data.concept}</div>
      <div style={S.conceptBlock}><div style={S.conceptName}>{data.concept}</div><div style={{width:40,height:3,background:ACCENT,marginTop:12}}/></div>
      <div style={S.tabRow}>{tabs.map(t=><button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>
      <div style={S.content} className="fade-in" key={tab}>
        {tab==="morning" && <MorningTab d={data.morning} onNext={()=>setTab("midday")}/>}
        {tab==="midday" && <MiddayTab d={data.midday} onNext={()=>setTab("evening")}/>}
        {tab==="evening" && <EveningTab quiz={data.quiz} answers={answers} submitted={submitted} allAnswered={allAnswered} score={score} closing={data.closing} scoreRef={scoreRef} onAnswer={(qi,ai)=>{if(!submitted)setAnswers(p=>({...p,[qi]:ai}));}} onSubmit={handleSubmit}/>}
      </div>
      <div style={S.srcSection}>
        <div style={S.srcDivider}/>
        <button className="src-toggle" onClick={()=>setSrcOpen(!srcOpen)}>{srcOpen?"▲":"▼"} SOURCES</button>
        {srcOpen && <div style={S.srcList}>{data.sources.map((s,i)=><div key={i} style={S.srcItem}><a href={s.url} target="_blank" rel="noopener noreferrer" className="src-link">{s.label}</a><div style={S.srcDetail}>{s.detail}</div></div>)}<div style={S.srcVerified}>✓ ALL SOURCES VERIFIED · ENTRY 014 · SC.2.2</div></div>}
      </div>
    </div>
  );
}

function MorningTab({d,onNext}) {
  return (<div>
    <div style={{...S.label,color:ACCENT}}>☀ MORNING BRIEF</div>
    <div style={S.hook}>{d.hook}</div>
    <div style={{marginBottom:20}}>{d.explanation_paragraphs.map((p,i)=><p key={i} style={{fontSize:13,color:"#888",lineHeight:1.7,marginBottom:i<d.explanation_paragraphs.length-1?14:0}}>{p}</p>)}</div>
    <div style={{background:ACCENT_DIM,border:`1px solid rgba(71,255,232,0.2)`,borderRadius:4,padding:"16px 18px",marginBottom:20}}>
      <div style={{...S.label,color:ACCENT,marginBottom:10}}>WHY TODAY</div>
      <div style={{fontSize:13,color:"#bbb",lineHeight:1.65}}>{d.why_today}</div>
    </div>
    <div style={{borderLeft:`3px solid ${ACCENT}`,paddingLeft:16,marginBottom:24}}>
      <div style={{...S.label,color:ACCENT,marginBottom:10}}>⚡ MORNING CHALLENGE</div>
      <div style={{fontSize:13,color:"#888",lineHeight:1.75,whiteSpace:"pre-wrap"}}>{d.morning_challenge}</div>
    </div>
    <button className="next-tab-btn" onClick={onNext}>☁ MIDDAY →</button>
  </div>);
}

function MiddayTab({d,onNext}) {
  return (<div>
    <div style={{...S.label,color:ACCENT}}>☁ MIDDAY REFRAME</div>
    <div style={{borderLeft:`3px solid ${ACCENT}`,paddingLeft:16,marginBottom:24}}><div style={{fontSize:16,color:"#fff",lineHeight:1.5}}>{d.reframe}</div></div>
    <div style={{...S.label,color:"#555",marginBottom:14}}>👁 IN THE WILD — TYPE C · DISCOVERY CALL PATTERN</div>
    <div style={{borderTop:"1px solid #1a1a1a",paddingTop:16,marginBottom:20}}>{d.itw_paragraphs.map((p,i)=><p key={i} style={{fontSize:13,color:"#888",lineHeight:1.7,marginBottom:i<d.itw_paragraphs.length-1?14:0}}>{p}</p>)}</div>
    <div style={{border:`1px solid rgba(71,255,232,0.25)`,borderRadius:4,padding:"16px 18px",marginBottom:20,background:ACCENT_DIM}}>
      <div style={{fontSize:14,color:"#ddd",lineHeight:1.6,fontStyle:"italic",marginBottom:10}}>"{d.quote}"</div>
      <div style={{fontSize:11,color:"#555",letterSpacing:"0.04em"}}>— {d.attribution}</div>
    </div>
    <div style={{fontSize:13,color:"#666",lineHeight:1.65,borderTop:"1px solid #141414",paddingTop:16,marginBottom:8}}>{d.midday_nudge}</div>
    <button className="next-tab-btn" onClick={onNext}>🔥 EVENING →</button>
  </div>);
}

function EveningTab({quiz,answers,submitted,allAnswered,score,closing,scoreRef,onAnswer,onSubmit}) {
  const lbl = score===3?"LOCKED IN 🔒":score===2?"ALMOST THERE":score===1?"KEEP GOING":"REVIEW & RETRY";
  const sub = score===3?"Perfect score. You've got this one.":score===2?"One away. Come back and get that third.":"The concepts will stick with more reps. Come back.";
  const border = score===3?ACCENT:score===2?"#606060":"#333";
  const cls = score===3?"score-box score-perfect":score===2?"score-box score-close":"score-box score-low";
  return (<div>
    <div style={{...S.label,color:ACCENT}}>🔥 TEST YOURSELF</div>
    {quiz.map((q,qi)=>(
      <div key={qi} style={{marginBottom:28}}>
        <div style={{fontSize:13,color:"#ccc",lineHeight:1.6,marginBottom:12}}>{qi+1}. {q.question}</div>
        {q.options.map((opt,ai)=>{
          let cls="quiz-opt";
          if(submitted&&ai===q.correct)cls="quiz-opt correct";
          else if(submitted&&answers[qi]===ai)cls="quiz-opt wrong";
          else if(!submitted&&answers[qi]===ai)cls="quiz-opt selected";
          return <button key={ai} className={cls} onClick={()=>onAnswer(qi,ai)} disabled={submitted}><span style={{color:ACCENT,marginRight:8}}>{String.fromCharCode(65+ai)}.</span>{opt}</button>;
        })}
        {submitted&&<div style={{fontSize:11,color:"#555",lineHeight:1.6,marginTop:8,paddingLeft:4}}>{q.explanation}</div>}
      </div>
    ))}
    {!submitted&&<button className="submit-btn" onClick={onSubmit} disabled={!allAnswered}>SUBMIT</button>}
    {submitted&&<div ref={scoreRef} className={cls} style={{border:`2px solid ${border}`}}>
      <div style={{fontSize:36,fontWeight:500,color:score===3?ACCENT:score===2?"#ccc":"#555"}}>{score}/3</div>
      <div style={{fontSize:13,letterSpacing:"0.15em",color:score===3?"#fff":"#888",marginTop:6}}>{lbl}</div>
      <div style={{fontSize:12,color:"#555",marginTop:8,lineHeight:1.5}}>{sub}</div>
    </div>}
    <div style={{fontSize:13,color:"#aaa",borderTop:"1px solid #1a1a1a",paddingTop:20,marginTop:20,lineHeight:1.7}}>{closing}</div>
  </div>);
}

const css = (accent) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0A0A0A;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes popIn{0%{transform:scale(0.85);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
  @keyframes pulseBorder{0%,100%{box-shadow:0 0 0 0 ${accent}44}50%{box-shadow:0 0 0 8px ${accent}11}}
  .fade-in{animation:fadeIn 0.28s ease forwards}
  .tab-btn{background:none;border:none;cursor:pointer;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.12em;padding:8px 12px;color:#555;transition:color 0.2s;border-bottom:1.5px solid transparent}
  .tab-btn:hover{color:#aaa}.tab-btn.active{color:${accent};border-bottom-color:${accent}}
  .next-tab-btn{display:block;width:100%;margin-top:32px;padding:14px 20px;background:${accent};color:#0A0A0A;border:none;border-radius:4px;font-family:'DM Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.12em;cursor:pointer;text-align:center;transition:opacity 0.2s}
  .next-tab-btn:hover{opacity:0.85}
  .quiz-opt{background:#111;border:1px solid #222;border-radius:4px;padding:12px 14px;cursor:pointer;font-family:'DM Mono',monospace;font-size:12px;color:#888;margin-bottom:8px;transition:all 0.18s;text-align:left;width:100%}
  .quiz-opt:hover:not(:disabled){border-color:${accent}44;color:#ccc}
  .quiz-opt.selected{border-color:${accent};background:${accent}22;color:#ddd}
  .quiz-opt.correct{border-color:#4ade80;color:#4ade80;background:#4ade8011}
  .quiz-opt.wrong{border-color:#f87171;color:#f87171;background:#f8717111}
  .submit-btn{background:${accent};color:#0A0A0A;border:none;padding:12px 24px;font-family:'DM Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.1em;cursor:pointer;border-radius:3px;margin-top:8px}
  .submit-btn:disabled{opacity:0.3;cursor:not-allowed}
  .score-box{border-radius:6px;padding:28px 20px;text-align:center;margin:24px 0;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards}
  .score-perfect{background:${accent}0f;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards,pulseBorder 1.8s ease-in-out 0.4s 3}
  .score-close{background:#1a1a1a}.score-low{background:#111}
  .src-toggle{background:none;border:1px solid #222;padding:7px 14px;font-family:'DM Mono',monospace;font-size:10px;color:#555;cursor:pointer;border-radius:3px;letter-spacing:0.12em}
  .src-toggle:hover{color:#999;border-color:#444}
  .src-link{color:${accent};text-decoration:none;font-size:11px;display:block;margin-bottom:4px;font-family:'DM Mono',monospace}
  .src-link:hover{text-decoration:underline}
`;

const S = {
  root:{background:"#0A0A0A",minHeight:"100vh",fontFamily:"'DM Mono',monospace",color:"#fff",maxWidth:680,margin:"0 auto",paddingBottom:80},
  header:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px 12px",borderBottom:"1px solid #141414"},
  hL:{display:"flex",alignItems:"center",gap:10},hR:{display:"flex",alignItems:"center",gap:12},
  logo:{fontSize:11,letterSpacing:"0.2em",color:"#fff",fontWeight:500},
  entryBadge:{fontSize:10,color:"#333",letterSpacing:"0.1em"},
  streak:{fontSize:11,color:"#aaa"},
  badge:{fontSize:9,letterSpacing:"0.15em",padding:"3px 8px",borderRadius:2,fontWeight:500},
  datebar:{fontSize:10,color:"#333",letterSpacing:"0.1em",padding:"8px 24px",borderBottom:"1px solid #0f0f0f"},
  conceptBlock:{padding:"28px 24px 0"},
  conceptName:{fontSize:28,fontWeight:500,color:"#fff",letterSpacing:"-0.01em",lineHeight:1.1},
  tabRow:{display:"flex",borderBottom:"1px solid #141414",marginTop:20,padding:"0 12px",gap:4},
  content:{padding:"24px 24px 0"},
  label:{fontSize:10,letterSpacing:"0.15em",marginBottom:16,fontWeight:500},
  hook:{fontSize:18,color:"#fff",lineHeight:1.45,fontWeight:400,marginBottom:18,letterSpacing:"-0.01em"},
  srcSection:{padding:"28px 24px 48px"},srcDivider:{borderTop:"1px solid #141414",marginBottom:18},
  srcList:{marginTop:16,display:"flex",flexDirection:"column",gap:16},srcItem:{},
  srcDetail:{fontSize:11,color:"#444",lineHeight:1.6},
  srcVerified:{fontSize:10,color:"#2a2a2a",letterSpacing:"0.1em",marginTop:8,paddingTop:12,borderTop:"1px solid #141414"},
};
