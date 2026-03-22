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

// Social link icons
function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function DribbbleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>
    </svg>
  )
}

function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return <LinkedInIcon />
    case 'twitter':
    case 'x':
      return <TwitterIcon />
    case 'github':
      return <GitHubIcon />
    case 'dribbble':
      return <DribbbleIcon />
    default:
      return <LinkedInIcon />
  }
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
              {content.brandName || 'Worq'}
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

          {/* View At - Social Links */}
          {content.socialLinks && content.socialLinks.length > 0 && (
            <div className="space-y-3">
              <Label className="text-gray-500">View At:</Label>
              <div className="flex items-center gap-4">
                {content.socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                    title={social.platform}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            </div>
          )}
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
              onClick={() => {
                const contactSection = document.getElementById('contact')
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
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
