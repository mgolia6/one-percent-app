import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'One Percent',
  description: 'A daily micro-learning system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ background: '#0A0A0A', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
