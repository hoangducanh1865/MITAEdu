package com.mita.user.controller;

import com.mita.auth.service.PasswordResetService;
import com.mita.common.dto.ApiResponse;
import com.mita.common.exception.ApiException;
import com.mita.user.dto.UpdateProfileRequest;
import com.mita.user.dto.UserDto;
import com.mita.user.entity.User;
import com.mita.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Quản lý người dùng")
public class UserController {

    private final UserService userService;
    private final PasswordResetService passwordResetService;

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin người dùng (chỉ của chính mình; ADMIN xem được mọi người)")
    public ResponseEntity<ApiResponse<UserDto>> getUser(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        requireSelfOrAdmin(id, currentUser);
        return ResponseEntity.ok(ApiResponse.ok(userService.getById(id)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin cá nhân (chỉ của chính mình; ADMIN cập nhật được mọi người)")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProfileRequest req,
            @AuthenticationPrincipal User currentUser) {
        requireSelfOrAdmin(id, currentUser);
        return ResponseEntity.ok(ApiResponse.ok(userService.updateProfile(id, req)));
    }

    /** Chỉ cho phép thao tác trên hồ sơ của chính người dùng đang đăng nhập, trừ ADMIN. */
    private void requireSelfOrAdmin(Long id, User currentUser) {
        if (currentUser == null) {
            throw ApiException.unauthorized("Vui lòng đăng nhập");
        }
        if (currentUser.getRole() != User.Role.ADMIN && !currentUser.getId().equals(id)) {
            throw ApiException.forbidden("Bạn không có quyền truy cập tài nguyên này");
        }
    }

    @PutMapping("/{id}/password")
    @Operation(summary = "Đổi mật khẩu trực tiếp đã tắt — dùng link qua email")
    public ResponseEntity<ApiResponse<Void>> changePassword(@PathVariable Long id) {
        throw ApiException.badRequest(
                "Vui lòng yêu cầu link đổi mật khẩu qua email để thiết lập mật khẩu mới.");
    }

    @PostMapping("/me/password-reset-link")
    @Operation(summary = "Gửi link đổi mật khẩu về email của người dùng hiện tại")
    public ResponseEntity<ApiResponse<Void>> requestPasswordChange(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw ApiException.unauthorized("Vui lòng đăng nhập để đổi mật khẩu");
        }

        passwordResetService.requestPasswordChange(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(
                "Chúng tôi đã gửi link đổi mật khẩu đến email của bạn.", null));
    }
}
