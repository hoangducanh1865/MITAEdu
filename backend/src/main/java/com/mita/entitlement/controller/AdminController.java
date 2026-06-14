package com.mita.entitlement.controller;

import com.mita.common.dto.ApiResponse;
import com.mita.entitlement.dto.ActivationCodeDto;
import com.mita.entitlement.dto.GenerateCodesRequest;
import com.mita.entitlement.service.ActivationCodeService;
import com.mita.user.dto.UserDto;
import com.mita.user.entity.User;
import com.mita.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Quản trị hệ thống")
public class AdminController {

    private final ActivationCodeService activationCodeService;
    private final UserRepository userRepository;

    /* ── Users ── */

    @GetMapping("/users")
    @Operation(summary = "Danh sách tất cả người dùng")
    public ResponseEntity<ApiResponse<List<UserDto>>> listUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(UserDto::from).toList();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    /* ── Activation Codes ── */

    @PostMapping("/access-codes/generate")
    @Operation(summary = "Tạo mã kích hoạt hàng loạt")
    public ResponseEntity<ApiResponse<List<String>>> generateCodes(
            @RequestBody GenerateCodesRequest request,
            Authentication authentication) {
        User admin = (User) authentication.getPrincipal();
        List<String> codes = activationCodeService.generateCodes(
                request.getCourseId(), request.getCount(), admin.getId(), request.getExpiresAt());
        return ResponseEntity.ok(ApiResponse.ok(codes));
    }

    @GetMapping("/access-codes")
    @Operation(summary = "Danh sách mã kích hoạt theo khóa học")
    public ResponseEntity<ApiResponse<List<ActivationCodeDto>>> listCodes(
            @RequestParam Long courseId) {
        return ResponseEntity.ok(ApiResponse.ok(activationCodeService.getCodesForCourse(courseId)));
    }
}
