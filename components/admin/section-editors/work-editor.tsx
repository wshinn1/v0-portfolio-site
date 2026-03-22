'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Briefcase, Plus, Trash2, GripVertical, Upload, X } from 'lucide-react'
import type { WorkContent } from '@/lib/types/cms'

interface WorkEditorProps {
  content: WorkContent
  onSave: (content: WorkContent) => Promise<void>
}

export function WorkEditor({ content: initialContent, onSave }: WorkEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<WorkContent>(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(content)
    } finally {
      setIsSaving(false)
    }
  }

  const addCategory = () => {
    setContent({
      ...content,
      categories: [...content.categories, 'New Category'],
    })
  }

  const removeCategory = (index: number) => {
    setContent({
      ...content,
      categories: content.categories.filter((_, i) => i !== index),
    })
  }

  const updateCategory = (index: number, value: string) => {
    const newCategories = [...content.categories]
    newCategories[index] = value
    setContent({ ...content, categories: newCategories })
  }

  const addProject = () => {
    setContent({
      ...content,
      projects: [
        ...content.projects,
        { title: 'New Project', category: '', image: '', link: '' },
      ],
    })
  }

  const removeProject = (index: number) => {
    setContent({
      ...content,
      projects: content.projects.filter((_, i) => i !== index),
    })
  }

  const updateProject = (index: number, field: keyof WorkContent['projects'][0], value: string) => {
    const newProjects = [...content.projects]
    newProjects[index] = { ...newProjects[index], [field]: value }
    setContent({ ...content, projects: newProjects })
  }

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        updateProject(index, 'image', data.url)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploadingIndex(null)
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-900">Work / Portfolio</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Content */}
      {isOpen && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          {/* Basic Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section Label
              </label>
              <input
                type="text"
                value={content.label}
                onChange={(e) => setContent({ ...content, label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                View All Text
              </label>
              <input
                type="text"
                value={content.viewAllText}
                onChange={(e) => setContent({ ...content, viewAllText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading
            </label>
            <input
              type="text"
              value={content.heading}
              onChange={(e) => setContent({ ...content, heading: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Categories
              </label>
              <button
                onClick={addCategory}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>
            <div className="space-y-2">
              {content.categories.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => updateCategory(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => removeCategory(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Projects
              </label>
              <button
                onClick={addProject}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>
            <div className="space-y-4">
              {content.projects.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        Project {index + 1}
                      </span>
                    </div>
                    <button
                      onClick={() => removeProject(index)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => updateProject(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={project.category}
                        onChange={(e) => updateProject(index, 'category', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Project URL
                    </label>
                    <input
                      type="url"
                      value={project.link}
                      onChange={(e) => updateProject(index, 'link', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Project Image
                    </label>
                    <div className="flex items-center gap-3">
                      {project.image ? (
                        <div className="relative w-20 h-14 bg-gray-200 rounded overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => updateProject(index, 'image', '')}
                            className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
                          {uploadingIndex === index ? (
                            <span className="text-gray-500">Uploading...</span>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">Upload Image</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(index, file)
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
