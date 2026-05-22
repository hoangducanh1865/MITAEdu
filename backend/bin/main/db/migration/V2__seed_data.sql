-- ============================================================
-- V2: Seed Data — courses, exam_packages, exams, questions
-- ============================================================

-- Admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin MITA', 'admin@mita.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- ── Courses ──────────────────────────────────────────────────

INSERT INTO courses (name, slug, category, teacher, description) VALUES
('Khóa Nền Tảng Hình Học Không Gian 2K9', 'nen-tang-hhkg-2k9', 'THPT', 'Hoàng Trung Anh',
 'Khóa học nền tảng hình học không gian dành cho học sinh lớp 12, ôn thi THPTQG.'),
('Đọc Hiểu Chuyên Sâu TSA', 'doc-hieu-chuyen-sau-tsa', 'TSA', 'Hoàng Trung Anh',
 'Luyện kỹ năng đọc hiểu, phân tích văn bản cho kỳ thi Đánh giá Tư duy (TSA).'),
('Tư Duy Định Lượng HSA', 'tu-duy-dinh-luong-hsa', 'HSA', 'Hoàng Trung Anh',
 'Ôn luyện tư duy định lượng, toán học cho kỳ thi Đánh giá Năng lực (HSA).')
ON CONFLICT (slug) DO NOTHING;

-- ── Lessons (HHKG course - from link_video_bai_giang.jsonl) ──

INSERT INTO lessons (course_id, title, sort_order, video_url) VALUES
((SELECT id FROM courses WHERE slug='nen-tang-hhkg-2k9'),
 'Buổi 6 - Tỉ lệ thể tích hình chóp tứ giác & hình lăng trụ', 6,
 'https://www.youtube.com/watch?v=OXTBiczG-6k')
ON CONFLICT DO NOTHING;

-- ── Exam Packages (from hsa-mock-data.js) ────────────────────

INSERT INTO exam_packages (name, tag, description, is_locked) VALUES
('Đề Luyện TSA — Tư Duy Toán Học',         'TSA', 'Bộ đề luyện Tư duy Toán học cho TSA',     false),
('Đề Luyện TSA — Đọc Hiểu',                'TSA', 'Bộ đề luyện Đọc hiểu cho TSA',            false),
('Đề Luyện TSA — Khoa Học',                'TSA', 'Bộ đề luyện phần Khoa học cho TSA',       false),
('Đề Luyện HSA — Tư Duy Định Lượng (Toán)','HSA', 'Bộ đề luyện Tư duy định lượng cho HSA',  false),
('Đề Luyện HSA — Tư Duy Định Tính (Văn)',  'HSA', 'Bộ đề luyện Tư duy định tính cho HSA',   false),
('Đề Luyện HSA — Tiếng Anh',               'HSA', 'Bộ đề luyện Tiếng Anh cho HSA',          false),
('Đề Luyện HSA — Khoa Học Tự Nhiên',       'HSA', 'Vật Lý, Hóa Học, Sinh Học',              false)
ON CONFLICT DO NOTHING;

-- ── Exams (HSA Toán - from hsa-mock-data.js) ─────────────────

INSERT INTO exams (package_id, title, duration_minutes, part_count, status) VALUES
((SELECT id FROM exam_packages WHERE name='Đề Luyện HSA — Tư Duy Định Lượng (Toán)'), 'Thi Thử THPT',              60, 1, 'PUBLISHED'),
((SELECT id FROM exam_packages WHERE name='Đề Luyện HSA — Tư Duy Định Lượng (Toán)'), 'Đề luyện: Tư duy định lượng 09', 60, 1, 'PUBLISHED'),
((SELECT id FROM exam_packages WHERE name='Đề Luyện HSA — Tư Duy Định Lượng (Toán)'), 'Đề luyện: Tư duy định lượng 08', 60, 1, 'PUBLISHED'),
((SELECT id FROM exam_packages WHERE name='Đề Luyện HSA — Tư Duy Định Lượng (Toán)'), 'Đề luyện: Tư duy định lượng 07', 60, 1, 'PUBLISHED'),
((SELECT id FROM exam_packages WHERE name='Đề Luyện HSA — Tư Duy Định Lượng (Toán)'), 'Đề luyện: Tư duy định lượng 06', 60, 1, 'PUBLISHED'),
((SELECT id FROM exam_packages WHERE name='Đề Luyện HSA — Tư Duy Định Lượng (Toán)'), 'Đề luyện: Tư duy định lượng 05', 60, 1, 'PUBLISHED'),
((SELECT id FROM exam_packages WHERE name='Đề Luyện HSA — Tư Duy Định Lượng (Toán)'), 'Đề luyện: Tư duy định lượng 04', 60, 1, 'PUBLISHED'),
((SELECT id FROM exam_packages WHERE name='Đề Luyện HSA — Tư Duy Định Lượng (Toán)'), 'Đề luyện: Tư duy định lượng 03', 60, 1, 'PUBLISHED'),
((SELECT id FROM exam_packages WHERE name='Đề Luyện HSA — Tư Duy Định Lượng (Toán)'), 'Đề luyện: Tư duy định lượng 02', 60, 1, 'PUBLISHED'),
((SELECT id FROM exam_packages WHERE name='Đề Luyện HSA — Tư Duy Định Lượng (Toán)'), 'Đề luyện: Tư duy định lượng 01', 60, 1, 'PUBLISHED'),

-- HSA Văn
((SELECT id FROM exam_packages WHERE name='Đề Luyện HSA — Tư Duy Định Tính (Văn)'), 'Đề luyện HSA: Ngữ văn 11', 60, 1, 'PUBLISHED'),
((SELECT id FROM exam_packages WHERE name='Đề Luyện HSA — Tư Duy Định Tính (Văn)'), 'Đề luyện HSA: Ngữ Văn 10', 60, 1, 'PUBLISHED'),
((SELECT id FROM exam_packages WHERE name='Đề Luyện HSA — Tư Duy Định Tính (Văn)'), 'Đề luyện HSA: Ngữ văn 09', 60, 1, 'PUBLISHED'),

-- HSA Tiếng Anh
((SELECT id FROM exam_packages WHERE name='Đề Luyện HSA — Tiếng Anh'), 'Đề luyện HSA: Ngữ văn 11', 60, 1, 'PUBLISHED'),
((SELECT id FROM exam_packages WHERE name='Đề Luyện HSA — Tiếng Anh'), 'Đề luyện HSA: Ngữ Văn 10', 60, 1, 'PUBLISHED');

-- ── Sample question (for first HSA Toán exam) ────────────────

INSERT INTO questions (exam_id, sort_order, text, option_a, option_b, option_c, option_d, correct_answer)
SELECT e.id, 1,
    'Cho hàm số $f(x) = x^2 - 4x + 3$. Giá trị nhỏ nhất của $f(x)$ trên đoạn $[0, 3]$ là?',
    '-1', '0', '1', '3', 'A'
FROM exams e
JOIN exam_packages p ON e.package_id = p.id
WHERE p.name = 'Đề Luyện HSA — Tư Duy Định Lượng (Toán)'
  AND e.title = 'Đề luyện: Tư duy định lượng 01'
LIMIT 1;

-- ── Schedules (sample weekly schedule) ───────────────────────

INSERT INTO schedules (day_of_week, period, lesson_title, lesson_course) VALUES
(2, 'MORNING',   'Buổi 1 - Giới thiệu khóa học HHKG',          'Khóa Nền Tảng HHKG 2K9'),
(2, 'AFTERNOON', 'Đề luyện: Tư duy định lượng 01',              'HSA Toán'),
(4, 'MORNING',   'Buổi 2 - Hình chóp đều',                     'Khóa Nền Tảng HHKG 2K9'),
(4, 'AFTERNOON', 'Chuyên đề Đọc hiểu nâng cao',                 'TSA Đọc hiểu'),
(6, 'MORNING',   'Buổi 6 - Tỉ lệ thể tích hình chóp & lăng trụ','Khóa Nền Tảng HHKG 2K9'),
(6, 'EVENING',   'Thi thử HSA tổng hợp',                        'HSA Tổng hợp');
