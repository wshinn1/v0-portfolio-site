'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

interface Section {
  id: string
  section_type: string
  title: string
}

interface MobileMenuProps {
  sections: Section[]
  siteName: string
  primaryColor: string
}

export function MobileMenu({ sections, siteName, primaryColor }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavClick = (sectionType: string) => {
    setIsOpen(false)
    // Smooth scroll to section
    const element = document.getElementById(sectionType)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#f5f5f5] border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <span 
          className="text-xl font-bold italic"
          style={{ color: primaryColor }}
        >
          {siteName}
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-gray-200 transition-colors"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <nav 
        className={`lg:hidden fixed top-[60px] right-0 bottom-0 z-50 w-64 bg-[#f5f5f5] border-l border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 space-y-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleNavClick(section.section_type)}
              className="block w-full text-left text-gray-600 hover:text-gray-900 py-2 transition-colors"
            >
              {section.section_type === 'hero' ? 'Full Stack Engineer' : section.title}
            </button>
          ))}

        </div>
      </nav>
    </>
  )
}
