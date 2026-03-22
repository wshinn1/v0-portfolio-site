# Portfolio CMS - Development Plan

## Project Overview

A single-page portfolio website with a full CMS backend that allows editing of all sections, typography, and styling. The frontend features a fixed left sidebar navigation with smooth-scrolling content on the right side.

---

## Architecture

### Frontend Structure
- **Layout**: Fixed left sidebar (navigation/branding) + Scrollable right content area
- **Sections**: Hero, About, Work, Services, Experience, FAQ, Contact
- **Effects**: Custom expanding circle cursor, smooth scrolling
- **Typography**: Dynamic Google Fonts loaded from CMS settings

### Backend Structure
- **Admin Route**: `/admin` - Protected CMS dashboard
- **Data Storage**: Database (Supabase/Neon) for persistent storage
- **API Routes**: CRUD operations for sections and settings

---

## Sections (Components) to Build

| Section | Description | Editable Fields |
|---------|-------------|-----------------|
| **Hero** | Main landing with name, title, image, stats, awards | Name, subtitle, bio, image, stats (years exp), awards list, "Top Rated" badges, availability status |
| **About** | Bio section with CTA buttons | Section label, headline, job title, bio text, button 1 (text/link), button 2 (text/link) |
| **Work** | Portfolio grid with project cards | Section label, headline, categories list, projects (image, title, category, link) |
| **Services** | Services grid with icons | Section label, headline, services (icon, title, description) |
| **Experience** | Timeline of work history (expandable) | Section label, headline, experiences (company, role, date range, description - expandable) |
| **FAQ** | Accordion Q&A | Section label, headline, questions (question, answer) |
| **Contact** | Contact info + social links + footer | Logo/signature, headline, CTA button, phone, email, social links, image, bio text, copyright, footer links |

---

## Phase Breakdown

### Phase 1: Foundation & Database Setup ✅ COMPLETE
**Goal**: Set up database schema, Supabase client, and basic project structure

- [x] Connect Supabase integration (CONNECTED)
- [x] Connect Vercel Blob integration (CONNECTED)
- [x] Set up Supabase client files (`lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`)
- [x] Create database schema with RLS:
  - `typography` (H1, H2, H3, body, small, label - font family, size, weight, color)
  - `site_settings` (global settings)
  - `sections` (section data with JSON content)
- [x] Create Blob upload API route (`/api/upload`)
- [x] Create initial seed data (all 7 sections seeded)
- [x] Set up API routes for CRUD operations (`/api/cms/*`)
- [x] Create TypeScript types (`lib/types/cms.ts`)
- [x] Create CMS data fetching utilities (`lib/cms/get-cms-data.ts`)

---

### Phase 2: Typography System ✅ COMPLETE
**Goal**: Build typography management that connects frontend to backend

- [x] Typography settings table structure (created in Phase 1)
- [x] Create Google Fonts loader component (`components/cms/google-fonts-loader.tsx`)
  - Dynamically loads Google Fonts based on typography settings
  - Supports 28+ popular Google Fonts
- [x] Build typography context/provider for frontend (`components/cms/typography-provider.tsx`)
  - Provides `useTypography()` hook
  - Pre-built components: H1, H2, H3, Body, Small, Label
  - `getStyle()` function for inline styles
- [x] Create typography admin panel (`components/admin/typography-editor.tsx`)
  - Google Font selector dropdown
  - Font size, weight, line-height, letter-spacing controls
  - Color picker with hex input
  - Live preview for each typography element
  - Collapsible sections for each element type

---

### Phase 3: Admin Dashboard Shell ✅ COMPLETE
**Goal**: Build the CMS admin interface structure

- [x] Create `/admin` route with layout (`app/admin/layout.tsx`)
  - Sidebar navigation with Dashboard, Sections, Typography, Settings
  - Sign out functionality
- [x] Create `/admin/login` page with authentication
- [x] Create admin dashboard page with stats and quick actions (`app/admin/page.tsx`)
- [x] Build collapsible section panels UI (`app/admin/sections/page.tsx`)
  - Expand/collapse functionality
  - Visibility toggle per section
  - Basic field editing with save
- [x] Add typography settings panel (`app/admin/typography/page.tsx`)
  - Uses TypographyEditor component
- [x] Add global settings panel (`app/admin/settings/page.tsx`)
  - Site name, meta description
  - Logo and favicon URLs
  - Primary, secondary, background colors with live preview

---

### Phase 4: Hero Section (Frontend + Admin) ✅ COMPLETE
**Goal**: Build Hero section with full CMS integration

**Frontend Components:**
- [x] Hero layout (3-column: left info, center image, right stats)
- [x] "Available for work" badge with animated dot
- [x] Name with stylized typography (bold first, light last)
- [x] Bio text
- [x] "Top Rated on" badges section (Dribbble, Behance, Upwork)
- [x] Stats section (years of experience with stacked label)
- [x] Awards list with custom icons

**Admin Panel:**
- [x] Hero section editor (`components/admin/section-editors/hero-editor.tsx`)
- [x] Image upload for profile photo with Blob integration
- [x] Dynamic awards list (add/remove/edit)
- [x] Platform badges toggle
- [x] Stats editor

**Files Created:**
- `components/sections/hero-section.tsx` - Frontend Hero component
- `components/admin/section-editors/hero-editor.tsx` - Admin editor for Hero
- Updated `app/page.tsx` - Homepage with fixed sidebar layout preview

---

### Phase 5: About Section (Frontend + Admin) ✅ COMPLETE
**Goal**: Build About section with CMS integration

**Frontend Components:**
- [x] Section label badge ("ABOUT") - black pill style
- [x] Headline - large bold text
- [x] Job title - secondary heading
- [x] Bio paragraph - readable body text
- [x] Two CTA buttons (Download Resume - dark, Contact Me - coral)

**Admin Panel:**
- [x] Text fields for all content (label, heading, job title, description)
- [x] Button configurator (text and link for resume, text for contact)

**Files Created:**
- `components/sections/about-section.tsx` - Frontend About component
- `components/admin/section-editors/about-editor.tsx` - Admin editor

---

### Phase 6: Work/Portfolio Section (Frontend + Admin) ✅ COMPLETE
**Goal**: Build portfolio grid with project management

**Frontend Components:**
- [x] Section label + headline (left side, sticky)
- [x] Category filter list with active state
- [x] Project grid (2 columns, responsive)
- [x] Project cards with hover effects and image zoom
- [x] Project links to external URLs
- [x] Placeholder images for empty projects

**Admin Panel:**
- [x] Category manager (add/remove)
- [x] Project list with:
  - Image upload with Blob integration
  - Title, category fields
  - External link URL
  - Remove functionality

**Files Created:**
- `components/sections/work-section.tsx` - Frontend Work component
- `components/admin/section-editors/work-editor.tsx` - Admin editor

---

### Phase 7: Services Section (Frontend + Admin) ✅ COMPLETE
**Goal**: Build services grid with icon management

**Frontend Components:**
- [x] Section label + headline (left side, sticky)
- [x] Services grid (2x2 responsive)
- [x] Service cards with custom SVG icons, title, description
- [x] Divider lines between cards (border styling)

**Admin Panel:**
- [x] Service list manager (add/remove services)
- [x] Icon selector dropdown (web, graphic, app, brand)
- [x] Title and description fields

**Files Created:**
- `components/sections/services-section.tsx` - Frontend Services component with SVG icons
- `components/admin/section-editors/services-editor.tsx` - Admin editor

---

### Phase 8: Experience Section (Frontend + Admin) ✅ COMPLETE
**Goal**: Build expandable experience timeline

**Frontend Components:**
- [x] Section label + headline (left side, sticky)
- [x] Experience list with dividers
- [x] Each item: Company, Role, Date range
- [x] Expandable details (click to reveal more info) with chevron icons
- [x] Smooth expand/collapse animation

**Admin Panel:**
- [x] Experience list manager (add/remove)
- [x] Fields: Company, Role, Period, Description
- [x] Save functionality

**Files Created:**
- `components/sections/experience-section.tsx` - Frontend with expandable items
- `components/admin/section-editors/experience-editor.tsx` - Admin editor

---

### Phase 9: FAQ Section (Frontend + Admin)
**Goal**: Build accordion FAQ component

**Frontend Components:**
- [ ] Section label + headline (left side)
- [ ] Accordion list with +/- icons
- [ ] Smooth expand/collapse animation
- [ ] Answer reveal on click

**Admin Panel:**
- [ ] FAQ list manager
- [ ] Question and Answer fields (rich text for answer)
- [ ] Reorder functionality

---

### Phase 10: Contact/Footer Section (Frontend + Admin)
**Goal**: Build contact section and footer

**Frontend Components:**
- [ ] Logo/signature image (left side)
- [ ] Headline with CTA button
- [ ] Contact info (phone, email)
- [ ] Social links with icons
- [ ] Profile image with bio text
- [ ] Footer with copyright and links

**Admin Panel:**
- [ ] Logo/signature upload
- [ ] Headline and CTA button config
- [ ] Contact info fields
- [ ] Social links manager (platform, URL)
- [ ] Footer text and links

---

### Phase 11: Layout & Navigation
**Goal**: Build the fixed sidebar and scrolling layout

**Frontend Components:**
- [ ] Fixed left sidebar (30-40% width)
- [ ] Scrollable right content area
- [ ] Navigation links that scroll to sections
- [ ] Active section indicator
- [ ] Smooth scroll behavior

**Admin Panel:**
- [ ] Navigation items manager
- [ ] Section visibility toggles (show/hide sections)

---

### Phase 12: Custom Cursor Effect
**Goal**: Implement the expanding circle cursor

- [ ] Create cursor component
- [ ] Track mouse position
- [ ] Implement expanding circle animation on hover
- [ ] Different states for different elements
- [ ] Disable on touch devices

---

### Phase 13: Polish & Optimization
**Goal**: Final touches and performance

- [ ] Loading states for admin
- [ ] Error handling
- [ ] Image optimization
- [ ] SEO meta tags from CMS
- [ ] Mobile responsive adjustments
- [ ] Performance optimization

---

## Database Schema (Final)

```sql
-- Typography settings (no RLS - public read, admin write via service role)
CREATE TABLE typography (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  element_type VARCHAR(20) UNIQUE NOT NULL, -- h1, h2, h3, body, small, label
  font_family VARCHAR(100) DEFAULT 'Inter',
  font_size VARCHAR(20) DEFAULT '16px',
  font_weight VARCHAR(10) DEFAULT '400',
  line_height VARCHAR(10) DEFAULT '1.5',
  letter_spacing VARCHAR(20) DEFAULT 'normal',
  color VARCHAR(20) DEFAULT '#1a1a1a',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings (single row for global config)
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name VARCHAR(100) DEFAULT 'Portfolio',
  logo_url TEXT,
  favicon_url TEXT,
  meta_description TEXT,
  primary_color VARCHAR(20) DEFAULT '#ff6b4a',
  secondary_color VARCHAR(20) DEFAULT '#1a1a1a',
  background_color VARCHAR(20) DEFAULT '#f5f5f5',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sections (flexible JSON storage for all section content)
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type VARCHAR(50) UNIQUE NOT NULL, -- hero, about, work, services, experience, faq, contact
  title VARCHAR(100), -- Display title for admin
  content JSONB NOT NULL DEFAULT '{}', -- All section-specific data
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables (public read, authenticated write)
ALTER TABLE typography ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Public read policies (frontend can read all data)
CREATE POLICY "Public read typography" ON typography FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read sections" ON sections FOR SELECT USING (true);

-- Authenticated write policies (admin can modify)
CREATE POLICY "Auth write typography" ON typography FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write sections" ON sections FOR ALL USING (auth.role() = 'authenticated');
```

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL with RLS)
- **File Storage**: Vercel Blob (private access)
- **Auth**: Supabase Auth (for admin protection)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Fonts**: Google Fonts (dynamically loaded)
- **Icons**: Lucide React
- **State Management**: React Context + SWR

---

## Design Reference

### Color Palette
- Background: Light gray (`#f5f5f5`)
- Text Primary: Near black (`#1a1a1a`)
- Text Secondary: Gray (`#666666`)
- Accent: Coral/Orange (`#ff6b4a`)
- White: (`#ffffff`)

### Typography (Default)
- Headings: Bold, large, high contrast
- Body: Regular weight, comfortable reading size
- Labels: Uppercase, small, badge-style

### Layout
- Left sidebar: ~35% width, fixed position
- Right content: ~65% width, scrollable
- Section padding: Generous whitespace
- Card styling: Minimal, clean borders

---

## Notes

- All text content should be editable from the CMS
- Images should support upload and URL input
- Typography changes should apply globally and instantly
- Admin should have autosave or explicit save button
- Consider adding preview mode for admin

---

## Next Steps

1. Review this plan and confirm the phases
2. Choose database provider (Supabase recommended for auth + storage)
3. Start with Phase 1: Foundation & Database Setup

---

*Last Updated: March 22, 2026*
