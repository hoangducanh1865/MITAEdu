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
    public List<String> generateCodes(Long courseId, int count, Long adminId) {
        if (count < 1 || count > 500) {
            throw ApiException.badRequest("Số lượng mã phải từ 1 đến 500");
        }
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy khóa học"));
        User admin = (adminId != null) ? userRepository.findById(adminId).orElse(null) : null;

        List<String> generated = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            String code = generateUniqueCode();
            ActivationCode ac = ActivationCode.builder()
                    .code(code)
                    .course(course)
                    .createdBy(admin)
                    .build();
            activationCodeRepository.save(ac);
            generated.add(code);
        }
        return generated;
    }

    @Transactional
    public CourseEntitlementDto activateCode(String rawCode, Long userId) {
        String code = rawCode.trim().toUpperCase();

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

    @Transactional(readOnly = true)
    public List<ActivationCodeDto> getCodesForCourse(Long courseId) {
        return activationCodeRepository.findByCourseId(courseId).stream()
                .map(ActivationCodeDto::from)
                .toList();
    }

    @Transactional
    public void revokeCode(Long codeId) {
        ActivationCode ac = activationCodeRepository.findById(codeId)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy mã kích hoạt"));
        ac.setStatus(Status.REVOKED);
        activationCodeRepository.save(ac);
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
