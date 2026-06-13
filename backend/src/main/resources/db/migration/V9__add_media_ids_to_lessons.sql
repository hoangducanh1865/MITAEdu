ALTER TABLE lessons ADD COLUMN video_media_id       VARCHAR(100) REFERENCES media_assets(id);
ALTER TABLE lessons ADD COLUMN pdf_media_id         VARCHAR(100) REFERENCES media_assets(id);
ALTER TABLE lessons ADD COLUMN handwritten_media_id VARCHAR(100) REFERENCES media_assets(id);
