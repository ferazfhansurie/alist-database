import pg from 'pg';
const { Pool } = pg;

// Database configuration
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_OHSUd5mWYD3z@ep-floral-night-a1p6xrre-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function fixUserRoles() {
  try {
    console.log('Fixing user roles...\n');

    // Update editors (should be editor, not admin)
    const editors = [
      'amir@thealist.my',
      'fatimhaifaa@thealist.my',
      'hidayat@thealist.my',
      'ainasofia@thealist.my',
      'azri@thealist.my'
    ];

    for (const email of editors) {
      await pool.query(
        'UPDATE users SET role = $1 WHERE email = $2',
        ['editor', email]
      );
      console.log(`✓ Updated ${email} to editor role`);
    }

    // Update viewers (should remain viewer)
    const viewers = [
      'izzyrahman@thealist.my',
      'tika@thealist.my',
      'linda@thealist.my'
    ];

    for (const email of viewers) {
      await pool.query(
        'UPDATE users SET role = $1 WHERE email = $2',
        ['viewer', email]
      );
      console.log(`✓ Confirmed ${email} as viewer role`);
    }

    console.log('\n=== Final User List ===');
    const allUsers = await pool.query('SELECT name, email, role FROM users ORDER BY role DESC, name');
    allUsers.rows.forEach((user, index) => {
      const roleDisplay = user.role === 'admin' ? '👑 ADMIN' : user.role === 'editor' ? '✏️  EDITOR' : '👁️  VIEWER';
      console.log(`${index + 1}. ${roleDisplay} - ${user.name} (${user.email})`);
    });

    console.log('\n✓ All roles have been updated successfully!');

  } catch (error) {
    console.error('Error fixing user roles:', error);
  } finally {
    await pool.end();
    console.log('\nDatabase connection closed.');
  }
}

fixUserRoles();
