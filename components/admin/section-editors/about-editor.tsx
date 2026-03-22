'use client'

import { useState } from 'react'
import { AboutContent, Section } from '@/lib/types/cms'
import { ChevronDown, ChevronUp, Save, FileText, Link } from 'lucide-react'

interface AboutEditorProps {
  section: Section
  onSave: (content: AboutContent) => Promise<void>
}

export function AboutEditor({ section, onSave }: AboutEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [content, setContent] = useState<AboutContent>(section.content as AboutContent)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(content)
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = <K extends keyof AboutContent>(field: K, value: AboutContent[K]) => {
    setContent(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">About Section</h3>
            <p className="text-sm text-gray-500">Bio, job title, and CTA buttons</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 space-y-6">
          {/* Section Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Label
            </label>
            <input
              type="text"
              value={content.label}
              onChange={(e) => updateField('label', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ABOUT"
            />
          </div>

          {/* Heading */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Heading
            </label>
            <input
              type="text"
              value={content.heading}
              onChange={(e) => updateField('heading', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="I work for you"
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={content.jobTitle}
              onChange={(e) => updateField('jobTitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="UI/UX Designer"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Your bio text..."
            />
          </div>

          {/* Buttons Section */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Link className="w-4 h-4" />
              CTA Buttons
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resume Button */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-800">Resume Button</h5>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={content.resumeButtonText}
                    onChange={(e) => updateField('resumeButtonText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Download Resume"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Resume URL</label>
                  <input
                    type="url"
                    value={content.resumeUrl}
                    onChange={(e) => updateField('resumeUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>
              </div>

              {/* Contact Button */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-800">Contact Button</h5>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={content.contactButtonText}
                    onChange={(e) => updateField('contactButtonText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contact Me"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  This button scrolls to the Contact section
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
