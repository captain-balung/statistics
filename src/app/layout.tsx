import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Statistics Playground',
  description: '讓高中與大學生看見統計概念如何運作的互動實驗網站',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
