-- V13: Ensure HSA course exists (ON CONFLICT = PostgreSQL-native upsert, safer than SELECT...WHERE NOT EXISTS)
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS description TEXT;

INSERT INTO courses (name, slug, category, teacher, description)
VALUES ('Khóa Nền Tảng - Tư Duy Toàn Diện ĐGNL TP HCM 2027 (V-ACT)',
        'khoa-nen-tang-vact-2027', 'HSA', 'MITA Education',
        'Khóa học toàn diện 8 môn: Toán, Tiếng Việt, Tiếng Anh, Hóa, Sinh học, Sử, Địa, Lí cho kỳ thi ĐGNL TP HCM (V-ACT) 2027')
ON CONFLICT (slug) DO NOTHING;
