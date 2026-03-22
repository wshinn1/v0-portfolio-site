// Typography Types
export interface Typography {
  id: string
  element_type: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'label'
  font_family: string
  font_size: string
  font_weight: string
  line_height: string
  letter_spacing: string
  color: string
  created_at: string
  updated_at: string
}

// Site Settings Types
export interface SiteSettings {
  id: string
  site_name: string
  logo_url: string | null
  favicon_url: string | null
  meta_description: string | null
  primary_color: string
  secondary_color: string
  background_color: string
  og_image: string | null
  og_title: string | null
  og_description: string | null
  created_at: string
  updated_at: string
}

// Section Types
export interface Section {
  id: string
  section_type: SectionType
  title: string
  content: SectionContent
  sort_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export type SectionType = 
  | 'hero' 
  | 'about' 
  | 'work' 
  | 'services' 
  | 'experience' 
  | 'faq' 
  | 'contact'

// Section Content Types
export type SectionContent = 
  | HeroContent 
  | AboutContent 
  | WorkContent 
  | ServicesContent 
  | ExperienceContent 
  | FAQContent 
  | ContactContent

// Hero Section
export interface HeroContent {
  badge: string
  firstName: string
  lastName: string
  tagline: string
  email: string
  profileImage: string
  stats: {
    years: string
    yearsLabel: string
  }
  awards: {
    icon: string
    title: string
    subtitle: string
  }[]
  topRatedOn: string[]
  ctaText: string
}

// About Section
export interface AboutContent {
  label: string
  heading: string
  jobTitle: string
  description: string
  resumeUrl: string
  resumeButtonText: string
  contactButtonText: string
}

// Work Section
export interface WorkContent {
  label: string
  heading: string
  categories: string[]
  viewAllText: string
  projects: {
    title: string
    category: string
    image: string
    link: string
  }[]
}

// Services Section
export interface ServicesContent {
  label: string
  heading: string
  services: {
    icon: string
    title: string
    description: string
  }[]
}

// Experience Section
export interface ExperienceContent {
  label: string
  heading: string
  experiences: {
    company: string
    role: string
    period: string
    description: string
  }[]
}

// FAQ Section
export interface FAQContent {
  label: string
  heading: string
  questions: {
    question: string
    answer: string
  }[]
}

// Contact Section
export interface ContactContent {
  logoText: string
  heading: string
  ctaText: string
  phone: string
  email: string
  profileImage: string
  bio: string
  socialLinks: {
    platform: string
    url: string
  }[]
  copyright: string
  footerLinks: {
    label: string
    url: string
  }[]
}

// CMS Data Bundle (for frontend)
export interface CMSData {
  typography: Typography[]
  siteSettings: SiteSettings | null
  sections: Section[]
}
