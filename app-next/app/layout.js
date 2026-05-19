import './globals.css'

export const metadata = {
  title: 'One Percent',
  description: 'A daily micro-learning system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ background: '#0A0A0A', margin: 0, padding: 0, fontFamily: "'Inter',sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
