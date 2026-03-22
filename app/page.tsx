import { getCMSData } from '@/lib/cms/get-cms-data'
import { TypographyProvider } from '@/components/cms/typography-provider'
import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { WorkSection } from '@/components/sections/work-section'
import type { HeroContent, AboutContent, WorkContent } from '@/lib/types/cms'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  const { typography, siteSettings, sections } = await getCMSData()
  
  // Get section contents
  const heroSection = sections.find((s) => s.section_type === 'hero')
  const heroContent = heroSection?.content as HeroContent | undefined
  
  const aboutSection = sections.find((s) => s.section_type === 'about')
  const aboutContent = aboutSection?.content as AboutContent | undefined
  
  const workSection = sections.find((s) => s.section_type === 'work')
  const workContent = workSection?.content as WorkContent | undefined

  return (
    <TypographyProvider typography={typography}>
      <main 
        className="min-h-screen"
        style={{ backgroundColor: siteSettings?.background_color || '#f5f5f5' }}
      >
        {/* Fixed Left Sidebar - will be built in Phase 11 */}
        <div className="flex">
          {/* Placeholder for sidebar */}
          <aside className="hidden lg:block w-[35%] min-h-screen fixed left-0 top-0 border-r border-gray-200 bg-inherit p-8">
            <div className="h-full flex flex-col justify-between">
              <div>
                {/* Logo placeholder */}
                <span 
                  className="text-2xl font-bold italic"
                  style={{ color: siteSettings?.primary_color || '#ff6b4a' }}
                >
                  {siteSettings?.site_name || 'Worq'}
                </span>
              </div>
              <nav className="space-y-4">
                {sections.map((section) => (
                  <a 
                    key={section.id}
                    href={`#${section.section_type}`}
                    className="block text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
              <div className="text-sm text-gray-500">
                <a href="/admin" className="hover:text-gray-700">
                  Admin Panel
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="w-full lg:w-[65%] lg:ml-[35%] min-h-screen">
            <div className="p-8 lg:p-16">
              {/* Hero Section */}
              {heroContent && siteSettings && (
                <HeroSection 
                  content={heroContent} 
                  siteSettings={siteSettings}
                />
              )}

              {/* About Section */}
              {aboutContent && (
                <AboutSection content={aboutContent} />
              )}

              {/* Work Section */}
              {workContent && siteSettings && (
                <WorkSection 
                  content={workContent} 
                  primaryColor={siteSettings.primary_color}
                />
              )}

              {/* Placeholder for remaining sections */}
              <div className="mt-16 py-8 border-t border-gray-200 text-center text-gray-400">
                <p className="text-sm">More sections coming in Phase 7-10...</p>
                <p className="text-xs mt-2">Services, Experience, FAQ, Contact</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </TypographyProvider>
  )
}
