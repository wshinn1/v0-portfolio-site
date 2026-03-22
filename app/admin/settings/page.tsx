"use client"

import { useEffect, useState } from "react"
import { Loader2, Save, Upload, Image, X } from "lucide-react"
import { useRef, useState as useStateRef } from "react"
import type { SiteSettings } from "@/lib/types/cms"

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingOG, setIsUploadingOG] = useState(false)
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const ogImageInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/cms/settings")
        if (res.ok) {
          const data = await res.json()
          setSettings(data)
        } else {
          setError("Failed to load settings")
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
        setError("Failed to load settings")
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    if (!settings) return

    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch("/api/cms/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      setError("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = (field: keyof SiteSettings, value: string | null) => {
    if (!settings) return
    setSettings({ ...settings, [field]: value })
  }

  const handleImageUpload = async (file: File, field: 'og_image' | 'favicon_url' | 'logo_url', setUploading: (v: boolean) => void) => {
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/x-icon', 'image/svg+xml', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, WebP, ICO, SVG, or GIF)')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        updateField(field, data.url)
      } else {
        setError('Upload failed. Please try again.')
      }
    } catch (err) {
      console.error('Upload failed:', err)
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error || "No settings found"}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Site Settings</h1>
          <p className="text-zinc-500 mt-2">
            Configure global settings for your portfolio
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Settings saved successfully!
        </div>
      )}

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="text-xl font-semibold text-zinc-900 mb-6">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.site_name || ""}
                onChange={(e) => updateField("site_name", e.target.value)}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                placeholder="My Portfolio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Meta Description
              </label>
              <textarea
                value={settings.meta_description || ""}
                onChange={(e) => updateField("meta_description", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
                placeholder="A brief description of your portfolio..."
              />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="text-xl font-semibold text-zinc-900 mb-6">Branding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Logo
              </label>
              <p className="text-xs text-zinc-400 mb-3">
                Your site logo (recommended: PNG or SVG)
              </p>
              
              {settings.logo_url ? (
                <div className="relative inline-block">
                  <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                    <img
                      src={settings.logo_url}
                      alt="Logo preview"
                      className="max-h-16 object-contain"
                    />
                  </div>
                  <button
                    onClick={() => updateField('logo_url', null)}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove logo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-zinc-300 rounded-lg cursor-pointer hover:bg-zinc-50 transition-colors">
                  {isUploadingLogo ? (
                    <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-6 h-6 text-zinc-400 mb-1" />
                      <span className="text-sm text-zinc-500">Upload logo</span>
                    </div>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingLogo}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'logo_url', setIsUploadingLogo)
                    }}
                  />
                </label>
              )}
            </div>

            {/* Favicon */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Favicon
              </label>
              <p className="text-xs text-zinc-400 mb-3">
                The small icon shown in browser tabs (recommended: 32x32 PNG or ICO)
              </p>
              
              {settings.favicon_url ? (
                <div className="relative inline-block">
                  <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center gap-3">
                    <img
                      src={settings.favicon_url}
                      alt="Favicon preview"
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-sm text-zinc-500">Favicon uploaded</span>
                  </div>
                  <button
                    onClick={() => updateField('favicon_url', null)}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove favicon"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-zinc-300 rounded-lg cursor-pointer hover:bg-zinc-50 transition-colors">
                  {isUploadingFavicon ? (
                    <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-6 h-6 text-zinc-400 mb-1" />
                      <span className="text-sm text-zinc-500">Upload favicon</span>
                    </div>
                  )}
                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept="image/png,image/x-icon,image/svg+xml,image/gif"
                    className="hidden"
                    disabled={isUploadingFavicon}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'favicon_url', setIsUploadingFavicon)
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Social Sharing / Open Graph */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">Social Sharing</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Customize how your portfolio appears when shared on social media
          </p>
          
          <div className="space-y-6">
            {/* OG Title */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Share Title
              </label>
              <input
                type="text"
                value={settings.og_title || ""}
                onChange={(e) => updateField("og_title", e.target.value)}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                placeholder="My Portfolio - Designer & Developer"
              />
              <p className="text-xs text-zinc-400 mt-1">
                The title shown when your site is shared. Falls back to Site Name if empty.
              </p>
            </div>

            {/* OG Description */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Share Description
              </label>
              <textarea
                value={settings.og_description || ""}
                onChange={(e) => updateField("og_description", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
                placeholder="A brief description that appears when shared on social media..."
              />
              <p className="text-xs text-zinc-400 mt-1">
                Falls back to Meta Description if empty.
              </p>
            </div>

            {/* OG Image Upload */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Share Image
              </label>
              <p className="text-xs text-zinc-400 mb-3">
                Recommended size: 1200x630 pixels. This image appears when your site is shared on social media.
              </p>
              
              {settings.og_image ? (
                <div className="relative">
                  <img
                    src={settings.og_image}
                    alt="OG Image preview"
                    className="w-full max-w-lg rounded-lg border border-zinc-200"
                  />
                  <button
                    onClick={() => updateField('og_image', null)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full max-w-lg h-40 border-2 border-dashed border-zinc-300 rounded-lg cursor-pointer hover:bg-zinc-50 transition-colors">
                  {isUploadingOG ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-8 h-8 text-zinc-400 animate-spin mb-2" />
                      <span className="text-sm text-zinc-500">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Image className="w-8 h-8 text-zinc-400 mb-2" />
                      <span className="text-sm text-zinc-500">Click to upload share image</span>
                      <span className="text-xs text-zinc-400 mt-1">JPEG, PNG, or WebP</span>
                    </div>
                  )}
                  <input
                    ref={ogImageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={isUploadingOG}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'og_image', setIsUploadingOG)
                    }}
                  />
                </label>
              )}
            </div>

            {/* Preview */}
            {(settings.og_title || settings.og_description || settings.og_image) && (
              <div className="mt-6 p-4 bg-zinc-50 rounded-lg">
                <p className="text-xs text-zinc-500 mb-3">Preview (approximate):</p>
                <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden max-w-md">
                  {settings.og_image && (
                    <img
                      src={settings.og_image}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-3">
                    <p className="font-semibold text-zinc-900 text-sm truncate">
                      {settings.og_title || settings.site_name || "Your Site Title"}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                      {settings.og_description || settings.meta_description || "Your site description..."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer / Copyright */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">Footer</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Customize the copyright text shown at the bottom of your site
          </p>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Copyright Text
            </label>
            <input
              type="text"
              value={settings.copyright_text || ""}
              onChange={(e) => updateField("copyright_text", e.target.value)}
              className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              placeholder="© 2026 Your Name. All rights reserved."
            />
            <p className="text-xs text-zinc-400 mt-1">
              This text appears in the footer of your portfolio.
            </p>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="text-xl font-semibold text-zinc-900 mb-6">Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Primary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.primary_color || "#ff6b4a"}
                  onChange={(e) => updateField("primary_color", e.target.value)}
                  className="w-12 h-12 p-1 border border-zinc-200 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primary_color || "#ff6b4a"}
                  onChange={(e) => updateField("primary_color", e.target.value)}
                  className="flex-1 px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Secondary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.secondary_color || "#1a1a1a"}
                  onChange={(e) => updateField("secondary_color", e.target.value)}
                  className="w-12 h-12 p-1 border border-zinc-200 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.secondary_color || "#1a1a1a"}
                  onChange={(e) => updateField("secondary_color", e.target.value)}
                  className="flex-1 px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Background Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.background_color || "#f5f5f5"}
                  onChange={(e) => updateField("background_color", e.target.value)}
                  className="w-12 h-12 p-1 border border-zinc-200 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.background_color || "#f5f5f5"}
                  onChange={(e) => updateField("background_color", e.target.value)}
                  className="flex-1 px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div className="mt-6 p-6 rounded-lg" style={{ backgroundColor: settings.background_color || "#f5f5f5" }}>
            <p className="text-sm text-zinc-500 mb-3">Preview:</p>
            <div className="flex items-center gap-4">
              <button
                className="px-6 py-3 rounded-lg text-white font-medium"
                style={{ backgroundColor: settings.primary_color || "#ff6b4a" }}
              >
                Primary Button
              </button>
              <button
                className="px-6 py-3 rounded-lg text-white font-medium"
                style={{ backgroundColor: settings.secondary_color || "#1a1a1a" }}
              >
                Secondary Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
