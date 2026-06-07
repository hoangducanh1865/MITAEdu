package com.mita.media;

import com.mita.common.dto.ApiResponse;
import com.mita.media.dto.MediaUrlDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
@Tag(name = "Media", description = "Cấp presigned URL video/PDF (yêu cầu đăng nhập)")
public class MediaController {

    private final MediaService mediaService;

    @GetMapping("/{mediaId}/url")
    @Operation(summary = "Lấy presigned URL ngắn hạn cho một media (video/PDF)")
    public ResponseEntity<ApiResponse<MediaUrlDto>> getUrl(@PathVariable String mediaId) {
        return ResponseEntity.ok(ApiResponse.ok(mediaService.getUrl(mediaId)));
    }
}
