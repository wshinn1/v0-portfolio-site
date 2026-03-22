-- Add copyright_text column to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS copyright_text TEXT DEFAULT '© 2026 Portfolio. All rights reserved.';
