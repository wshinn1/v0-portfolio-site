import { getCMSData } from '@/lib/cms/get-cms-data'
import { TypographyProvider } from '@/components/cms/typography-provider'
import { HeroSection } from '@/components/sections/hero-section'
import { AboutSection } from '@/components/sections/about-section'
import { WorkSection } from '@/components/sections/work-section'
import { ServicesSection } from '@/components/sections/services-section'
import { ExperienceSection } from '@/components/sections/experience-section'
import { FAQSection } from '@/components/sections/faq-section'
import { ContactSection } from '@/components/sections/contact-section'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { ActiveNav } from '@/components/layout/active-nav'
import type { HeroContent, AboutContent, WorkContent, ServicesContent, ExperienceContent, FAQContent, ContactContent } from '@/lib/types/cms'

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
  
  const servicesSection = sections.find((s) => s.section_type === 'services')
  const servicesContent = servicesSection?.content as ServicesContent | undefined
  
  const experienceSection = sections.find((s) => s.section_type === 'experience')
  const experienceContent = experienceSection?.content as ExperienceContent | undefined
  
  const faqSection = sections.find((s) => s.section_type === 'faq')
  const faqContent = faqSection?.content as FAQContent | undefined
  
  const contactSection = sections.find((s) => s.section_type === 'contact')
  const contactContent = contactSection?.content as ContactContent | undefined

  return (
    <TypographyProvider typography={typography}>
      <main 
        className="min-h-screen scroll-smooth"
        style={{ backgroundColor: siteSettings?.background_color || '#f5f5f5' }}
      >
        {/* Mobile Menu */}
        <MobileMenu 
          sections={sections.map(s => ({ id: s.id, section_type: s.section_type, title: s.title || s.section_type }))}
          siteName={siteSettings?.site_name || 'Worq'}
          primaryColor={siteSettings?.primary_color || '#ff6b4a'}
        />

        {/* Fixed Left Sidebar - Desktop Only */}
        <div className="flex">
          <aside className="hidden lg:block w-[13%] min-w-[160px] max-w-[200px] min-h-screen fixed left-0 top-0 border-r border-gray-200 bg-inherit p-4">
            <div className="h-full flex flex-col justify-between">
              <div>
                {/* Logo */}
                <span 
                  className="text-xl font-bold italic"
                  style={{ color: siteSettings?.primary_color || '#ff6b4a' }}
                >
                  {siteSettings?.site_name || 'Worq'}
                </span>
              </div>
              <ActiveNav 
                sections={sections.map(s => ({ id: s.id, section_type: s.section_type, title: s.title || s.section_type }))}
                primaryColor={siteSettings?.primary_color || '#ff6b4a'}
              />
              <div className="text-xs text-gray-500">
                <a href="/admin" className="hover:text-gray-700">
                  Admin Panel
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="w-full lg:w-[87%] lg:ml-[13%] min-h-screen pt-16 lg:pt-0">
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

              {/* Services Section */}
              {servicesContent && (
                <ServicesSection content={servicesContent} />
              )}

              {/* Experience Section */}
              {experienceContent && (
                <ExperienceSection content={experienceContent} />
              )}

              {/* FAQ Section */}
              {faqContent && (
                <FAQSection content={faqContent} />
              )}

              {/* Contact Section */}
              {contactContent && siteSettings && (
                <ContactSection 
                  content={contactContent} 
                  primaryColor={siteSettings.primary_color}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </TypographyProvider>
  )
}
