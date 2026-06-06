package com.mita.auth.repository;

import com.mita.auth.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    /** Xóa token chưa dùng của user (trước khi tạo token mới) */
    void deleteByUserIdAndUsedFalse(Long userId);
}
