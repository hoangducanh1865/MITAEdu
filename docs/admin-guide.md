# Hướng dẫn Quản trị viên MITAEdu

## 1. Cấu trúc Bucket Viettel IDC Cloud Object Storage (VCOS)

### Tên bucket
```
mita-edu-123
```
(Cấu hình qua biến môi trường `VCOS_BUCKET` trong Railway/production)

### Cấu trúc thư mục bắt buộc
```
mita-edu-123/
└── courses/
    └── {course-slug}/          ← slug của khóa học (ví dụ: toan-vact-hsa)
        └── b{N}/               ← số thứ tự bài học (b1, b2, b3, ...)
            ├── video.mp4       ← video bài giảng
            ├── de-bai.pdf      ← đề bài / tài liệu
            └── viet-tay.pdf    ← file viết tay / lời giải
```

### Quy tắc đặt tên object key
- Slug khóa học phải khớp với cột `slug` trong bảng `courses` (ví dụ: `toan-vact-hsa`, `ly-tsa-2026`)
- Số thứ tự bài học bắt đầu từ `b1`, theo thứ tự tăng dần
- Tên file cố định: `video.mp4`, `de-bai.pdf`, `viet-tay.pdf`
- Object key đầy đủ ví dụ: `courses/toan-vact-hsa/b1/video.mp4`

---

## 2. Upload file lên Bucket

### Quy trình upload (dùng Viettel IDC Console hoặc AWS CLI tương thích)

```bash
# Cấu hình credentials
export AWS_ACCESS_KEY_ID="<VCOS_ACCESS_KEY>"
export AWS_SECRET_ACCESS_KEY="<VCOS_SECRET_KEY>"
export AWS_ENDPOINT_URL="https://hcm01.vstorage.vngcloud.vn"  # endpoint VCOS

# Upload video
aws s3 cp ./video.mp4 s3://mita-edu-123/courses/toan-vact-hsa/b1/video.mp4 \
  --content-type video/mp4

# Upload PDF đề bài
aws s3 cp ./de-bai.pdf s3://mita-edu-123/courses/toan-vact-hsa/b1/de-bai.pdf \
  --content-type application/pdf

# Upload file viết tay
aws s3 cp ./viet-tay.pdf s3://mita-edu-123/courses/toan-vact-hsa/b1/viet-tay.pdf \
  --content-type application/pdf
```

---

## 3. Tạo bản ghi media_assets trong Database

Sau khi upload file lên bucket, cần thêm bản ghi vào bảng `media_assets` để backend có thể tra cứu và ký presigned URL:

```sql
-- Thêm video
INSERT INTO media_assets (id, object_key, content_type, course_slug, title)
VALUES (
  'toan-vact-hsa-b1-video',
  'courses/toan-vact-hsa/b1/video.mp4',
  'video/mp4',
  'toan-vact-hsa',
  'Bài 1 - Video bài giảng'
);

-- Thêm đề bài
INSERT INTO media_assets (id, object_key, content_type, course_slug, title)
VALUES (
  'toan-vact-hsa-b1-debai',
  'courses/toan-vact-hsa/b1/de-bai.pdf',
  'application/pdf',
  'toan-vact-hsa',
  'Bài 1 - Đề bài'
);

-- Thêm file viết tay
INSERT INTO media_assets (id, object_key, content_type, course_slug, title)
VALUES (
  'toan-vact-hsa-b1-viettay',
  'courses/toan-vact-hsa/b1/viet-tay.pdf',
  'application/pdf',
  'toan-vact-hsa',
  'Bài 1 - File viết tay'
);
```

### Liên kết media_assets với lesson

```sql
-- Cập nhật lesson để trỏ tới media IDs vừa tạo
UPDATE lessons
SET video_media_id       = 'toan-vact-hsa-b1-video',
    pdf_media_id         = 'toan-vact-hsa-b1-debai',
    handwritten_media_id = 'toan-vact-hsa-b1-viettay'
WHERE course_id = (SELECT id FROM courses WHERE slug = 'toan-vact-hsa')
  AND sort_order = 1;
```

---

## 4. Tạo mã kích hoạt (Access Codes)

### Qua Admin Panel (khuyến nghị)

1. Truy cập `/admin/access-codes`
2. Chọn khóa học từ dropdown
3. Nhập số lượng mã cần tạo (tối đa 500 mã/lần)
4. Nhấn **Tạo mã** — hệ thống tự động sinh mã theo format `MITA-XXXX-XXXX`
5. Sao chép danh sách mã và gửi cho học viên

### Qua API (cho hệ thống tích hợp)

```bash
curl -X POST https://api.mita-edu.com/api/admin/access-codes/generate \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"courseId": 1, "count": 50}'
```

**Format mã:** `MITA-XXXX-XXXX` (mỗi X là 1 ký tự từ bộ `ACDEFGHJKLMNPQRSTUVWXY34679`)
- Không dùng ký tự dễ nhầm lẫn (O/0, I/1/l)
- Tổng ~380 tỷ tổ hợp có thể

---

## 5. Cấp quyền trực tiếp cho User (Admin Grant)

Dùng khi không muốn phát mã, ví dụ: cấp quyền cho nhân viên, tester, học viên đặc biệt.

### Qua Admin Panel

1. Truy cập `/admin/entitlements`
2. Nhập **User ID** (xem trong `/admin/users`)
3. Chọn khóa học
4. Nhấn **Cấp quyền**

### Qua API

```bash
curl -X POST https://api.mita-edu.com/api/admin/entitlements \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"userId": 42, "courseId": 1}'
```

---

## 6. Thu hồi quyền / Revoke mã

### Thu hồi mã kích hoạt (chưa dùng)

- Admin Panel: `/admin/access-codes` → nhấn **Thu hồi** bên cạnh mã
- API: `DELETE /api/admin/access-codes/{id}`

> Mã đã được dùng (`USED`) không thể thu hồi trực tiếp — hãy thu hồi entitlement của user đó.

### Thu hồi quyền truy cập của user

- Admin Panel: `/admin/entitlements` → nhấn **Thu hồi** bên cạnh user
- API: `DELETE /api/admin/entitlements/{id}`

User bị thu hồi quyền sẽ **không thể xem nội dung khóa học** ngay lập tức (presigned URL còn hiệu lực tối đa 2 giờ).

---

## 7. Quản lý Users và Roles

### Xem danh sách users

Truy cập `/admin/users` — hiển thị: ID, tên, email, role, trạng thái xác thực email, ngày tạo.

### Nâng role lên ADMIN (chỉ qua DB trực tiếp)

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

> **Lưu ý bảo mật:** Sau khi nâng role, user cần đăng xuất và đăng nhập lại để cookie `mita_role` được cập nhật.

---

## 8. Bảo mật presigned URL

- TTL mặc định: **7200 giây (2 giờ)** — cấu hình qua `VCOS_URL_TTL_SECONDS`
- URL không thể chia sẻ vì mang watermark email user
- Backend kiểm tra entitlement **trước khi ký URL** — không thể bypass bằng cách đoán object key
- Frontend không bao giờ biết `object_key` thật trên bucket

---

## 9. Checklist triển khai

- [ ] Đặt đúng biến môi trường: `VCOS_BUCKET`, `VCOS_ACCESS_KEY`, `VCOS_SECRET_KEY`, `VCOS_ENDPOINT`, `VCOS_REGION`
- [ ] Flyway migration V7, V8, V9 chạy thành công
- [ ] Tạo ít nhất 1 admin account và set `role = 'ADMIN'` trong DB
- [ ] Kiểm tra bucket policy cho phép GET/PUT từ backend IP
- [ ] Test presigned URL: đăng nhập → vào khóa học có quyền → video phát được
