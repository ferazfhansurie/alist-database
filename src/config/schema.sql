-- KOL Database Schema

-- Create KOL types enum
CREATE TYPE kol_type AS ENUM ('social-media', 'twitter-thread', 'blogger', 'production-talent');

-- Create tiers enum
CREATE TYPE tier AS ENUM ('Tier 1 (Premium)', 'Tier 2 (Mid-tier)', 'Tier 3 (Emerging)', 'Tier 4 (Micro)', 'NANO', 'MICRO', 'MACRO', 'MEGA', 'MID-TIER');

-- Create gender enum
CREATE TYPE gender AS ENUM ('Male', 'Female', 'Other');

-- Create hair style enum
CREATE TYPE hair_style AS ENUM ('Hijab', 'Free Hair', 'Not Related');

-- Create race enum
CREATE TYPE race AS ENUM ('Malay', 'Chinese', 'Indian', 'Other Asian', 'Caucasian', 'African', 'Mixed Race', 'Other');

-- Create states enum
CREATE TYPE state AS ENUM ('Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya');

-- Create PICS enum
CREATE TYPE pic AS ENUM ('Amir', 'Tika', 'Aina');

-- Create niches table
CREATE TABLE IF NOT EXISTS niches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- Create KOLs table
CREATE TABLE IF NOT EXISTS kols (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  instagram VARCHAR(500),
  tiktok VARCHAR(500),
  facebook VARCHAR(500),
  twitter VARCHAR(500),
  thread VARCHAR(500),
  blog VARCHAR(500),
  rate DECIMAL(10,2) NOT NULL DEFAULT 0,
  instagram_rate DECIMAL(10,2) DEFAULT 0,
  tiktok_rate DECIMAL(10,2) DEFAULT 0,
  facebook_rate DECIMAL(10,2) DEFAULT 0,
  twitter_rate DECIMAL(10,2) DEFAULT 0,
  thread_rate DECIMAL(10,2) DEFAULT 0,
  blog_rate DECIMAL(10,2) DEFAULT 0,
  youtube_rate DECIMAL(10,2) DEFAULT 0,
  xhs_rate DECIMAL(10,2) DEFAULT 0,
  lemon8_rate DECIMAL(10,2) DEFAULT 0,
  selling_price DECIMAL(10,2) DEFAULT 0,
  rate_updated_at DATE,
  tier tier NOT NULL DEFAULT 'Tier 3 (Emerging)',
  gender gender NOT NULL DEFAULT 'Other',
  hair_style hair_style NOT NULL DEFAULT 'Free Hair',
  race race NOT NULL DEFAULT 'Other',
  address state NOT NULL DEFAULT 'Selangor',
  contact_number VARCHAR(20) NOT NULL,
  submission_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  rate_details TEXT,
  pic pic NOT NULL DEFAULT 'Amir',
  kol_type kol_type NOT NULL DEFAULT 'social-media',
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create KOL niches junction table
CREATE TABLE IF NOT EXISTS kol_niches (
  kol_id INTEGER REFERENCES kols(id) ON DELETE CASCADE,
  niche_id INTEGER REFERENCES niches(id) ON DELETE CASCADE,
  PRIMARY KEY (kol_id, niche_id)
);

-- Insert default niches
INSERT INTO niches (name) VALUES
  ('Fashion & Beauty'),
  ('Lifestyle'),
  ('Food & Dining'),
  ('Travel'),
  ('Technology'),
  ('Fitness & Health'),
  ('Parenting'),
  ('Business & Finance'),
  ('Entertainment'),
  ('Education'),
  ('Sports'),
  ('Automotive'),
  ('Gaming'),
  ('Art & Design'),
  ('Music'),
  ('Comedy'),
  ('News & Politics'),
  ('Religion & Spirituality'),
  ('Pet & Animal'),
  ('Home & Garden'),
  ('GENERAL'),
  ('BEAUTY'),
  ('COMEDY/ TREND'),
  ('PROFESSIONAL/ MEDICAL'),
  ('EDUCATION'),
  ('SKINCARE'),
  ('AUTOMOTIVE')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kols_kol_type ON kols(kol_type);
CREATE INDEX IF NOT EXISTS idx_kols_tier ON kols(tier);
CREATE INDEX IF NOT EXISTS idx_kols_gender ON kols(gender);
CREATE INDEX IF NOT EXISTS idx_kols_race ON kols(race);
CREATE INDEX IF NOT EXISTS idx_kols_address ON kols(address);
CREATE INDEX IF NOT EXISTS idx_kols_is_active ON kols(is_active);
CREATE INDEX IF NOT EXISTS idx_kols_created_at ON kols(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_kols_updated_at 
    BEFORE UPDATE ON kols 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
