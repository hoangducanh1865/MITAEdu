package com.mita.auth.service;

import com.mita.auth.entity.EmailVerificationToken;
import com.mita.auth.repository.EmailVerificationTokenRepository;
import com.mita.common.exception.ApiException;
import com.mita.user.entity.User;
import com.mita.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final ResendEmailService resendEmailService;
    private final FrontendUrlResolver frontendUrlResolver;

    /** Tạo token và gửi email xác minh */
    @Transactional
    public void sendVerification(User user, String originHeader, String refererHeader) {
        // Xóa token cũ chưa dùng nếu có
        tokenRepository.deleteByUserIdAndUsedFalse(user.getId());

        String rawToken = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .user(user)
                .token(rawToken)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
        tokenRepository.save(verificationToken);

        String frontendUrl = frontendUrlResolver.resolve(originHeader, refererHeader);
        String verifyUrl = frontendUrl + "/verify-email?token=" + rawToken;
        resendEmailService.sendVerificationEmail(user.getEmail(), user.getName(), verifyUrl);
    }

    /** Xác minh token từ link email */
    @Transactional
    public void verifyToken(String rawToken) {
        EmailVerificationToken verificationToken = tokenRepository.findByToken(rawToken)
                .orElseThrow(() -> ApiException.badRequest("Link xác minh không hợp lệ"));

        if (verificationToken.isUsed()) {
            throw ApiException.badRequest("Link xác minh đã được sử dụng");
        }
        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw ApiException.badRequest("Link xác minh đã hết hạn. Vui lòng yêu cầu gửi lại.");
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        verificationToken.setUsed(true);
        tokenRepository.save(verificationToken);

        log.info("Email verified for user: {}", user.getEmail());
    }

    /**
     * Gửi lại email xác minh theo email.
     * Im lặng (không ném lỗi) nếu email không tồn tại hoặc đã xác minh —
     * tránh để lộ thông tin tài khoản nào tồn tại trong hệ thống.
     */
    @Transactional
    public void resendVerification(String email, String originHeader, String refererHeader) {
        userRepository.findByEmail(email).ifPresent(user -> {
            if (!user.isEmailVerified()) {
                sendVerification(user, originHeader, refererHeader);
            }
        });
    }
}
