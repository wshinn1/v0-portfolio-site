'use client'

import { useState } from 'react'
import type { ExperienceContent } from '@/lib/types/cms'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ExperienceSectionProps {
  content: ExperienceContent
}

export function ExperienceSection({ content }: ExperienceSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section id="experience" className="py-20 bg-[#f5f5f5]">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Left Side - Label and Heading */}
        <div className="lg:w-1/3 lg:sticky lg:top-20 lg:self-start">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-white bg-[#1a1a1a] rounded-full mb-4">
            {content.label}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight">
            {content.heading}
          </h2>
        </div>

        {/* Right Side - Experience Timeline */}
        <div className="lg:w-2/3">
          <div className="space-y-0">
            {content.experiences.map((exp, index) => (
              <div
                key={index}
                className="border-b border-gray-300 last:border-b-0"
              >
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full py-6 flex items-start justify-between text-left hover:bg-gray-100/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{exp.company}</p>
                    <h3 className="text-xl font-semibold text-[#1a1a1a]">
                      {exp.role}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {exp.period}
                    </span>
                    {expandedIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                {/* Expandable Description */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedIndex === index ? 'max-h-40 pb-6' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed pr-12">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
