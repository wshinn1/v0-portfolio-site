'use client'

import Image from 'next/image'
import { useTypography, Label, Body } from '@/components/cms/typography-provider'
import type { HeroContent, SiteSettings } from '@/lib/types/cms'

interface HeroSectionProps {
  content: HeroContent
  siteSettings: SiteSettings | null
}

// Icon components for awards
function FWAIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3L3 8v8l9 5 9-5V8l-9-5z" />
      <path d="M12 8v8" />
    </svg>
  )
}

function BlogsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

function LandingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M6 12h12" />
    </svg>
  )
}

// Platform badge icons
function DribbbleIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <circle cx="12" cy="12" r="10" />
      </svg>
    </div>
  )
}

function BehanceIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <rect x="4" y="8" width="6" height="8" rx="2" />
        <rect x="12" y="8" width="6" height="8" rx="2" />
      </svg>
    </div>
  )
}

function UpworkIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M6 12c0 3 2 5 5 3l2 5 4-10c-3 0-5 2-5 5" />
      </svg>
    </div>
  )
}

function getAwardIcon(iconType: string) {
  switch (iconType) {
    case 'fwa':
      return <FWAIcon />
    case 'blogs':
      return <BlogsIcon />
    case 'landing':
      return <LandingIcon />
    default:
      return <FWAIcon />
  }
}

function getPlatformBadge(platform: string) {
  switch (platform) {
    case 'dribbble':
      return <DribbbleIcon />
    case 'behance':
      return <BehanceIcon />
    case 'upwork':
      return <UpworkIcon />
    default:
      return null
  }
}

export function HeroSection({ content, siteSettings }: HeroSectionProps) {
  const { getStyle } = useTypography()
  const primaryColor = siteSettings?.primary_color || '#ff6b4a'

  return (
    <section id="hero" className="min-h-screen py-8 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-start">
        {/* Left Column - Info */}
        <div className="lg:col-span-4 space-y-8">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <span 
              className="text-2xl font-bold italic"
              style={{ color: primaryColor }}
            >
              Worq
            </span>
            <span className="text-sm text-gray-500">
              {content.email}
            </span>
          </div>

          {/* Available Badge */}
          <div className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: primaryColor }}
            />
            <span 
              className="text-sm font-medium"
              style={{ color: primaryColor }}
            >
              {content.badge}
            </span>
          </div>

          {/* Name */}
          <div className="space-y-0">
            <h1 
              className="text-5xl lg:text-6xl font-bold tracking-tight leading-none"
              style={{ ...getStyle('h1'), letterSpacing: '0.05em' }}
            >
              {content.firstName}
            </h1>
            <h1 
              className="text-5xl lg:text-6xl font-light tracking-tight leading-none"
              style={{ ...getStyle('h1'), fontWeight: '300', letterSpacing: '0.05em' }}
            >
              {content.lastName}
            </h1>
          </div>

          {/* Tagline */}
          <Body className="text-gray-600 max-w-xs">
            {content.tagline}
          </Body>

          {/* Top Rated On */}
          <div className="space-y-3">
            <Label className="text-gray-500">Top Rated on :</Label>
            <div className="flex items-center gap-3">
              {content.topRatedOn.map((platform, index) => (
                <div key={index}>
                  {getPlatformBadge(platform)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column - Profile Image */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="relative w-full max-w-md aspect-[3/4] rounded-lg overflow-hidden bg-gray-200">
            {content.profileImage ? (
              <Image
                src={content.profileImage}
                alt={`${content.firstName} ${content.lastName}`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats & Awards */}
        <div className="lg:col-span-4 space-y-8">
          {/* CTA Button */}
          <div className="flex justify-end">
            <button
              className="px-6 py-3 rounded-full text-white font-medium transition-transform hover:scale-105"
              style={{ backgroundColor: primaryColor }}
            >
              {content.ctaText}
            </button>
          </div>

          {/* Stats */}
          <div className="border-t border-b border-gray-200 py-6">
            <div className="text-5xl font-bold" style={getStyle('h1')}>
              {content.stats.years}
            </div>
            <div className="text-gray-600 mt-1">
              {content.stats.yearsLabel.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div className="space-y-6">
            {content.awards.map((award, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="text-gray-700">
                  {getAwardIcon(award.icon)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{award.title}</div>
                  <div className="text-gray-500 text-sm">{award.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
