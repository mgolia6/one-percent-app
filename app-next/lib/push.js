// Web Push (PWA) client helpers. Foundation pass: register the service worker,
// request permission, subscribe with the VAPID public key, and persist the
// subscription to Supabase (RLS: each user owns their rows). Sending is done
// server-side via /api/push/test (needs the VAPID private key).
import { supabase } from '@/lib/supabase'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
  return arr
}

export function pushSupported() {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

// Standalone = installed PWA. iOS ONLY delivers push to an installed PWA.
export function isStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

export async function getSubscription() {
  const reg = await navigator.serviceWorker.getRegistration()
  if (!reg) return null
  return reg.pushManager.getSubscription()
}

// Register SW → request permission → subscribe → save to Supabase.
// Throws with a short code the UI maps to a message.
export async function enablePush() {
  if (!pushSupported()) throw new Error('unsupported')
  if (!VAPID_PUBLIC_KEY) throw new Error('missing-vapid')

  const reg = await navigator.serviceWorker.register('/sw.js')
  await navigator.serviceWorker.ready

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') throw new Error('denied')

  let sub = await reg.pushManager.getSubscription()
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    })
  }

  const json = sub.toJSON()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        user_id: user.id,
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
        user_agent: navigator.userAgent,
        last_used_at: new Date().toISOString(),
      },
      { onConflict: 'endpoint' }
    )
    if (error) throw new Error('save-failed: ' + error.message)
  }
  return sub
}

// Fire a test notification to this device's current subscription.
export async function sendTestPush() {
  const sub = await getSubscription()
  if (!sub) throw new Error('not-subscribed')
  const res = await fetch('/api/push/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription: sub.toJSON() }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || 'send-failed')
  return body
}
