package com.mita.exam.controller;

import com.mita.common.dto.ApiResponse;
import com.mita.exam.dto.*;
import com.mita.exam.service.ExamService;
import com.mita.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Exams", description = "Bài thi")
public class ExamController {

    private final ExamService examService;

    @GetMapping("/api/exam-packages")
    @Operation(summary = "Danh sách bộ đề", description = "?tag=TSA|HSA")
    public ResponseEntity<ApiResponse<List<ExamPackageDto>>> getPackages(
            @RequestParam(required = false) String tag) {
        return ResponseEntity.ok(ApiResponse.ok(examService.getPackages(tag)));
    }

    @GetMapping("/api/exam-packages/{id}")
    @Operation(summary = "Chi tiết bộ đề")
    public ResponseEntity<ApiResponse<ExamPackageDto>> getPackage(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(examService.getPackageById(id)));
    }

    @GetMapping("/api/exams")
    @Operation(summary = "Danh sách bài thi", description = "?packageId=&status=PUBLISHED")
    public ResponseEntity<ApiResponse<List<ExamDto>>> getExams(
            @RequestParam(required = false) Long packageId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(examService.getExams(packageId, status)));
    }

    @GetMapping("/api/exams/{id}")
    @Operation(summary = "Chi tiết bài thi")
    public ResponseEntity<ApiResponse<ExamDto>> getExam(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(examService.getExamById(id)));
    }

    @GetMapping("/api/exams/{id}/questions")
    @Operation(summary = "Câu hỏi (chỉ khi đã bắt đầu thi)")
    public ResponseEntity<ApiResponse<List<QuestionDto>>> getQuestions(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(examService.getQuestions(id, user.getId())));
    }

    @PostMapping("/api/exams/{id}/start")
    @Operation(summary = "Bắt đầu bài thi")
    public ResponseEntity<ApiResponse<SubmissionDto>> startExam(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(examService.startExam(id, user.getId())));
    }
}
