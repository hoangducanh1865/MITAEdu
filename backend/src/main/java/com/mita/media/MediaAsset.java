package com.mita.media;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Danh mục media (video/PDF) lưu trên Viettel Cloud Object Storage.
 * Frontend chỉ tham chiếu tới `id` (không bao giờ thấy object key thật),
 * backend tra cứu object_key tương ứng rồi ký presigned URL.
 */
@Entity
@Table(name = "media_assets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaAsset {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "object_key", nullable = false, length = 500)
    private String objectKey;

    @Column(name = "content_type", length = 100)
    private String contentType;

    /** Slug khóa học - phục vụ kiểm tra kích hoạt/enrollment sau này. */
    @Column(name = "course_slug", length = 255)
    private String courseSlug;

    @Column(length = 255)
    private String title;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
