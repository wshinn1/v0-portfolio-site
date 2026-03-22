-- Portfolio CMS Database Schema
-- Phase 1: Foundation Tables

-- ============================================
-- Typography Settings Table
-- ============================================
CREATE TABLE IF NOT EXISTS typography (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  element_type VARCHAR(20) UNIQUE NOT NULL,
  font_family VARCHAR(100) DEFAULT 'Inter',
  font_size VARCHAR(20) DEFAULT '16px',
  font_weight VARCHAR(10) DEFAULT '400',
  line_height VARCHAR(10) DEFAULT '1.5',
  letter_spacing VARCHAR(20) DEFAULT 'normal',
  color VARCHAR(20) DEFAULT '#1a1a1a',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Site Settings Table (Single Row)
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
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

-- ============================================
-- Sections Table (Flexible JSON Content)
-- ============================================
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(100),
  content JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Enable Row Level Security
-- ============================================
ALTER TABLE typography ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Public Read Policies (Frontend can read)
-- ============================================
DROP POLICY IF EXISTS "Public read typography" ON typography;
CREATE POLICY "Public read typography" ON typography FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read site_settings" ON site_settings;
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read sections" ON sections;
CREATE POLICY "Public read sections" ON sections FOR SELECT USING (true);

-- ============================================
-- Authenticated Write Policies (Admin can modify)
-- ============================================
DROP POLICY IF EXISTS "Auth insert typography" ON typography;
CREATE POLICY "Auth insert typography" ON typography FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Auth update typography" ON typography;
CREATE POLICY "Auth update typography" ON typography FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Auth delete typography" ON typography;
CREATE POLICY "Auth delete typography" ON typography FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Auth insert site_settings" ON site_settings;
CREATE POLICY "Auth insert site_settings" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Auth update site_settings" ON site_settings;
CREATE POLICY "Auth update site_settings" ON site_settings FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Auth delete site_settings" ON site_settings;
CREATE POLICY "Auth delete site_settings" ON site_settings FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Auth insert sections" ON sections;
CREATE POLICY "Auth insert sections" ON sections FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Auth update sections" ON sections;
CREATE POLICY "Auth update sections" ON sections FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Auth delete sections" ON sections;
CREATE POLICY "Auth delete sections" ON sections FOR DELETE TO authenticated USING (true);

-- ============================================
-- Updated At Trigger Function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- Apply Triggers
-- ============================================
DROP TRIGGER IF EXISTS update_typography_updated_at ON typography;
CREATE TRIGGER update_typography_updated_at
  BEFORE UPDATE ON typography
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sections_updated_at ON sections;
CREATE TRIGGER update_sections_updated_at
  BEFORE UPDATE ON sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
