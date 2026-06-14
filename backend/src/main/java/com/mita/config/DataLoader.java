package com.mita.config;

import com.mita.user.entity.User;
import com.mita.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if not exists
        userRepository.findByEmail("admin@mita.edu.vn")
                .ifPresentOrElse(admin -> {
                    boolean changed = false;
                    if (admin.getRole() != User.Role.ADMIN) {
                        admin.setRole(User.Role.ADMIN);
                        changed = true;
                    }
                    if (!admin.isEmailVerified()) {
                        admin.setEmailVerified(true);
                        changed = true;
                    }
                    if (changed) {
                        userRepository.save(admin);
                        log.info("✅ Admin user privileges repaired: admin@mita.edu.vn");
                    } else {
                        log.info("✅ Admin user already exists");
                    }
                }, () -> {
                    User admin = User.builder()
                            .name("Admin MITA")
                            .email("admin@mita.edu.vn")
                            .passwordHash(passwordEncoder.encode("admin123"))
                            .role(User.Role.ADMIN)
                            .emailVerified(true)
                            .build();
                    userRepository.save(admin);
                    log.info("✅ Admin user created: admin@mita.edu.vn / admin123");
                });

    }
}
