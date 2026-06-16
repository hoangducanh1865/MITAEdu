INSERT INTO media_assets (id, object_key, content_type, course_slug, title)
VALUES (
  'khoa-nen-tang-vact-2027-b1-answer',
  'courses/khoa-nen-tang-vact-2027/b1/dap-an-chi-tiet.pdf',
  'application/pdf',
  'khoa-nen-tang-vact-2027',
  'Toán · Bài 1 · Đáp án chi tiết'
)
ON CONFLICT (id) DO UPDATE
SET object_key = EXCLUDED.object_key,
    content_type = EXCLUDED.content_type,
    course_slug = EXCLUDED.course_slug,
    title = EXCLUDED.title;

UPDATE lessons
SET answer_media_id = 'khoa-nen-tang-vact-2027-b1-answer'
WHERE course_id = (
  SELECT id FROM courses WHERE slug = 'khoa-nen-tang-vact-2027'
)
AND sort_order = 1;
