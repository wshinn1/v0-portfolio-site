import { getCMSData } from '@/lib/cms/get-cms-data'
import { TypographyProvider, H1, H2, Body } from '@/components/cms/typography-provider'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  const { typography, siteSettings, sections } = await getCMSData()
  
  // Get hero section content
  const heroSection = sections.find((s) => s.section_type === 'hero')
  const heroContent = heroSection?.content as { firstName?: string; lastName?: string; tagline?: string } | undefined

  return (
    <TypographyProvider typography={typography}>
      <main 
        className="min-h-screen p-8"
        style={{ backgroundColor: siteSettings?.background_color || '#f5f5f5' }}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Site Name */}
          <div className="text-center">
            <H1>{siteSettings?.site_name || 'Portfolio'}</H1>
          </div>

          {/* Hero Preview */}
          {heroContent && (
            <div className="space-y-4">
              <H2>
                {heroContent.firstName} {heroContent.lastName}
              </H2>
              <Body>{heroContent.tagline}</Body>
            </div>
          )}

          {/* Sections List */}
          <div className="mt-12 p-6 bg-white rounded-lg border">
            <h3 className="font-semibold mb-4">Loaded Sections:</h3>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id} className="flex items-center gap-2">
                  <span 
                    className="px-2 py-1 text-xs rounded-full"
                    style={{ 
                      backgroundColor: siteSettings?.primary_color || '#ff6b4a',
                      color: '#fff'
                    }}
                  >
                    {section.section_type}
                  </span>
                  <span>{section.title}</span>
                  {!section.is_visible && (
                    <span className="text-xs text-gray-400">(hidden)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Typography Preview */}
          <div className="mt-12 p-6 bg-white rounded-lg border">
            <h3 className="font-semibold mb-4">Typography Settings Loaded:</h3>
            <ul className="space-y-2 text-sm">
              {typography.map((t) => (
                <li key={t.id} className="flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                    {t.element_type}
                  </span>
                  <span>{t.font_family}</span>
                  <span className="text-gray-400">|</span>
                  <span>{t.font_size}</span>
                  <span className="text-gray-400">|</span>
                  <span>{t.font_weight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin Link */}
          <div className="text-center pt-8">
            <a 
              href="/admin" 
              className="inline-block px-6 py-3 rounded-full text-white font-medium"
              style={{ backgroundColor: siteSettings?.primary_color || '#ff6b4a' }}
            >
              Go to Admin Panel
            </a>
          </div>
        </div>
      </main>
    </TypographyProvider>
  )
}
