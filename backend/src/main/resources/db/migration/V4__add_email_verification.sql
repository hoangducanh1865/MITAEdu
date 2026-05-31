-- V4: Email verification support

ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- Các tài khoản đã tồn tại trước khi có tính năng xác minh (gồm admin, seed data)
-- được coi là đã xác minh để không bị khóa đăng nhập.
UPDATE users SET email_verified = TRUE;

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP    NOT NULL,
  used       BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_evt_token   ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_evt_user_id ON email_verification_tokens(user_id);
