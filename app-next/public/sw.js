/* One Percent — service worker (Web Push).
   Kept intentionally minimal: no offline caching yet, just push handling. */

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (e) {
    data = { body: event.data && event.data.text() }
  }
  const title = data.title || 'One Percent'
  const options = {
    body: data.body || 'Time for your daily 1%.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'one-percent',
    data: { url: data.url || '/' },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(url) && 'focus' in client) return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow(url)
    })
  )
})
