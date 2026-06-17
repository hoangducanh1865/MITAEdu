# Hướng dẫn quản trị MITA Education

File này là bản tóm tắt thao tác quản trị thường dùng. Riêng phần upload video bài giảng và tài liệu PDF có hướng dẫn chi tiết theo từng khóa ở [media-upload-guide.md](media-upload-guide.md).

## 1. Upload video và tài liệu bài học

Luồng đúng của hệ thống hiện tại:

1. Upload file thật lên bucket VCOS/S3.
2. Tạo hoặc cập nhật bản ghi trong bảng `media_assets`.
3. Cập nhật bài học trong bảng `lessons` để trỏ tới `video_media_id`, `pdf_media_id`, `handwritten_media_id`, `answer_media_id`.
4. Kiểm tra bằng tài khoản admin, sau đó kiểm tra bằng tài khoản học sinh đã kích hoạt khóa.

Không upload vào `/library`, `/documents`, hay thư mục public của frontend. Hai trang đó không phải nguồn nội dung khóa học bảo mật.

Checklist nhanh:

- Bucket production mặc định: `mita-edu-123`, cấu hình bằng `VCOS_BUCKET`.
- Endpoint mặc định trong backend: `https://vcos.cloudstorage.com.vn`, cấu hình bằng `VCOS_ENDPOINT`.
- Khóa HSA đang có trong codebase dùng slug `khoa-nen-tang-vact-2027`.
- `media_assets.course_slug` phải khớp chính xác với `courses.slug`.
- Tên object key nên theo mẫu `courses/{course_slug}/b{sort_order}/video.mp4`, `de-bai.pdf`, `viet-tay.pdf`, `dap-an-chi-tiet.pdf`.
- File `dap-an-chi-tiet.pdf` là tab `Đáp án chi tiết`; media id tương ứng nên là `{course_slug}-b{sort_order}-answer`.
- Với khóa HSA hiện tại, `sort_order` chạy từ 1 đến 179 trên toàn khóa. Ví dụ `Hóa · Bài 1` là `b104`, không phải `b1`.

Xem hướng dẫn đầy đủ, SQL mẫu và mapping từng môn ở [media-upload-guide.md](media-upload-guide.md).

## 2. Tạo mã kích hoạt

Trang admin: `/admin/access-codes`

Luồng sử dụng:

1. Đăng nhập bằng tài khoản có role `ADMIN`.
2. Vào `/admin/access-codes`.
3. Chọn một khóa cụ thể, hoặc chọn `Tất cả khóa hiện có`.
4. Nhập số lượng mã. Nếu chọn tất cả khóa, số lượng này là số mã cho mỗi khóa.
5. Chọn hạn kích hoạt nếu cần. Để trống nghĩa là không giới hạn thời gian.
6. Bấm `Tạo và tải CSV`.

File CSV tải về có các cột:

```csv
code,course_id,course_name,status,expires_at,created_at
```

Mỗi mã chỉ mở một khóa tương ứng. Mã hết hiệu lực khi quá hạn hoặc ngay sau khi học sinh dùng thành công. Khi học sinh kích hoạt, backend tạo quyền trong bảng `course_entitlements` để học sinh xem khóa đó.

API tương ứng:

```bash
curl -X POST "https://mitaedu-production.up.railway.app/api/admin/access-codes/generate" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "courseIds": [1],
    "count": 50,
    "expiresAt": "2026-07-31T23:59:00"
  }'
```

Tạo mã cho tất cả khóa bằng cách truyền toàn bộ `courseIds` hiện có. Có thể lấy danh sách khóa qua:

```bash
curl "https://mitaedu-production.up.railway.app/api/courses" \
  -H "Authorization: Bearer <admin_token>"
```

## 3. Tài khoản admin

Admin được phép xem toàn bộ khóa học, bài học, đề thi và media mà không cần mã kích hoạt. Nếu một tài khoản vẫn bị khóa sau khi nâng quyền, đăng xuất và đăng nhập lại để token mới chứa role `ADMIN`.

Kiểm tra trong DB:

```sql
SELECT id, full_name, email, role, email_verified
FROM users
WHERE email = 'admin@mita.edu.vn';
```

Sửa quyền admin trực tiếp:

```sql
UPDATE users
SET role = 'ADMIN',
    email_verified = TRUE
WHERE email = 'admin@mita.edu.vn';
```

## 4. Kiểm tra quyền xem khóa

Kiểm tra khóa:

```sql
SELECT id, name, slug, category
FROM courses
ORDER BY category, id;
```

Kiểm tra quyền học sinh:

```sql
SELECT ce.id,
       u.email,
       c.name AS course_name,
       c.slug AS course_slug,
       ce.created_at
FROM course_entitlements ce
JOIN users u ON u.id = ce.user_id
JOIN courses c ON c.id = ce.course_id
ORDER BY ce.created_at DESC;
```

Nếu học sinh đã nhập mã nhưng vẫn không xem được:

- Kiểm tra mã trong bảng `activation_codes` có `status = 'USED'`.
- Kiểm tra có dòng tương ứng trong `course_entitlements`.
- Kiểm tra lesson có `video_media_id`, `pdf_media_id`, `handwritten_media_id`, hoặc `answer_media_id`.
- Kiểm tra `media_assets.course_slug` khớp `courses.slug`.

## 5. Bảo mật media

Frontend không biết object key thật trên bucket. Khi người dùng mở video/PDF, frontend gọi:

```text
GET /api/media/{mediaId}/url
```

Backend kiểm tra role admin hoặc quyền khóa học, sau đó ký presigned URL ngắn hạn. TTL mặc định là 7200 giây, cấu hình bằng `VCOS_URL_TTL_SECONDS`.

Các biến môi trường liên quan:

```text
VCOS_ENDPOINT
VCOS_REGION
VCOS_ACCESS_KEY
VCOS_SECRET_KEY
VCOS_BUCKET
VCOS_URL_TTL_SECONDS
```

Không đưa `VCOS_ACCESS_KEY`, `VCOS_SECRET_KEY`, `DB_USERNAME`, `DB_PASSWORD` vào tài liệu, commit, ảnh chụp màn hình, hoặc ticket public.

## 6. Checklist trước khi deploy

- Backend build thành công.
- Railway đã có `SPRING_DATASOURCE_URL`, `DB_USERNAME`, `DB_PASSWORD`.
- Railway đã có `JWT_SECRET`.
- Railway đã có `APP_CORS_ALLOWED_ORIGINS` chứa `https://mita-edu.com`, `https://www.mita-edu.com`, `https://staging.mita-edu.com`.
- Railway đã có đầy đủ biến `VCOS_*` nếu cần xem video/PDF.
- Flyway migration không trùng version.
- Đăng nhập admin test được `/admin/access-codes`.
- Mở thử một bài có media bằng admin.
- Mở thử cùng bài bằng học sinh chưa kích hoạt để chắc chắn bị khóa.
- Kích hoạt mã cho học sinh rồi mở lại bài để chắc chắn xem được.
