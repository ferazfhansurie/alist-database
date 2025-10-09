import pg from 'pg';
const { Pool } = pg;

// Database configuration
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_OHSUd5mWYD3z@ep-floral-night-a1p6xrre-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Users to add
const usersToAdd = [
  // Editors - full access to edit
  { name: 'Amir', email: 'amir@thealist.my', role: 'editor', password: 'amir123' },
  { name: 'Effa', email: 'fatimhaifaa@thealist.my', role: 'editor', password: 'effa123' },
  { name: 'Yat', email: 'hidayat@thealist.my', role: 'editor', password: 'yat123' },
  { name: 'Aina', email: 'ainasofia@thealist.my', role: 'editor', password: 'aina123' },
  { name: 'Azri', email: 'azri@thealist.my', role: 'editor', password: 'azri123' },

  // Viewers - read-only access
  { name: 'Izzy', email: 'izzyrahman@thealist.my', role: 'viewer', password: 'izzy123' },
  { name: 'Tika', email: 'tika@thealist.my', role: 'viewer', password: 'tika123' },
  { name: 'Linda', email: 'linda@thealist.my', role: 'viewer', password: 'linda123' }
];

async function addUsers() {
  try {
    console.log('Starting user creation process...\n');

    for (const user of usersToAdd) {
      try {
        // Check if user already exists
        const existingUser = await pool.query(
          'SELECT id, email FROM users WHERE email = $1',
          [user.email]
        );

        if (existingUser.rows.length > 0) {
          console.log(`✓ User ${user.name} (${user.email}) already exists - skipping`);
          continue;
        }

        // Create new user
        const result = await pool.query(
          'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
          [user.email, user.password, user.name, user.role]
        );

        const createdUser = result.rows[0];
        console.log(`✓ Created ${createdUser.role}: ${createdUser.name} (${createdUser.email}) - Password: ${user.password}`);

      } catch (error) {
        console.error(`✗ Error creating user ${user.name}:`, error.message);
      }
    }

    console.log('\n=== User Creation Summary ===');
    console.log('\nEditors (Can access, edit, and copy):');
    console.log('  1. Amir - amir@thealist.my (Password: amir123)');
    console.log('  2. Effa - fatimhaifaa@thealist.my (Password: effa123)');
    console.log('  3. Yat - hidayat@thealist.my (Password: yat123)');
    console.log('  4. Aina - ainasofia@thealist.my (Password: aina123)');
    console.log('  5. Azri - azri@thealist.my (Password: azri123)');

    console.log('\nViewers (Can only view, cannot edit or copy):');
    console.log('  6. Izzy - izzyrahman@thealist.my (Password: izzy123)');
    console.log('  7. Tika - tika@thealist.my (Password: tika123)');
    console.log('  8. Linda - linda@thealist.my (Password: linda123)');

    console.log('\n✓ All users have been processed successfully!');

    // Verify all users
    const allUsers = await pool.query('SELECT name, email, role FROM users ORDER BY role DESC, name');
    console.log('\n=== Current Users in Database ===');
    allUsers.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });

  } catch (error) {
    console.error('Error in user creation process:', error);
  } finally {
    await pool.end();
    console.log('\nDatabase connection closed.');
  }
}

// Run the script
addUsers();
