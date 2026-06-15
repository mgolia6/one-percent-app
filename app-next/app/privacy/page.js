'use client'

import { useRouter } from 'next/navigation'

const EFFECTIVE_DATE = 'June 15, 2026'
const CONTACT_EMAIL = 'matthew@mpgink.com'

const Section = ({ title, children }) => (
  <div style={{ background: '#1a2a3a', borderRadius: 10, padding: '24px 28px', marginBottom: 12 }}>
    <div style={{ fontSize: 9, color: 'rgba(232,238,245,0.35)', letterSpacing: '0.18em', fontWeight: 600, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>{title}</div>
    <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.6)', lineHeight: 1.8, fontWeight: 300 }}>
      {children}
    </div>
  </div>
)

const P = ({ children }) => <p style={{ marginBottom: 12 }}>{children}</p>
const Li = ({ children }) => (
  <div style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
    <div style={{ color: '#47FFE8', fontSize: 10, marginTop: 4, flexShrink: 0 }}>•</div>
    <div>{children}</div>
  </div>
)

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: '#0e141c', fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Header */}
        <div style={{ padding: '20px 0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, letterSpacing: '0.22em', fontWeight: 600, color: '#e8eef5', fontFamily: "'DM Mono', monospace" }}>ONE PERCENT</span>
          <button
            onClick={() => router.back()}
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, padding: '7px 12px', fontSize: 9, color: 'rgba(232,238,245,0.5)', cursor: 'pointer', letterSpacing: '0.1em', fontFamily: "'DM Mono', monospace" }}
          >
            ← BACK
          </button>
        </div>

        {/* Hero */}
        <div style={{ background: '#1a2a3a', borderRadius: 10, padding: '32px 28px', marginBottom: 12 }}>
          <div style={{ fontSize: 9, color: '#47FFE8', letterSpacing: '0.18em', fontWeight: 600, marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>PRIVACY POLICY</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: '#e8eef5', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 12 }}>
            What we collect.<br />How we use it.<br />What we don't do.
          </div>
          <div style={{ fontSize: 12, color: 'rgba(232,238,245,0.4)', fontFamily: "'DM Mono', monospace", letterSpacing: '0.04em' }}>
            Effective {EFFECTIVE_DATE} · One Percent by mpgink
          </div>
        </div>

        <Section title="THE SHORT VERSION">
          <P>One Percent is a solo-built daily learning app in closed beta. We collect only what's necessary to make the app work and improve it. We don't sell your data. We don't share it with advertisers. We never will.</P>
          <P>If you have questions, email <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#47FFE8', textDecoration: 'none' }}>{CONTACT_EMAIL}</a>.</P>
        </Section>

        <Section title="WHAT WE COLLECT">
          <P>When you sign up and use One Percent, we collect:</P>
          <Li><strong style={{ color: '#e8eef5', fontWeight: 500 }}>Account information</strong> — your email address, first name, last name, and optionally your phone number. Email is required for login. Everything else is optional.</Li>
          <Li><strong style={{ color: '#e8eef5', fontWeight: 500 }}>Learning activity</strong> — which entries you've completed, your quiz scores, time spent, and streak data. This is what powers your Progress tab.</Li>
          <Li><strong style={{ color: '#e8eef5', fontWeight: 500 }}>Goal data</strong> — the commitment you set in the app (what you want to change, by when, and how you'll know). Stored on your profile, visible only to you.</Li>
          <Li><strong style={{ color: '#e8eef5', fontWeight: 500 }}>Feedback and bug reports</strong> — anything you submit via the Feedback or Bug buttons. This includes any screenshots you choose to attach.</Li>
          <Li><strong style={{ color: '#e8eef5', fontWeight: 500 }}>Usage analytics</strong> — anonymized event data (e.g. which entries are opened, funnel drop-off) via PostHog. No personally identifiable information is attached to these events beyond your user ID.</Li>
          <Li><strong style={{ color: '#e8eef5', fontWeight: 500 }}>Profile photo</strong> — if you choose to upload one. Stored in Supabase Storage, visible only to you in the app.</Li>
        </Section>

        <Section title="HOW WE USE IT">
          <Li>To run the app — unlock entries, track your streak, display your progress, send daily reminder emails.</Li>
          <Li>To improve the app — aggregate usage patterns help us understand what's working and what isn't. No individual behavior is sold or shared.</Li>
          <Li>To communicate with you — email reminders, weekly wrap-ups, and occasional product updates. You can turn email reminders off at any time from your Account page.</Li>
          <Li>To respond to feedback — if you report a bug or submit feedback, we may follow up by email.</Li>
        </Section>

        <Section title="WHAT WE DON'T DO">
          <Li>We don't sell your data. Not now, not ever.</Li>
          <Li>We don't share your data with advertisers or data brokers.</Li>
          <Li>We don't show you ads.</Li>
          <Li>We don't use your data to train AI models.</Li>
          <Li>We don't track you across other websites or apps.</Li>
        </Section>

        <Section title="DATA STORAGE & SECURITY">
          <P>Your data is stored in Supabase (PostgreSQL), hosted on AWS infrastructure in the US. Supabase enforces row-level security — you can only access your own data. All connections are encrypted in transit via HTTPS.</P>
          <P>Email delivery is handled by Resend. Analytics are handled by PostHog, configured with autocapture disabled and minimal data collection.</P>
        </Section>

        <Section title="DATA RETENTION & DELETION">
          <P>Your data is retained for as long as your account is active. If you want your account and all associated data deleted, email <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#47FFE8', textDecoration: 'none' }}>{CONTACT_EMAIL}</a> with the subject line "Delete my account." We'll confirm deletion within 5 business days.</P>
          <P>During closed beta, account deletion requests are handled manually. A self-serve deletion option will be available before public launch.</P>
        </Section>

        <Section title="THIRD-PARTY SERVICES">
          <P>One Percent uses the following third-party services to operate:</P>
          <Li><strong style={{ color: '#e8eef5', fontWeight: 500 }}>Supabase</strong> — database, authentication, and file storage</Li>
          <Li><strong style={{ color: '#e8eef5', fontWeight: 500 }}>Vercel</strong> — hosting and deployment</Li>
          <Li><strong style={{ color: '#e8eef5', fontWeight: 500 }}>Resend</strong> — transactional email delivery</Li>
          <Li><strong style={{ color: '#e8eef5', fontWeight: 500 }}>PostHog</strong> — anonymized product analytics</Li>
          <P style={{ marginTop: 12 }}>Each of these services has its own privacy policy. We chose them because they're credible, have strong security practices, and don't resell user data.</P>
        </Section>

        <Section title="YOUR RIGHTS">
          <P>You have the right to access, correct, or delete your personal data at any time. To exercise any of these rights, email <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#47FFE8', textDecoration: 'none' }}>{CONTACT_EMAIL}</a>.</P>
          <P>If you're in the EU or UK, you have additional rights under GDPR/UK GDPR, including the right to data portability and the right to lodge a complaint with your local supervisory authority.</P>
        </Section>

        <Section title="CHANGES TO THIS POLICY">
          <P>If this policy changes in a material way, we'll notify you by email and update the effective date above. Minor clarifications may be made without notice.</P>
          <P>This is a living document. One Percent is in beta, and some data practices may evolve as the product grows. We'll always be transparent about what changes and why.</P>
        </Section>

        {/* Contact footer */}
        <div style={{ padding: '24px 0', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'rgba(232,238,245,0.25)', fontFamily: "'DM Mono', monospace", letterSpacing: '0.08em' }}>
            Questions? <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'rgba(71,255,232,0.5)', textDecoration: 'none' }}>{CONTACT_EMAIL}</a>
          </div>
        </div>

      </div>
    </div>
  )
}
