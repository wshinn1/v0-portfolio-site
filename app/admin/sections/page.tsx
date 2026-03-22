"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Save, 
  Loader2, 
  Plus, 
  Copy, 
  Trash2, 
  ArrowUp,
  ArrowDown
} from "lucide-react"
import type { Section } from "@/lib/types/cms"

// Import dedicated section editors
import { HeroEditor } from "@/components/admin/section-editors/hero-editor"
import { AboutEditor } from "@/components/admin/section-editors/about-editor"
import { WorkEditor } from "@/components/admin/section-editors/work-editor"
import { ServicesEditor } from "@/components/admin/section-editors/services-editor"
import { ExperienceEditor } from "@/components/admin/section-editors/experience-editor"
import { FAQEditor } from "@/components/admin/section-editors/faq-editor"
import { ContactEditor } from "@/components/admin/section-editors/contact-editor"

// Section type options for creating new sections
const SECTION_TYPES = [
  { type: 'hero', title: 'Hero', description: 'Main hero section with profile' },
  { type: 'about', title: 'About', description: 'About me section' },
  { type: 'work', title: 'Work', description: 'Portfolio/projects showcase' },
  { type: 'services', title: 'Services', description: 'Services offered' },
  { type: 'experience', title: 'Experience', description: 'Work experience timeline' },
  { type: 'faq', title: 'FAQ', description: 'Frequently asked questions' },
  { type: 'contact', title: 'Contact', description: 'Contact information and footer' },
]

// Default content templates for each section type
const DEFAULT_CONTENT: Record<string, Record<string, unknown>> = {
  hero: {
    badge: "Available for work",
    firstName: "Your",
    lastName: "Name",
    tagline: "Your tagline here",
    email: "email@example.com",
    profileImage: "",
    stats: { years: "5+", yearsLabel: "Years of experience" },
    awards: [],
    topRatedOn: [],
    ctaText: "Contact Me"
  },
  about: {
    label: "ABOUT",
    heading: "About Me",
    jobTitle: "Your Title",
    description: "Your description here...",
    resumeUrl: "",
    resumeButtonText: "Download Resume",
    contactButtonText: "Contact Me"
  },
  work: {
    label: "WORK",
    heading: "My Work",
    categories: [],
    viewAllText: "View All",
    projects: []
  },
  services: {
    label: "SERVICES",
    heading: "What I Do",
    services: []
  },
  experience: {
    label: "EXPERIENCE",
    heading: "My Journey",
    experiences: []
  },
  faq: {
    label: "FAQ",
    heading: "Frequently Asked Questions",
    questions: []
  },
  contact: {
    logoText: "Logo",
    heading: "Let's Connect",
    ctaText: "Contact",
    phone: "",
    email: "",
    profileImage: "",
    bio: "",
    socialLinks: [],
    copyright: "© 2024",
    footerLinks: []
  }
}

// Section editor component - uses dedicated editors for each section type
function SectionEditorWrapper({ 
  section, 
  onSave 
}: { 
  section: Section
  onSave: (content: Record<string, unknown>) => Promise<void>
}) {
  const baseType = section.section_type.split('_')[0]
  
  switch (baseType) {
    case 'hero':
      return <HeroEditor section={section} onSave={onSave} />
    case 'about':
      return <AboutEditor section={section} onSave={onSave} />
    case 'work':
      return <WorkEditor content={section.content as any} onSave={onSave} />
    case 'services':
      return (
        <ServicesEditor 
          content={section.content as any} 
          sectionId={section.id} 
          onSave={async (_sectionId, content) => onSave(content)} 
        />
      )
    case 'experience':
      return (
        <ExperienceEditor 
          content={section.content as any} 
          sectionId={section.id} 
          onSave={async () => {}} 
        />
      )
    case 'faq':
      return <FAQEditor content={section.content as any} onSave={onSave} />
    case 'contact':
      return <ContactEditor section={section} onSave={onSave} />
    default:
      return (
        <div className="p-4 bg-zinc-50 rounded-lg">
          <p className="text-sm text-zinc-500">No editor available for this section type.</p>
        </div>
      )
  }
}

export default function SectionsPage() {
  const searchParams = useSearchParams()
  const openSection = searchParams.get("section")
  
  const [sections, setSections] = useState<Section[]>([])
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [pendingChanges, setPendingChanges] = useState<Record<string, Record<string, unknown>>>({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingSection, setDeletingSection] = useState<string | null>(null)

  useEffect(() => {
    fetchSections()
  }, [])

  useEffect(() => {
    if (openSection) {
      setExpandedSections(new Set([openSection]))
    }
  }, [openSection])

  async function fetchSections() {
    try {
      const res = await fetch("/api/cms/sections")
      if (res.ok) {
        const data = await res.json()
        setSections(data)
      }
    } catch (error) {
      console.error("Error fetching sections:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSection = (sectionType: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionType)) {
        next.delete(sectionType)
      } else {
        next.add(sectionType)
      }
      return next
    })
  }

  const toggleVisibility = async (section: Section) => {
    try {
      const res = await fetch("/api/cms/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: section.id,
          is_visible: !section.is_visible,
        }),
      })
      
      if (res.ok) {
        setSections((prev) =>
          prev.map((s) =>
            s.id === section.id ? { ...s, is_visible: !s.is_visible } : s
          )
        )
      }
    } catch (error) {
      console.error("Error toggling visibility:", error)
    }
  }

  const handleContentUpdate = (sectionType: string, content: Record<string, unknown>) => {
    setPendingChanges((prev) => ({
      ...prev,
      [sectionType]: content,
    }))
  }

  const saveSection = async (section: Section) => {
    const content = pendingChanges[section.section_type]
    if (!content) return

    setSavingSection(section.section_type)
    
    try {
      const res = await fetch("/api/cms/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: section.id,
          content,
        }),
      })
      
      if (res.ok) {
        setSections((prev) =>
          prev.map((s) =>
            s.id === section.id ? { ...s, content } : s
          )
        )
        setPendingChanges((prev) => {
          const next = { ...prev }
          delete next[section.section_type]
          return next
        })
      }
    } catch (error) {
      console.error("Error saving section:", error)
    } finally {
      setSavingSection(null)
    }
  }

  const addSection = async (type: string) => {
    try {
      const maxSortOrder = Math.max(...sections.map(s => s.sort_order || 0), 0)
      const baseType = type.split('_')[0] // Get base type without timestamp
      
      const res = await fetch("/api/cms/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section_type: type,
          title: SECTION_TYPES.find(t => t.type === baseType)?.title || type,
          content: DEFAULT_CONTENT[baseType] || {},
          sort_order: maxSortOrder + 1,
          is_visible: true,
        }),
      })
      
      if (res.ok) {
        await fetchSections()
        setShowAddModal(false)
      }
    } catch (error) {
      console.error("Error adding section:", error)
    }
  }

  const duplicateSection = async (section: Section) => {
    try {
      const baseType = section.section_type.split('_')[0]
      
      const res = await fetch("/api/cms/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section_type: baseType,
          title: `${section.title} (Copy)`,
          content: section.content,
          sort_order: section.sort_order + 1,
          is_visible: true,
        }),
      })
      
      if (res.ok) {
        await fetchSections()
      }
    } catch (error) {
      console.error("Error duplicating section:", error)
    }
  }

  const deleteSection = async (section: Section) => {
    if (!confirm(`Are you sure you want to delete "${section.title}"? This cannot be undone.`)) {
      return
    }

    setDeletingSection(section.id)
    
    try {
      const res = await fetch(`/api/cms/sections?id=${section.id}`, {
        method: "DELETE",
      })
      
      if (res.ok) {
        setSections((prev) => prev.filter((s) => s.id !== section.id))
      }
    } catch (error) {
      console.error("Error deleting section:", error)
    } finally {
      setDeletingSection(null)
    }
  }

  const moveSection = async (section: Section, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === section.id)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (targetIndex < 0 || targetIndex >= sections.length) return
    
    const targetSection = sections[targetIndex]
    
    // Swap sort orders
    try {
      await Promise.all([
        fetch("/api/cms/sections", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: section.id,
            sort_order: targetSection.sort_order,
          }),
        }),
        fetch("/api/cms/sections", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: targetSection.id,
            sort_order: section.sort_order,
          }),
        }),
      ])
      
      await fetchSections()
    } catch (error) {
      console.error("Error moving section:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Sections</h1>
          <p className="text-zinc-500 mt-2">Add, edit, reorder, and manage your portfolio sections</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-zinc-900 mb-4">Add New Section</h2>
            <div className="space-y-3">
              {SECTION_TYPES.map((type) => (
                <button
                  key={type.type}
                  onClick={() => addSection(type.type)}
                  className="w-full p-4 text-left border border-zinc-200 rounded-lg hover:border-zinc-400 hover:bg-zinc-50 transition-colors"
                >
                  <p className="font-medium text-zinc-900">{type.title}</p>
                  <p className="text-sm text-zinc-500">{type.description}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="mt-4 w-full py-2 text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section, index) => {
          const isExpanded = expandedSections.has(section.section_type)
          const hasChanges = !!pendingChanges[section.section_type]
          const isSaving = savingSection === section.section_type
          const isDeleting = deletingSection === section.id

          return (
            <div
              key={section.id}
              className={`bg-white rounded-xl border overflow-hidden transition-colors ${
                section.is_visible ? 'border-zinc-200' : 'border-zinc-200 bg-zinc-50'
              }`}
            >
              {/* Section Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-100">
                <div className="flex items-center gap-3 flex-1">
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveSection(section, 'up')}
                      disabled={index === 0}
                      className="p-1 text-zinc-400 hover:text-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveSection(section, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-1 text-zinc-400 hover:text-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => toggleSection(section.section_type)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-zinc-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-zinc-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">{section.title}</p>
                      <p className="text-sm text-zinc-500 capitalize">{section.section_type.split('_')[0]}</p>
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <button
                      onClick={() => saveSection(section)}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save
                    </button>
                  )}
                  
                  {/* Duplicate button */}
                  <button
                    onClick={() => duplicateSection(section)}
                    className="p-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                    title="Duplicate section"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  
                  {/* Delete button */}
                  <button
                    onClick={() => deleteSection(section)}
                    disabled={isDeleting}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete section"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => toggleVisibility(section)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      section.is_visible
                        ? "text-green-600 bg-green-50 hover:bg-green-100"
                        : "text-zinc-500 bg-zinc-100 hover:bg-zinc-200"
                    }`}
                  >
                    {section.is_visible ? (
                      <>
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span className="text-sm">Hidden</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Section Content Editor */}
              {isExpanded && (
                <div className="p-6">
                  <SectionEditorWrapper
                    section={section}
                    onSave={async (content) => {
                      // Save directly to API
                      try {
                        const res = await fetch("/api/cms/sections", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            id: section.id,
                            content,
                          }),
                        })
                        
                        if (res.ok) {
                          setSections((prev) =>
                            prev.map((s) =>
                              s.id === section.id ? { ...s, content } : s
                            )
                          )
                        }
                      } catch (error) {
                        console.error("Error saving section:", error)
                      }
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-12 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
          <p className="text-zinc-500 mb-4">No sections yet</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Your First Section
          </button>
        </div>
      )}
    </div>
  )
}
