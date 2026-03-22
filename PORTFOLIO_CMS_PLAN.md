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

### Phase 1: Foundation & Database Setup
**Goal**: Set up database schema and basic project structure

- [ ] Connect database integration (Supabase or Neon)
- [ ] Create database schema for:
  - `site_settings` (global settings, typography)
  - `sections` (section data with JSON content)
  - `typography` (H1, H2, H3, body, small - font family, size, weight, color)
- [ ] Create initial seed data
- [ ] Set up API routes for CRUD operations

---

### Phase 2: Typography System
**Goal**: Build typography management that connects frontend to backend

- [ ] Create typography settings table structure:
  ```
  - h1: { fontFamily, fontSize, fontWeight, lineHeight, color, letterSpacing }
  - h2: { fontFamily, fontSize, fontWeight, lineHeight, color, letterSpacing }
  - h3: { fontFamily, fontSize, fontWeight, lineHeight, color, letterSpacing }
  - body: { fontFamily, fontSize, fontWeight, lineHeight, color }
  - small: { fontFamily, fontSize, fontWeight, lineHeight, color }
  ```
- [ ] Create Google Fonts loader component
- [ ] Build typography context/provider for frontend
- [ ] Create typography admin panel with:
  - Google Font selector (searchable dropdown)
  - Font size, weight, line-height controls
  - Color picker
  - Live preview

---

### Phase 3: Admin Dashboard Shell
**Goal**: Build the CMS admin interface structure

- [ ] Create `/admin` route with layout
- [ ] Build collapsible section panels UI
- [ ] Create section list with expand/collapse functionality
- [ ] Add typography settings panel
- [ ] Add global settings panel (site name, favicon, etc.)
- [ ] Build save/publish functionality

---

### Phase 4: Hero Section (Frontend + Admin)
**Goal**: Build Hero section with full CMS integration

**Frontend Components:**
- [ ] Hero layout (3-column: left info, center image, right stats)
- [ ] "Available for work" badge
- [ ] Name with stylized typography
- [ ] Bio text
- [ ] "Top Rated on" badges section
- [ ] Stats section (years of experience)
- [ ] Awards list

**Admin Panel:**
- [ ] Hero section editor with all fields
- [ ] Image upload for profile photo
- [ ] Dynamic awards/badges list (add/remove)
- [ ] Stats editor

---

### Phase 5: About Section (Frontend + Admin)
**Goal**: Build About section with CMS integration

**Frontend Components:**
- [ ] Section label badge ("ABOUT")
- [ ] Headline
- [ ] Job title
- [ ] Bio paragraph
- [ ] Two CTA buttons (Download Resume, Contact Me)

**Admin Panel:**
- [ ] Text fields for all content
- [ ] Button configurator (text, link, style)

---

### Phase 6: Work/Portfolio Section (Frontend + Admin)
**Goal**: Build portfolio grid with project management

**Frontend Components:**
- [ ] Section label + headline (left side)
- [ ] Category filter list
- [ ] Project grid (2 columns)
- [ ] Project cards with hover effects
- [ ] Project links to external URLs

**Admin Panel:**
- [ ] Category manager (add/remove/reorder)
- [ ] Project list with:
  - Image upload
  - Title, category selection
  - External link URL
  - Reorder functionality

---

### Phase 7: Services Section (Frontend + Admin)
**Goal**: Build services grid with icon management

**Frontend Components:**
- [ ] Section label + headline (left side)
- [ ] Services grid (2x2)
- [ ] Service cards with icon, title, description
- [ ] Divider lines between cards

**Admin Panel:**
- [ ] Service list manager
- [ ] Icon selector (from icon library)
- [ ] Title and description fields

---

### Phase 8: Experience Section (Frontend + Admin)
**Goal**: Build expandable experience timeline

**Frontend Components:**
- [ ] Section label + headline (left side)
- [ ] Experience list with dividers
- [ ] Each item: Company, Role, Date range
- [ ] Expandable details (click to reveal more info)
- [ ] Smooth expand/collapse animation

**Admin Panel:**
- [ ] Experience list manager
- [ ] Fields: Company, Role, Start date, End date, Description
- [ ] Reorder functionality

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

## Database Schema (Draft)

```sql
-- Typography settings
CREATE TABLE typography (
  id UUID PRIMARY KEY,
  element_type VARCHAR(20), -- h1, h2, h3, body, small
  font_family VARCHAR(100),
  font_size VARCHAR(20),
  font_weight VARCHAR(10),
  line_height VARCHAR(10),
  letter_spacing VARCHAR(20),
  color VARCHAR(20),
  updated_at TIMESTAMP
);

-- Site settings
CREATE TABLE site_settings (
  id UUID PRIMARY KEY,
  site_name VARCHAR(100),
  favicon_url TEXT,
  meta_description TEXT,
  primary_color VARCHAR(20),
  secondary_color VARCHAR(20),
  background_color VARCHAR(20),
  updated_at TIMESTAMP
);

-- Sections (flexible JSON storage)
CREATE TABLE sections (
  id UUID PRIMARY KEY,
  section_type VARCHAR(50), -- hero, about, work, services, etc.
  content JSONB, -- All section-specific data
  sort_order INTEGER,
  is_visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMP
);
```

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase or Neon (PostgreSQL)
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
