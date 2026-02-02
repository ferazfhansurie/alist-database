import express from 'express';
import cors from 'cors';
import pg from 'pg';
const { Pool } = pg;

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Database configuration using environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_OHSUd5mWYD3z@ep-floral-night-a1p6xrre-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Run schema migrations on startup
async function runMigrations() {
  try {
    // Convert enum columns to VARCHAR for flexibility
    const alterColumns = [
      `ALTER TABLE kols ALTER COLUMN address TYPE VARCHAR(255) USING address::text`,
      `ALTER TABLE kols ALTER COLUMN race TYPE VARCHAR(100) USING race::text`,
      `ALTER TABLE kols ALTER COLUMN gender TYPE VARCHAR(50) USING gender::text`,
      `ALTER TABLE kols ALTER COLUMN hair_style TYPE VARCHAR(100) USING hair_style::text`,
      `ALTER TABLE kols ALTER COLUMN tier TYPE VARCHAR(100) USING tier::text`,
      `ALTER TABLE kols ALTER COLUMN contact_number TYPE VARCHAR(255)`,
      `ALTER TABLE kols ALTER COLUMN name TYPE VARCHAR(500)`,
      `ALTER TABLE kols ALTER COLUMN pic TYPE VARCHAR(500)`,
      `ALTER TABLE kols ALTER COLUMN instagram TYPE VARCHAR(1000)`,
      `ALTER TABLE kols ALTER COLUMN tiktok TYPE VARCHAR(1000)`,
      `ALTER TABLE kols ALTER COLUMN facebook TYPE VARCHAR(1000)`,
      `ALTER TABLE kols ALTER COLUMN twitter TYPE VARCHAR(1000)`,
      `ALTER TABLE kols ALTER COLUMN thread TYPE VARCHAR(1000)`,
      `ALTER TABLE kols ALTER COLUMN youtube TYPE VARCHAR(1000)`,
      `ALTER TABLE kols ALTER COLUMN lemon8 TYPE VARCHAR(1000)`,
      `ALTER TABLE kols ALTER COLUMN xhs TYPE VARCHAR(1000)`,
      `ALTER TABLE kols ALTER COLUMN blog TYPE VARCHAR(1000)`,
    ];

    for (const sql of alterColumns) {
      await pool.query(sql).catch(() => {});
    }

    console.log('Schema migrations completed');
  } catch (error) {
    console.error('Migration error:', error.message);
  }
}

// Run migrations
runMigrations();

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

    const kolResult = await client.query(`
      INSERT INTO kols (
        youtube, lemon8, xhs,
        name, instagram, tiktok, facebook, twitter, thread, blog,
        rate, instagram_rate, tiktok_rate, facebook_rate, twitter_rate, thread_rate, blog_rate, youtube_rate, lemon8_rate, xhs_rate,
        rating, selling_price,
        tier, gender, hair_style, race, address, contact_number,
        rate_details, rate_updated_at, pic_user_id, pic, kol_type, notes, custom_fields
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35)
      RETURNING *
    `, [
      kolData.youtube || null, kolData.lemon8 || null, kolData.xhs || null,
      kolData.name, kolData.instagram, kolData.tiktok, kolData.facebook,
      kolData.twitter, kolData.thread, kolData.blog, kolData.rate,
      kolData.instagramRate || kolData.instagramrate || 0,
      kolData.tiktokRate || kolData.tiktokrate || 0,
      kolData.facebookRate || kolData.facebookrate || 0,
      kolData.twitterRate || kolData.twitterrate || 0,
      kolData.threadRate || kolData.threadrate || 0,
      kolData.blogRate || kolData.blograte || 0,
      kolData.youtubeRate || kolData.youtuberate || 0,
      kolData.lemon8Rate || kolData.lemon8rate || 0,
      kolData.xhsRate || kolData.xhsrate || 0,
      kolData.rating || 0, kolData.sellingPrice || 0,
      kolData.tier, kolData.gender, kolData.hairStyle, kolData.race,
      kolData.address, kolData.contactNumber, kolData.rateDetails,
      kolData.rateUpdatedAt ? new Date(kolData.rateUpdatedAt).toISOString().split('T')[0] : null,
      kolData.picUserId || null, kolData.pic, kolData.kolType, kolData.notes,
      JSON.stringify(kolData.customFields || {})
    ]);

    const newKOL = kolResult.rows[0];

    if (kolData.niches && kolData.niches.length > 0) {
      for (const nicheName of kolData.niches) {
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

        await client.query(
          'INSERT INTO kol_niches (kol_id, niche_id) VALUES ($1, $2)',
          [newKOL.id, nicheId]
        );
      }
    }

    await client.query('COMMIT');

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

    const queryParams = [
      kolData.name, kolData.instagram, kolData.tiktok, kolData.facebook,
      kolData.twitter, kolData.thread, kolData.blog, kolData.rate,
      kolData.instagramRate || kolData.instagramrate || 0,
      kolData.tiktokRate || kolData.tiktokrate || 0,
      kolData.facebookRate || kolData.facebookrate || 0,
      kolData.twitterRate || kolData.twitterrate || 0,
      kolData.threadRate || kolData.threadrate || 0,
      kolData.blogRate || kolData.blograte || 0,
      kolData.youtube || null, kolData.lemon8 || null, kolData.xhs || null,
      kolData.youtubeRate || kolData.youtuberate || 0,
      kolData.lemon8Rate || kolData.lemon8rate || 0,
      kolData.xhsRate || kolData.xhsrate || 0,
      kolData.rating || 0, kolData.sellingPrice || 0,
      kolData.tier, kolData.gender, kolData.hairStyle, kolData.race,
      kolData.address, kolData.contactNumber, kolData.rateDetails,
      kolData.rateUpdatedAt ? new Date(kolData.rateUpdatedAt).toISOString().split('T')[0] : null,
      kolData.picUserId || null, kolData.pic, kolData.kolType, kolData.notes,
      JSON.stringify(kolData.customFields || {}), id
    ];

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
    `, queryParams);

    if (updateResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'KOL not found' });
    }

    await client.query('DELETE FROM kol_niches WHERE kol_id = $1', [id]);

    if (kolData.niches && kolData.niches.length > 0) {
      for (const nicheName of kolData.niches) {
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

        await client.query(
          'INSERT INTO kol_niches (kol_id, niche_id) VALUES ($1, $2)',
          [id, nicheId]
        );
      }
    }

    await client.query('COMMIT');

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

// Proposal generation - disabled in serverless (Puppeteer not supported)
app.post('/api/proposals/generate', async (req, res) => {
  res.status(501).json({
    error: 'Proposal generation is not available in serverless mode. Puppeteer requires a traditional server environment.',
    suggestion: 'Run the local server with "npm run server" for proposal generation.'
  });
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
      INSERT INTO custom_field_configs(field_key, field_label, field_type, field_options, is_required, display_order)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [fieldKey, fieldLabel, fieldType, JSON.stringify(fieldOptions || []), isRequired || false, displayOrder || 0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating custom field:', error);
    if (error.code === '23505') {
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

    const result = await pool.query(
      'SELECT id, email, name, role FROM users WHERE email = $1 AND password_hash = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

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

    const result = await pool.query(
      'SELECT id, email, name FROM users WHERE id = $1 AND password_hash = $2',
      [userId, currentPassword]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

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

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

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
      department: 'Management',
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

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const userPassword = password || Math.random().toString(36).slice(-8);

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
      tempPassword: userPassword
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
  res.json({ status: 'OK', timestamp: new Date().toISOString(), environment: 'vercel-serverless' });
});

// Debug endpoints
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

// Export for Vercel serverless
export default app;
