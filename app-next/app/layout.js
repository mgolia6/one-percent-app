import './globals.css'
import { Suspense } from 'react'
import PostHogProvider from '@/components/PostHogProvider'

export const metadata = {
  title: 'One Percent',
  description: 'A daily micro-learning system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Suspense required because PostHogInit uses useSearchParams() */}
        <Suspense fallback={null}>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  )
}
