import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: '2026 Calendar - AI-Powered Calendar App',
  description: 'An advanced interactive calendar application with OpenAI integration and Model Context Protocol',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
