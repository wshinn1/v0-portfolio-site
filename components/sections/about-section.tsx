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

            {/* Contact Me Button */}
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-[#ff6b4a] rounded-full hover:bg-[#e55a3a] transition-colors"
            >
              {content.contactButtonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
