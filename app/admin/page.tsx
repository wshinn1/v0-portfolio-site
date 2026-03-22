"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Type, Settings, Eye, EyeOff, ChevronRight } from "lucide-react"
import type { Section } from "@/lib/types/cms"

export default function AdminDashboardPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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
    fetchSections()
  }, [])

  const visibleSections = sections.filter((s) => s.is_visible)
  const hiddenSections = sections.filter((s) => !s.is_visible)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-zinc-500 mt-2">Manage your portfolio content</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/sections"
          className="bg-white rounded-xl p-6 border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-zinc-900">{sections.length}</p>
            <p className="text-zinc-500">Total Sections</p>
          </div>
        </Link>

        <Link
          href="/admin/typography"
          className="bg-white rounded-xl p-6 border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Type className="w-6 h-6 text-purple-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-zinc-900">6</p>
            <p className="text-zinc-500">Typography Styles</p>
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-white rounded-xl p-6 border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-green-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-zinc-900">Site</p>
            <p className="text-zinc-500">Global Settings</p>
          </div>
        </Link>
      </div>

      {/* Sections Overview */}
      <div className="bg-white rounded-xl border border-zinc-200">
        <div className="p-6 border-b border-zinc-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-900">Sections Overview</h2>
            <Link
              href="/admin/sections"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              View all
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-zinc-500">Loading sections...</div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`/admin/sections?section=${section.section_type}`}
                className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-semibold text-zinc-600">
                      {section.sort_order}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">{section.title}</p>
                    <p className="text-sm text-zinc-500 capitalize">{section.section_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {section.is_visible ? (
                    <span className="flex items-center gap-1.5 text-sm text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                      <Eye className="w-3.5 h-3.5" />
                      Visible
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
                      <EyeOff className="w-3.5 h-3.5" />
                      Hidden
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-zinc-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-6 bg-zinc-900 rounded-xl text-white">
        <h3 className="text-lg font-semibold mb-2">Quick Tip</h3>
        <p className="text-zinc-400">
          Click on any section to edit its content. Changes are saved automatically when you update fields.
          Use the Typography panel to customize fonts and colors across your entire site.
        </p>
      </div>
    </div>
  )
}
