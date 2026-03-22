import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// Dynamic import with ssr: false - completely skips server rendering
// This prevents any hydration mismatch since the component only renders on client
const CustomCursor = dynamic(
  () => import('@/components/layout/custom-cursor').then(mod => mod.CustomCursor),
  { ssr: false }
)

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CustomCursor />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
