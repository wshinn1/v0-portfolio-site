'use client'

import { useState, useRef } from 'react'
import type { HeroContent, Section } from '@/lib/types/cms'
import { Upload, Plus, Trash2, GripVertical, Save, Loader2, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react'

interface HeroEditorProps {
  section: Section
  onSave: (content: HeroContent) => Promise<void>
}

export function HeroEditor({ section, onSave }: HeroEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const sectionContent = section?.content as HeroContent | undefined
  const [content, setContent] = useState<HeroContent>({
    brandName: sectionContent?.brandName || '',
    badge: sectionContent?.badge || '',
    firstName: sectionContent?.firstName || '',
    lastName: sectionContent?.lastName || '',
    tagline: sectionContent?.tagline || '',
    email: sectionContent?.email || '',
    profileImage: sectionContent?.profileImage || '',
    linkedinUrl: sectionContent?.linkedinUrl || '',
    stats: sectionContent?.stats || { years: '', yearsLabel: '' },
    awards: sectionContent?.awards || [],
    topRatedOn: sectionContent?.topRatedOn || [],
    socialLinks: sectionContent?.socialLinks || [],
    ctaText: sectionContent?.ctaText || '',
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

  const updateField = <K extends keyof HeroContent>(field: K, value: HeroContent[K]) => {
    setContent(prev => ({ ...prev, [field]: value }))
  }

  const handleStatsChange = (field: keyof HeroContent['stats'], value: string) => {
    setContent(prev => ({
      ...prev,
      stats: { ...prev.stats, [field]: value }
    }))
  }

  const handleAwardChange = (index: number, field: keyof HeroContent['awards'][0], value: string) => {
    const newAwards = [...content.awards]
    newAwards[index] = { ...newAwards[index], [field]: value }
    setContent(prev => ({ ...prev, awards: newAwards }))
  }

  const addAward = () => {
    setContent(prev => ({
      ...prev,
      awards: [...prev.awards, { icon: 'fwa', title: '', subtitle: '' }]
    }))
  }

  const removeAward = (index: number) => {
    setContent(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }))
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
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
        updateField('profileImage', data.url)
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

  const removeImage = () => {
    updateField('profileImage', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...(content.socialLinks || [])]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setContent(prev => ({ ...prev, socialLinks: newLinks }))
  }

  const addSocialLink = () => {
    setContent(prev => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), { platform: 'linkedin', url: '' }]
    }))
  }

  const removeSocialLink = (index: number) => {
    setContent(prev => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          <h3 className="font-semibold text-gray-900">Hero Section</h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleSave()
          }}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name / Logo Text</label>
            <input
              type="text"
              value={content.brandName || ''}
              onChange={(e) => updateField('brandName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your brand or company name"
            />
            <p className="text-xs text-gray-500 mt-1">This appears as the logo text in the header</p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={content.firstName || ''}
                onChange={(e) => updateField('firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={content.lastName || ''}
                onChange={(e) => updateField('lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability Badge</label>
            <input
              type="text"
              value={content.badge || ''}
              onChange={(e) => updateField('badge', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Available for work"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={content.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline / Bio</label>
            <textarea
              value={content.tagline || ''}
              onChange={(e) => updateField('tagline', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={content.linkedinUrl || ''}
              onChange={(e) => updateField('linkedinUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://linkedin.com/in/yourprofile"
            />
            <p className="text-xs text-gray-500 mt-1">This will display as a button below your bio</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
            <input
              type="text"
              value={content.ctaText || ''}
              onChange={(e) => updateField('ctaText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Contact Me"
            />
          </div>

          {/* Profile Image Upload */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
            
            {content.profileImage ? (
              <div className="flex items-start gap-4">
                <div className="relative w-32 h-40 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={content.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-2">Current image uploaded</p>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Upload className="w-4 h-4" />
                    Replace Image
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                      }}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-gray-400 animate-spin mb-2" />
                    <span className="text-sm text-gray-500">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">Click to upload profile image</span>
                    <span className="text-xs text-gray-400 mt-1">Recommended: 600x800px, JPG or PNG</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                />
              </label>
            )}
          </div>

          {/* Stats */}
          <div className="border-t pt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Experience Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years (e.g., "10+")</label>
                <input
                  type="text"
                  value={content.stats?.years || ''}
                  onChange={(e) => handleStatsChange('years', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={content.stats?.yearsLabel || ''}
                  onChange={(e) => handleStatsChange('yearsLabel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Years of experience"
                />
              </div>
            </div>
          </div>

          {/* Social Links (View At) */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Social Links (View At)</h4>
                <p className="text-xs text-gray-500 mt-1">Links shown in the "View At:" section</p>
              </div>
              <button
                onClick={addSocialLink}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>
            <div className="space-y-3">
              {(content.socialLinks || []).map((link, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-32">
                    <select
                      value={link.platform}
                      onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                      className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter/X</option>
                      <option value="github">GitHub</option>
                      <option value="dribbble">Dribbble</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <button
                    onClick={() => removeSocialLink(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(!content.socialLinks || content.socialLinks.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">No social links added yet. Click "Add Link" to add one.</p>
              )}
            </div>
          </div>

          {/* Awards */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">Awards</h4>
              <button
                onClick={addAward}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                <Plus className="w-4 h-4" />
                Add Award
              </button>
            </div>
            <div className="space-y-4">
              {content.awards?.map((award, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="text-gray-400 cursor-move">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                      <select
                        value={award.icon}
                        onChange={(e) => handleAwardChange(index, 'icon', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                      >
                        <option value="fwa">FWA</option>
                        <option value="blogs">Blogs</option>
                        <option value="landing">Landing Page</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={award.title}
                        onChange={(e) => handleAwardChange(index, 'title', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                        placeholder="Award title"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={award.subtitle}
                        onChange={(e) => handleAwardChange(index, 'subtitle', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                        placeholder="Description"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeAward(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
