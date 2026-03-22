'use client'

import { useState, useEffect } from 'react'

interface Section {
  id: string
  section_type: string
  title: string
}

interface ActiveNavProps {
  sections: Section[]
  primaryColor: string
}

export function ActiveNav({ sections, primaryColor }: ActiveNavProps) {
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Offset for header

      for (const section of sections) {
        const element = document.getElementById(section.section_type)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.section_type)
            break
          }
        }
      }
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionType: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionType)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="space-y-3">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.section_type}`}
          onClick={(e) => handleNavClick(e, section.section_type)}
          className={`block text-sm transition-colors ${
            activeSection === section.section_type
              ? 'font-medium'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          style={{
            color: activeSection === section.section_type ? primaryColor : undefined
          }}
        >
          {section.section_type === 'hero' ? 'Full Stack Engineer' : section.section_type === 'faq' ? 'Process' : section.title}
        </a>
      ))}
    </nav>
  )
}
