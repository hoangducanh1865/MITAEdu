package com.mita.media;

import com.mita.common.exception.ApiException;
import com.mita.course.repository.CourseRepository;
import com.mita.course.repository.LessonRepository;
import com.mita.course.service.TrialAccessPolicy;
import com.mita.entitlement.service.EntitlementService;
import com.mita.media.dto.MediaUrlDto;
import com.mita.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.time.Duration;

@Service
@Slf4j
@RequiredArgsConstructor
public class MediaService {

    private final MediaAssetRepository mediaAssetRepository;
    private final MediaStorageProperties props;
    private final S3Presigner presigner;
    private final S3Client s3Client;
    private final EntitlementService entitlementService;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    @Transactional(readOnly = true)
    public MediaUrlDto getUrl(String mediaId, Authentication authentication) {
        return getUrl(mediaId, authentication, false);
    }

    @Transactional(readOnly = true)
    public MediaUrlDto getUrl(String mediaId, Authentication authentication, boolean download) {
        MediaAsset asset = requireAccessibleAsset(mediaId, authentication);
        ensureObjectExists(asset);

        long ttl = props.getUrlTtlSeconds();
        GetObjectRequest.Builder getObjectRequestBuilder = GetObjectRequest.builder()
                .bucket(props.getBucket())
                .key(asset.getObjectKey());

        if (download) {
            getObjectRequestBuilder.responseContentDisposition(
                    "attachment; filename=\"" + buildDownloadFileName(asset) + "\"");
            if (asset.getContentType() != null && !asset.getContentType().isBlank()) {
                getObjectRequestBuilder.responseContentType(asset.getContentType());
            }
        }

        GetObjectRequest getObjectRequest = getObjectRequestBuilder.build();

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

    @Transactional(readOnly = true)
    public MediaContent getContent(String mediaId, Authentication authentication) {
        MediaAsset asset = requireAccessibleAsset(mediaId, authentication);
        ensureObjectExists(asset);

        try {
            URLConnection connection = new URL(buildPresignedUrl(asset, false)).openConnection();
            connection.setConnectTimeout(10_000);
            connection.setReadTimeout(30_000);
            String contentType = connection.getContentType() != null && !connection.getContentType().isBlank()
                    ? connection.getContentType()
                    : asset.getContentType();
            return new MediaContent(
                    connection.getInputStream(),
                    contentType,
                    connection.getContentLengthLong(),
                    buildDownloadFileName(asset));
        } catch (IOException ex) {
            log.warn("Cannot stream media object via presigned URL: mediaId={}, key={}",
                    asset.getId(), asset.getObjectKey(), ex);
            throw ApiException.badRequest("Không tải được nội dung. Vui lòng thử lại sau.");
        }
    }

    private MediaAsset requireAccessibleAsset(String mediaId, Authentication authentication) {
        MediaAsset asset = mediaAssetRepository.findById(mediaId)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy media: " + mediaId));

        if (!isTrialMedia(asset.getId())) {
            if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
                throw ApiException.unauthorized("Vui lòng đăng nhập để xem nội dung này");
            }
            if (!user.getRole().equals(User.Role.ADMIN) && asset.getCourseSlug() != null) {
                Long courseId = courseRepository.findBySlug(asset.getCourseSlug())
                        .map(c -> c.getId()).orElse(null);
                if (courseId != null && !entitlementService.hasAccess(user.getId(), courseId)) {
                    throw ApiException.forbidden("Bạn chưa có quyền truy cập khóa học này");
                }
            }
        }

        return asset;
    }

    private void ensureObjectExists(MediaAsset asset) {
        try {
            s3Client.headObject(HeadObjectRequest.builder()
                    .bucket(props.getBucket())
                    .key(asset.getObjectKey())
                    .build());
        } catch (S3Exception ex) {
            if (isMissingObject(ex)) {
                log.warn("Media object is missing from storage: mediaId={}, key={}",
                        asset.getId(), asset.getObjectKey());
                throw ApiException.notFound("Nội dung chưa được tải lên");
            }
            log.warn("Cannot verify media object in storage: mediaId={}, key={}, status={}, code={}",
                    asset.getId(), asset.getObjectKey(), ex.statusCode(), ex.awsErrorDetails().errorCode());
            throw ApiException.badRequest("Không tải được nội dung. Vui lòng thử lại sau.");
        }
    }

    private boolean isMissingObject(S3Exception ex) {
        String code = ex.awsErrorDetails() != null ? ex.awsErrorDetails().errorCode() : "";
        return ex.statusCode() == 404
                || "NoSuchKey".equalsIgnoreCase(code)
                || "NotFound".equalsIgnoreCase(code);
    }

    private String buildPresignedUrl(MediaAsset asset, boolean download) {
        GetObjectRequest.Builder getObjectRequestBuilder = GetObjectRequest.builder()
                .bucket(props.getBucket())
                .key(asset.getObjectKey());

        if (download) {
            getObjectRequestBuilder.responseContentDisposition(
                    "attachment; filename=\"" + buildDownloadFileName(asset) + "\"");
            if (asset.getContentType() != null && !asset.getContentType().isBlank()) {
                getObjectRequestBuilder.responseContentType(asset.getContentType());
            }
        }

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(props.getUrlTtlSeconds()))
                .getObjectRequest(getObjectRequestBuilder.build())
                .build();

        return presigner.presignGetObject(presignRequest).url().toString();
    }

    private boolean isTrialMedia(String mediaId) {
        return lessonRepository.countTrialMediaLinks(
                TrialAccessPolicy.COURSE_SLUG,
                TrialAccessPolicy.LESSON_SORT_ORDERS,
                mediaId) > 0;
    }

    private String buildDownloadFileName(MediaAsset asset) {
        String source = asset.getId() != null ? asset.getId() : "mita-document";
        String fileName = source.replaceAll("[^A-Za-z0-9._-]", "-");
        if (!fileName.toLowerCase().endsWith(".pdf") && "application/pdf".equalsIgnoreCase(asset.getContentType())) {
            fileName += ".pdf";
        }
        return fileName;
    }

    public record MediaContent(
            InputStream stream,
            String contentType,
            Long contentLength,
            String fileName
    ) {}
}
