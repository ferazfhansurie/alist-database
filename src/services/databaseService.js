import pool from '../config/database.js';

class DatabaseService {
  // Initialize database schema
  async initializeDatabase() {
    try {
      const schemaSQL = await fetch('/src/config/schema.sql');
      const schema = await schemaSQL.text();
      
      // Split the SQL into individual statements
      const statements = schema.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          await pool.query(statement);
        }
      }
      
      console.log('Database schema initialized successfully');
    } catch (error) {
      console.error('Error initializing database schema:', error);
      // If schema file can't be loaded, create tables manually
      await this.createTablesManually();
    }
  }

  // Create tables manually if schema file loading fails
  async createTablesManually() {
    try {
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
          CREATE TYPE tier AS ENUM ('Tier 1 (Premium)', 'Tier 2 (Mid-tier)', 'Tier 3 (Emerging)', 'Tier 4 (Micro)');
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
          CREATE TYPE hair_style AS ENUM ('Hijab', 'Free Hair');
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

      await pool.query(`
        DO $$ BEGIN
          CREATE TYPE pic AS ENUM ('Amir', 'Tika', 'Aina');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      // Create niches table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS niches (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL
        );
      `);

      // Create KOLs table
      await pool.query(`
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
      `);

      // Create KOL niches junction table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS kol_niches (
          kol_id INTEGER REFERENCES kols(id) ON DELETE CASCADE,
          niche_id INTEGER REFERENCES niches(id) ON DELETE CASCADE,
          PRIMARY KEY (kol_id, niche_id)
        );
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
          ('Home & Garden')
        ON CONFLICT (name) DO NOTHING;
      `);

      console.log('Database tables created manually');
    } catch (error) {
      console.error('Error creating tables manually:', error);
      throw error;
    }
  }

  // Get all KOLs
  async getAllKOLs() {
    try {
      const result = await pool.query(`
        SELECT 
          k.*,
          ARRAY_AGG(n.name) as niches
        FROM kols k
        LEFT JOIN kol_niches kn ON k.id = kn.kol_id
        LEFT JOIN niches n ON kn.niche_id = n.id
        WHERE k.is_active = true
        GROUP BY k.id
        ORDER BY k.created_at DESC
      `);
      
      return result.rows.map(row => ({
        ...row,
        niches: row.niches.filter(niche => niche !== null)
      }));
    } catch (error) {
      console.error('Error fetching KOLs:', error);
      throw error;
    }
  }

  // Get KOLs by type
  async getKOLsByType(kolType) {
    try {
      const result = await pool.query(`
        SELECT 
          k.*,
          ARRAY_AGG(n.name) as niches
        FROM kols k
        LEFT JOIN kol_niches kn ON k.id = kn.kol_id
        LEFT JOIN niches n ON kn.niche_id = n.id
        WHERE k.kol_type = $1 AND k.is_active = true
        GROUP BY k.id
        ORDER BY k.created_at DESC
      `, [kolType]);
      
      return result.rows.map(row => ({
        ...row,
        niches: row.niches.filter(niche => niche !== null)
      }));
    } catch (error) {
      console.error('Error fetching KOLs by type:', error);
      throw error;
    }
  }

  // Get KOL by ID
  async getKOLById(id) {
    try {
      const result = await pool.query(`
        SELECT 
          k.*,
          ARRAY_AGG(n.name) as niches
        FROM kols k
        LEFT JOIN kol_niches kn ON k.id = kn.kol_id
        LEFT JOIN niches n ON kn.niche_id = n.id
        WHERE k.id = $1 AND k.is_active = true
        GROUP BY k.id
      `, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        ...row,
        niches: row.niches.filter(niche => niche !== null)
      };
    } catch (error) {
      console.error('Error fetching KOL by ID:', error);
      throw error;
    }
  }

  // Create new KOL
  async createKOL(kolData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Insert KOL
      const kolResult = await client.query(`
        INSERT INTO kols (
          name, instagram, tiktok, facebook, twitter, thread, blog,
          rate, tier, gender, hair_style, race, address, contact_number,
          rate_details, pic, kol_type, notes,
          instagram_rate, tiktok_rate, facebook_rate, twitter_rate,
          thread_rate, blog_rate, youtube_rate, xhs_rate, lemon8_rate,
          selling_price, rate_updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)
        RETURNING *
      `, [
        kolData.name, kolData.instagram, kolData.tiktok, kolData.facebook,
        kolData.twitter, kolData.thread, kolData.blog, kolData.rate,
        kolData.tier, kolData.gender, kolData.hairStyle, kolData.race,
        kolData.address, kolData.contactNumber, kolData.rateDetails,
        kolData.pic, kolData.kolType, kolData.notes,
        kolData.instagramrate || 0, kolData.tiktokrate || 0, kolData.facebookrate || 0,
        kolData.twitterrate || 0, kolData.threadrate || 0, kolData.blograte || 0,
        kolData.youtuberate || 0, kolData.xhsrate || 0, kolData.lemon8rate || 0,
        kolData.sellingPrice || 0, kolData.rateUpdatedAt || null
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
      return await this.getKOLById(newKOL.id);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating KOL:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Update KOL
  async updateKOL(id, kolData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Update KOL
      const updateResult = await client.query(`
        UPDATE kols SET
          name = $1, instagram = $2, tiktok = $3, facebook = $4,
          twitter = $5, thread = $6, blog = $7, rate = $8,
          tier = $9, gender = $10, hair_style = $11, race = $12,
          address = $13, contact_number = $14, rate_details = $15,
          pic = $16, kol_type = $17, notes = $18,
          instagram_rate = $19, tiktok_rate = $20, facebook_rate = $21,
          twitter_rate = $22, thread_rate = $23, blog_rate = $24,
          youtube_rate = $25, xhs_rate = $26, lemon8_rate = $27,
          selling_price = $28, rate_updated_at = $29,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $30
        RETURNING *
      `, [
        kolData.name, kolData.instagram, kolData.tiktok, kolData.facebook,
        kolData.twitter, kolData.thread, kolData.blog, kolData.rate,
        kolData.tier, kolData.gender, kolData.hairStyle, kolData.race,
        kolData.address, kolData.contactNumber, kolData.rateDetails,
        kolData.pic, kolData.kolType, kolData.notes,
        kolData.instagramrate || 0, kolData.tiktokrate || 0, kolData.facebookrate || 0,
        kolData.twitterrate || 0, kolData.threadrate || 0, kolData.blograte || 0,
        kolData.youtuberate || 0, kolData.xhsrate || 0, kolData.lemon8rate || 0,
        kolData.sellingPrice || 0, kolData.rateUpdatedAt || null,
        id
      ]);
      
      if (updateResult.rows.length === 0) {
        throw new Error('KOL not found');
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
      return await this.getKOLById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating KOL:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Delete KOL (soft delete)
  async deleteKOL(id) {
    try {
      const result = await pool.query(
        'UPDATE kols SET is_active = false WHERE id = $1 RETURNING *',
        [id]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting KOL:', error);
      throw error;
    }
  }

  // Get KOL statistics
  async getKOLStats() {
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
      
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching KOL stats:', error);
      throw error;
    }
  }

  // Get all niches
  async getAllNiches() {
    try {
      const result = await pool.query('SELECT * FROM niches ORDER BY name');
      return result.rows;
    } catch (error) {
      console.error('Error fetching niches:', error);
      throw error;
    }
  }

  // Get pool instance
  getPool() {
    return pool;
  }

  // Close database connection
  async close() {
    await pool.end();
  }
}

export default new DatabaseService();
