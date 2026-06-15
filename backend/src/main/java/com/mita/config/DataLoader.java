package com.mita.config;

import com.mita.user.entity.User;
import com.mita.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Đảm bảo tài khoản admin được cấu hình qua biến môi trường (APP_ADMIN_EMAIL) có quyền ADMIN.
 *
 * Chỉ "promote" một tài khoản ĐÃ tồn tại — KHÔNG tạo tài khoản mới và KHÔNG đặt mật khẩu mặc định.
 * Admin phải tự đăng ký qua app (chọn mật khẩu riêng) rồi mới được nâng quyền.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;

    @Value("${app.admin-email}")
    private String adminEmail;

    @Override
    public void run(String... args) throws Exception {
        userRepository.findByEmail(adminEmail)
                .ifPresentOrElse(this::ensureAdminPrivileges, () -> log.warn(
                        "⚠️ Admin email '{}' chưa có tài khoản — bỏ qua. " +
                                "Hãy đăng ký tài khoản này qua app rồi khởi động lại để được cấp quyền ADMIN.",
                        adminEmail));
    }

    private void ensureAdminPrivileges(User user) {
        boolean changed = false;
        if (user.getRole() != User.Role.ADMIN) {
            user.setRole(User.Role.ADMIN);
            changed = true;
        }
        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            changed = true;
        }
        if (changed) {
            userRepository.save(user);
            log.info("✅ Admin privileges ensured for {}", user.getEmail());
        } else {
            log.info("✅ Admin user already configured: {}", user.getEmail());
        }
    }
}
