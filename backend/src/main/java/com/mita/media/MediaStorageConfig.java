package com.mita.media;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URI;

/**
 * Khởi tạo S3Presigner trỏ tới Viettel Cloud Object Storage.
 * VCOS dùng path-style (bucket nằm trong path) nên bật pathStyleAccessEnabled.
 */
@Configuration
@Slf4j
@RequiredArgsConstructor
public class MediaStorageConfig {

    private final MediaStorageProperties props;

    @Bean
    public S3Presigner s3Presigner() {
        return S3Presigner.builder()
                .endpointOverride(URI.create(props.getEndpoint()))
                .region(Region.of(props.getRegion()))
                .credentialsProvider(credentialsProvider())
                .serviceConfiguration(s3Configuration())
                .build();
    }

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .endpointOverride(URI.create(props.getEndpoint()))
                .region(Region.of(props.getRegion()))
                .credentialsProvider(credentialsProvider())
                .serviceConfiguration(s3Configuration())
                .build();
    }

    private AwsCredentialsProvider credentialsProvider() {
        String accessKey = props.getAccessKey();
        String secretKey = props.getSecretKey();

        // Cho phép app khởi động ở môi trường dev/local chưa cấu hình credentials.
        // URL ký ra sẽ không dùng được, nhưng app vẫn chạy bình thường.
        if (!StringUtils.hasText(accessKey) || !StringUtils.hasText(secretKey)) {
            log.warn("VCOS credentials chưa được cấu hình (VCOS_ACCESS_KEY/VCOS_SECRET_KEY). " +
                    "Tính năng cấp presigned URL sẽ KHÔNG hoạt động cho tới khi được set.");
            accessKey = "unset";
            secretKey = "unset";
        }

        return StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey));
    }

    private S3Configuration s3Configuration() {
        return S3Configuration.builder()
                .pathStyleAccessEnabled(true)
                .build();
    }
}
