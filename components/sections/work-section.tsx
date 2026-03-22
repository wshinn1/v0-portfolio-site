'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { WorkContent } from '@/lib/types/cms'

interface WorkSectionProps {
  content: WorkContent
  primaryColor?: string
}

export function WorkSection({ content, primaryColor = '#ff6b4a' }: WorkSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Filter projects based on active category
  const filteredProjects = activeCategory
    ? content.projects.filter((p) => p.category.toLowerCase().includes(activeCategory.toLowerCase()))
    : content.projects

  return (
    <section id="work" className="py-16 lg:py-24">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Left Side - Label, Heading, Categories */}
        <div className="lg:w-[35%] lg:sticky lg:top-8 lg:self-start">
          {/* Section Label */}
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-gray-900 text-white rounded-full mb-4">
            {content.label}
          </span>
          
          {/* Heading */}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
            {content.heading}
          </h2>

          {/* Category Filter */}
          <nav className="space-y-3">
            {content.categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                className={`block text-left w-full transition-colors ${
                  activeCategory === category 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
            <button
              onClick={() => setActiveCategory(null)}
              className="block text-left w-full mt-4 transition-colors"
              style={{ color: primaryColor }}
            >
              {content.viewAllText}
            </button>
          </nav>
        </div>

        {/* Right Side - Project Grid */}
        <div className="lg:w-[65%]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <a
                key={index}
                href={project.link || '#'}
                target={project.link ? '_blank' : undefined}
                rel={project.link ? 'noopener noreferrer' : undefined}
                className="group block"
              >
                {/* Project Image */}
                <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden mb-4">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
                      <div className="text-center">
                        <div className="w-16 h-12 mx-auto mb-2 bg-gray-400/30 rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-400">Preview</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="flex items-baseline gap-2 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                    {project.title},
                  </h3>
                  <span className="text-gray-500">{project.category}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
