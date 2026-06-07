package com.mita.media;

import com.mita.common.exception.ApiException;
import com.mita.media.dto.MediaUrlDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.time.Duration;

@Service
@Slf4j
@RequiredArgsConstructor
public class MediaService {

    private final MediaAssetRepository mediaAssetRepository;
    private final MediaStorageProperties props;
    private final S3Presigner presigner;

    /**
     * Sinh presigned URL ngắn hạn cho một media asset đã biết.
     * Yêu cầu người dùng đã đăng nhập (gate ở SecurityConfig).
     *
     * TODO (giai đoạn sau): khi có bảng activations, kiểm tra user đã kích hoạt
     * khóa học `asset.getCourseSlug()` chưa trước khi cấp URL.
     */
    @Transactional(readOnly = true)
    public MediaUrlDto getUrl(String mediaId) {
        MediaAsset asset = mediaAssetRepository.findById(mediaId)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy media: " + mediaId));

        long ttl = props.getUrlTtlSeconds();
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(props.getBucket())
                .key(asset.getObjectKey())
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(ttl))
                .getObjectRequest(getObjectRequest)
                .build();

        String url = presigner.presignGetObject(presignRequest).url().toString();

        return MediaUrlDto.builder()
                .url(url)
                .contentType(asset.getContentType())
                .title(asset.getTitle())
                .expiresInSeconds(ttl)
                .build();
    }
}
