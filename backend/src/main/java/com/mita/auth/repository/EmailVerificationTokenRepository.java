package com.mita.auth.repository;

import com.mita.auth.entity.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {

    Optional<EmailVerificationToken> findByToken(String token);

    /** Xóa token chưa dùng của user (trước khi tạo token mới) */
    void deleteByUserIdAndUsedFalse(Long userId);
}
