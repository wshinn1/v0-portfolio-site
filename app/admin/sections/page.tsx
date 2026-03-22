"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronDown, ChevronRight, Eye, EyeOff, Save, Loader2 } from "lucide-react"
import type { Section } from "@/lib/types/cms"

// Section editor components - will be expanded in later phases
function SectionEditor({ section, onUpdate }: { section: Section; onUpdate: (content: Record<string, unknown>) => void }) {
  const content = section.content as Record<string, unknown>
  
  return (
    <div className="space-y-4">
      {Object.entries(content).map(([key, value]) => {
        // Handle nested objects and arrays simply for now
        if (typeof value === "object" && value !== null) {
          return (
            <div key={key} className="p-4 bg-zinc-50 rounded-lg">
              <p className="text-sm font-medium text-zinc-700 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
              <pre className="text-xs text-zinc-500 overflow-auto max-h-40">
                {JSON.stringify(value, null, 2)}
              </pre>
              <p className="text-xs text-zinc-400 mt-2">Complex field - full editor coming in next phase</p>
            </div>
          )
        }
        
        // Handle simple string/number fields
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-zinc-700 mb-2 capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </label>
            {typeof value === "string" && value.length > 100 ? (
              <textarea
                value={value as string}
                onChange={(e) => onUpdate({ ...content, [key]: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
              />
            ) : (
              <input
                type="text"
                value={String(value)}
                onChange={(e) => onUpdate({ ...content, [key]: e.target.value })}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function SectionsPage() {
  const searchParams = useSearchParams()
  const openSection = searchParams.get("section")
  
  const [sections, setSections] = useState<Section[]>([])
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [pendingChanges, setPendingChanges] = useState<Record<string, Record<string, unknown>>>({})

  useEffect(() => {
    async function fetchSections() {
      try {
        const res = await fetch("/api/cms/sections")
        if (res.ok) {
          const data = await res.json()
          setSections(data)
          // Open section from URL param
          if (openSection) {
            setExpandedSections(new Set([openSection]))
          }
        }
      } catch (error) {
        console.error("Error fetching sections:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSections()
  }, [openSection])

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Sections</h1>
        <p className="text-zinc-500 mt-2">Edit your portfolio sections content</p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.section_type)
          const hasChanges = !!pendingChanges[section.section_type]
          const isSaving = savingSection === section.section_type

          return (
            <div
              key={section.id}
              className="bg-white rounded-xl border border-zinc-200 overflow-hidden"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-100">
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
                    <p className="text-sm text-zinc-500 capitalize">{section.section_type}</p>
                  </div>
                </button>

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
                  <SectionEditor
                    section={{
                      ...section,
                      content: pendingChanges[section.section_type] || section.content,
                    }}
                    onUpdate={(content) => handleContentUpdate(section.section_type, content)}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
