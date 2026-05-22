package com.mita.exam.controller;

import com.mita.common.dto.ApiResponse;
import com.mita.exam.dto.ResultDto;
import com.mita.exam.dto.SubmissionDto;
import com.mita.exam.dto.SubmitRequest;
import com.mita.exam.service.SubmissionService;
import com.mita.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@Tag(name = "Submissions", description = "Nộp bài và kết quả")
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    @Operation(summary = "Nộp bài thi")
    public ResponseEntity<ApiResponse<ResultDto>> submit(
            @Valid @RequestBody SubmitRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(submissionService.submit(req, user.getId())));
    }

    @GetMapping
    @Operation(summary = "Lịch sử làm bài")
    public ResponseEntity<ApiResponse<List<SubmissionDto>>> history(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(submissionService.getUserHistory(user.getId())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Kết quả chi tiết")
    public ResponseEntity<ApiResponse<ResultDto>> result(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(submissionService.getResult(id, user.getId())));
    }
}
