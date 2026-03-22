'use client'

import { useState } from 'react'
import type { HeroContent } from '@/lib/types/cms'
import { Upload, Plus, Trash2, GripVertical } from 'lucide-react'

interface HeroEditorProps {
  content: HeroContent
  onChange: (content: HeroContent) => void
  onImageUpload: (file: File) => Promise<string>
}

export function HeroEditor({ content, onChange, onImageUpload }: HeroEditorProps) {
  const [uploading, setUploading] = useState(false)

  const handleChange = (field: keyof HeroContent, value: string | HeroContent['stats'] | HeroContent['awards'] | HeroContent['topRatedOn']) => {
    onChange({ ...content, [field]: value })
  }

  const handleStatsChange = (field: keyof HeroContent['stats'], value: string) => {
    onChange({
      ...content,
      stats: { ...content.stats, [field]: value }
    })
  }

  const handleAwardChange = (index: number, field: keyof HeroContent['awards'][0], value: string) => {
    const newAwards = [...content.awards]
    newAwards[index] = { ...newAwards[index], [field]: value }
    onChange({ ...content, awards: newAwards })
  }

  const addAward = () => {
    onChange({
      ...content,
      awards: [...content.awards, { icon: 'fwa', title: '', subtitle: '' }]
    })
  }

  const removeAward = (index: number) => {
    onChange({
      ...content,
      awards: content.awards.filter((_, i) => i !== index)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await onImageUpload(file)
      handleChange('profileImage', url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handlePlatformToggle = (platform: string) => {
    const current = content.topRatedOn || []
    if (current.includes(platform)) {
      handleChange('topRatedOn', current.filter(p => p !== platform))
    } else {
      handleChange('topRatedOn', [...current, platform])
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={content.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={content.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Availability Badge
        </label>
        <input
          type="text"
          value={content.badge}
          onChange={(e) => handleChange('badge', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Available for work"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={content.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tagline / Bio
        </label>
        <textarea
          value={content.tagline}
          onChange={(e) => handleChange('tagline', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CTA Button Text
        </label>
        <input
          type="text"
          value={content.ctaText}
          onChange={(e) => handleChange('ctaText', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Contact Me"
        />
      </div>

      {/* Profile Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Image
        </label>
        <div className="flex items-start gap-4">
          {content.profileImage ? (
            <div className="relative w-24 h-32 rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={content.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleChange('profileImage', '')}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ) : (
            <div className="w-24 h-32 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          <div className="flex-1">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <Upload size={16} />
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Recommended: 600x800px, JPG or PNG
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-t pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Experience Stats</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years (e.g., "10+")
            </label>
            <input
              type="text"
              value={content.stats.years}
              onChange={(e) => handleStatsChange('years', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              value={content.stats.yearsLabel}
              onChange={(e) => handleStatsChange('yearsLabel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Years of experience"
            />
          </div>
        </div>
      </div>

      {/* Top Rated Platforms */}
      <div className="border-t pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Top Rated On</h4>
        <div className="flex flex-wrap gap-2">
          {['dribbble', 'behance', 'upwork'].map((platform) => (
            <button
              key={platform}
              onClick={() => handlePlatformToggle(platform)}
              className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                content.topRatedOn?.includes(platform)
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {platform}
            </button>
          ))}
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
            <Plus size={14} />
            Add Award
          </button>
        </div>
        <div className="space-y-4">
          {content.awards.map((award, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="text-gray-400 cursor-move">
                <GripVertical size={16} />
              </div>
              <div className="flex-1 grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Icon
                  </label>
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={award.title}
                    onChange={(e) => handleAwardChange(index, 'title', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg"
                    placeholder="Award title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Subtitle
                  </label>
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
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
