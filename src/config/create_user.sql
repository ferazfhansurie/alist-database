-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the first user (firaz@alist.com)
-- Note: In production, you should hash the password properly
-- For demo purposes, we'll use a simple hash of '123456'
INSERT INTO users (email, password_hash, name, role) 
VALUES (
    'firaz@alist.com', 
    '123456', -- In production, use proper password hashing like bcrypt
    'Firaz',
    'admin'
)
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = CURRENT_TIMESTAMP;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Verify the user was created
SELECT * FROM users WHERE email = 'firaz@alist.com';
