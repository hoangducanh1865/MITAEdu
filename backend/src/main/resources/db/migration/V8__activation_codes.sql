CREATE TABLE activation_codes (
    id         BIGSERIAL PRIMARY KEY,
    code       VARCHAR(32)  NOT NULL UNIQUE,
    course_id  BIGINT       NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status     VARCHAR(20)  NOT NULL DEFAULT 'UNUSED',
    expires_at TIMESTAMP,
    created_by BIGINT REFERENCES users(id),
    used_by    BIGINT REFERENCES users(id),
    used_at    TIMESTAMP,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activation_codes_code      ON activation_codes(code);
CREATE INDEX idx_activation_codes_course_id ON activation_codes(course_id);
CREATE INDEX idx_activation_codes_status    ON activation_codes(status);
