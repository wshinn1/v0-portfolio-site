'use client'

import { useState } from 'react'
import type { Typography } from '@/lib/types/cms'
import { GOOGLE_FONTS } from '@/components/cms/google-fonts-loader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown, Save, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TypographyEditorProps {
  typography: Typography[]
  onSave: (typography: Typography[]) => Promise<void>
}

const ELEMENT_LABELS: Record<string, string> = {
  h1: 'Heading 1 (H1)',
  h2: 'Heading 2 (H2)',
  h3: 'Heading 3 (H3)',
  body: 'Body Text',
  small: 'Small Text',
  label: 'Labels / Badges',
}

const FONT_WEIGHTS = [
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Regular (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semi Bold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: '800', label: 'Extra Bold (800)' },
]

export function TypographyEditor({ typography, onSave }: TypographyEditorProps) {
  const [localTypography, setLocalTypography] = useState<Typography[]>(typography)
  const [saving, setSaving] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>(['h1'])

  const updateField = (
    elementType: string,
    field: keyof Typography,
    value: string
  ) => {
    setLocalTypography((prev) =>
      prev.map((t) =>
        t.element_type === elementType ? { ...t, [field]: value } : t
      )
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(localTypography)
    } finally {
      setSaving(false)
    }
  }

  const toggleSection = (elementType: string) => {
    setOpenSections((prev) =>
      prev.includes(elementType)
        ? prev.filter((s) => s !== elementType)
        : [...prev, elementType]
    )
  }

  // Sort typography by display order
  const sortedTypography = [...localTypography].sort((a, b) => {
    const order = ['h1', 'h2', 'h3', 'body', 'small', 'label']
    return order.indexOf(a.element_type) - order.indexOf(b.element_type)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Typography Settings</h2>
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="space-y-2">
        {sortedTypography.map((typo) => (
          <Collapsible
            key={typo.element_type}
            open={openSections.includes(typo.element_type)}
            onOpenChange={() => toggleSection(typo.element_type)}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="font-medium text-foreground">
                  {ELEMENT_LABELS[typo.element_type] || typo.element_type}
                </span>
                <span
                  className="text-muted-foreground"
                  style={{
                    fontFamily: `'${typo.font_family}', sans-serif`,
                    fontSize: '14px',
                  }}
                >
                  {typo.font_family} / {typo.font_size} / {typo.font_weight}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'h-5 w-5 text-muted-foreground transition-transform',
                  openSections.includes(typo.element_type) && 'rotate-180'
                )}
              />
            </CollapsibleTrigger>

            <CollapsibleContent className="border-x border-b border-border rounded-b-lg bg-card">
              <div className="p-4 space-y-4">
                {/* Preview */}
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                  <div
                    style={{
                      fontFamily: `'${typo.font_family}', sans-serif`,
                      fontSize: typo.font_size,
                      fontWeight: typo.font_weight as React.CSSProperties['fontWeight'],
                      lineHeight: typo.line_height,
                      letterSpacing: typo.letter_spacing,
                      color: typo.color,
                    }}
                  >
                    {typo.element_type === 'h1' && 'The Quick Brown Fox'}
                    {typo.element_type === 'h2' && 'Jumps Over The Lazy Dog'}
                    {typo.element_type === 'h3' && 'Sample Heading Text'}
                    {typo.element_type === 'body' &&
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'}
                    {typo.element_type === 'small' && 'Small helper text example'}
                    {typo.element_type === 'label' && 'SECTION LABEL'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Font Family */}
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select
                      value={typo.font_family}
                      onValueChange={(value) =>
                        updateField(typo.element_type, 'font_family', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GOOGLE_FONTS.map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Font Weight */}
                  <div className="space-y-2">
                    <Label>Font Weight</Label>
                    <Select
                      value={typo.font_weight}
                      onValueChange={(value) =>
                        updateField(typo.element_type, 'font_weight', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_WEIGHTS.map((weight) => (
                          <SelectItem key={weight.value} value={weight.value}>
                            {weight.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Input
                      value={typo.font_size}
                      onChange={(e) =>
                        updateField(typo.element_type, 'font_size', e.target.value)
                      }
                      placeholder="16px"
                    />
                  </div>

                  {/* Line Height */}
                  <div className="space-y-2">
                    <Label>Line Height</Label>
                    <Input
                      value={typo.line_height}
                      onChange={(e) =>
                        updateField(typo.element_type, 'line_height', e.target.value)
                      }
                      placeholder="1.5"
                    />
                  </div>

                  {/* Letter Spacing */}
                  <div className="space-y-2">
                    <Label>Letter Spacing</Label>
                    <Input
                      value={typo.letter_spacing}
                      onChange={(e) =>
                        updateField(typo.element_type, 'letter_spacing', e.target.value)
                      }
                      placeholder="normal"
                    />
                  </div>

                  {/* Color */}
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={typo.color}
                        onChange={(e) =>
                          updateField(typo.element_type, 'color', e.target.value)
                        }
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={typo.color}
                        onChange={(e) =>
                          updateField(typo.element_type, 'color', e.target.value)
                        }
                        placeholder="#1a1a1a"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}
