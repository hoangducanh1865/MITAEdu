package com.mita.media;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Cấu hình kết nối Viettel Cloud Object Storage (S3-compatible).
 * Map từ block "viettel.s3" trong application.yml.
 */
@Component
@ConfigurationProperties(prefix = "viettel.s3")
@Getter
@Setter
public class MediaStorageProperties {
    private String endpoint;
    private String region;
    private String accessKey;
    private String secretKey;
    private String bucket;
    private long urlTtlSeconds = 7200;
}
