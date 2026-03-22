import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CursorWrapper } from '@/components/layout/cursor-wrapper'
import { createClient } from '@/lib/supabase/server'
import './globals.css'

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = await createClient()
    const { data: settings } = await supabase
      .from('site_settings')
      .select('site_name, meta_description, og_image, og_title, og_description, favicon_url')
      .single()

    const title = settings?.og_title || settings?.site_name || 'Portfolio'
    const description = settings?.og_description || settings?.meta_description || 'Professional portfolio'
    const ogImage = settings?.og_image || null

    return {
      title,
      description,
      icons: settings?.favicon_url ? { icon: settings.favicon_url } : undefined,
      openGraph: {
        title,
        description,
        type: 'website',
        ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
      },
      twitter: {
        card: ogImage ? 'summary_large_image' : 'summary',
        title,
        description,
        ...(ogImage && { images: [ogImage] }),
      },
    }
  } catch {
    return {
      title: 'Portfolio',
      description: 'Professional portfolio',
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <CursorWrapper />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
