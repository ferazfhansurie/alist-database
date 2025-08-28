-- Insert the first user (firaz@alist.com)
-- This script should be run after create_user.sql
INSERT INTO users (email, password_hash, name, role) 
VALUES (
    'firaz@alist.com', 
    '123456', -- In production, use proper password hashing like bcrypt
    'Firaz',
    'admin'
);

-- Verify the user was created
SELECT * FROM users WHERE email = 'firaz@alist.com';

-- Show all users in the table
SELECT * FROM users;
