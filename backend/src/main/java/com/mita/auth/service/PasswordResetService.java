package com.mita.auth.service;

import com.mita.auth.entity.PasswordResetToken;
import com.mita.auth.repository.PasswordResetTokenRepository;
import com.mita.common.exception.ApiException;
import com.mita.user.entity.User;
import com.mita.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final ResendEmailService resendEmailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    /**
     * Gửi email đặt lại mật khẩu.
     * Im lặng nếu email không tồn tại — tránh lộ thông tin tài khoản.
     */
    @Transactional
    public void requestReset(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            createTokenAndSendEmail(user, false);
            log.info("Password reset requested for user: {}", user.getEmail());
        });
    }

    /** Gửi link đổi mật khẩu cho chính người dùng đang đăng nhập. */
    @Transactional
    public void requestPasswordChange(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> ApiException.unauthorized("Vui lòng đăng nhập lại"));

        createTokenAndSendEmail(user, true);
        log.info("Password change requested for user: {}", user.getEmail());
    }

    /** Xác thực token và đặt lại mật khẩu mới */
    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        PasswordResetToken prt = tokenRepository.findByToken(rawToken)
                .orElseThrow(() -> ApiException.badRequest("Link đặt lại mật khẩu không hợp lệ"));

        if (prt.isUsed()) {
            throw ApiException.badRequest("Link này đã được sử dụng");
        }
        if (prt.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw ApiException.badRequest("Link đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại.");
        }

        var user = prt.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        prt.setUsed(true);
        tokenRepository.save(prt);

        log.info("Password reset successfully for user: {}", user.getEmail());
    }

    private void createTokenAndSendEmail(User user, boolean passwordChange) {
        tokenRepository.deleteByUserIdAndUsedFalse(user.getId());

        String rawToken = UUID.randomUUID().toString();
        PasswordResetToken prt = PasswordResetToken.builder()
                .user(user)
                .token(rawToken)
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build();
        tokenRepository.save(prt);

        String resetUrl = frontendUrl + "/reset-password?token=" + rawToken;
        if (passwordChange) {
            resendEmailService.sendPasswordChangeEmail(user.getEmail(), user.getName(), resetUrl);
        } else {
            resendEmailService.sendPasswordResetEmail(user.getEmail(), user.getName(), resetUrl);
        }
    }
}
