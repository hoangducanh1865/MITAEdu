package com.mita.auth.controller;

import com.mita.auth.dto.AuthResponse;
import com.mita.auth.dto.LoginRequest;
import com.mita.auth.dto.RegisterRequest;
import com.mita.auth.service.AuthService;
import com.mita.auth.service.EmailVerificationService;
import com.mita.common.dto.ApiResponse;
import com.mita.user.dto.UserDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Đăng ký, đăng nhập")
public class AuthController {

    private final AuthService authService;
    private final EmailVerificationService emailVerificationService;

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản mới — gửi email xác minh, chưa cấp quyền truy cập")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequest req) {
        authService.register(req);
        return ResponseEntity.ok(ApiResponse.ok(
                "Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản trước khi đăng nhập.", null));
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(authService.login(req)));
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin người dùng hiện tại")
    public ResponseEntity<ApiResponse<UserDto>> me(@AuthenticationPrincipal UserDetails userDetails) {
        var user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(UserDto.from(user)));
    }

    @PostMapping("/verify-email")
    @Operation(summary = "Xác minh email qua token từ link")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Token không hợp lệ"));
        }
        emailVerificationService.verifyToken(token);
        return ResponseEntity.ok(ApiResponse.ok("Xác minh email thành công", null));
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Gửi lại email xác minh theo địa chỉ email")
    public ResponseEntity<ApiResponse<Void>> resendVerification(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email != null && !email.isBlank()) {
            emailVerificationService.resendVerification(email);
        }
        // Luôn trả message chung để tránh dò email tồn tại
        return ResponseEntity.ok(ApiResponse.ok(
                "Nếu email hợp lệ và chưa được xác minh, chúng tôi đã gửi lại link xác minh.", null));
    }
}
