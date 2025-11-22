-- Migration to add missing rate columns to kols table
-- Run this if you have an existing database

-- Add YouTube rate column
ALTER TABLE kols ADD COLUMN IF NOT EXISTS youtube_rate DECIMAL(10,2) DEFAULT 0;

-- Add XHS (Xiaohongshu/RedBook) rate column
ALTER TABLE kols ADD COLUMN IF NOT EXISTS xhs_rate DECIMAL(10,2) DEFAULT 0;

-- Add Lemon8 rate column
ALTER TABLE kols ADD COLUMN IF NOT EXISTS lemon8_rate DECIMAL(10,2) DEFAULT 0;

-- Add selling price column
ALTER TABLE kols ADD COLUMN IF NOT EXISTS selling_price DECIMAL(10,2) DEFAULT 0;

-- Add rate updated date column
ALTER TABLE kols ADD COLUMN IF NOT EXISTS rate_updated_at DATE;

-- Optional: Add rating column if not exists
ALTER TABLE kols ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 0 CHECK (rating >= 0 AND rating <= 5);

COMMENT ON COLUMN kols.youtube_rate IS 'Platform-specific rate for YouTube content';
COMMENT ON COLUMN kols.xhs_rate IS 'Platform-specific rate for XHS/Xiaohongshu content';
COMMENT ON COLUMN kols.lemon8_rate IS 'Platform-specific rate for Lemon8 content';
COMMENT ON COLUMN kols.selling_price IS 'Internal selling price for the KOL';
COMMENT ON COLUMN kols.rate_updated_at IS 'Date when the rate was last updated';
COMMENT ON COLUMN kols.rating IS 'Star rating (0-5) for KOL performance';
