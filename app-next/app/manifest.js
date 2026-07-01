// Next.js App Router serves this at /manifest.webmanifest and auto-links it.
// Makes the app installable ("Add to Home Screen") with the branded icon and
// the design-system dark theme.
export default function manifest() {
  return {
    name: 'One Percent',
    short_name: 'One Percent',
    description: 'A daily micro-learning system — one concept per day.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0e141c',
    theme_color: '#0e141c',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
