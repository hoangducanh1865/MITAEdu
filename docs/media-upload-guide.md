# Hướng dẫn upload video bài giảng và file tài liệu

Tài liệu này mô tả đúng cách đưa video/PDF vào hệ thống khóa học bảo mật của MITA Education. Làm đủ 3 phần: upload object, tạo `media_assets`, rồi nối vào `lessons`.

## 1. Cách hệ thống đang đọc media

Frontend không đọc thẳng file từ bucket. Frontend chỉ nhận các media id trong lesson:

- `videoMediaId`: video bài giảng.
- `pdfMediaId`: file đề bài/tài liệu chính, hiển thị tab `Đề bài`.
- `handwrittenMediaId`: file lời giải/file viết tay, hiển thị tab `File viết tay`.

Khi học sinh mở bài, frontend gọi:

```text
GET /api/media/{mediaId}/url
```

Backend sẽ:

1. Tìm `media_assets.id = {mediaId}`.
2. Kiểm tra quyền xem khóa bằng `media_assets.course_slug`.
3. Ký presigned URL cho `media_assets.object_key`.

Vì vậy một bài chỉ hiện media khi cả 3 thứ cùng đúng:

- File thật tồn tại trong bucket tại đúng `object_key`.
- Có bản ghi `media_assets` trỏ tới đúng `object_key` và đúng `course_slug`.
- Dòng `lessons` của bài đó trỏ tới đúng media id.

## 2. Bucket và quy ước đặt tên

Bucket production mặc định:

```text
mita-edu-123
```

Biến môi trường backend:

```text
VCOS_ENDPOINT=https://vcos.cloudstorage.com.vn
VCOS_REGION=us-east-1
VCOS_BUCKET=mita-edu-123
VCOS_URL_TTL_SECONDS=7200
```

Quy ước object key mới:

```text
courses/{course_slug}/b{sort_order}/video.mp4
courses/{course_slug}/b{sort_order}/de-bai.pdf
courses/{course_slug}/b{sort_order}/viet-tay.pdf
```

Quy ước media id mới:

```text
{course_slug}-b{sort_order}-video
{course_slug}-b{sort_order}-pdf
{course_slug}-b{sort_order}-handwritten
```

Ví dụ cho khóa HSA, bài có `sort_order = 1`:

```text
courses/khoa-nen-tang-vact-2027/b1/video.mp4
courses/khoa-nen-tang-vact-2027/b1/de-bai.pdf
courses/khoa-nen-tang-vact-2027/b1/viet-tay.pdf

khoa-nen-tang-vact-2027-b1-video
khoa-nen-tang-vact-2027-b1-pdf
khoa-nen-tang-vact-2027-b1-handwritten
```

Khuyến nghị giữ tên file ASCII cố định như trên. Tên tiếng Việt hoặc có dấu cách vẫn có thể upload được, nhưng dễ sai khi copy object key vào SQL.

## 3. Các khóa học hiện có

Kiểm tra danh sách khóa thật trong database trước khi upload:

```sql
SELECT id, name, slug, category
FROM courses
ORDER BY category, id;
```

### HSA: Khóa Nền Tảng V-ACT 2027

Khóa này đã được seed trong codebase.

```text
Tên hiển thị: Khóa Nền Tảng - Tư Duy Toàn Diện ĐGNL TP HCM 2027 (V-ACT)
Category: HSA
Slug: khoa-nen-tang-vact-2027
Số bài: 179
Object root: courses/khoa-nen-tang-vact-2027/
```

Mapping môn theo `sort_order`:

| Môn | Bài trong UI | `sort_order` dùng trong object key |
| --- | --- | --- |
| Toán | Bài 1 đến Bài 58 | `b1` đến `b58` |
| Tiếng Việt | Bài 0 đến Bài 22 | `b59` đến `b81` |
| Tiếng Anh | Bài 1 đến Bài 22 | `b82` đến `b103` |
| Hóa | Bài 1 đến Bài 23 | `b104` đến `b126` |
| Sinh học | Bài 1 đến Bài 14 | `b127` đến `b140` |
| Sử | Bài 1 đến Bài 16 | `b141` đến `b156` |
| Địa | Bài 1 đến Bài 16 | `b157` đến `b172` |
| Lí | Bài 1 đến Bài 7 | `b173` đến `b179` |

Điểm dễ nhầm: `sort_order` là số thứ tự toàn khóa. Vì vậy `Hóa · Bài 1` upload vào `b104`, không phải `b1`.

### TSA: Khóa Trại hè Đánh thức tư duy ĐGNL

Frontend đã có tab/category `TSA`, nhưng trong migration hiện tại chưa thấy seed khóa TSA cụ thể. Trước khi upload, phải xác nhận trong DB đã có dòng `courses.category = 'TSA'`.

```sql
SELECT id, name, slug, category
FROM courses
WHERE category = 'TSA'
ORDER BY id;
```

Nếu query không trả dòng nào, cần tạo khóa và lesson trước, rồi mới upload media. Khi đã có slug thật, dùng cùng quy ước:

```text
courses/{slug_thuc_te_cua_tsa}/b{sort_order}/video.mp4
courses/{slug_thuc_te_cua_tsa}/b{sort_order}/de-bai.pdf
courses/{slug_thuc_te_cua_tsa}/b{sort_order}/viet-tay.pdf
```

Nếu cần tạo slug mới cho khóa TSA, khuyến nghị dùng slug ổn định, không đổi sau khi đã upload:

```text
khoa-trai-he-danh-thuc-tu-duy-dgnl
```

Chỉ dùng slug này nếu dòng trong bảng `courses.slug` cũng đúng y hệt.

### THPT: Khóa Luyện Đề V-ACT 2027

Frontend đã có tab/category `THPT`, nhưng trong migration hiện tại chưa thấy seed khóa THPT cụ thể. Trước khi upload, phải xác nhận trong DB đã có dòng `courses.category = 'THPT'`.

```sql
SELECT id, name, slug, category
FROM courses
WHERE category = 'THPT'
ORDER BY id;
```

Nếu query không trả dòng nào, cần tạo khóa và lesson trước, rồi mới upload media. Khi đã có slug thật, dùng cùng quy ước:

```text
courses/{slug_thuc_te_cua_thpt}/b{sort_order}/video.mp4
courses/{slug_thuc_te_cua_thpt}/b{sort_order}/de-bai.pdf
courses/{slug_thuc_te_cua_thpt}/b{sort_order}/viet-tay.pdf
```

Nếu cần tạo slug mới cho khóa THPT, khuyến nghị dùng slug ổn định:

```text
khoa-luyen-de-vact-2027
```

Chỉ dùng slug này nếu dòng trong bảng `courses.slug` cũng đúng y hệt.

## 4. Upload file lên bucket

### Cách 1: Dùng console VCOS

1. Mở bucket `mita-edu-123`.
2. Tạo folder theo đúng object key.
3. Upload file với tên cố định:
   - `video.mp4`
   - `de-bai.pdf`
   - `viet-tay.pdf`
4. Nếu console cho sửa content type, đặt:
   - Video: `video/mp4`
   - PDF: `application/pdf`

Ví dụ HSA, Toán Bài 1:

```text
courses/khoa-nen-tang-vact-2027/b1/video.mp4
courses/khoa-nen-tang-vact-2027/b1/de-bai.pdf
courses/khoa-nen-tang-vact-2027/b1/viet-tay.pdf
```

### Cách 2: Dùng AWS CLI compatible

Không commit credentials. Chỉ export tạm trong terminal local hoặc cấu hình profile riêng.

```bash
export AWS_ACCESS_KEY_ID="<VCOS_ACCESS_KEY>"
export AWS_SECRET_ACCESS_KEY="<VCOS_SECRET_KEY>"
export AWS_DEFAULT_REGION="${VCOS_REGION:-us-east-1}"
export VCOS_ENDPOINT="https://vcos.cloudstorage.com.vn"
export VCOS_BUCKET="mita-edu-123"
```

Upload HSA Toán Bài 1:

```bash
aws --endpoint-url "$VCOS_ENDPOINT" s3 cp ./video.mp4 \
  "s3://$VCOS_BUCKET/courses/khoa-nen-tang-vact-2027/b1/video.mp4" \
  --content-type "video/mp4"

aws --endpoint-url "$VCOS_ENDPOINT" s3 cp ./de-bai.pdf \
  "s3://$VCOS_BUCKET/courses/khoa-nen-tang-vact-2027/b1/de-bai.pdf" \
  --content-type "application/pdf"

aws --endpoint-url "$VCOS_ENDPOINT" s3 cp ./viet-tay.pdf \
  "s3://$VCOS_BUCKET/courses/khoa-nen-tang-vact-2027/b1/viet-tay.pdf" \
  --content-type "application/pdf"
```

Upload HSA Hóa Bài 1:

```bash
aws --endpoint-url "$VCOS_ENDPOINT" s3 cp ./video.mp4 \
  "s3://$VCOS_BUCKET/courses/khoa-nen-tang-vact-2027/b104/video.mp4" \
  --content-type "video/mp4"
```

## 5. SQL nối media vào bài học

### Mẫu đầy đủ cho một bài

Thay 3 giá trị này trước khi chạy:

- `course_slug`
- `sort_order`
- `title_prefix`

```sql
-- Ví dụ: HSA Toán Bài 1
INSERT INTO media_assets (id, object_key, content_type, course_slug, title)
VALUES
  (
    'khoa-nen-tang-vact-2027-b1-video',
    'courses/khoa-nen-tang-vact-2027/b1/video.mp4',
    'video/mp4',
    'khoa-nen-tang-vact-2027',
    'Toán · Bài 1 · Video bài giảng'
  ),
  (
    'khoa-nen-tang-vact-2027-b1-pdf',
    'courses/khoa-nen-tang-vact-2027/b1/de-bai.pdf',
    'application/pdf',
    'khoa-nen-tang-vact-2027',
    'Toán · Bài 1 · Đề bài'
  ),
  (
    'khoa-nen-tang-vact-2027-b1-handwritten',
    'courses/khoa-nen-tang-vact-2027/b1/viet-tay.pdf',
    'application/pdf',
    'khoa-nen-tang-vact-2027',
    'Toán · Bài 1 · File viết tay'
  )
ON CONFLICT (id) DO UPDATE
SET object_key = EXCLUDED.object_key,
    content_type = EXCLUDED.content_type,
    course_slug = EXCLUDED.course_slug,
    title = EXCLUDED.title;

UPDATE lessons
SET video_media_id = 'khoa-nen-tang-vact-2027-b1-video',
    pdf_media_id = 'khoa-nen-tang-vact-2027-b1-pdf',
    handwritten_media_id = 'khoa-nen-tang-vact-2027-b1-handwritten'
WHERE course_id = (
    SELECT id FROM courses WHERE slug = 'khoa-nen-tang-vact-2027'
)
AND sort_order = 1;
```

### HSA: ví dụ Hóa Bài 1

`Hóa · Bài 1` có `sort_order = 104`, nên object key dùng `b104`.

```sql
INSERT INTO media_assets (id, object_key, content_type, course_slug, title)
VALUES
  (
    'khoa-nen-tang-vact-2027-b104-video',
    'courses/khoa-nen-tang-vact-2027/b104/video.mp4',
    'video/mp4',
    'khoa-nen-tang-vact-2027',
    'Hóa · Bài 1 · Video bài giảng'
  ),
  (
    'khoa-nen-tang-vact-2027-b104-pdf',
    'courses/khoa-nen-tang-vact-2027/b104/de-bai.pdf',
    'application/pdf',
    'khoa-nen-tang-vact-2027',
    'Hóa · Bài 1 · Đề bài'
  ),
  (
    'khoa-nen-tang-vact-2027-b104-handwritten',
    'courses/khoa-nen-tang-vact-2027/b104/viet-tay.pdf',
    'application/pdf',
    'khoa-nen-tang-vact-2027',
    'Hóa · Bài 1 · File viết tay'
  )
ON CONFLICT (id) DO UPDATE
SET object_key = EXCLUDED.object_key,
    content_type = EXCLUDED.content_type,
    course_slug = EXCLUDED.course_slug,
    title = EXCLUDED.title;

UPDATE lessons
SET video_media_id = 'khoa-nen-tang-vact-2027-b104-video',
    pdf_media_id = 'khoa-nen-tang-vact-2027-b104-pdf',
    handwritten_media_id = 'khoa-nen-tang-vact-2027-b104-handwritten'
WHERE course_id = (
    SELECT id FROM courses WHERE slug = 'khoa-nen-tang-vact-2027'
)
AND sort_order = 104;
```

### HSA: ví dụ Lí Bài 7

`Lí · Bài 7` có `sort_order = 179`.

```sql
INSERT INTO media_assets (id, object_key, content_type, course_slug, title)
VALUES
  (
    'khoa-nen-tang-vact-2027-b179-video',
    'courses/khoa-nen-tang-vact-2027/b179/video.mp4',
    'video/mp4',
    'khoa-nen-tang-vact-2027',
    'Lí · Bài 7 · Video bài giảng'
  ),
  (
    'khoa-nen-tang-vact-2027-b179-pdf',
    'courses/khoa-nen-tang-vact-2027/b179/de-bai.pdf',
    'application/pdf',
    'khoa-nen-tang-vact-2027',
    'Lí · Bài 7 · Đề bài'
  )
ON CONFLICT (id) DO UPDATE
SET object_key = EXCLUDED.object_key,
    content_type = EXCLUDED.content_type,
    course_slug = EXCLUDED.course_slug,
    title = EXCLUDED.title;

UPDATE lessons
SET video_media_id = 'khoa-nen-tang-vact-2027-b179-video',
    pdf_media_id = 'khoa-nen-tang-vact-2027-b179-pdf',
    handwritten_media_id = NULL
WHERE course_id = (
    SELECT id FROM courses WHERE slug = 'khoa-nen-tang-vact-2027'
)
AND sort_order = 179;
```

Nếu một bài chưa có file viết tay, để `handwritten_media_id = NULL`. Nếu chưa có video, để `video_media_id = NULL`. UI sẽ chỉ hiển thị phần có media id.

## 6. Mẫu kiểm tra sau khi chạy SQL

Kiểm tra lesson đã trỏ đúng media id:

```sql
SELECT l.sort_order,
       l.title,
       l.video_media_id,
       l.pdf_media_id,
       l.handwritten_media_id
FROM lessons l
JOIN courses c ON c.id = l.course_id
WHERE c.slug = 'khoa-nen-tang-vact-2027'
ORDER BY l.sort_order;
```

Kiểm tra media asset đã dùng đúng slug và object key:

```sql
SELECT id, object_key, content_type, course_slug, title
FROM media_assets
WHERE course_slug = 'khoa-nen-tang-vact-2027'
ORDER BY id;
```

Kiểm tra một bài cụ thể:

```sql
SELECT l.sort_order,
       l.title,
       ma_v.object_key AS video_key,
       ma_p.object_key AS pdf_key,
       ma_h.object_key AS handwritten_key
FROM lessons l
JOIN courses c ON c.id = l.course_id
LEFT JOIN media_assets ma_v ON ma_v.id = l.video_media_id
LEFT JOIN media_assets ma_p ON ma_p.id = l.pdf_media_id
LEFT JOIN media_assets ma_h ON ma_h.id = l.handwritten_media_id
WHERE c.slug = 'khoa-nen-tang-vact-2027'
  AND l.sort_order = 1;
```

## 7. Test trên website

1. Đăng nhập admin.
2. Mở `/courses?category=HSA`.
3. Mở khóa `Khóa Nền Tảng - Tư Duy Toàn Diện ĐGNL TP HCM 2027 (V-ACT)`.
4. Mở bài vừa gắn media.
5. Video phải hiện nếu có `video_media_id`.
6. Tab `Đề bài` phải hiện nếu có `pdf_media_id`.
7. Tab `File viết tay` phải hiện nếu có `handwritten_media_id`.

Sau đó test bằng học sinh:

1. Đăng nhập học sinh chưa kích hoạt khóa.
2. Mở khóa HSA, phải thấy khóa bị khóa.
3. Dùng mã kích hoạt khóa HSA.
4. Mở lại bài có media, phải xem được video/PDF.

## 8. Lỗi thường gặp

### Upload đúng file nhưng UI không hiện gì

Nguyên nhân thường là lesson chưa trỏ tới media id.

Chạy:

```sql
SELECT sort_order, title, video_media_id, pdf_media_id, handwritten_media_id
FROM lessons
WHERE course_id = (SELECT id FROM courses WHERE slug = 'khoa-nen-tang-vact-2027')
  AND sort_order = 1;
```

Nếu 3 cột media đều `NULL`, hãy chạy `UPDATE lessons ...` ở mục 5.

### Backend báo không tìm thấy media

Nguyên nhân: `lessons.*_media_id` trỏ tới id không tồn tại trong `media_assets`.

Chạy:

```sql
SELECT id
FROM media_assets
WHERE id IN (
  'khoa-nen-tang-vact-2027-b1-video',
  'khoa-nen-tang-vact-2027-b1-pdf',
  'khoa-nen-tang-vact-2027-b1-handwritten'
);
```

### Admin xem được nhưng học sinh đã kích hoạt vẫn không xem được

Kiểm tra `media_assets.course_slug`. Nó phải là slug thật trong bảng `courses`.

Sai:

```text
toan-vact-hsa
```

Đúng cho khóa HSA hiện tại:

```text
khoa-nen-tang-vact-2027
```

Sửa:

```sql
UPDATE media_assets
SET course_slug = 'khoa-nen-tang-vact-2027'
WHERE id LIKE 'khoa-nen-tang-vact-2027-%';
```

### Video/PDF vẫn lỗi sau khi DB đúng

Kiểm tra object key có tồn tại trong bucket:

```bash
aws --endpoint-url "$VCOS_ENDPOINT" s3 ls \
  "s3://mita-edu-123/courses/khoa-nen-tang-vact-2027/b1/"
```

Nếu không thấy file, upload lại đúng đường dẫn.

### Dữ liệu legacy `toan-vact-hsa`

Migration cũ có seed media id dạng:

```text
toan-vact-hsa-b1-video
toan-vact-hsa-b1-pdf
toan-vact-hsa-b1-handwritten
```

Đây là dữ liệu legacy. Với nội dung mới, dùng slug thật `khoa-nen-tang-vact-2027`. Nếu muốn chuẩn hóa lại Bài 1 HSA, chạy SQL ở mục 5 cho `b1` để tạo bộ id mới rồi update lesson về:

```text
khoa-nen-tang-vact-2027-b1-video
khoa-nen-tang-vact-2027-b1-pdf
khoa-nen-tang-vact-2027-b1-handwritten
```

## 9. Quy trình chuẩn cho mỗi đợt upload

1. Xuất danh sách lesson cần upload:

```sql
SELECT l.sort_order, l.title
FROM lessons l
JOIN courses c ON c.id = l.course_id
WHERE c.slug = 'khoa-nen-tang-vact-2027'
ORDER BY l.sort_order;
```

2. Đặt file local theo từng bài:

```text
local-upload/
  b1/
    video.mp4
    de-bai.pdf
    viet-tay.pdf
  b2/
    video.mp4
    de-bai.pdf
```

3. Upload lên bucket theo cùng số `b{sort_order}`.
4. Chạy SQL `INSERT INTO media_assets ... ON CONFLICT`.
5. Chạy SQL `UPDATE lessons ...`.
6. Kiểm tra bằng query ở mục 6.
7. Test admin trên website.
8. Test học sinh bằng mã kích hoạt thật.
