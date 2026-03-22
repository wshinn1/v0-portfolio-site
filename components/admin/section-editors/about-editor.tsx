'use client'

import { useState, useRef } from 'react'
import { AboutContent, Section } from '@/lib/types/cms'
import { ChevronDown, ChevronUp, Save, FileText, Link, Upload, X, Loader2, File } from 'lucide-react'

interface AboutEditorProps {
  section: Section
  onSave: (content: AboutContent) => Promise<void>
}

export function AboutEditor({ section, onSave }: AboutEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const sectionContent = section?.content as AboutContent | undefined
  const [content, setContent] = useState<AboutContent>({
    label: sectionContent?.label || '',
    heading: sectionContent?.heading || '',
    jobTitle: sectionContent?.jobTitle || '',
    description: sectionContent?.description || '',
    resumeButtonText: sectionContent?.resumeButtonText || '',
    resumeUrl: sectionContent?.resumeUrl || '',
    contactButtonText: sectionContent?.contactButtonText || '',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleResumeUpload = async (file: File) => {
    if (!file) return

    // Validate file type (only PDF)
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        updateField('resumeUrl', data.url)
      } else {
        alert('Upload failed. Please try again.')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeResume = () => {
    updateField('resumeUrl', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
                
                {/* Resume Upload */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Resume File (PDF)</label>
                  
                  {content.resumeUrl ? (
                    <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <File className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Resume.pdf</p>
                        <a 
                          href={content.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View uploaded file
                        </a>
                      </div>
                      <button
                        onClick={removeResume}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove resume"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
                          <span className="text-sm text-gray-500">Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Click to upload resume</span>
                          <span className="text-xs text-gray-400 mt-1">PDF only, max 10MB</span>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleResumeUpload(file)
                        }}
                      />
                    </label>
                  )}
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
