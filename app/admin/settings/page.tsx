"use client"

import { useEffect, useState } from "react"
import { Loader2, Save, Upload } from "lucide-react"
import type { SiteSettings } from "@/lib/types/cms"

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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

  const updateField = (field: keyof SiteSettings, value: string) => {
    if (!settings) return
    setSettings({ ...settings, [field]: value })
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
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Logo URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.logo_url || ""}
                  onChange={(e) => updateField("logo_url", e.target.value)}
                  className="flex-1 px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
              {settings.logo_url && (
                <div className="mt-3 p-4 bg-zinc-50 rounded-lg">
                  <img
                    src={settings.logo_url}
                    alt="Logo preview"
                    className="max-h-16 object-contain"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Favicon URL
              </label>
              <input
                type="text"
                value={settings.favicon_url || ""}
                onChange={(e) => updateField("favicon_url", e.target.value)}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
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
