package com.mita.document.controller;

import com.mita.common.dto.ApiResponse;
import com.mita.document.dto.DocumentDto;
import com.mita.document.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@Tag(name = "Documents", description = "Tài liệu và học liệu")
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping
    @Operation(summary = "Danh sách tài liệu", description = "?type=PDF|VIDEO|MATERIAL|OTHER")
    public ResponseEntity<ApiResponse<List<DocumentDto>>> list(
            @RequestParam(required = false) String type) {
        List<DocumentDto> documents = type != null && !type.isEmpty()
                ? documentService.getByType(type)
                : documentService.getAll();
        return ResponseEntity.ok(ApiResponse.ok(documents));
    }

    @GetMapping("/course/{courseName}")
    @Operation(summary = "Danh sách tài liệu theo khóa học")
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getByCourseName(
            @PathVariable String courseName) {
        return ResponseEntity.ok(ApiResponse.ok(documentService.getByCourseName(courseName)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Chi tiết tài liệu")
    public ResponseEntity<ApiResponse<DocumentDto>> getOne(@PathVariable Long id) {
        DocumentDto dto = documentService.getById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PostMapping
    @Operation(summary = "Tạo tài liệu mới")
    public ResponseEntity<ApiResponse<DocumentDto>> create(@RequestBody DocumentDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(documentService.create(dto)));
    }
}
