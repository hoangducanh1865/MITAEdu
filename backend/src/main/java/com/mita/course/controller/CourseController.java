package com.mita.course.controller;

import com.mita.common.dto.ApiResponse;
import com.mita.course.dto.CourseDto;
import com.mita.course.dto.LessonDto;
import com.mita.course.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Tag(name = "Courses", description = "Khóa học")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    @Operation(summary = "Danh sách khóa học", description = "?category=TSA|HSA|THPT")
    public ResponseEntity<ApiResponse<List<CourseDto>>> list(
            @RequestParam(required = false) String category,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getAll(category, authentication)));
    }

    @GetMapping("/trial")
    @Operation(summary = "Khóa học thử", description = "Chỉ trả về buổi học thử được mở cho mọi tài khoản đăng nhập")
    public ResponseEntity<ApiResponse<CourseDto>> getTrialCourse() {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getTrialCourse()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Chi tiết khóa học (kèm danh sách bài học nếu có quyền)")
    public ResponseEntity<ApiResponse<CourseDto>> getOne(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getById(id, authentication)));
    }

    @GetMapping("/{id}/lessons")
    @Operation(summary = "Danh sách bài học của khóa học (yêu cầu quyền truy cập)")
    public ResponseEntity<ApiResponse<List<LessonDto>>> getLessons(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getLessons(id, authentication)));
    }
}
