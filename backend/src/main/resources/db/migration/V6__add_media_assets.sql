-- ============================================================
-- V6: Media assets (video/PDF lưu trên Viettel Cloud Object Storage)
-- Frontend tham chiếu tới `id`; backend tra object_key rồi ký presigned URL.
-- ============================================================

CREATE TABLE IF NOT EXISTS media_assets (
    id            VARCHAR(100) PRIMARY KEY,
    object_key    VARCHAR(500)        NOT NULL,
    content_type  VARCHAR(100),
    course_slug   VARCHAR(255),
    title         VARCHAR(255),
    created_at    TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_course_slug ON media_assets(course_slug);

-- ── Seed: Bài 1 - Tính đơn điệu & Cực trị hàm số (khóa toan-vact-hsa) ──
-- LƯU Ý: object_key phải khớp CHÍNH XÁC tên object trên bucket VCOS.
-- Khuyến nghị upload/đổi tên 3 file của Bài 1 thành đúng các key dưới đây.
INSERT INTO media_assets (id, object_key, content_type, course_slug, title) VALUES
    ('toan-vact-hsa-b1-video',       'courses/toan-vact-hsa/b1/video.mp4',   'video/mp4',       'toan-vact-hsa', 'Bài 1 · Video bài giảng'),
    ('toan-vact-hsa-b1-pdf',         'courses/toan-vact-hsa/b1/de-bai.pdf',  'application/pdf', 'toan-vact-hsa', 'Bài 1 · Đề bài'),
    ('toan-vact-hsa-b1-handwritten', 'courses/toan-vact-hsa/b1/viet-tay.pdf','application/pdf', 'toan-vact-hsa', 'Bài 1 · File viết tay');
