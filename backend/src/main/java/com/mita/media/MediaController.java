package com.mita.media;

import com.mita.common.dto.ApiResponse;
import com.mita.media.dto.MediaUrlDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
@Tag(name = "Media", description = "Cấp presigned URL video/PDF")
public class MediaController {

    private final MediaService mediaService;

    @GetMapping("/{mediaId}/url")
    @Operation(summary = "Lấy presigned URL ngắn hạn cho một media. Media học thử được mở công khai.")
    public ResponseEntity<ApiResponse<MediaUrlDto>> getUrl(
            @PathVariable String mediaId,
            @RequestParam(defaultValue = "false") boolean download,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok(mediaService.getUrl(mediaId, authentication, download)));
    }

    @GetMapping("/{mediaId}/content")
    @Operation(summary = "Stream nội dung media qua backend để xem/tải trên mobile mà không lộ presigned URL.")
    public ResponseEntity<InputStreamResource> getContent(
            @PathVariable String mediaId,
            @RequestParam(defaultValue = "false") boolean download,
            Authentication authentication) {
        MediaService.MediaContent content = mediaService.getContent(mediaId, authentication);
        MediaType mediaType = content.contentType() != null && !content.contentType().isBlank()
                ? MediaType.parseMediaType(content.contentType())
                : MediaType.APPLICATION_OCTET_STREAM;
        ContentDisposition disposition = (download
                ? ContentDisposition.attachment()
                : ContentDisposition.inline())
                .filename(content.fileName())
                .build();

        ResponseEntity.BodyBuilder response = ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .header(HttpHeaders.CACHE_CONTROL, "private, no-store");
        if (content.contentLength() != null && content.contentLength() >= 0) {
            response.contentLength(content.contentLength());
        }
        return response.body(new InputStreamResource(content.stream()));
    }
}
