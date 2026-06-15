package com.mita.user.controller;

import com.mita.auth.service.PasswordResetService;
import com.mita.common.dto.ApiResponse;
import com.mita.common.exception.ApiException;
import com.mita.user.dto.UpdateProfileRequest;
import com.mita.user.dto.UserDto;
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
    @Operation(summary = "Lấy thông tin người dùng")
    public ResponseEntity<ApiResponse<UserDto>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getById(id)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin cá nhân")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProfileRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(userService.updateProfile(id, req)));
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
