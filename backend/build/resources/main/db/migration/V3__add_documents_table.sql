-- ============================================================
-- V3: Add Documents/Materials Table
-- ============================================================

CREATE TABLE IF NOT EXISTS documents (
    id            BIGSERIAL PRIMARY KEY,
    title         VARCHAR(255)        NOT NULL,
    type          VARCHAR(30)         NOT NULL,
    description   TEXT,
    course_name   VARCHAR(255),
    file_path     VARCHAR(500),
    url           VARCHAR(500),
    duration      VARCHAR(50),
    created_at    TIMESTAMP           NOT NULL DEFAULT NOW(),
    sort_order    INTEGER             NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_course_name ON documents(course_name);
CREATE INDEX IF NOT EXISTS idx_documents_sort_order ON documents(sort_order);
