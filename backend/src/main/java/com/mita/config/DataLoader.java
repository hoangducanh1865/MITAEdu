package com.mita.config;

import com.mita.user.entity.User;
import com.mita.user.repository.UserRepository;
import com.mita.document.entity.Document;
import com.mita.document.repository.DocumentRepository;
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
    private final DocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if not exists
        if (!userRepository.existsByEmail("admin@mita.edu.vn")) {
            User admin = User.builder()
                    .name("Admin MITA")
                    .email("admin@mita.edu.vn")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("✅ Admin user created: admin@mita.edu.vn / admin123");
        } else {
            log.info("✅ Admin user already exists");
        }

        // Seed sample documents
        if (documentRepository.count() == 0) {
            seedDocuments();
            log.info("✅ Sample documents created");
        } else {
            log.info("✅ Documents already exist");
        }
    }

    private void seedDocuments() {
        // Course materials for "Khoá nền tảng HHKG 2k9"
        String courseName = "Khoá nền tảng HHKG 2k9";

        // Lesson 6 video
        documentRepository.save(Document.builder()
                .title("Buổi 6 - Tỉ lệ thể tích của hình chóp tứ giác")
                .type(Document.Type.VIDEO)
                .description("Video bài giảng - Tỉ lệ thể tích của hình chóp tứ giác có đáy là hình bình hành - Tỉ lệ thể tích của hình lăng trụ")
                .courseName(courseName)
                .url("https://www.youtube.com/watch?v=OXTBiczG-6k")
                .sortOrder(6)
                .build());

        // Lesson 6 - Handwritten notes
        documentRepository.save(Document.builder()
                .title("Buổi 6 - File viết tay (Solutions)")
                .type(Document.Type.PDF)
                .description("Lời giải chi tiết - Tỉ lệ thể tích của hình chóp tứ giác - File viết tay")
                .courseName(courseName)
                .filePath("/materials/Buổi 6 - Tỉ lệ thể tích của hình chóp tứ giác có đáy là hình bình hành - Tỉ lệ thể tích của hình lăng trụ - File viết tay.pdf")
                .sortOrder(2)
                .build());

        // Lesson 6 - Practice problems
        documentRepository.save(Document.builder()
                .title("Buổi 6 - File đề (Exercises)")
                .type(Document.Type.PDF)
                .description("Bài tập - Tỉ số thể tích của hình chóp tứ giác - Tỉ số thể tích của khối lăng trụ")
                .courseName(courseName)
                .filePath("/materials/Buổi 6 - Tỉ số thể tích của hình chóp tứ giác - Tỉ số thể tích của khối lăng trụ - File đề.pdf")
                .sortOrder(1)
                .build());

        // Additional sample materials
        documentRepository.save(Document.builder()
                .title("Hình học không gian - Tài liệu ôn tập")
                .type(Document.Type.MATERIAL)
                .description("Tổng hợp lý thuyết và bài tập hình học không gian - Dành cho học sinh lớp 11, 12")
                .courseName(courseName)
                .sortOrder(3)
                .build());

        documentRepository.save(Document.builder()
                .title("Các công thức quan trọng HHKG")
                .type(Document.Type.MATERIAL)
                .description("Tổng hợp các công thức thường dùng trong hình học không gian")
                .courseName(courseName)
                .sortOrder(4)
                .build());
    }
}
