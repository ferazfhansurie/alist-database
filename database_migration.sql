-- Database Migration Script for Platform-Specific Rates
-- Run this script to update your existing database schema

-- 1. Add platform-specific rate columns to kols table
ALTER TABLE kols 
ADD COLUMN IF NOT EXISTS instagram_rate DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tiktok_rate DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS facebook_rate DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS twitter_rate DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS thread_rate DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS blog_rate DECIMAL(10,2) DEFAULT 0;

-- 2. Update existing tier enum to include JUTA values
-- Note: PostgreSQL doesn't support adding values to existing enums directly
-- We need to create a new enum and migrate the data
DO $$ 
BEGIN
    -- Create new tier enum with additional values
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tier_new') THEN
        CREATE TYPE tier_new AS ENUM (
            'Tier 1 (Premium)', 
            'Tier 2 (Mid-tier)', 
            'Tier 3 (Emerging)', 
            'Tier 4 (Micro)',
            'NANO',
            'MICRO', 
            'MACRO',
            'MEGA',
            'MID-TIER'
        );
    END IF;
END $$;

-- 3. Update hair_style enum to include 'Not Related'
DO $$ 
BEGIN
    -- Create new hair_style enum with additional values
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hair_style_new') THEN
        CREATE TYPE hair_style_new AS ENUM ('Hijab', 'Free Hair', 'Not Related');
    END IF;
END $$;

-- 4. Add new niches for JUTA data
INSERT INTO niches (name) VALUES
    ('GENERAL'),
    ('BEAUTY'),
    ('COMEDY/ TREND'),
    ('PROFESSIONAL/ MEDICAL'),
    ('EDUCATION'),
    ('SKINCARE'),
    ('AUTOMOTIVE')
ON CONFLICT (name) DO NOTHING;

-- 5. Migrate existing data to use new platform rates
-- Copy existing rate to the appropriate platform rate based on KOL type
UPDATE kols 
SET 
    instagram_rate = CASE 
        WHEN kol_type = 'social-media' AND instagram IS NOT NULL AND instagram != '' THEN rate
        ELSE 0
    END,
    tiktok_rate = CASE 
        WHEN kol_type = 'social-media' AND tiktok IS NOT NULL AND tiktok != '' THEN rate
        ELSE 0
    END,
    facebook_rate = CASE 
        WHEN kol_type = 'social-media' AND facebook IS NOT NULL AND facebook != '' THEN rate
        ELSE 0
    END,
    twitter_rate = CASE 
        WHEN kol_type = 'twitter-thread' AND twitter IS NOT NULL AND twitter != '' THEN rate
        ELSE 0
    END,
    thread_rate = CASE 
        WHEN kol_type = 'twitter-thread' AND thread IS NOT NULL AND thread != '' THEN rate
        ELSE 0
    END,
    blog_rate = CASE 
        WHEN kol_type = 'blogger' AND blog IS NOT NULL AND blog != '' THEN rate
        ELSE 0
    END;

-- 6. Update overall rate to be the maximum of all platform rates
UPDATE kols 
SET rate = GREATEST(
    COALESCE(instagram_rate, 0),
    COALESCE(tiktok_rate, 0),
    COALESCE(facebook_rate, 0),
    COALESCE(twitter_rate, 0),
    COALESCE(thread_rate, 0),
    COALESCE(blog_rate, 0),
    COALESCE(rate, 0)
);

-- 7. Create indexes for better performance on new rate columns
CREATE INDEX IF NOT EXISTS idx_kols_instagram_rate ON kols(instagram_rate);
CREATE INDEX IF NOT EXISTS idx_kols_tiktok_rate ON kols(tiktok_rate);
CREATE INDEX IF NOT EXISTS idx_kols_facebook_rate ON kols(facebook_rate);
CREATE INDEX IF NOT EXISTS idx_kols_twitter_rate ON kols(twitter_rate);
CREATE INDEX IF NOT EXISTS idx_kols_thread_rate ON kols(thread_rate);
CREATE INDEX IF NOT EXISTS idx_kols_blog_rate ON kols(blog_rate);

-- 8. Add comments to document the new columns
COMMENT ON COLUMN kols.instagram_rate IS 'Rate for Instagram posts/stories/reels';
COMMENT ON COLUMN kols.tiktok_rate IS 'Rate for TikTok videos';
COMMENT ON COLUMN kols.facebook_rate IS 'Rate for Facebook posts/stories';
COMMENT ON COLUMN kols.twitter_rate IS 'Rate for Twitter posts';
COMMENT ON COLUMN kols.thread_rate IS 'Rate for Threads posts';
COMMENT ON COLUMN kols.blog_rate IS 'Rate for blog posts';

-- 9. Create a view for easy querying of KOLs with platform rates
CREATE OR REPLACE VIEW kol_platform_rates AS
SELECT 
    id,
    name,
    instagram,
    instagram_rate,
    tiktok,
    tiktok_rate,
    facebook,
    facebook_rate,
    twitter,
    twitter_rate,
    thread,
    thread_rate,
    blog,
    blog_rate,
    rate as overall_rate,
    tier,
    gender,
    hair_style,
    race,
    address,
    contact_number,
    rate_details,
    pic,
    kol_type,
    notes,
    is_active,
    created_at,
    updated_at
FROM kols
WHERE is_active = true;

-- 10. Create a function to calculate total platform rates for a KOL
CREATE OR REPLACE FUNCTION calculate_kol_total_rate(kol_id INTEGER)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    total_rate DECIMAL(10,2);
BEGIN
    SELECT GREATEST(
        COALESCE(instagram_rate, 0),
        COALESCE(tiktok_rate, 0),
        COALESCE(facebook_rate, 0),
        COALESCE(twitter_rate, 0),
        COALESCE(thread_rate, 0),
        COALESCE(blog_rate, 0)
    ) INTO total_rate
    FROM kols
    WHERE id = kol_id;
    
    RETURN COALESCE(total_rate, 0);
END;
$$ LANGUAGE plpgsql;

-- 11. Create a function to get platform rates summary for a KOL
CREATE OR REPLACE FUNCTION get_kol_platform_summary(kol_id INTEGER)
RETURNS TABLE(
    platform VARCHAR(20),
    link TEXT,
    rate DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 'Instagram'::VARCHAR(20), k.instagram, COALESCE(k.instagram_rate, 0)
    FROM kols k WHERE k.id = kol_id AND k.instagram IS NOT NULL AND k.instagram != ''
    UNION ALL
    SELECT 'TikTok'::VARCHAR(20), k.tiktok, COALESCE(k.tiktok_rate, 0)
    FROM kols k WHERE k.id = kol_id AND k.tiktok IS NOT NULL AND k.tiktok != ''
    UNION ALL
    SELECT 'Facebook'::VARCHAR(20), k.facebook, COALESCE(k.facebook_rate, 0)
    FROM kols k WHERE k.id = kol_id AND k.facebook IS NOT NULL AND k.facebook != ''
    UNION ALL
    SELECT 'Twitter'::VARCHAR(20), k.twitter, COALESCE(k.twitter_rate, 0)
    FROM kols k WHERE k.id = kol_id AND k.twitter IS NOT NULL AND k.twitter != ''
    UNION ALL
    SELECT 'Threads'::VARCHAR(20), k.thread, COALESCE(k.thread_rate, 0)
    FROM kols k WHERE k.id = kol_id AND k.thread IS NOT NULL AND k.thread != ''
    UNION ALL
    SELECT 'Blog'::VARCHAR(20), k.blog, COALESCE(k.blog_rate, 0)
    FROM kols k WHERE k.id = kol_id AND k.blog IS NOT NULL AND k.blog != '';
END;
$$ LANGUAGE plpgsql;

-- 12. Update the trigger to recalculate overall rate when platform rates change
CREATE OR REPLACE FUNCTION update_kol_overall_rate()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the overall rate to be the maximum of all platform rates
    NEW.rate = GREATEST(
        COALESCE(NEW.instagram_rate, 0),
        COALESCE(NEW.tiktok_rate, 0),
        COALESCE(NEW.facebook_rate, 0),
        COALESCE(NEW.twitter_rate, 0),
        COALESCE(NEW.thread_rate, 0),
        COALESCE(NEW.blog_rate, 0)
    );
    
    -- Update the updated_at timestamp
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Create trigger to automatically update overall rate when platform rates change
DROP TRIGGER IF EXISTS update_kol_overall_rate_trigger ON kols;
CREATE TRIGGER update_kol_overall_rate_trigger
    BEFORE UPDATE ON kols
    FOR EACH ROW
    EXECUTE FUNCTION update_kol_overall_rate();

-- 14. Verify the migration
SELECT 
    'Migration completed successfully' as status,
    COUNT(*) as total_kols,
    COUNT(CASE WHEN instagram_rate > 0 THEN 1 END) as kols_with_instagram_rates,
    COUNT(CASE WHEN tiktok_rate > 0 THEN 1 END) as kols_with_tiktok_rates,
    COUNT(CASE WHEN facebook_rate > 0 THEN 1 END) as kols_with_facebook_rates,
    COUNT(CASE WHEN twitter_rate > 0 THEN 1 END) as kols_with_twitter_rates,
    COUNT(CASE WHEN thread_rate > 0 THEN 1 END) as kols_with_thread_rates,
    COUNT(CASE WHEN blog_rate > 0 THEN 1 END) as kols_with_blog_rates
FROM kols
WHERE is_active = true;

-- 15. Show sample of migrated data
SELECT 
    name,
    instagram,
    instagram_rate,
    tiktok,
    tiktok_rate,
    rate as overall_rate,
    kol_type
FROM kols
WHERE is_active = true
LIMIT 5;
