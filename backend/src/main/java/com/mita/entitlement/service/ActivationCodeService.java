package com.mita.entitlement.service;

import com.mita.common.exception.ApiException;
import com.mita.course.entity.Course;
import com.mita.course.repository.CourseRepository;
import com.mita.entitlement.dto.ActivationCodeDto;
import com.mita.entitlement.dto.CourseEntitlementDto;
import com.mita.entitlement.entity.ActivationCode;
import com.mita.entitlement.entity.ActivationCode.Status;
import com.mita.entitlement.entity.CourseEntitlement;
import com.mita.entitlement.repository.ActivationCodeRepository;
import com.mita.user.entity.User;
import com.mita.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivationCodeService {

    private static final String ALPHABET = "ACDEFGHJKLMNPQRSTUVWXY34679";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final ActivationCodeRepository activationCodeRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EntitlementService entitlementService;

    @Transactional
    public List<ActivationCodeDto> generateCodes(List<Long> courseIds, int count, Long adminId, LocalDateTime expiresAt) {
        if (courseIds == null || courseIds.isEmpty()) {
            throw ApiException.badRequest("Vui lòng chọn ít nhất một khóa học");
        }
        if (count < 1 || count > 10000) {
            throw ApiException.badRequest("Số lượng mã phải từ 1 đến 10000 cho mỗi khóa");
        }

        List<Course> courses = courseIds.stream()
                .distinct()
                .map(courseId -> courseRepository.findById(courseId)
                        .orElseThrow(() -> ApiException.notFound("Không tìm thấy khóa học: " + courseId)))
                .toList();
        User admin = (adminId != null) ? userRepository.findById(adminId).orElse(null) : null;

        List<ActivationCodeDto> generated = new ArrayList<>();
        for (Course course : courses) {
            for (int i = 0; i < count; i++) {
                String code = generateUniqueCode();
                ActivationCode ac = ActivationCode.builder()
                        .code(code)
                        .course(course)
                        .createdBy(admin)
                        .expiresAt(expiresAt)
                        .build();
                generated.add(ActivationCodeDto.from(activationCodeRepository.save(ac)));
            }
        }
        return generated;
    }

    @Transactional
    public CourseEntitlementDto activateCode(String rawCode, Long userId) {
        String code = normalizeCode(rawCode);

        ActivationCode ac = activationCodeRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> ApiException.badRequest("Mã kích hoạt không hợp lệ"));

        if (ac.getStatus() != Status.UNUSED) {
            throw ApiException.badRequest("Mã đã được sử dụng hoặc đã bị thu hồi");
        }
        if (ac.getExpiresAt() != null && ac.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw ApiException.badRequest("Mã kích hoạt đã hết hạn");
        }
        if (entitlementService.hasAccess(userId, ac.getCourse().getId())) {
            throw ApiException.badRequest("Bạn đã có quyền truy cập khóa học này");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy người dùng"));
        ac.setStatus(Status.USED);
        ac.setUsedBy(user);
        ac.setUsedAt(LocalDateTime.now());
        activationCodeRepository.save(ac);

        CourseEntitlement entitlement = entitlementService.grantAccess(
                userId, ac.getCourse().getId(),
                CourseEntitlement.Source.ACTIVATION_CODE, null);

        return CourseEntitlementDto.from(entitlement);
    }

    private String normalizeCode(String rawCode) {
        if (rawCode == null || rawCode.isBlank()) {
            throw ApiException.badRequest("Mã kích hoạt không hợp lệ");
        }

        String body = rawCode.toUpperCase().replaceAll("[^A-Z0-9]", "");
        while (body.startsWith("MITA")) {
            body = body.substring(4);
        }
        if (body.length() != 8) {
            throw ApiException.badRequest("Mã kích hoạt không hợp lệ");
        }
        return "MITA-" + body.substring(0, 4) + "-" + body.substring(4);
    }

    @Transactional(readOnly = true)
    public List<ActivationCodeDto> getCodes(Long courseId) {
        List<ActivationCode> codes = courseId != null
                ? activationCodeRepository.findByCourseIdOrderByCreatedAtDesc(courseId)
                : activationCodeRepository.findAllByOrderByCreatedAtDesc();
        return codes.stream()
                .map(ActivationCodeDto::from)
                .toList();
    }

    private String generateUniqueCode() {
        String code;
        do {
            code = "MITA-" + randomSegment(4) + "-" + randomSegment(4);
        } while (activationCodeRepository.existsByCode(code));
        return code;
    }

    private String randomSegment(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }
}
