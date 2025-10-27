import express from 'express';
import cors from 'cors';
import pg from 'pg';
const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - Temporarily allowing all origins for testing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});
app.use(express.json());

// Database configuration
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_OHSUd5mWYD3z@ep-floral-night-a1p6xrre-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to Neon PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Initialize database schema
async function initializeDatabase() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create enums
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE kol_type AS ENUM ('social-media', 'twitter-thread', 'blogger', 'production-talent');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE tier AS ENUM ('Celebrity', 'Tier 1 (Premium)', 'Tier 2 (Mid-tier)', 'Tier 3 (Emerging)', 'Tier 4 (Micro)', 'NANO', 'MICRO', 'MACRO', 'MEGA', 'MID-TIER');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE gender AS ENUM ('Male', 'Female', 'Other');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE hair_style AS ENUM ('Hijab', 'Free Hair', 'Not Related');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE race AS ENUM ('Malay', 'Chinese', 'Indian', 'Other Asian', 'Caucasian', 'African', 'Mixed Race', 'Other');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE state AS ENUM ('Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS niches (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS kols (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        instagram VARCHAR(500),
        tiktok VARCHAR(500),
        facebook VARCHAR(500),
        twitter VARCHAR(500),
        thread VARCHAR(500),
        youtube VARCHAR(500),
        lemon8 VARCHAR(500),
        xhs VARCHAR(500),
        blog VARCHAR(500),
        rate DECIMAL(10,2) NOT NULL DEFAULT 0,
        instagram_rate DECIMAL(10,2) DEFAULT 0,
        tiktok_rate DECIMAL(10,2) DEFAULT 0,
        facebook_rate DECIMAL(10,2) DEFAULT 0,
        twitter_rate DECIMAL(10,2) DEFAULT 0,
        thread_rate DECIMAL(10,2) DEFAULT 0,
        youtube_rate DECIMAL(10,2) DEFAULT 0,
        lemon8_rate DECIMAL(10,2) DEFAULT 0,
        xhs_rate DECIMAL(10,2) DEFAULT 0,
        blog_rate DECIMAL(10,2) DEFAULT 0,
        rating SMALLINT DEFAULT 0,
        selling_price DECIMAL(12,2) DEFAULT 0,
        tier tier NOT NULL DEFAULT 'Tier 3 (Emerging)',
        gender gender NOT NULL DEFAULT 'Other',
        hair_style hair_style NOT NULL DEFAULT 'Free Hair',
        race race NOT NULL DEFAULT 'Other',
        address state NOT NULL DEFAULT 'Selangor',
        contact_number VARCHAR(20) NOT NULL,
        submission_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        rate_details TEXT,
        rate_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  pic VARCHAR(255) NOT NULL DEFAULT 'Amir',
  pic_user_id INTEGER REFERENCES users(id),
        kol_type kol_type NOT NULL DEFAULT 'social-media',
        notes TEXT,
        custom_fields JSONB DEFAULT '{}',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Drop the enum type constraint and convert pic column to varchar
    await pool.query(`
      DO $$ 
      BEGIN
        -- First alter the column to drop the enum constraint
        ALTER TABLE kols 
        ALTER COLUMN pic TYPE VARCHAR(255) USING pic::text;

        -- Then drop the enum type
        DROP TYPE IF EXISTS pic;
      EXCEPTION
        WHEN others THEN
          NULL;
      END $$;
    `);

    // Add platform-specific rate columns to existing kols table (migration)
    await pool.query(`
      ALTER TABLE kols
      ADD COLUMN IF NOT EXISTS instagram_rate DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tiktok_rate DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS facebook_rate DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS twitter_rate DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS thread_rate DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS blog_rate DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS youtube_rate DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS lemon8_rate DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS xhs_rate DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS pic_user_id INTEGER,
      ADD COLUMN IF NOT EXISTS rating SMALLINT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS selling_price DECIMAL(12,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS rate_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS kol_niches (
        kol_id INTEGER REFERENCES kols(id) ON DELETE CASCADE,
        niche_id INTEGER REFERENCES niches(id) ON DELETE CASCADE,
        PRIMARY KEY (kol_id, niche_id)
      );
    `);

    // Create custom fields configuration table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS custom_field_configs (
        id SERIAL PRIMARY KEY,
        field_key VARCHAR(100) UNIQUE NOT NULL,
        field_label VARCHAR(255) NOT NULL,
        field_type VARCHAR(50) NOT NULL,
        field_options JSONB DEFAULT '[]',
        is_required BOOLEAN DEFAULT false,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default custom fields
    await pool.query(`
      INSERT INTO custom_field_configs (field_key, field_label, field_type, is_required, display_order) VALUES
        ('ic_number', 'IC Number', 'text', false, 1),
        ('bank_name', 'Bank Name', 'text', false, 2),
        ('bank_account', 'Bank Account Number', 'text', false, 3)
      ON CONFLICT (field_key) DO NOTHING;
    `);

    // Insert default niches
    await pool.query(`
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
    `);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database schema:', error);
  }
}

// Sample data for migration
const sampleKOLData = [
  {
    name: 'Sarah Ahmad',
    instagram: 'https://instagram.com/sarahahmad',
    tiktok: 'https://tiktok.com/@sarahahmad',
    rate: 2500,
    tier: 'Tier 1 (Premium)',
    gender: 'Female',
    niches: ['Fashion & Beauty', 'Lifestyle'],
    hairStyle: 'Hijab',
    race: 'Malay',
    address: 'Terengganu',
    contactNumber: '+60123456789',
    rateDetails: 'Includes 3 posts + 5 stories + 1 reel',
    pic: 'Tika',
    kolType: 'social-media'
  },
  {
    name: 'David Chen',
    twitter: 'https://twitter.com/davidchen',
    thread: 'https://threads.net/@davidchen',
    rate: 1800,
    tier: 'Tier 2 (Mid-tier)',
    gender: 'Male',
    niches: ['Technology', 'Business & Finance'],
    hairStyle: 'Free Hair',
    race: 'Chinese',
    address: 'Selangor',
    contactNumber: '+60187654321',
    rateDetails: 'Includes 2 tweets + 1 thread post',
    pic: 'Amir',
    kolType: 'twitter-thread'
  }
];

// Migrate sample data
async function migrateSampleData() {
  try {
    // Check if data already exists
    const existingKOLs = await pool.query('SELECT COUNT(*) FROM kols');
    if (parseInt(existingKOLs.rows[0].count) > 0) {
      console.log('Database already contains data, skipping migration');
      return;
    }

    console.log('Starting migration of sample data...');
    
    for (const sampleKOL of sampleKOLData) {
      try {
        // Insert KOL
        const kolResult = await pool.query(`
          INSERT INTO kols (
            name, instagram, tiktok, facebook, twitter, thread, blog,
            rate, tier, gender, hair_style, race, address, contact_number,
            rate_details, pic, kol_type
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          RETURNING *
        `, [
          sampleKOL.name, sampleKOL.instagram, sampleKOL.tiktok, null,
          sampleKOL.twitter, sampleKOL.thread, null, sampleKOL.rate,
          sampleKOL.tier, sampleKOL.gender, sampleKOL.hairStyle, sampleKOL.race,
          sampleKOL.address, sampleKOL.contactNumber, sampleKOL.rateDetails,
          sampleKOL.pic, sampleKOL.kolType
        ]);
        
        const newKOL = kolResult.rows[0];
        
        // Insert niches
        if (sampleKOL.niches && sampleKOL.niches.length > 0) {
          for (const nicheName of sampleKOL.niches) {
            // Get or create niche
            let nicheResult = await pool.query(
              'SELECT id FROM niches WHERE name = $1',
              [nicheName]
            );
            
            let nicheId;
            if (nicheResult.rows.length === 0) {
              const newNicheResult = await pool.query(
                'INSERT INTO niches (name) VALUES ($1) RETURNING id',
                [nicheName]
              );
              nicheId = newNicheResult.rows[0].id;
            } else {
              nicheId = nicheResult.rows[0].id;
            }
            
            // Link KOL to niche
            await pool.query(
              'INSERT INTO kol_niches (kol_id, niche_id) VALUES ($1, $2)',
              [newKOL.id, nicheId]
            );
          }
        }
        
        console.log(`Migrated KOL: ${sampleKOL.name}`);
      } catch (error) {
        console.error(`Error migrating KOL ${sampleKOL.name}:`, error);
      }
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

// API Routes

// Get all KOLs
app.get('/api/kols', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        k.id, k.name, k.instagram, k.tiktok, k.facebook, k.twitter, k.thread, k.blog,
        k.rate, k.tier, k.gender, k.hair_style, k.race, k.address, k.contact_number,
        k.submission_date, k.rate_details, k.rate_updated_at, k.pic, k.kol_type, k.notes, k.custom_fields, k.is_active,
        k.created_at, k.updated_at,
        k.instagram_rate AS instagramRate,
        k.tiktok_rate AS tiktokRate,
        k.facebook_rate AS facebookRate,
        k.twitter_rate AS twitterRate,
        k.thread_rate AS threadRate,
        k.blog_rate AS blogRate,
        k.youtube AS youtube,
        k.lemon8 AS lemon8,
        k.xhs AS xhs,
        k.youtube_rate AS youtubeRate,
        k.lemon8_rate AS lemon8Rate,
        k.xhs_rate AS xhsRate,
        k.rating AS rating,
        k.selling_price AS sellingPrice,
        k.pic_user_id AS picUserId,
        u.name AS picUserName,
        ARRAY_AGG(n.name) AS niches
      FROM kols k
  LEFT JOIN kol_niches kn ON k.id = kn.kol_id
  LEFT JOIN niches n ON kn.niche_id = n.id
  LEFT JOIN users u ON k.pic_user_id = u.id
      WHERE k.is_active = true
  GROUP BY k.id, k.name, k.instagram, k.tiktok, k.facebook, k.twitter, k.thread, k.blog,
       k.rate, k.tier, k.gender, k.hair_style, k.race, k.address, k.contact_number,
       k.submission_date, k.rate_details, k.rate_updated_at, k.pic, k.kol_type, k.notes, k.custom_fields, k.is_active,
       k.created_at, k.updated_at, k.instagram_rate, k.tiktok_rate, k.facebook_rate,
       k.twitter_rate, k.thread_rate, k.blog_rate, k.youtube, k.lemon8, k.xhs, k.youtube_rate, k.lemon8_rate, k.xhs_rate, k.rating, k.selling_price, k.pic_user_id, u.name
      ORDER BY k.created_at DESC
    `);
    
    const kols = result.rows.map(row => ({
      ...row,
      niches: row.niches.filter(niche => niche !== null)
    }));
    
    res.json(kols);
  } catch (error) {
    console.error('Error fetching KOLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get KOLs by type
app.get('/api/kols/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const result = await pool.query(`
      SELECT
        k.id, k.name, k.instagram, k.tiktok, k.facebook, k.twitter, k.thread, k.blog,
        k.rate, k.tier, k.gender, k.hair_style, k.race, k.address, k.contact_number,
        k.submission_date, k.rate_details, k.rate_updated_at, k.pic, k.kol_type, k.notes, k.custom_fields, k.is_active,
        k.created_at, k.updated_at,
        k.instagram_rate AS instagramRate,
        k.tiktok_rate AS tiktokRate,
        k.facebook_rate AS facebookRate,
        k.twitter_rate AS twitterRate,
        k.thread_rate AS threadRate,
        k.blog_rate AS blogRate,
        k.youtube AS youtube,
        k.lemon8 AS lemon8,
        k.xhs AS xhs,
        k.youtube_rate AS youtubeRate,
        k.lemon8_rate AS lemon8Rate,
        k.xhs_rate AS xhsRate,
        k.rating AS rating,
        k.selling_price AS sellingPrice,
        k.pic_user_id AS picUserId,
        u.name AS picUserName,
        ARRAY_AGG(n.name) AS niches
      FROM kols k
  LEFT JOIN kol_niches kn ON k.id = kn.kol_id
  LEFT JOIN niches n ON kn.niche_id = n.id
  LEFT JOIN users u ON k.pic_user_id = u.id
      WHERE k.kol_type = $1 AND k.is_active = true
  GROUP BY k.id, k.name, k.instagram, k.tiktok, k.facebook, k.twitter, k.thread, k.blog,
       k.rate, k.tier, k.gender, k.hair_style, k.race, k.address, k.contact_number,
       k.submission_date, k.rate_details, k.rate_updated_at, k.pic, k.kol_type, k.notes, k.custom_fields, k.is_active,
       k.created_at, k.updated_at, k.instagram_rate, k.tiktok_rate, k.facebook_rate,
       k.twitter_rate, k.thread_rate, k.blog_rate, k.youtube, k.lemon8, k.xhs, k.youtube_rate, k.lemon8_rate, k.xhs_rate, k.rating, k.selling_price, k.pic_user_id, u.name
      ORDER BY k.created_at DESC
    `, [type]);
    
    const kols = result.rows.map(row => ({
      ...row,
      niches: row.niches.filter(niche => niche !== null)
    }));
    res.json(kols);
  } catch (error) {
    console.error('Error fetching KOLs by type:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get KOL statistics
app.get('/api/kols/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN kol_type = 'social-media' THEN 1 END) as social_media,
        COUNT(CASE WHEN kol_type = 'twitter-thread' THEN 1 END) as twitter_thread,
        COUNT(CASE WHEN kol_type = 'blogger' THEN 1 END) as blogger,
        COUNT(CASE WHEN kol_type = 'production-talent' THEN 1 END) as production_talent,
        COALESCE(SUM(rate), 0) as total_value,
        COALESCE(AVG(rate), 0) as average_rate
      FROM kols
      WHERE is_active = true
    `);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching KOL stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new KOL
app.post('/api/kols', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const kolData = req.body;
    
    // Insert KOL
    const kolResult = await client.query(`
      INSERT INTO kols (
        youtube, lemon8, xhs,
        name, instagram, tiktok, facebook, twitter, thread, blog,
        rate, instagram_rate, tiktok_rate, facebook_rate, twitter_rate, thread_rate, blog_rate, youtube_rate, lemon8_rate, xhs_rate,
        rating, selling_price,
        tier, gender, hair_style, race, address, contact_number,
        rate_details, rate_updated_at, pic_user_id, pic, kol_type, notes, custom_fields
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36)
      RETURNING *
    `, [
      kolData.youtube || null, kolData.lemon8 || null, kolData.xhs || null,
      kolData.name, kolData.instagram, kolData.tiktok, kolData.facebook,
      kolData.twitter, kolData.thread, kolData.blog, kolData.rate,
      kolData.instagramRate || 0, kolData.tiktokRate || 0, kolData.facebookRate || 0,
      kolData.twitterRate || 0, kolData.threadRate || 0, kolData.blogRate || 0, kolData.youtubeRate || 0, kolData.lemon8Rate || 0, kolData.xhsRate || 0,
      kolData.rating || 0, kolData.sellingPrice || 0,
      kolData.tier, kolData.gender, kolData.hairStyle, kolData.race,
      kolData.address, kolData.contactNumber, kolData.rateDetails,
      kolData.rateUpdatedAt || new Date().toISOString(),
      kolData.picUserId || null, kolData.pic, kolData.kolType, kolData.notes,
      JSON.stringify(kolData.customFields || {})
    ]);
    
    const newKOL = kolResult.rows[0];
    
    // Insert niches
    if (kolData.niches && kolData.niches.length > 0) {
      for (const nicheName of kolData.niches) {
        // Get or create niche
        let nicheResult = await client.query(
          'SELECT id FROM niches WHERE name = $1',
          [nicheName]
        );
        
        let nicheId;
        if (nicheResult.rows.length === 0) {
          const newNicheResult = await client.query(
            'INSERT INTO niches (name) VALUES ($1) RETURNING id',
            [nicheName]
          );
          nicheId = newNicheResult.rows[0].id;
        } else {
          nicheId = nicheResult.rows[0].id;
        }
        
        // Link KOL to niche
        await client.query(
          'INSERT INTO kol_niches (kol_id, niche_id) VALUES ($1, $2)',
          [newKOL.id, nicheId]
        );
      }
    }
    
    await client.query('COMMIT');
    
    // Return the complete KOL with niches
    const completeKOL = await pool.query(`
      SELECT 
        k.*,
        k.instagram_rate AS instagramRate,
        k.tiktok_rate AS tiktokRate,
        k.facebook_rate AS facebookRate,
        k.twitter_rate AS twitterRate,
        k.thread_rate AS threadRate,
        k.blog_rate AS blogRate,
        k.pic_user_id AS picUserId,
        u.name AS picUserName,
        ARRAY_AGG(n.name) AS niches
      FROM kols k
      LEFT JOIN kol_niches kn ON k.id = kn.kol_id
      LEFT JOIN niches n ON kn.niche_id = n.id
      LEFT JOIN users u ON k.pic_user_id = u.id
      WHERE k.id = $1
      GROUP BY k.id, u.name
    `, [newKOL.id]);
    
    res.status(201).json(completeKOL.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating KOL:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});
       
// Get KOL by ID
app.get('/api/kols/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        k.*,
        k.instagram_rate AS instagramRate,
        k.tiktok_rate AS tiktokRate,
        k.facebook_rate AS facebookRate,
        k.twitter_rate AS twitterRate,
        k.thread_rate AS threadRate,
        k.blog_rate AS blogRate,
        k.pic_user_id AS picUserId,
        u.name AS picUserName,
        ARRAY_AGG(n.name) AS niches
      FROM kols k
      LEFT JOIN kol_niches kn ON k.id = kn.kol_id
      LEFT JOIN niches n ON kn.niche_id = n.id
      LEFT JOIN users u ON k.pic_user_id = u.id
      WHERE k.id = $1 AND k.is_active = true
      GROUP BY k.id, u.name
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'KOL not found' });
    }
    
    const kol = result.rows[0];
    kol.niches = kol.niches.filter(niche => niche !== null);
    
    res.json(kol);
  } catch (error) {
    console.error('Error fetching KOL by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update KOL
app.put('/api/kols/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const kolData = req.body;
    
    // Update KOL
    const updateResult = await client.query(`
      UPDATE kols SET
        name = $1, instagram = $2, tiktok = $3, facebook = $4,
        twitter = $5, thread = $6, blog = $7, rate = $8,
        instagram_rate = $9, tiktok_rate = $10, facebook_rate = $11,
        twitter_rate = $12, thread_rate = $13, blog_rate = $14,
        youtube = $15, lemon8 = $16, xhs = $17,
        youtube_rate = $18, lemon8_rate = $19, xhs_rate = $20,
        rating = $21, selling_price = $22,
        tier = $23, gender = $24, hair_style = $25, race = $26,
        address = $27, contact_number = $28, rate_details = $29,
        rate_updated_at = $30, pic_user_id = $31, pic = $32, kol_type = $33, notes = $34,
        custom_fields = $35, updated_at = CURRENT_TIMESTAMP
      WHERE id = $36
      RETURNING *
    `, [
      kolData.name, kolData.instagram, kolData.tiktok, kolData.facebook,
      kolData.twitter, kolData.thread, kolData.blog, kolData.rate,
      kolData.instagramRate || 0, kolData.tiktokRate || 0, kolData.facebookRate || 0,
      kolData.twitterRate || 0, kolData.threadRate || 0, kolData.blogRate || 0,
      kolData.youtube || null, kolData.lemon8 || null, kolData.xhs || null,
      kolData.youtubeRate || 0, kolData.lemon8Rate || 0, kolData.xhsRate || 0,
      kolData.rating || 0, kolData.sellingPrice || 0,
      kolData.tier, kolData.gender, kolData.hairStyle, kolData.race,
      kolData.address, kolData.contactNumber, kolData.rateDetails,
      kolData.rateUpdatedAt || new Date().toISOString(),
  kolData.picUserId || null, kolData.pic, kolData.kolType, kolData.notes,
  JSON.stringify(kolData.customFields || {}), id
    ]);
    
    if (updateResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'KOL not found' });
    }
    
    // Remove existing niche links
    await client.query('DELETE FROM kol_niches WHERE kol_id = $1', [id]);
    
    // Insert new niches
    if (kolData.niches && kolData.niches.length > 0) {
      for (const nicheName of kolData.niches) {
        // Get or create niche
        let nicheResult = await client.query(
          'SELECT id FROM niches WHERE name = $1',
          [nicheName]
        );
        
        let nicheId;
        if (nicheResult.rows.length === 0) {
          const newNicheResult = await client.query(
            'INSERT INTO niches (name) VALUES ($1) RETURNING id',
            [nicheName]
          );
          nicheId = newNicheResult.rows[0].id;
        } else {
          nicheId = nicheResult.rows[0].id;
        }
        
        // Link KOL to niche
        await client.query(
          'INSERT INTO kol_niches (kol_id, niche_id) VALUES ($1, $2)',
          [id, nicheId]
        );
      }
    }
    
    await client.query('COMMIT');
    
    // Return the updated KOL with niches
    const completeKOL = await pool.query(`
      SELECT 
        k.*,
        k.instagram_rate AS instagramRate,
        k.tiktok_rate AS tiktokRate,
        k.facebook_rate AS facebookRate,
        k.twitter_rate AS twitterRate,
        k.thread_rate AS threadRate,
        k.blog_rate AS blogRate,
        k.pic_user_id AS picUserId,
        u.name AS picUserName,
        ARRAY_AGG(n.name) AS niches
      FROM kols k
      LEFT JOIN kol_niches kn ON k.id = kn.kol_id
      LEFT JOIN niches n ON kn.niche_id = n.id
      LEFT JOIN users u ON k.pic_user_id = u.id
      WHERE k.id = $1
      GROUP BY k.id, u.name
    `, [id]);
    
    res.json(completeKOL.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating KOL:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Delete KOL (soft delete)
app.delete('/api/kols/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE kols SET is_active = false WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'KOL not found' });
    }
    
    res.json({ message: 'KOL deleted successfully' });
  } catch (error) {
    console.error('Error deleting KOL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all niches
app.get('/api/niches', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM niches ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching niches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Custom Fields API endpoints

// Get all custom field configurations
app.get('/api/custom-fields', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM custom_field_configs
      WHERE is_active = true
      ORDER BY display_order, field_label
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching custom fields:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new custom field configuration
app.post('/api/custom-fields', async (req, res) => {
  try {
    const { fieldKey, fieldLabel, fieldType, fieldOptions, isRequired, displayOrder } = req.body;

    if (!fieldKey || !fieldLabel || !fieldType) {
      return res.status(400).json({ error: 'fieldKey, fieldLabel, and fieldType are required' });
    }

    const result = await pool.query(`
      INSERT INTO custom_field_configs (field_key, field_label, field_type, field_options, is_required, display_order)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [fieldKey, fieldLabel, fieldType, JSON.stringify(fieldOptions || []), isRequired || false, displayOrder || 0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating custom field:', error);
    if (error.code === '23505') { // Unique violation
      res.status(409).json({ error: 'Custom field with this key already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update custom field configuration
app.put('/api/custom-fields/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fieldLabel, fieldType, fieldOptions, isRequired, displayOrder, isActive } = req.body;

    const result = await pool.query(`
      UPDATE custom_field_configs SET
        field_label = $1,
        field_type = $2,
        field_options = $3,
        is_required = $4,
        display_order = $5,
        is_active = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [fieldLabel, fieldType, JSON.stringify(fieldOptions || []), isRequired, displayOrder, isActive, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Custom field not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating custom field:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete custom field configuration (soft delete)
app.delete('/api/custom-fields/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE custom_field_configs SET is_active = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Custom field not found' });
    }

    res.json({ message: 'Custom field deleted successfully' });
  } catch (error) {
    console.error('Error deleting custom field:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Query the database for the user
    const result = await pool.query(
      'SELECT id, email, name, role FROM users WHERE email = $1 AND password_hash = $2',
      [email, password]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = result.rows[0];
    
    // In production, you should generate a JWT token here
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password endpoint
app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'User ID, current password, and new password are required' });
    }

    // Verify current password
    const result = await pool.query(
      'SELECT id, email, name FROM users WHERE id = $1 AND password_hash = $2',
      [userId, currentPassword]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPassword, userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create initial user (for setup purposes)
app.post('/api/auth/setup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create new user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [email, password, name, 'admin']
    );

    const user = result.rows[0];

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Management API endpoints

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, email, name, role, created_at, updated_at,
      CASE 
        WHEN updated_at > NOW() - INTERVAL '1 hour' THEN 'Now'
        WHEN updated_at > NOW() - INTERVAL '1 day' THEN 'Today'
        WHEN updated_at > NOW() - INTERVAL '7 days' THEN 'This week'
        ELSE 'Older'
      END as last_active,
      'active' as status
      FROM users 
      ORDER BY created_at DESC
    `);
    
    const users = result.rows.map(user => ({
      ...user,
      department: 'Management', // Default department
      avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }));
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role = 'viewer', department, password } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    // Use provided password or generate a temporary one
    const userPassword = password || Math.random().toString(36).slice(-8);
    
    // Create new user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at',
      [email, userPassword, name, role]
    );
    
    const user = result.rows[0];
    
    res.status(201).json({
      ...user,
      department: department || 'Management',
      last_active: 'Just created',
      status: 'active',
      avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      tempPassword: userPassword // Include the password in response
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, department } = req.body;
    
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, email, name, role, updated_at',
      [name, email, role, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    
    res.json({
      ...user,
      department: department || 'Management',
      last_active: 'Updated',
      status: 'active',
      avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, name',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Debug endpoint to check database structure
app.get('/api/debug/kol-structure', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'kols' 
      AND column_name LIKE '%rate%'
      ORDER BY column_name
    `);
    
    res.json({
      rate_columns: result.rows,
      message: 'Database structure for rate columns'
    });
  } catch (error) {
    console.error('Error checking database structure:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Debug endpoint to check a sample KOL
app.get('/api/debug/sample-kol', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, name, rate, instagram_rate, tiktok_rate, facebook_rate, 
        twitter_rate, thread_rate, blog_rate, kol_type
      FROM kols 
      WHERE is_active = true 
      LIMIT 1
    `);
    
    res.json({
      sample_kol: result.rows[0] || 'No KOLs found',
      message: 'Sample KOL with rate columns'
    });
  } catch (error) {
    console.error('Error fetching sample KOL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Setup initial user
async function setupInitialUser() {
  try {
    // Check if any users exist
    const result = await pool.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(result.rows[0].count);
    
    if (userCount === 0) {
      // Create the first user
      await pool.query(
        'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)',
        ['firaz@alist.com', '123456', 'Firaz', 'admin']
      );
      console.log('Initial user created: firaz@alist.com / 123456');
    } else {
      console.log('Users already exist, skipping initial user setup');
    }
  } catch (error) {
    console.error('Error setting up initial user:', error);
  }
}

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    await setupInitialUser();
    await migrateSampleData();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
