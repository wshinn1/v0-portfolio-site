"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { TypographyEditor } from "@/components/admin/typography-editor"
import type { Typography } from "@/lib/types/cms"

export default function TypographyPage() {
  const [typography, setTypography] = useState<Typography[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTypography() {
      try {
        const res = await fetch("/api/cms/typography")
        if (res.ok) {
          const data = await res.json()
          setTypography(data)
        } else {
          setError("Failed to load typography settings")
        }
      } catch (error) {
        console.error("Error fetching typography:", error)
        setError("Failed to load typography settings")
      } finally {
        setIsLoading(false)
      }
    }
    fetchTypography()
  }, [])

  const handleSave = async (updatedTypography: Typography[]) => {
    try {
      const res = await fetch("/api/cms/typography", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTypography),
      })

      if (res.ok) {
        setTypography(updatedTypography)
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving typography:", error)
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Typography</h1>
        <p className="text-zinc-500 mt-2">
          Customize fonts, sizes, and colors for your portfolio
        </p>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <TypographyEditor typography={typography} onSave={handleSave} />
      </div>
    </div>
  )
}
