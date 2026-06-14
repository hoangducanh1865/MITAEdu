UPDATE users
SET role = 'ADMIN',
    email_verified = TRUE
WHERE LOWER(email) = 'admin@mita.edu.vn';
