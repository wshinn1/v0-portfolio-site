'use client'

import { useState } from 'react'
import type { FAQContent } from '@/lib/types/cms'
import { Plus, Minus } from 'lucide-react'

interface FAQSectionProps {
  content: FAQContent
}

export function FAQSection({ content }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(1) // Second item open by default

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Left side - Label and Heading */}
        <div className="lg:w-1/3 lg:sticky lg:top-8 lg:self-start">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-foreground text-background rounded-full mb-4">
            {content.label || 'FAQ'}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-foreground">
            {content.heading || 'Frequently Asked Questions'}
          </h2>
        </div>

        {/* Right side - Questions */}
        <div className="lg:w-2/3">
          <div className="space-y-0">
            {content.questions?.map((item, index) => (
              <div key={index} className="border-b border-border">
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full py-6 flex items-center justify-between text-left hover:opacity-70 transition-opacity"
                >
                  <span className="text-lg font-medium text-foreground pr-4">
                    {item.question}
                  </span>
                  <span className="flex-shrink-0">
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-foreground" />
                    ) : (
                      <Plus className="w-5 h-5 text-foreground" />
                    )}
                  </span>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                  }`}
                >
                  <p className="text-muted-foreground leading-relaxed pr-12">
                    {item.answer}
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
