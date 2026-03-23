-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (public contact form)
CREATE POLICY "Anyone can insert contact submissions"
ON contact_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users can read/update
CREATE POLICY "Authenticated users can read contact submissions"
ON contact_submissions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update contact submissions"
ON contact_submissions FOR UPDATE
TO authenticated
USING (true);
