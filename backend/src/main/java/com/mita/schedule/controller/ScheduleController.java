package com.mita.schedule.controller;

import com.mita.common.dto.ApiResponse;
import com.mita.schedule.dto.ScheduleDto;
import com.mita.schedule.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
@Tag(name = "Schedules", description = "Thời khóa biểu")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping
    @Operation(summary = "Danh sách lịch học")
    public ResponseEntity<ApiResponse<List<ScheduleDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(scheduleService.getAll()));
    }
}
