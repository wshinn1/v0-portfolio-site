# Portfolio CMS - Full-Stack Content Management System

A modern, full-stack content management system and website built with Next.js 16, Supabase, and Tailwind CSS. Features a comprehensive admin dashboard, real-time analytics with PostHog, typography customization, and automated email reporting. Built with spec-driven intent and iterative development phases.

---

## Project Overview

This portfolio site features:
- **Public Portfolio** - Responsive landing page with hero, about, projects, and contact sections
- **Admin CMS** - Full content management system with authentication
- **Real-time Analytics** - PostHog-powered visitor tracking with interactive world map
- **Typography System** - Google Fonts integration with live preview
- **Contact Form** - Message management with Supabase backend

---

## Development Phases

### Phase 1: Foundation & Portfolio Design
**Goal:** Create a visually stunning portfolio landing page

- Set up Next.js 16 project with App Router
- Designed hero section with profile image, stats, and call-to-action
- Built about section with professional bio and resume download
- Created projects showcase with hover effects
- Added contact section with form
- Implemented responsive design with Tailwind CSS
- Configured custom typography with Google Fonts (Geist, Inter)

**Key Components:**
- `components/sections/hero-section.tsx`
- `components/sections/about-section.tsx`
- `components/sections/projects-section.tsx`
- `components/sections/contact-section.tsx`

---

### Phase 2: Database & Authentication
**Goal:** Add persistent storage and secure admin access

- Integrated Supabase for database and authentication
- Created database schema for:
  - `sections` - CMS content storage
  - `site_settings` - Global site configuration
  - `contact_messages` - Form submissions
  - `typography_settings` - Font configurations
- Implemented secure authentication with Supabase Auth
- Added Row Level Security (RLS) policies
- Built admin login/signup pages

**Database Schema:**
```sql
-- Sections table for CMS content
CREATE TABLE sections (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  content JSONB,
  is_visible BOOLEAN DEFAULT true,
  order_index INTEGER,
  updated_at TIMESTAMP
);

-- Typography settings
CREATE TABLE typography_settings (
  id UUID PRIMARY KEY,
  heading_font TEXT,
  body_font TEXT,
  font_scale DECIMAL,
  updated_at TIMESTAMP
);
```

---

### Phase 3: Admin CMS Dashboard
**Goal:** Build a full content management system

- Created admin layout with sidebar navigation
- Built section editors for each portfolio component:
  - Hero Editor (profile, stats, badges)
  - About Editor (bio, resume URL)
  - Projects Editor (add/edit/delete projects)
  - Contact Editor (form settings)
- Implemented real-time content preview
- Added image upload support via Vercel Blob
- Built settings page for site-wide configuration

**Admin Routes:**
- `/admin` - Dashboard overview
- `/admin/sections` - Content management
- `/admin/messages` - Contact form submissions
- `/admin/typography` - Font customization
- `/admin/settings` - Site settings
- `/admin/analytics` - Visitor tracking

---

### Phase 4: Typography System
**Goal:** Allow dynamic font customization

- Integrated Google Fonts API for font discovery
- Built font picker with search and preview
- Implemented live typography preview
- Added font scale adjustment (0.8x - 1.2x)
- Created persistent font settings in database
- Dynamic CSS variable injection for fonts

**Features:**
- 1500+ Google Fonts available
- Separate heading and body font selection
- Real-time preview before saving
- Font scale multiplier for accessibility

---

### Phase 5: Analytics Dashboard
**Goal:** Track visitors with real-time geographic data

- Integrated PostHog for event tracking
- Built custom analytics API with HogQL queries
- Created Campaign Monitoring dashboard with:
  - Page views, sessions, countries, cities metrics
  - Interactive world map with city-level markers
  - Top countries table with flags
  - Audience metrics with sparkline charts
  - Top pages performance table
  - Recent visitors live feed
- Implemented auto-refresh for real-time updates

**PostHog Integration:**
- Client-side tracking via `posthog-js`
- Server-side API queries via PostHog Query API
- Geographic data with latitude/longitude for precise city mapping

**Dashboard Features:**
- 15-second auto-refresh for live data
- 7/30/90 day date range filters
- Interactive map with pulsing city markers
- Country flags via flagcdn.com

---

### Phase 6: Polish & Production
**Goal:** Final refinements and production deployment

- Added "Learn More" button to hero (scrolls to About)
- Made "Contact Me" button toggleable via admin
- Moved LinkedIn button to About section
- Reduced map marker sizes for cleaner visualization
- Cleaned up debug code for production
- Deployed to Vercel with custom domain

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui, Radix UI |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| File Storage | Vercel Blob |
| Analytics | PostHog |
| Maps | react-simple-maps |
| Charts | Recharts |
| Fonts | Google Fonts API |
| Deployment | Vercel |

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_PERSONAL_API_KEY=your_personal_api_key
POSTHOG_PROJECT_ID=your_project_id

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm/pnpm/yarn
- Supabase account
- PostHog account (for analytics)

### Installation

```bash
# Clone the repository
git clone https://github.com/wshinn1/v0-portfolio-site.git
cd v0-portfolio-site

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
# (Execute SQL scripts in /scripts folder via Supabase dashboard)

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the CMS.

---

## Project Structure

```
├── app/
│   ├── page.tsx              # Public portfolio page
│   ├── layout.tsx            # Root layout with fonts
│   ├── admin/
│   │   ├── page.tsx          # Admin dashboard
│   │   ├── analytics/        # Analytics dashboard
│   │   ├── sections/         # Content management
│   │   ├── typography/       # Font settings
│   │   ├── messages/         # Contact submissions
│   │   └── settings/         # Site settings
│   └── api/
│       ├── analytics/        # PostHog API routes
│       ├── sections/         # CMS API routes
│       └── fonts/            # Google Fonts API
├── components/
│   ├── sections/             # Portfolio section components
│   ├── admin/                # Admin UI components
│   ├── ui/                   # shadcn/ui components
│   └── providers/            # Context providers
├── lib/
│   ├── supabase/             # Database client
│   └── types/                # TypeScript definitions
└── scripts/                  # Database migrations
```

---

## Built with v0

This entire project was built through conversational AI using [v0.app](https://v0.app). Every feature, from the initial design to the analytics dashboard, was developed through natural language prompts and iterative refinement.

[Continue working on v0](https://v0.app/chat/projects/prj_vhbtDOkcaCJR5YP2HJSpV41yHJO0)

---

## License

MIT License - feel free to use this as a template for your own portfolio.

---

## Author

**Wes Shinn** - Senior Full-Stack Engineer
- Website: [fullstack.wesshinn.com](https://fullstack.wesshinn.com)
- LinkedIn: [linkedin.com/in/wesshinn](https://linkedin.com/in/wesshinn)
