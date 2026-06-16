ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS answer_media_id VARCHAR(100) REFERENCES media_assets(id);
