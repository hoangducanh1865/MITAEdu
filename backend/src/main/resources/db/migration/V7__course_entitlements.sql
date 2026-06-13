CREATE TABLE course_entitlements (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id           BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status              VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    source              VARCHAR(30) NOT NULL,
    granted_by_admin_id BIGINT REFERENCES users(id),
    starts_at           TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMP,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, course_id)
);

CREATE INDEX idx_entitlements_user_id   ON course_entitlements(user_id);
CREATE INDEX idx_entitlements_course_id ON course_entitlements(course_id);
CREATE INDEX idx_entitlements_status    ON course_entitlements(status);
