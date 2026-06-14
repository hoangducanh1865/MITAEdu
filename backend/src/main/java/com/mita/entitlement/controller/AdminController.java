package com.mita.entitlement.controller;

import com.mita.common.dto.ApiResponse;
import com.mita.entitlement.dto.*;
import com.mita.entitlement.entity.CourseEntitlement;
import com.mita.entitlement.service.ActivationCodeService;
import com.mita.entitlement.service.EntitlementService;
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
    private final EntitlementService entitlementService;
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
                request.getCourseId(), request.getCount(), admin.getId());
        return ResponseEntity.ok(ApiResponse.ok(codes));
    }

    @GetMapping("/access-codes")
    @Operation(summary = "Danh sách mã kích hoạt theo khóa học")
    public ResponseEntity<ApiResponse<List<ActivationCodeDto>>> listCodes(
            @RequestParam Long courseId) {
        return ResponseEntity.ok(ApiResponse.ok(activationCodeService.getCodesForCourse(courseId)));
    }

    @DeleteMapping("/access-codes/{id}")
    @Operation(summary = "Thu hồi mã kích hoạt")
    public ResponseEntity<ApiResponse<Void>> revokeCode(@PathVariable Long id) {
        activationCodeService.revokeCode(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    /* ── Entitlements ── */

    @GetMapping("/entitlements")
    @Operation(summary = "Danh sách quyền truy cập (tất cả hoặc theo user)")
    public ResponseEntity<ApiResponse<List<CourseEntitlementDto>>> listEntitlements(
            @RequestParam(required = false) Long userId) {
        List<CourseEntitlementDto> result = (userId != null)
                ? entitlementService.getUserEntitlements(userId)
                : entitlementService.getAllEntitlements();
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping("/entitlements")
    @Operation(summary = "Cấp quyền truy cập trực tiếp cho user")
    public ResponseEntity<ApiResponse<CourseEntitlementDto>> grantEntitlement(
            @RequestBody AdminGrantRequest request,
            Authentication authentication) {
        User admin = (User) authentication.getPrincipal();
        CourseEntitlement e = entitlementService.grantAccess(
                request.getUserId(), request.getCourseId(),
                CourseEntitlement.Source.ADMIN_GRANT, admin.getId());
        return ResponseEntity.ok(ApiResponse.ok(CourseEntitlementDto.from(e)));
    }

    @DeleteMapping("/entitlements/{id}")
    @Operation(summary = "Thu hồi quyền truy cập của user")
    public ResponseEntity<ApiResponse<Void>> revokeEntitlement(@PathVariable Long id) {
        entitlementService.revokeEntitlement(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
