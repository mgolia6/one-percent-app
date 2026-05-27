'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { TOTAL_ENTRIES } from '@/lib/config'

// ── Shared survey helpers ────────────────────────────────────────────────────
const WEEKLY_ACCENT = '#47FFE8'
const BETA_ACCENT = '#FF4778'
const SURVEY_CATS = ['Sales Craft', 'AI', 'Vocab & Language', 'Mental Models', 'Philosophy', 'Neuroscience & Cognition', 'Communication']

function SvRatingRow({ label, question, value, onChange, accent }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 9, color: accent, letterSpacing: '0.15em', fontWeight: 700, marginBottom: 3 }}>{label}</div>
      {question && <div style={{ fontSize: 13, color: '#aaa', marginBottom: 8, lineHeight: 1.4 }}>{question}</div>}
      <div style={{ display: 'flex', gap: 6 }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => onChange(n)} style={{
            flex: 1, padding: '10px 0', borderRadius: 3,
            border: '1px solid ' + (value >= n ? accent : '#222'),
            background: value >= n ? accent + '22' : '#111',
            color: value >= n ? accent : '#555',
            fontSize: 13, cursor: 'pointer', fontFamily: "'Inter',sans-serif", transition: 'all 0.15s',
          }}>{n}</button>
        ))}
      </div>
    </div>
  )
}

function SvChipRow({ label, options, value, onChange, accent }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, color: '#666', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)} style={{
            padding: '8px 14px', borderRadius: 3, fontSize: 12, cursor: 'pointer',
            fontFamily: "'Inter',sans-serif", fontWeight: 500,
            border: '1px solid ' + (value === opt ? accent : '#222'),
            background: value === opt ? accent + '22' : '#111',
            color: value === opt ? accent : '#555', transition: 'all 0.15s',
          }}>{opt}</button>
        ))}
      </div>
    </div>
  )
}

function SvOpenText({ label, value, onChange, placeholder, minHeight }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <div style={{ fontSize: 11, color: '#666', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 600 }}>{label}</div>}
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || 'Be specific.'} style={{
        width: '100%', background: '#0a0a0a', border: '1px solid #222', borderRadius: 4,
        padding: '12px 14px', fontSize: 13, color: '#bbb', fontFamily: "'Inter',sans-serif",
        resize: 'vertical', minHeight: minHeight || 64, outline: 'none', boxSizing: 'border-box',
      }} />
    </div>
  )
}

function SvSection({ title }) {
  return <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.2em', fontWeight: 700, marginBottom: 16, marginTop: 28, paddingBottom: 8, borderBottom: '1px solid #1a1a1a' }}>{title}</div>
}

// ── Weekly check-in survey ───────────────────────────────────────────────────
function WeeklySurveyTest({ userId, onDone }) {
  const [entriesCompleted, setEntriesCompleted] = useState(null)
  const [timeOfDay, setTimeOfDay] = useState(null)
  const [device, setDevice] = useState(null)
  const [clarityRating, setClarityRating] = useState(0)
  const [relevanceRating, setRelevanceRating] = useState(0)
  const [quizRating, setQuizRating] = useState(0)
  const [mostUsefulCat, setMostUsefulCat] = useState(null)
  const [leastRelevantCat, setLeastRelevantCat] = useState(null)
  const [topicsWanted, setTopicsWanted] = useState('')
  const [appliedLearning, setAppliedLearning] = useState(null)
  const [appliedDetail, setAppliedDetail] = useState('')
  const [frictionFreq, setFrictionFreq] = useState(null)
  const [frictionDetail, setFrictionDetail] = useState('')
  const [leaderboard, setLeaderboard] = useState(null)
  const [emailReceived, setEmailReceived] = useState(null)
  const [nameResonate, setNameResonate] = useState(null)
  const [nameSuggestion, setNameSuggestion] = useState('')
  const [pitch, setPitch] = useState('')
  const [whoNeedsIt, setWhoNeedsIt] = useState('')
  const [wouldContinue, setWouldContinue] = useState(null)
  const [openMore, setOpenMore] = useState('')
  const [anythingElse, setAnythingElse] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const coreReady = entriesCompleted && timeOfDay && device && clarityRating && relevanceRating && quizRating && mostUsefulCat && appliedLearning && frictionFreq && wouldContinue

  const submit = async () => {
    if (!coreReady) return
    setSubmitting(true)
    const parts = [
      entriesCompleted && ('entries:' + entriesCompleted),
      timeOfDay && ('time:' + timeOfDay),
      device && ('device:' + device),
      mostUsefulCat && ('most_useful:' + mostUsefulCat),
      leastRelevantCat && ('least_relevant:' + leastRelevantCat),
      topicsWanted && ('topics_wanted:' + topicsWanted),
      appliedLearning && ('applied:' + appliedLearning),
      appliedDetail && ('applied_detail:' + appliedDetail),
      frictionFreq && ('friction:' + frictionFreq),
      frictionDetail && ('friction_detail:' + frictionDetail),
      leaderboard && ('leaderboard:' + leaderboard),
      emailReceived && ('email:' + emailReceived),
      nameResonate && ('name:' + nameResonate),
      nameSuggestion && ('name_suggestion:' + nameSuggestion),
      pitch && ('pitch:' + pitch),
      whoNeedsIt && ('who_needs_it:' + whoNeedsIt),
      openMore && ('open_more:' + openMore),
    ].filter(Boolean)
    const { error } = await supabase.from('feedback').insert({
      user_id: userId,
      feedback_type: 'weekly',
      clarity_rating: clarityRating,
      topic_rating: relevanceRating,
      quiz_rating: quizRating,
      would_recommend: wouldContinue,
      missing_topics: parts.join(' | '),
      biggest_win: anythingElse || null,
    })
    setSubmitting(false)
    setResult(error ? 'error' : 'ok')
    if (!error) setTimeout(onDone, 1500)
  }

  if (result === 'ok') return <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: WEEKLY_ACCENT, letterSpacing: '0.08em' }}>checkmark WRITTEN TO SUPABASE</div>
  if (result === 'error') return <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: BETA_ACCENT }}>X INSERT FAILED</div>

  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: '0.2em', color: '#555', marginBottom: 6, fontWeight: 600 }}>WEEKLY CHECK-IN — LIVE TEST</div>
      <div style={{ fontSize: 18, color: '#fff', fontWeight: 700, marginBottom: 6 }}>One week in. Be honest.</div>
      <div style={{ fontSize: 13, color: '#555', marginBottom: 28, lineHeight: 1.6 }}>This feedback directly shapes what One Percent becomes. Don't be nice — be useful.</div>

      <SvSection title="USAGE" />
      <SvChipRow label="HOW MANY ENTRIES DID YOU COMPLETE THIS WEEK?" options={['0', '1-2', '3-4', '5+']} value={entriesCompleted} onChange={setEntriesCompleted} accent={WEEKLY_ACCENT} />
      <SvChipRow label="WHEN DO YOU USUALLY OPEN THE APP?" options={['Morning', 'Midday', 'Evening', 'No pattern']} value={timeOfDay} onChange={setTimeOfDay} accent={WEEKLY_ACCENT} />
      <SvChipRow label="PRIMARY DEVICE?" options={['Phone', 'Desktop', 'Both equally']} value={device} onChange={setDevice} accent={WEEKLY_ACCENT} />

      <SvSection title="CONTENT" />
      <SvRatingRow label="CLARITY" question="How clear is the content?" value={clarityRating} onChange={setClarityRating} accent={WEEKLY_ACCENT} />
      <SvRatingRow label="RELEVANCE" question="How useful to your actual work?" value={relevanceRating} onChange={setRelevanceRating} accent={WEEKLY_ACCENT} />
      <SvRatingRow label="QUIZ QUALITY" question="Is it testing the right things?" value={quizRating} onChange={setQuizRating} accent={WEEKLY_ACCENT} />
      <SvChipRow label="WHICH CATEGORY HAS BEEN MOST USEFUL?" options={SURVEY_CATS} value={mostUsefulCat} onChange={setMostUsefulCat} accent={WEEKLY_ACCENT} />
      <SvChipRow label="WHICH CATEGORY FEELS LEAST RELEVANT TO YOU?" options={[...SURVEY_CATS, 'Too early to say']} value={leastRelevantCat} onChange={setLeastRelevantCat} accent={WEEKLY_ACCENT} />
      <SvOpenText label="WHAT TOPICS DO YOU WANT TO SEE NEXT?" value={topicsWanted} onChange={setTopicsWanted} placeholder="No topic too niche." />
      <SvChipRow label="HAS ANYTHING YOU LEARNED COME UP IN YOUR ACTUAL WORK OR LIFE THIS WEEK?" options={['Yes - tell us', 'Not yet', "Doesn't apply"]} value={appliedLearning} onChange={setAppliedLearning} accent={WEEKLY_ACCENT} />
      {appliedLearning === 'Yes - tell us' && <SvOpenText value={appliedDetail} onChange={setAppliedDetail} placeholder="What happened?" />}

      <SvSection title="EXPERIENCE" />
      <SvChipRow label="HOW OFTEN DID YOU HIT FRICTION?" options={['Never', 'Once', 'A few times', 'Often']} value={frictionFreq} onChange={setFrictionFreq} accent={WEEKLY_ACCENT} />
      {frictionFreq && frictionFreq !== 'Never' && <SvOpenText value={frictionDetail} onChange={setFrictionDetail} placeholder="Describe it." />}
      <SvChipRow label="THE LEADERBOARD?" options={['Motivates me', 'Irrelevant', 'Creates pressure', "Haven't noticed it"]} value={leaderboard} onChange={setLeaderboard} accent={WEEKLY_ACCENT} />
      <SvChipRow label="DID THE DAILY REMINDER EMAIL REACH YOU?" options={['Yes', 'No', "Haven't seen one"]} value={emailReceived} onChange={setEmailReceived} accent={WEEKLY_ACCENT} />

      <SvSection title="POSITIONING" />
      <SvChipRow label='"ONE PERCENT" — DOES THE NAME RESONATE?' options={['Yes it clicks', "It's fine", 'Not really', 'I have a better idea']} value={nameResonate} onChange={setNameResonate} accent={WEEKLY_ACCENT} />
      {nameResonate === 'I have a better idea' && <SvOpenText value={nameSuggestion} onChange={setNameSuggestion} placeholder="What would you call it?" />}
      <SvOpenText label="HOW WOULD YOU DESCRIBE THIS APP TO A COLLEAGUE IN ONE SENTENCE?" value={pitch} onChange={setPitch} placeholder="Be natural." />
      <SvOpenText label="WHO SPECIFICALLY COMES TO MIND — WHO NEEDS THIS?" value={whoNeedsIt} onChange={setWhoNeedsIt} placeholder="Name, role, or type." />

      <SvSection title="SIGNAL" />
      <SvChipRow label="WOULD YOU KEEP USING THIS AFTER THE BETA?" options={['Definitely', 'Probably', 'Not sure', 'Probably not']} value={wouldContinue} onChange={setWouldContinue} accent={WEEKLY_ACCENT} />
      <SvOpenText label="WHAT WOULD MAKE YOU OPEN THE APP MORE CONSISTENTLY?" value={openMore} onChange={setOpenMore} placeholder="Be specific." />
      <SvOpenText label="ANYTHING ELSE?" value={anythingElse} onChange={setAnythingElse} placeholder="Optional." />

      <button onClick={submit} disabled={!coreReady || submitting} style={{
        width: '100%', padding: '14px 0', marginTop: 8,
        background: coreReady ? WEEKLY_ACCENT : '#1a1a1a', border: 'none', borderRadius: 4,
        fontSize: 11, fontWeight: 600, color: '#0a0a0a',
        cursor: coreReady ? 'pointer' : 'not-allowed', letterSpacing: '0.1em',
        fontFamily: "'Inter',sans-serif", opacity: submitting ? 0.6 : 1,
      }}>
        {submitting ? 'WRITING TO SUPABASE...' : 'SUBMIT & VERIFY WRITE'}
      </button>
    </div>
  )
}

// ── End of beta survey ───────────────────────────────────────────────────────
function EndOfBetaSurveyTest({ userId, onDone }) {
  const [overallRating, setOverallRating] = useState(0)
  const [perceptionChange, setPerceptionChange] = useState(null)
  const [whyStopped, setWhyStopped] = useState('')
  const [clarityRating, setClarityRating] = useState(0)
  const [relevanceRating, setRelevanceRating] = useState(0)
  const [quizRating, setQuizRating] = useState(0)
  const [mostValueCat, setMostValueCat] = useState(null)
  const [couldCutCat, setCouldCutCat] = useState(null)
  const [structureVerdict, setStructureVerdict] = useState(null)
  const [structureDetail, setStructureDetail] = useState('')
  const [commitment, setCommitment] = useState(null)
  const [topicToAdd, setTopicToAdd] = useState('')
  const [peakStreak, setPeakStreak] = useState(null)
  const [openDriver, setOpenDriver] = useState(null)
  const [skipReason, setSkipReason] = useState('')
  const [leaderboardEffect, setLeaderboardEffect] = useState(null)
  const [mustChange, setMustChange] = useState('')
  const [mustKeep, setMustKeep] = useState('')
  const [brokenThing, setBrokenThing] = useState('')
  const [devicePref, setDevicePref] = useState(null)
  const [nameVerdict, setNameVerdict] = useState(null)
  const [nameSuggestion, setNameSuggestion] = useState('')
  const [publicPitch, setPublicPitch] = useState('')
  const [notFor, setNotFor] = useState('')
  const [wouldPay, setWouldPay] = useState(null)
  const [priceRange, setPriceRange] = useState(null)
  const [wouldRefer, setWouldRefer] = useState(null)
  const [referDetail, setReferDetail] = useState('')
  const [launchModel, setLaunchModel] = useState(null)
  const [sixMonth, setSixMonth] = useState(0)
  const [toTen, setToTen] = useState('')
  const [biggestWin, setBiggestWin] = useState('')
  const [ifYouWereMe, setIfYouWereMe] = useState('')
  const [anythingElse, setAnythingElse] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const coreReady = overallRating && perceptionChange && clarityRating && relevanceRating && quizRating && mostValueCat && structureVerdict && commitment && peakStreak && openDriver && leaderboardEffect && mustChange && mustKeep && devicePref && nameVerdict && wouldPay && wouldRefer && launchModel && sixMonth && biggestWin && ifYouWereMe

  const submit = async () => {
    if (!coreReady) return
    setSubmitting(true)
    const parts = [
      perceptionChange && ('perception:' + perceptionChange),
      whyStopped && ('why_stopped:' + whyStopped),
      mostValueCat && ('most_value:' + mostValueCat),
      couldCutCat && ('could_cut:' + couldCutCat),
      structureVerdict && ('structure:' + structureVerdict),
      structureDetail && ('structure_detail:' + structureDetail),
      commitment && ('commitment:' + commitment),
      topicToAdd && ('topic_add:' + topicToAdd),
      peakStreak && ('peak_streak:' + peakStreak),
      openDriver && ('open_driver:' + openDriver),
      skipReason && ('skip_reason:' + skipReason),
      leaderboardEffect && ('leaderboard:' + leaderboardEffect),
      mustChange && ('must_change:' + mustChange),
      mustKeep && ('must_keep:' + mustKeep),
      brokenThing && ('broken:' + brokenThing),
      devicePref && ('device:' + devicePref),
      nameVerdict && ('name:' + nameVerdict),
      nameSuggestion && ('name_suggestion:' + nameSuggestion),
      publicPitch && ('pitch:' + publicPitch),
      notFor && ('not_for:' + notFor),
      wouldPay && ('would_pay:' + wouldPay),
      priceRange && ('price:' + priceRange),
      referDetail && ('refer_detail:' + referDetail),
      launchModel && ('launch_model:' + launchModel),
      sixMonth && ('six_month:' + sixMonth),
      toTen && ('to_ten:' + toTen),
      ifYouWereMe && ('if_you_were_me:' + ifYouWereMe),
    ].filter(Boolean)
    const { error } = await supabase.from('feedback').insert({
      user_id: userId,
      feedback_type: 'end_of_beta',
      overall_rating: overallRating,
      clarity_rating: clarityRating,
      topic_rating: relevanceRating,
      quiz_rating: quizRating,
      would_recommend: wouldRefer,
      missing_topics: parts.join(' | '),
      biggest_win: biggestWin || null,
      comment: anythingElse || null,
    })
    setSubmitting(false)
    setResult(error ? 'error' : 'ok')
    if (!error) setTimeout(onDone, 1500)
  }

  if (result === 'ok') return <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: BETA_ACCENT, letterSpacing: '0.08em' }}>checkmark WRITTEN TO SUPABASE</div>
  if (result === 'error') return <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: BETA_ACCENT }}>X INSERT FAILED</div>

  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: '0.2em', color: '#555', marginBottom: 6, fontWeight: 600 }}>END OF BETA — LIVE TEST</div>
      <div style={{ fontSize: 18, color: '#fff', fontWeight: 700, marginBottom: 6 }}>30 days in. Zoom out.</div>
      <div style={{ fontSize: 13, color: '#555', marginBottom: 28, lineHeight: 1.6 }}>This is the full debrief. Be specific — this one shapes v1.</div>

      <SvSection title="OVERALL" />
      <SvRatingRow label="OVERALL RATING" question="How would you rate One Percent?" value={overallRating} onChange={setOverallRating} accent={BETA_ACCENT} />
      <SvChipRow label="COMPARED TO DAY 1, HOW HAS YOUR PERCEPTION CHANGED?" options={['Much better', 'Somewhat better', 'About the same', 'Worse', 'I stopped using it']} value={perceptionChange} onChange={setPerceptionChange} accent={BETA_ACCENT} />
      {(perceptionChange === 'Worse' || perceptionChange === 'I stopped using it') && <SvOpenText value={whyStopped} onChange={setWhyStopped} placeholder="What happened?" />}

      <SvSection title="CONTENT AND DEPTH" />
      <SvRatingRow label="CLARITY" question="How clear was the content overall?" value={clarityRating} onChange={setClarityRating} accent={BETA_ACCENT} />
      <SvRatingRow label="RELEVANCE" question="How useful to your actual work?" value={relevanceRating} onChange={setRelevanceRating} accent={BETA_ACCENT} />
      <SvRatingRow label="QUIZ QUALITY" question="Was it testing the right things?" value={quizRating} onChange={setQuizRating} accent={BETA_ACCENT} />
      <SvChipRow label="WHICH CATEGORY DELIVERED THE MOST VALUE?" options={SURVEY_CATS} value={mostValueCat} onChange={setMostValueCat} accent={BETA_ACCENT} />
      <SvChipRow label="WHICH CATEGORY COULD BE CUT WITHOUT YOU NOTICING?" options={[...SURVEY_CATS, 'None']} value={couldCutCat} onChange={setCouldCutCat} accent={BETA_ACCENT} />
      <SvChipRow label="WAS THE MORNING BRIEF / MIDDAY REFRAME / EVENING QUIZ STRUCTURE RIGHT?" options={['Yes — keep it', 'Needs tweaks', 'Rethink it']} value={structureVerdict} onChange={setStructureVerdict} accent={BETA_ACCENT} />
      {structureVerdict && structureVerdict !== 'Yes — keep it' && <SvOpenText value={structureDetail} onChange={setStructureDetail} placeholder="What would you change?" />}
      <SvChipRow label="WAS 10 MINUTES THE RIGHT COMMITMENT?" options={['Too short', 'Just right', 'Too long', 'Inconsistent']} value={commitment} onChange={setCommitment} accent={BETA_ACCENT} />
      <SvOpenText label="WHAT TOPIC DO YOU MOST WANT ADDED BEFORE PUBLIC LAUNCH?" value={topicToAdd} onChange={setTopicToAdd} placeholder="Be specific." />

      <SvSection title="HABIT AND RETENTION" />
      <SvChipRow label="AT YOUR PEAK, HOW MANY DAYS IN A ROW DID YOU USE IT?" options={['1', '2-3', '4-6', '7+', 'Every day']} value={peakStreak} onChange={setPeakStreak} accent={BETA_ACCENT} />
      <SvChipRow label="BIGGEST DRIVER OF OPENING THE APP ON ANY GIVEN DAY?" options={['Reminder email', 'Habit', 'Curiosity', 'Streak', 'Nothing consistent']} value={openDriver} onChange={setOpenDriver} accent={BETA_ACCENT} />
      <SvOpenText label="BIGGEST REASON YOU SKIPPED A DAY?" value={skipReason} onChange={setSkipReason} placeholder="Honest answer." />
      <SvChipRow label="DID THE LEADERBOARD AFFECT YOUR BEHAVIOR?" options={['Yes — kept me coming back', 'Yes — made me feel behind', 'No effect', 'I ignored it']} value={leaderboardEffect} onChange={setLeaderboardEffect} accent={BETA_ACCENT} />

      <SvSection title="PRODUCT AND UX" />
      <SvOpenText label="ONE THING THAT NEEDS TO CHANGE BEFORE PUBLIC LAUNCH?" value={mustChange} onChange={setMustChange} placeholder="Non-negotiable." />
      <SvOpenText label="ONE THING YOU'D FIGHT TO KEEP EXACTLY AS IT IS?" value={mustKeep} onChange={setMustKeep} placeholder="Don't lose this." />
      <SvOpenText label="ANYTHING EVER FEEL BROKEN, CONFUSING, OR OUT OF PLACE?" value={brokenThing} onChange={setBrokenThing} placeholder="Optional but valuable." />
      <SvChipRow label="MOBILE OR DESKTOP — WHICH FELT BETTER?" options={['Mobile', 'Desktop', 'Equal', 'I only used one']} value={devicePref} onChange={setDevicePref} accent={BETA_ACCENT} />

      <SvSection title="POSITIONING AND NAME" />
      <SvChipRow label="ONE PERCENT — DOES THE NAME WORK FOR PUBLIC LAUNCH?" options={["Yes it's strong", "It's fine", 'No — needs work', 'I have a suggestion']} value={nameVerdict} onChange={setNameVerdict} accent={BETA_ACCENT} />
      {nameVerdict === 'I have a suggestion' && <SvOpenText value={nameSuggestion} onChange={setNameSuggestion} placeholder="What would you call it?" />}
      <SvOpenText label="HOW WOULD YOU PITCH THIS TO SOMEONE WHO'S NEVER HEARD OF IT?" value={publicPitch} onChange={setPublicPitch} placeholder="How you'd actually say it." />
      <SvOpenText label="WHAT KIND OF PERSON IS THIS NOT FOR?" value={notFor} onChange={setNotFor} placeholder="Be direct." />

      <SvSection title="GTM SIGNAL" />
      <SvChipRow label="WOULD YOU PAY FOR THIS?" options={['Yes', 'No', 'Depends on the price']} value={wouldPay} onChange={setWouldPay} accent={BETA_ACCENT} />
      {wouldPay === 'Yes' && <SvChipRow label="WHAT MONTHLY PRICE FEELS FAIR?" options={['Under $5', '$5-10', '$10-20', '$20+']} value={priceRange} onChange={setPriceRange} accent={BETA_ACCENT} />}
      <SvChipRow label="WOULD YOU REFER THIS TO SOMEONE SPECIFIC?" options={['Yes — who and why', 'No', 'Maybe']} value={wouldRefer} onChange={setWouldRefer} accent={BETA_ACCENT} />
      {wouldRefer === 'Yes — who and why' && <SvOpenText value={referDetail} onChange={setReferDetail} placeholder="Who and why?" />}
      <SvChipRow label="WHICH LAUNCH MODEL WOULD MAKE YOU MOST LIKELY TO SHARE IT?" options={['Free with premium tier', 'One-time purchase', 'Subscription', 'Free forever', "Doesn't matter"]} value={launchModel} onChange={setLaunchModel} accent={BETA_ACCENT} />
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#666', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 600 }}>HOW LIKELY ARE YOU TO STILL BE USING THIS IN 6 MONTHS? (1-10)</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <button key={n} onClick={() => setSixMonth(n)} style={{
              flex: 1, padding: '8px 0', borderRadius: 3,
              border: '1px solid ' + (sixMonth >= n ? BETA_ACCENT : '#222'),
              background: sixMonth >= n ? BETA_ACCENT + '22' : '#111',
              color: sixMonth >= n ? BETA_ACCENT : '#555',
              fontSize: 11, cursor: 'pointer', fontFamily: "'Inter',sans-serif",
            }}>{n}</button>
          ))}
        </div>
      </div>
      <SvOpenText label="WHAT WOULD HAVE TO BE TRUE FOR YOUR ANSWER TO BE A 10?" value={toTen} onChange={setToTen} placeholder="Specific is better." />

      <SvSection title="FINAL WORD" />
      <SvOpenText label="BIGGEST PERSONAL WIN FROM THE BETA" value={biggestWin} onChange={setBiggestWin} placeholder="Something you learned, used, or now think differently about." minHeight={80} />
      <SvOpenText label="IF YOU WERE ME, WHAT WOULD YOU DO NEXT?" value={ifYouWereMe} onChange={setIfYouWereMe} placeholder="Don't hold back." minHeight={80} />
      <SvOpenText label="ANYTHING ELSE." value={anythingElse} onChange={setAnythingElse} placeholder="Optional." />

      <button onClick={submit} disabled={!coreReady || submitting} style={{
        width: '100%', padding: '14px 0', marginTop: 8,
        background: coreReady ? BETA_ACCENT : '#1a1a1a', border: 'none', borderRadius: 4,
        fontSize: 11, fontWeight: 600, color: coreReady ? '#fff' : '#333',
        cursor: coreReady ? 'pointer' : 'not-allowed', letterSpacing: '0.1em',
        fontFamily: "'Inter',sans-serif", opacity: submitting ? 0.6 : 1,
      }}>
        {submitting ? 'WRITING TO SUPABASE...' : 'SUBMIT & VERIFY WRITE'}
      </button>
    </div>
  )
}


export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState([])
  const [bugs, setBugs] = useState([])
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState(null)
  const [tab, setTab] = useState('users')
  const [surveyTab, setSurveyTab] = useState('weekly') // sub-tab inside surveys
  const [emailSending, setEmailSending] = useState(false)
  const [emailResult, setEmailResult] = useState(null)
  const [surveyKey, setSurveyKey] = useState(0) // bump to reset survey form
  const [resetting, setResetting] = useState(null)
  const [resetConfirm, setResetConfirm] = useState(null) // 'data' | 'hard' per email key: `${email}-data` | `${email}-hard`
  const [expandedUser, setExpandedUser] = useState(null)
  const [userCompletions, setUserCompletions] = useState({})

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data: prof, error: profError } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).maybeSingle()
      console.log('[admin] profile fetch:', prof, profError)
      if (profError || !prof?.is_admin) { router.push('/'); return }

      setUserId(session.user.id)

      const [{ data: fb }, { data: br }, { data: us, error: usError }] = await Promise.all([
        supabase.from('feedback').select('*, profiles(email)').order('created_at', { ascending: false }),
        supabase.from('bug_reports').select('*, profiles(email)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, email, name, first_name, last_name, phone, signup_date, current_streak, longest_streak, last_active_date, onboarding_complete, is_admin, avatar_url').order('signup_date', { ascending: false }),
      ])

      console.log('[admin] users fetch:', us, usError)
      setFeedback(fb || [])
      setBugs(br || [])
      setUsers(us || [])

      // Fetch completions summary per user
      const { data: allCompletions } = await supabase.from('completions').select('user_id, completed_at')
      if (allCompletions) {
        const summary = {}
        allCompletions.forEach(c => {
          if (!summary[c.user_id]) summary[c.user_id] = { count: 0, lastDate: null }
          summary[c.user_id].count++
          if (!summary[c.user_id].lastDate || c.completed_at > summary[c.user_id].lastDate) {
            summary[c.user_id].lastDate = c.completed_at
          }
        })
        setUserCompletions(summary)
      }
      setLoading(false)
    }
    init()
  }, [router])

  const refreshUsers = async () => {
    const { data: us } = await supabase.from('profiles').select('id, email, name, first_name, last_name, phone, signup_date, current_streak, longest_streak, last_active_date, onboarding_complete, is_admin, avatar_url').order('signup_date', { ascending: false })
    setUsers(us || [])
  }

  const [refreshing, setRefreshing] = useState(false)

  const refreshAll = async () => {
    setRefreshing(true)
    const [{ data: fb, error: e1 }, { data: br, error: e2 }, { data: us, error: e3 }] = await Promise.all([
      supabase.from('feedback').select('*, profiles(email)').order('created_at', { ascending: false }),
      supabase.from('bug_reports').select('*, profiles(email)').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, email, name, first_name, last_name, phone, signup_date, current_streak, longest_streak, last_active_date, onboarding_complete, is_admin, avatar_url').order('signup_date', { ascending: false }),
    ])
    if (e1) console.error('feedback fetch:', e1)
    if (e2) console.error('bug_reports fetch:', e2)
    if (e3) console.error('profiles fetch:', e3)
    setFeedback(fb || [])
    setBugs(br || [])
    setUsers(us || [])
    const { data: allCompletions } = await supabase.from('completions').select('user_id, completed_at')
    if (allCompletions) {
      const summary = {}
      allCompletions.forEach(c => {
        if (!summary[c.user_id]) summary[c.user_id] = { count: 0, lastDate: null }
        summary[c.user_id].count++
        if (!summary[c.user_id].lastDate || c.completed_at > summary[c.user_id].lastDate) {
          summary[c.user_id].lastDate = c.completed_at
        }
      })
      setUserCompletions(summary)
    }
    setRefreshing(false)
  }

  // Data reset: wipe completions + feedback + streak — keeps account + onboarding
  const resetUserData = async (userId, email) => {
    setResetting(`${email}-data`)
    await Promise.all([
      supabase.from('completions').delete().eq('user_id', userId),
      supabase.from('feedback').delete().eq('user_id', userId),
      supabase.from('profiles').update({
        current_streak: 0,
        longest_streak: 0,
        last_active_date: null,
      }).eq('id', userId),
    ])
    setResetting(null)
    setResetConfirm(null)
    await refreshUsers()
  }

  // Hard reset: everything above + onboarding_complete = false + name = null
  // User will go through onboarding again on next login
  const hardResetUser = async (userId, email) => {
    setResetting(`${email}-hard`)
    await Promise.all([
      supabase.from('completions').delete().eq('user_id', userId),
      supabase.from('feedback').delete().eq('user_id', userId),
      supabase.from('bug_reports').delete().eq('user_id', userId),
      supabase.from('profiles').update({
        current_streak: 0,
        longest_streak: 0,
        last_active_date: null,
        onboarding_complete: false,
        name: null,
      }).eq('id', userId),
    ])
    setResetting(null)
    setResetConfirm(null)
    await refreshUsers()
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 11, color: '#666', letterSpacing: '0.2em', fontFamily: "'Inter',sans-serif" }}>LOADING...</div>
    </div>
  )

  const stars = n => n ? '★'.repeat(n) + '☆'.repeat(5 - n) : '—'
  const timeAgo = ts => {
    const diff = Date.now() - new Date(ts)
    const h = Math.floor(diff / 3600000)
    if (h < 1) return 'just now'
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  const postEntryFb = feedback.filter(f => f.feedback_type === 'post_entry')
  const weeklyFb = feedback.filter(f => f.feedback_type === 'weekly')
  const landingFb = feedback.filter(f => f.feedback_type === 'landing')
  const endOfBetaFb = feedback.filter(f => f.feedback_type === 'end_of_beta' || f.feedback_type === 'final')
  const entryNums = [...new Set(postEntryFb.map(f => f.entry_number))].sort()

  const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : '—'
  const bar = val => {
    if (!val || val === '—') return '—'
    const filled = Math.round(val)
    return '█'.repeat(filled) + '░'.repeat(5 - filled) + ' ' + val
  }


  return (
    <div style={{ minHeight: '100vh', background: '#dadada', fontFamily: "'Inter',sans-serif", color: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .admin-tabs::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Row 1 — wordmark */}
        <div style={{ padding: '20px 24px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, letterSpacing: '0.22em', fontWeight: 600, color: '#0a0a0a' }}>ONE PERCENT</span>
            <span style={{ fontSize: 9, background: '#1a1a1a', color: '#47FFE8', border: '1px solid #47FFE866', borderRadius: 3, padding: '2px 7px', letterSpacing: '0.1em', fontWeight: 600 }}>ADMIN</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={refreshAll} disabled={refreshing} style={{ background: '#1a1a1a', border: '1px solid #1a1a1a', borderRadius: 6, padding: '6px 12px', fontSize: 9, color: '#47FFE8', cursor: refreshing ? 'default' : 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", opacity: refreshing ? 0.5 : 1, fontWeight: 700 }}>{refreshing ? '...' : '↻ REFRESH'}</button>
            <button onClick={() => router.push('/')} style={{ background: '#1a1a1a', border: '1px solid #1a1a1a', borderRadius: 6, padding: '6px 12px', fontSize: 9, color: '#ccc', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", fontWeight: 500 }}>← LIBRARY</button>
          </div>
        </div>

        {/* Row 2 — tab bar (dark pill, matches library) */}
        <div style={{ padding: '0 24px 10px' }}>
          <div className="admin-tabs" style={{
            background: '#1e1e1e', borderRadius: 8, padding: '4px',
            display: 'flex', alignItems: 'center', gap: 0,
            overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
          }}>
            {[
              ['users', 'USERS'],
              ['bugs', 'BUGS'],
              ['feedback', 'POST-LESSON'],
              ['instant', 'INSTANT'],
              ['weekly', 'WEEKLY'],
              ['endbeta', 'END OF BETA'],
              ['leaderboard', 'LEADERBOARD'],
              ['surveys', 'SURVEYS ↗'],
              ['email', 'EMAIL'],
            ].map(([id, label]) => {
              const active = tab === id
              return (
                <button key={id} onClick={() => setTab(id)} style={{
                  background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                  border: 'none', borderRadius: 6,
                  padding: '7px 12px', fontSize: 9,
                  color: active ? '#fff' : '#bbb',
                  cursor: 'pointer', letterSpacing: '0.08em',
                  fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap',
                  flexShrink: 0, fontWeight: active ? 500 : 400,
                  transition: 'all 0.15s ease',
                }}>{label}</button>
              )
            })}
          </div>
        </div>

      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px 24px 0' }}>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
          {[
            { label: 'USERS', value: users.length },
            { label: 'ENTRY FB', value: postEntryFb.length },
            { label: 'WEEKLY', value: weeklyFb.length },
            { label: 'END OF BETA', value: endOfBetaFb.length },
            { label: 'INSTANT', value: landingFb.length },
            { label: 'BUGS', value: bugs.length },
          ].map(s => (
            <div key={s.label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 4, padding: '14px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 8, color: '#888', letterSpacing: '0.1em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Entry feedback tab */}
        {tab === 'feedback' && (
          <div>
            <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>
              POST-LESSON RATINGS — {postEntryFb.length} SUBMISSIONS ACROSS {entryNums.length} ENTRIES
            </div>
            {postEntryFb.length === 0 && <div style={{ fontSize: 13, color: '#666', padding: '24px 0' }}>No entry feedback yet.</div>}
            {entryNums.map(num => {
              const rows = postEntryFb.filter(f => f.entry_number === num)
              return (
                <div key={num} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: 20, marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: '#47FFE8', letterSpacing: '0.15em', marginBottom: 14, fontWeight: 600 }}>ENTRY {num} — {rows.length} RATING{rows.length !== 1 ? 'S' : ''}</div>
                  {/* Aggregate */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                    {[
                      ['TOPIC AVG', avg(rows.map(r => r.topic_rating).filter(Boolean))],
                      ['CONTENT AVG', avg(rows.map(r => r.clarity_rating).filter(Boolean))],
                      ['QUIZ AVG', avg(rows.map(r => r.quiz_rating).filter(Boolean))],
                    ].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', marginBottom: 4 }}>{l}</div>
                        <div style={{ fontSize: 13, color: '#47FFE8', fontFamily: 'monospace' }}>{bar(v)}</div>
                      </div>
                    ))}
                  </div>
                  {/* Individual submissions */}
                  <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {rows.map((f, i) => (
                      <div key={f.id || i} style={{ background: '#0a0a0a', borderRadius: 4, padding: '10px 12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: f.comment ? 8 : 0 }}>
                          <span style={{ fontSize: 11, color: '#bbb', fontWeight: 500 }}>{f.profiles?.email || 'Unknown'}</span>
                          <span style={{ fontSize: 10, color: '#666' }}>{timeAgo(f.created_at)}</span>
                        </div>
                        {f.comment && <div style={{ fontSize: 12, color: '#888', lineHeight: 1.6, paddingLeft: 8, borderLeft: '2px solid #222' }}>{f.comment}</div>}
                        {f.image_url && <a href={f.image_url} target="_blank" rel="noopener noreferrer"><img src={f.image_url} alt="screenshot" style={{ marginTop: 8, maxWidth: '100%', maxHeight: 160, borderRadius: 4, border: '1px solid #333', objectFit: 'cover', display: 'block' }} /></a>}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Weekly tab */}
        {tab === 'weekly' && (
          <div>
            <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>WEEKLY CHECK-INS ({weeklyFb.length})</div>
            {weeklyFb.length === 0 && <div style={{ fontSize: 13, color: '#666', padding: '24px 0' }}>No weekly feedback yet.</div>}
            {weeklyFb.map(f => (
              <div key={f.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 11, color: '#bbb', fontWeight: 500 }}>{f.profiles?.email || 'Unknown'}</span>
                  <span style={{ fontSize: 10, color: '#666' }}>{timeAgo(f.created_at)}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                  {[['Clarity', f.clarity_rating], ['Relevance', f.topic_rating], ['Quiz', f.quiz_rating]].map(([l, r]) => (
                    <div key={l}>
                      <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', marginBottom: 4 }}>{l.toUpperCase()}</div>
                      <div style={{ fontSize: 13, color: '#47FFE8' }}>{stars(r)}</div>
                    </div>
                  ))}
                </div>
                {f.would_recommend && <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Recommend: <span style={{ color: '#fff' }}>{f.would_recommend}</span></div>}
                {f.biggest_win && <div style={{ background: '#0a0a0a', borderRadius: 4, padding: '10px 12px', marginBottom: 8, fontSize: 12, color: '#bbb', lineHeight: 1.6 }}><span style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>BIGGEST WIN</span>{f.biggest_win}</div>}
                {f.missing_topics && <div style={{ background: '#0a0a0a', borderRadius: 4, padding: '10px 12px', fontSize: 12, color: '#bbb', lineHeight: 1.6 }}><span style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>MISSING / CHANGE</span>{f.missing_topics}</div>}
              </div>
            ))}
          </div>
        )}

        {/* End of beta tab */}
        {tab === 'endbeta' && (
          <div>
            <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>END OF BETA SURVEYS ({endOfBetaFb.length})</div>
            {endOfBetaFb.length === 0 && <div style={{ fontSize: 13, color: '#666', padding: '24px 0' }}>No end-of-beta feedback yet.</div>}
            {endOfBetaFb.map(f => (
              <div key={f.id} style={{ background: '#111', border: '1px solid #FF477822', borderRadius: 6, padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 11, color: '#bbb', fontWeight: 500 }}>{f.profiles?.email || 'Unknown'}</span>
                  <span style={{ fontSize: 10, color: '#666' }}>{timeAgo(f.created_at)}</span>
                </div>
                {f.overall_rating && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', marginBottom: 4 }}>OVERALL</div>
                    <div style={{ fontSize: 13, color: '#FF4778' }}>{stars(f.overall_rating)}</div>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                  {[['Clarity', f.clarity_rating], ['Relevance', f.topic_rating], ['Quiz', f.quiz_rating]].map(([l, r]) => r ? (
                    <div key={l}>
                      <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', marginBottom: 4 }}>{l.toUpperCase()}</div>
                      <div style={{ fontSize: 13, color: '#FF4778' }}>{stars(r)}</div>
                    </div>
                  ) : null)}
                </div>
                {f.would_recommend && <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Recommend: <span style={{ color: '#fff' }}>{f.would_recommend}</span></div>}
                {f.biggest_win && <div style={{ background: '#0a0a0a', borderRadius: 4, padding: '10px 12px', marginBottom: 8, fontSize: 12, color: '#bbb', lineHeight: 1.6 }}><span style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>BIGGEST WIN</span>{f.biggest_win}</div>}
                {f.missing_topics && <div style={{ background: '#0a0a0a', borderRadius: 4, padding: '10px 12px', marginBottom: 8, fontSize: 12, color: '#bbb', lineHeight: 1.6 }}><span style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>MISSING / CHANGE</span>{f.missing_topics}</div>}
                {f.comment && <div style={{ background: '#0a0a0a', borderRadius: 4, padding: '10px 12px', fontSize: 12, color: '#bbb', lineHeight: 1.6 }}><span style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>COMMENT</span>{f.comment}</div>}
                {f.image_url && <a href={f.image_url} target="_blank" rel="noopener noreferrer"><img src={f.image_url} alt="screenshot" style={{ marginTop: 8, maxWidth: '100%', maxHeight: 160, borderRadius: 4, border: '1px solid #333', objectFit: 'cover', display: 'block' }} /></a>}
              </div>
            ))}
          </div>
        )}

        {/* Instant/landing feedback tab */}
        {tab === 'instant' && (
          <div>
            <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>INSTANT FEEDBACK ({landingFb.length})</div>
            {landingFb.length === 0 && <div style={{ fontSize: 13, color: '#666', padding: '24px 0' }}>No instant feedback yet.</div>}
            {landingFb.map(f => (
              <div key={f.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: '16px 20px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: f.comment ? 8 : 0 }}>
                    <span style={{ fontSize: 11, color: '#bbb', fontWeight: 500 }}>{f.profiles?.email || 'Unknown'}</span>
                    {f.overall_rating && <span style={{ fontSize: 12, color: '#47FFE8' }}>{f.overall_rating}/5</span>}
                  </div>
                  {f.comment && <div style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>{f.comment}</div>}
                  {f.image_url && <a href={f.image_url} target="_blank" rel="noopener noreferrer"><img src={f.image_url} alt="screenshot" style={{ marginTop: 8, maxWidth: '100%', maxHeight: 160, borderRadius: 4, border: '1px solid #333', objectFit: 'cover', display: 'block' }} /></a>}
                </div>
                <span style={{ fontSize: 10, color: '#666', flexShrink: 0 }}>{timeAgo(f.created_at)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bugs tab */}
        {tab === 'bugs' && (
          <div>
            <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>BUG REPORTS ({bugs.length})</div>
            {bugs.length === 0 && <div style={{ fontSize: 13, color: '#666', padding: '24px 0' }}>No bugs reported. 🎉</div>}
            {bugs.map(b => (
              <div key={b.id} style={{ background: '#111', border: '1px solid #FF417822', borderRadius: 6, padding: '16px 20px', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, background: '#FF417822', color: '#FF4778', padding: '2px 7px', borderRadius: 3, letterSpacing: '0.08em' }}>{b.page}</span>
                    <span style={{ fontSize: 11, color: '#bbb', fontWeight: 500 }}>{b.profiles?.email || 'Unknown'}</span>
                  </div>
                  <span style={{ fontSize: 10, color: '#666' }}>{timeAgo(b.created_at)}</span>
                </div>
                <div style={{ fontSize: 13, color: '#bbb', lineHeight: 1.6 }}>{b.description}</div>
                {b.image_url && <a href={b.image_url} target="_blank" rel="noopener noreferrer"><img src={b.image_url} alt="screenshot" style={{ marginTop: 10, maxWidth: '100%', maxHeight: 200, borderRadius: 4, border: '1px solid #333', objectFit: 'cover', display: 'block' }} /></a>}
              </div>
            ))}
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          <div>
            <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>USERS ({users.length})</div>

            {users.map(u => {
              const isExpanded = expandedUser === u.email
              const comp = userCompletions[u.id] || { count: 0, lastDate: null }
              const displayName = u.first_name || u.last_name
                ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
                : u.name || '—'

              // Compute feedback counts from global feedback array
              const userFb = feedback.filter(f => f.user_id === u.id)
              const userBugs = bugs.filter(b => b.user_id === u.id)
              const surveysCompleted = userFb.filter(f => ['weekly', 'end_of_beta'].includes(f.feedback_type)).length
              const instantFb = userFb.filter(f => f.feedback_type === 'instant').length
              const bugsReported = userBugs.length

              // Compute badge count from profile data
              const ctx = { completedCount: comp.count, longestStreak: u.longest_streak || 0, onboarded: !!u.onboarding_complete }
              let badgeCount = 0
              if (ctx.onboarded) badgeCount++                        // Founder's Club
              if (ctx.completedCount >= 1) badgeCount++              // First Step
              if (ctx.completedCount >= 7) badgeCount++              // Perfect Week
              if (ctx.completedCount >= 10) badgeCount++             // Ten Deep
              if (ctx.completedCount >= 25) badgeCount++             // Quarter Century
              if (ctx.longestStreak >= 3) badgeCount++               // 3-Day Streak
              if (ctx.longestStreak >= 7) badgeCount++               // Week Strong
              if (ctx.longestStreak >= 30) badgeCount++              // Monthly
              // perfect_score and all_cats need deeper data — skip in admin approximation

              const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

              return (
                <div key={u.email} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, marginBottom: 8, overflow: 'hidden' }}>

                  {/* Collapsed — name, email, lesson count pill */}
                  <div
                    onClick={() => setExpandedUser(isExpanded ? null : u.email)}
                    style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', userSelect: 'none' }}
                  >
                    <div style={{ fontSize: 16, color: '#444', flexShrink: 0, lineHeight: 1, fontWeight: 300 }}>{isExpanded ? '−' : '+'}</div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{displayName}</span>
                        {u.is_admin && <span style={{ fontSize: 9, background: '#47FFE822', color: '#47FFE8', border: '1px solid #47FFE844', borderRadius: 2, padding: '1px 5px', letterSpacing: '0.1em' }}>ADMIN</span>}
                        {!u.onboarding_complete && <span style={{ fontSize: 9, background: '#FF477822', color: '#FF4778', border: '1px solid #FF477844', borderRadius: 2, padding: '1px 5px', letterSpacing: '0.1em' }}>NOT ONBOARDED</span>}
                      </div>
                      <div style={{ fontSize: 10, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                    </div>

                    {/* Single right-side stat: lessons */}
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', marginBottom: 2 }}>LESSONS</div>
                      <div style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>{comp.count}<span style={{ fontSize: 11, color: '#555', fontWeight: 400 }}>/{TOTAL_ENTRIES}</span></div>
                    </div>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid #1a1a1a', padding: '16px 20px' }}>

                      {/* Stats grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #1a1a1a' }}>
                        {[
                          { label: 'ONBOARDED', value: fmt(u.signup_date) },
                          { label: 'LAST SIGN IN', value: fmt(u.last_active_date) },
                          { label: 'LAST LESSON', value: fmt(comp.lastDate), highlight: !!comp.lastDate },
                          { label: 'STREAK', value: u.current_streak || 0 },
                          { label: 'BEST STREAK', value: u.longest_streak || 0 },
                          { label: 'BADGES', value: `${badgeCount}/10` },
                          { label: 'SURVEYS', value: surveysCompleted },
                          { label: 'INSTANT FB', value: instantFb },
                          { label: 'BUGS', value: bugsReported },
                          { label: 'PHONE', value: u.phone || '—' },
                        ].map(s => (
                          <div key={s.label}>
                            <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', marginBottom: 3 }}>{s.label}</div>
                            <div style={{ fontSize: 12, color: s.highlight ? '#47FFE8' : '#888', fontWeight: s.highlight ? 600 : 400 }}>{s.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {resetConfirm === `${u.email}-data` ? (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                            <span style={{ fontSize: 11, color: '#888', flex: 1 }}>Delete completions + feedback. Keeps account + onboarding.</span>
                            <button onClick={() => resetUserData(u.id, u.email)} disabled={resetting === `${u.email}-data`} style={{ padding: '6px 14px', background: '#FF417822', border: '1px solid #FF417844', borderRadius: 3, fontSize: 10, color: '#FF4778', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", opacity: resetting === `${u.email}-data` ? 0.5 : 1 }}>
                              {resetting === `${u.email}-data` ? 'RESETTING...' : 'CONFIRM'}
                            </button>
                            <button onClick={() => setResetConfirm(null)} style={{ padding: '6px 12px', background: 'none', border: '1px solid #222', borderRadius: 3, fontSize: 10, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>CANCEL</button>
                          </div>
                        ) : resetConfirm === `${u.email}-hard` ? (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                            <span style={{ fontSize: 11, color: '#FF4778', flex: 1 }}>Wipe everything. User re-experiences onboarding on next login.</span>
                            <button onClick={() => hardResetUser(u.id, u.email)} disabled={resetting === `${u.email}-hard`} style={{ padding: '6px 14px', background: '#FF417844', border: '1px solid #FF4778', borderRadius: 3, fontSize: 10, color: '#FF4778', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", fontWeight: 600, opacity: resetting === `${u.email}-hard` ? 0.5 : 1 }}>
                              {resetting === `${u.email}-hard` ? 'RESETTING...' : 'CONFIRM HARD RESET'}
                            </button>
                            <button onClick={() => setResetConfirm(null)} style={{ padding: '6px 12px', background: 'none', border: '1px solid #222', borderRadius: 3, fontSize: 10, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>CANCEL</button>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => setResetConfirm(`${u.email}-data`)} style={{ padding: '6px 14px', background: 'none', border: '1px solid #222', borderRadius: 3, fontSize: 10, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>RESET DATA</button>
                            <button onClick={() => setResetConfirm(`${u.email}-hard`)} style={{ padding: '6px 14px', background: 'none', border: '1px solid #FF417844', borderRadius: 3, fontSize: 10, color: '#FF4778', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>HARD RESET</button>
                            <button
                              onClick={async () => {
                                const btn = document.getElementById(`welcome-${u.id}`)
                                if (btn) { btn.textContent = 'SENDING...'; btn.disabled = true }
                                try {
                                  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-welcome-email`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ first_name: u.first_name || u.name || 'there', email: u.email }) })
                                  if (btn) { btn.textContent = res.ok ? '✓ SENT' : '✗ FAILED'; btn.style.color = res.ok ? '#4ade80' : '#f87171' }
                                } catch { if (btn) { btn.textContent = '✗ ERROR'; btn.style.color = '#f87171' } }
                                setTimeout(() => { if (btn) { btn.textContent = 'WELCOME EMAIL'; btn.disabled = false; btn.style.color = '#47FFE8' } }, 3000)
                              }}
                              id={`welcome-${u.id}`}
                              style={{ padding: '6px 14px', background: 'none', border: '1px solid #47FFE844', borderRadius: 3, fontSize: 10, color: '#47FFE8', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>
                              WELCOME EMAIL
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Leaderboard tab — all users including admins, emails visible */}
        {tab === 'leaderboard' && (() => {
          const formatSpeed = (s) => {
            if (!s || s >= 99999) return '—'
            if (s < 60) return `${Math.round(s)}s`
            return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`
          }

          // Aggregate completions and feedback per user
          const enriched = users.map(u => {
            const comps = [] // completions not available in admin state — show what we have from profiles
            const total_score = 0
            return u
          })

          // Build rows from users + feedback data
          const rows = users.map(u => {
            const name = u.first_name
              ? `${u.first_name}${u.last_name ? ' ' + u.last_name : ''}`
              : u.name || u.email
            const userFb = feedback.filter(f => f.user_id === u.id)
            const commentCount = userFb.filter(f => f.comment && f.comment.trim().length > 0).length
            return {
              ...u,
              displayName: name,
              commentCount,
            }
          }).sort((a, b) => (b.current_streak || 0) - (a.current_streak || 0))

          return (
            <div>
              <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.15em', marginBottom: 4, fontWeight: 600 }}>LEADERBOARD — ALL USERS</div>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 20, lineHeight: 1.6 }}>Full view including admins. Emails visible. Sorted by streak.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rows.map((u, i) => (
                  <div key={u.id} style={{ background: '#111', border: `1px solid ${u.is_admin ? '#47FFE822' : '#1a1a1a'}`, borderRadius: 6, padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {u.avatar_url
                          ? <img src={u.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1px solid #222' }} />
                          : <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a1a1a', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>
                        }
                        <div>
                          <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>
                            {u.displayName}
                            {u.is_admin && <span style={{ fontSize: 9, background: '#47FFE822', color: '#47FFE8', border: '1px solid #47FFE844', borderRadius: 2, padding: '1px 5px', letterSpacing: '0.1em', marginLeft: 8 }}>ADMIN</span>}
                          </div>
                          <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>{u.email}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: '#444', flexShrink: 0 }}>#{i + 1}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                      {[
                        { label: 'STREAK', value: `🔥 ${u.current_streak || 0}`, color: '#FF8C47' },
                        { label: 'BEST', value: `${u.longest_streak || 0} days`, color: '#C847FF' },
                        { label: 'COMMENTS', value: u.commentCount, color: '#FF8C00' },
                        { label: 'LAST ACTIVE', value: u.last_active_date || '—', color: '#666' },
                      ].map(s => (
                        <div key={s.label} style={{ background: '#0a0a0a', borderRadius: 4, padding: '10px 10px' }}>
                          <div style={{ fontSize: 8, color: '#444', letterSpacing: '0.1em', marginBottom: 4 }}>{s.label}</div>
                          <div style={{ fontSize: 12, color: s.color, fontWeight: 500 }}>{s.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

        {/* Surveys tab — live testable forms */}
        {tab === 'surveys' && (
          <div>
            <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.15em', marginBottom: 4, fontWeight: 600 }}>SURVEY TEST LAB</div>
            <div style={{ fontSize: 12, color: '#555', marginBottom: 20, lineHeight: 1.6 }}>Fill and submit each form to verify it writes correctly to Supabase. Submissions appear in their respective tabs immediately after. Hit RESET to clear and test again.</div>

            {/* Sub-tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {[['weekly', 'WEEKLY CHECK-IN', '#47FFE8'], ['endbeta', 'END OF BETA', '#FF4778']].map(([id, label, color]) => (
                <button key={id} onClick={() => { setSurveyTab(id); setSurveyKey(k => k + 1) }} style={{
                  padding: '8px 16px', borderRadius: 4, border: `1px solid ${surveyTab === id ? color : '#222'}`,
                  background: surveyTab === id ? `${color}11` : 'none', color: surveyTab === id ? color : '#555',
                  fontSize: 11, cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", fontWeight: 500,
                }}>{label}</button>
              ))}
            </div>

            <div style={{ background: '#111', border: `1px solid ${surveyTab === 'weekly' ? '#47FFE822' : '#FF477822'}`, borderRadius: 8, padding: 28 }}>
              {surveyTab === 'weekly' && (
                <WeeklySurveyTest
                  key={surveyKey}
                  userId={userId}
                  onDone={() => setSurveyKey(k => k + 1)}
                />
              )}
              {surveyTab === 'endbeta' && (
                <EndOfBetaSurveyTest
                  key={surveyKey}
                  userId={userId}
                  onDone={() => setSurveyKey(k => k + 1)}
                />
              )}
            </div>

            <button onClick={() => setSurveyKey(k => k + 1)} style={{ marginTop: 16, background: 'none', border: '1px solid #222', borderRadius: 4, padding: '8px 16px', fontSize: 10, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>
              ↺ RESET FORM
            </button>
          </div>
        )}

        {/* Email tab */}
        {tab === 'email' && (
          <div>
            <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.15em', marginBottom: 4, fontWeight: 600 }}>EMAIL REMINDERS</div>
            <div style={{ fontSize: 12, color: '#555', marginBottom: 24, lineHeight: 1.6 }}>
              Manually trigger the daily reminder email. Sends to all users with onboarding complete who haven't completed an entry today. Smart-send logic applies — no duplicates.
            </div>

            {/* Recipient preview */}
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: 8, padding: '20px 24px', marginBottom: 24 }}>
              <div style={{ fontSize: 10, color: '#555', letterSpacing: '0.15em', marginBottom: 12, fontWeight: 600 }}>CURRENT RECIPIENTS</div>
              {users.filter(u => u.onboarding_complete).map(u => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: 12, color: '#ccc' }}>{u.first_name || u.name || 'Unknown'}</div>
                  <div style={{ fontSize: 11, color: '#555' }}>{u.email}</div>
                </div>
              ))}
            </div>

            {/* Send button */}
            <button
              onClick={async () => {
                setEmailSending(true)
                setEmailResult(null)
                try {
                  const res = await fetch('https://uuzdlubbynavybttlmeh.supabase.co/functions/v1/send-daily-reminder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({}),
                  })
                  const data = await res.json()
                  setEmailResult(data)
                } catch (e) {
                  setEmailResult({ error: e.message })
                } finally {
                  setEmailSending(false)
                }
              }}
              disabled={emailSending}
              style={{
                background: emailSending ? '#1a1a1a' : '#f0f0f0',
                border: 'none', borderRadius: 4,
                padding: '13px 28px', fontSize: 11, fontWeight: 700,
                color: emailSending ? '#333' : '#0a0a0a',
                cursor: emailSending ? 'not-allowed' : 'pointer',
                letterSpacing: '0.1em', fontFamily: "'Inter',sans-serif",
                transition: 'all 0.15s',
              }}
            >
              {emailSending ? 'SENDING...' : '✉ SEND DAILY REMINDER'}
            </button>

            {/* Result */}
            {emailResult && (
              <div style={{ marginTop: 20, background: '#111', border: `1px solid ${emailResult.error ? '#f8717133' : '#4ade8033'}`, borderRadius: 6, padding: '16px 20px' }}>
                {emailResult.error ? (
                  <div style={{ fontSize: 12, color: '#f87171' }}>Error: {emailResult.error}</div>
                ) : (
                  <div style={{ fontSize: 12, color: '#4ade80', lineHeight: 1.8 }}>
                    ✓ Sent: {emailResult.sent} &nbsp;·&nbsp; Skipped (already done today): {emailResult.skipped} &nbsp;·&nbsp; Total eligible: {emailResult.total}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  )
}
