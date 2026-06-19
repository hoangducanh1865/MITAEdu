-- ============================================================
-- V20: Tổ chức lại media theo MÔN HỌC cho khóa khoa-nen-tang-vact-2027
--
-- Cấu trúc object key MỚI:
--   courses/khoa-nen-tang-vact-2027/{subject}/b{bai}/{file}
-- media id MỚI:
--   khoa-nen-tang-vact-2027-{subject}-b{bai}-{kind}
--
-- Trong đó:
--   {subject} ∈ toan | tieng-viet | tieng-anh | hoa-hoc
--             | sinh-hoc | lich-su | dia-li | vat-li
--   {bai}     = SỐ BÀI TRONG TỪNG MÔN (lấy từ title "... · Bài N"),
--               KHÔNG còn dùng sort_order toàn khóa.
--   {file}    = video.mp4 | de-bai.pdf | viet-tay.pdf | dap-an-chi-tiet.pdf
--   {kind}    = video | pdf | handwritten | answer
--
-- Migration tạo/seed sẵn 4 media cho TẤT CẢ 179 bài (716 dòng media_assets)
-- rồi nối vào lessons. File chưa upload -> UI hiện "Nội dung chưa được tải lên";
-- upload đúng object key là xem được ngay, không cần đụng DB.
--
-- Idempotent: chạy lại nhiều lần vẫn an toàn (ON CONFLICT + UPDATE + DELETE legacy).
-- ============================================================

-- 1) Bảng dẫn xuất tạm: mỗi lesson -> subject slug + số bài + nhãn hiển thị
DROP TABLE IF EXISTS _lesson_map;
CREATE TEMP TABLE _lesson_map AS
SELECT
    l.id AS lesson_id,
    CASE
        WHEN l.title LIKE 'Toán %'       THEN 'toan'
        WHEN l.title LIKE 'Tiếng Việt %' THEN 'tieng-viet'
        WHEN l.title LIKE 'Tiếng Anh %'  THEN 'tieng-anh'
        WHEN l.title LIKE 'Hóa %'        THEN 'hoa-hoc'
        WHEN l.title LIKE 'Sinh học %'   THEN 'sinh-hoc'
        WHEN l.title LIKE 'Sử %'         THEN 'lich-su'
        WHEN l.title LIKE 'Địa %'        THEN 'dia-li'
        WHEN l.title LIKE 'Lí %'         THEN 'vat-li'
        ELSE NULL
    END AS subject,
    substring(l.title from 'Bài ([0-9]+)')       AS bai,
    substring(l.title from '^(.*Bài [0-9]+)')    AS prefix_label
FROM lessons l
JOIN courses c ON c.id = l.course_id
WHERE c.slug = 'khoa-nen-tang-vact-2027';

-- 2) Chốt chặn an toàn: mọi lesson phải map được subject + số bài
DO $$
DECLARE
    n_bad INT;
BEGIN
    SELECT count(*) INTO n_bad
    FROM _lesson_map
    WHERE subject IS NULL OR bai IS NULL;

    IF n_bad > 0 THEN
        RAISE EXCEPTION 'V20: % bài không xác định được môn/số bài từ title', n_bad;
    END IF;
END $$;

-- 3) Tạo/cập nhật 4 media_assets cho mỗi bài (theo cấu trúc môn mới)
INSERT INTO media_assets (id, object_key, content_type, course_slug, title)
SELECT
    'khoa-nen-tang-vact-2027-' || m.subject || '-b' || m.bai || '-' || k.kind,
    'courses/khoa-nen-tang-vact-2027/' || m.subject || '/b' || m.bai || '/' || k.file,
    k.ctype,
    'khoa-nen-tang-vact-2027',
    m.prefix_label || ' · ' || k.label
FROM _lesson_map m
CROSS JOIN (VALUES
    ('video',       'video.mp4',           'video/mp4',       'Video bài giảng'),
    ('pdf',         'de-bai.pdf',          'application/pdf', 'Đề bài'),
    ('handwritten', 'viet-tay.pdf',        'application/pdf', 'File viết tay'),
    ('answer',      'dap-an-chi-tiet.pdf', 'application/pdf', 'Đáp án chi tiết')
) AS k(kind, file, ctype, label)
ON CONFLICT (id) DO UPDATE
    SET object_key   = EXCLUDED.object_key,
        content_type = EXCLUDED.content_type,
        course_slug  = EXCLUDED.course_slug,
        title        = EXCLUDED.title;

-- 4) Nối tất cả lesson tới đúng 4 media id mới
UPDATE lessons l
SET video_media_id       = 'khoa-nen-tang-vact-2027-' || m.subject || '-b' || m.bai || '-video',
    pdf_media_id         = 'khoa-nen-tang-vact-2027-' || m.subject || '-b' || m.bai || '-pdf',
    handwritten_media_id = 'khoa-nen-tang-vact-2027-' || m.subject || '-b' || m.bai || '-handwritten',
    answer_media_id      = 'khoa-nen-tang-vact-2027-' || m.subject || '-b' || m.bai || '-answer'
FROM _lesson_map m
WHERE l.id = m.lesson_id;

-- 5) Dọn media cũ đã bị bỏ tham chiếu:
--    - legacy:   toan-vact-hsa-*            (object key courses/toan-vact-hsa/...)
--    - flat cũ:  khoa-nen-tang-vact-2027-b{N}-*  (object key courses/.../b{N}/...)
--    Lưu ý: KHÔNG xóa id mới khoa-nen-tang-vact-2027-{subject}-b{N}-* (sau slug là chữ cái).
DELETE FROM media_assets
WHERE id LIKE 'toan-vact-hsa-%'
   OR id ~ '^khoa-nen-tang-vact-2027-b[0-9]';
