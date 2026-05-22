-- ============================================================
-- V1: Initial Schema for MITA Education Platform
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255)        NOT NULL,
    email         VARCHAR(255)        NOT NULL UNIQUE,
    password_hash VARCHAR(255)        NOT NULL,
    role          VARCHAR(20)         NOT NULL DEFAULT 'USER',
    school        VARCHAR(255),
    city          VARCHAR(100),
    birth_year    INTEGER,
    created_at    TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255)        NOT NULL,
    slug          VARCHAR(255)        NOT NULL UNIQUE,
    category      VARCHAR(20)         NOT NULL,   -- TSA | HSA | THPT
    teacher       VARCHAR(255),
    thumbnail_url VARCHAR(500),
    description   TEXT,
    created_at    TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
    id                   BIGSERIAL PRIMARY KEY,
    course_id            BIGINT          NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title                VARCHAR(255)    NOT NULL,
    sort_order           INTEGER         NOT NULL DEFAULT 0,
    video_url            VARCHAR(500),
    pdf_path             VARCHAR(500),
    handwritten_pdf_path VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS exam_packages (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255)    NOT NULL,
    tag         VARCHAR(20)     NOT NULL,   -- TSA | HSA
    description TEXT,
    is_locked   BOOLEAN         NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS exams (
    id               BIGSERIAL PRIMARY KEY,
    package_id       BIGINT          NOT NULL REFERENCES exam_packages(id) ON DELETE CASCADE,
    title            VARCHAR(255)    NOT NULL,
    duration_minutes INTEGER         NOT NULL DEFAULT 60,
    part_count       INTEGER         NOT NULL DEFAULT 1,
    status           VARCHAR(20)     NOT NULL DEFAULT 'DRAFT',  -- DRAFT | PUBLISHED
    created_at       TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
    id             BIGSERIAL PRIMARY KEY,
    exam_id        BIGINT          NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    sort_order     INTEGER         NOT NULL DEFAULT 0,
    text           TEXT            NOT NULL,
    option_a       TEXT            NOT NULL,
    option_b       TEXT            NOT NULL,
    option_c       TEXT            NOT NULL,
    option_d       TEXT            NOT NULL,
    correct_answer CHAR(1)         NOT NULL   -- A | B | C | D
);

CREATE TABLE IF NOT EXISTS submissions (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exam_id          BIGINT          NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    answers_json     TEXT,           -- JSON: {"1":"A","2":"C",...}
    score            INTEGER,
    total_questions  INTEGER,
    started_at       TIMESTAMP       NOT NULL DEFAULT NOW(),
    submitted_at     TIMESTAMP
);

CREATE TABLE IF NOT EXISTS schedules (
    id           BIGSERIAL PRIMARY KEY,
    course_id    BIGINT          REFERENCES courses(id) ON DELETE SET NULL,
    day_of_week  INTEGER         NOT NULL,   -- 1=Mon..7=Sun
    period       VARCHAR(20)     NOT NULL,   -- MORNING | AFTERNOON | EVENING
    lesson_title VARCHAR(255),
    lesson_course VARCHAR(255)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lessons_course_id     ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_exams_package_id      ON exams(package_id);
CREATE INDEX IF NOT EXISTS idx_questions_exam_id     ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id   ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_exam_id   ON submissions(exam_id);
