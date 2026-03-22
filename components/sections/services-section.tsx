'use client'

import type { ServicesContent } from '@/lib/types/cms'

interface ServicesSectionProps {
  content: ServicesContent
}

// Service icon components
function WebDesignIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L4 14L24 24L44 14L24 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M4 24L24 34L44 24" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M4 34L24 44L44 34" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

function GraphicDesignIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="28" cy="20" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="24" cy="28" r="10" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

function AppDevelopmentIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="8" height="32" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="20" y="8" width="8" height="32" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="32" y="8" width="8" height="32" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

function BrandIdentityIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4V44" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 10H36V38H12V10Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 14H40" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 34H40" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

function getServiceIcon(iconType: string) {
  switch (iconType) {
    case 'web':
      return <WebDesignIcon />
    case 'graphic':
      return <GraphicDesignIcon />
    case 'app':
      return <AppDevelopmentIcon />
    case 'brand':
      return <BrandIdentityIcon />
    default:
      return <WebDesignIcon />
  }
}

export function ServicesSection({ content }: ServicesSectionProps) {
  return (
    <section id="services" className="py-24 bg-[#f5f5f5]">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Left Side - Label and Heading */}
        <div className="lg:w-1/3 lg:sticky lg:top-24 lg:self-start">
          <span className="inline-block px-3 py-1 bg-[#1a1a1a] text-white text-xs font-semibold rounded-full mb-4">
            {content.label}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight">
            {content.heading}
          </h2>
        </div>

        {/* Right Side - Services Grid */}
        <div className="lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {content.services.map((service, index) => (
              <div
                key={index}
                className={`p-8 ${
                  index < 2 ? 'border-b border-gray-300' : ''
                } ${
                  index % 2 === 0 ? 'md:border-r border-gray-300' : ''
                }`}
              >
                <div className="text-[#1a1a1a] mb-6">
                  {getServiceIcon(service.icon)}
                </div>
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
