'use client'

import { AboutContent } from '@/lib/types/cms'

interface AboutSectionProps {
  content: AboutContent
}

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <section id="about" className="min-h-screen bg-[#f0f0f0] py-16 md:py-24">
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-24 px-6 md:px-8 lg:px-16 max-w-7xl mx-auto">
        {/* Left Column - Label and Heading */}
        <div className="lg:w-1/3 lg:sticky lg:top-24 lg:self-start">
          {/* Section Label */}
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-[#1a1a1a] text-white rounded-full mb-4 md:mb-6">
            {content.label}
          </span>
          
          {/* Section Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight mb-8 lg:mb-0">
            {content.heading}
          </h2>
        </div>

        {/* Right Column - Content */}
        <div className="lg:w-2/3 pt-4 lg:pt-0 border-t border-gray-300 lg:border-t-0">
          {/* Job Title */}
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1a1a1a] mb-4 md:mb-6">
            {content.jobTitle}
          </h3>

          {/* Description */}
          <div className="space-y-4 mb-8 md:mb-10">
            {content.description?.split('\n').filter(p => p.trim()).map((paragraph, index) => (
              <p key={index} className="text-base md:text-lg text-[#4a4a4a] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            {/* Download Resume Button */}
            <a
              href={content.resumeUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-[#1a1a1a] rounded-full hover:bg-[#333] transition-colors"
            >
              {content.resumeButtonText}
            </a>

            {/* LinkedIn Button */}
            {content.linkedinUrl && (
              <a
                href={content.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-[#0A66C2] rounded-full hover:bg-[#004182] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                View LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
