package com.mita.course.controller;

import com.mita.common.dto.ApiResponse;
import com.mita.course.dto.CourseDto;
import com.mita.course.dto.LessonDto;
import com.mita.course.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getAll(category)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Chi tiết khóa học (kèm danh sách bài học)")
    public ResponseEntity<ApiResponse<CourseDto>> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getById(id)));
    }

    @GetMapping("/{id}/lessons")
    @Operation(summary = "Danh sách bài học của khóa học")
    public ResponseEntity<ApiResponse<List<LessonDto>>> getLessons(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getLessons(id)));
    }
}
