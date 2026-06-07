package com.mita.media.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaUrlDto {
    /** Presigned URL có thời hạn, trỏ thẳng tới object trên Viettel Cloud Object Storage. */
    private String url;
    private String contentType;
    private String title;
    /** Số giây URL còn sống - frontend dùng để chủ động xin URL mới trước khi hết hạn. */
    private long expiresInSeconds;
}
