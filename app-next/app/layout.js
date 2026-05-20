import './globals.css'

export const metadata = {
  title: 'One Percent',
  description: 'A daily micro-learning system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
