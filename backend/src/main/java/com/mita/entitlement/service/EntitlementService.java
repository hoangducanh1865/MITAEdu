package com.mita.entitlement.service;

import com.mita.common.exception.ApiException;
import com.mita.course.entity.Course;
import com.mita.course.repository.CourseRepository;
import com.mita.entitlement.dto.CourseEntitlementDto;
import com.mita.entitlement.entity.CourseEntitlement;
import com.mita.entitlement.entity.CourseEntitlement.Source;
import com.mita.entitlement.entity.CourseEntitlement.Status;
import com.mita.entitlement.repository.CourseEntitlementRepository;
import com.mita.user.entity.User;
import com.mita.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EntitlementService {

    private final CourseEntitlementRepository entitlementRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public boolean hasAccess(Long userId, Long courseId) {
        boolean isAdmin = userRepository.findById(userId)
                .map(user -> user.getRole() == User.Role.ADMIN)
                .orElse(false);
        if (isAdmin) {
            return true;
        }
        return entitlementRepository.existsActiveEntitlement(userId, courseId, LocalDateTime.now());
    }

    @Transactional
    public CourseEntitlement grantAccess(Long userId, Long courseId, Source source, Long adminId) {
        Optional<CourseEntitlement> existing = entitlementRepository.findByUserIdAndCourseId(userId, courseId);
        if (existing.isPresent()) {
            CourseEntitlement e = existing.get();
            if (e.getStatus() == Status.ACTIVE) {
                throw ApiException.badRequest("Người dùng đã có quyền truy cập khóa học này");
            }
            e.setStatus(Status.ACTIVE);
            e.setSource(source);
            e.setStartsAt(LocalDateTime.now());
            e.setExpiresAt(null);
            return entitlementRepository.save(e);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy người dùng"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy khóa học"));
        User admin = (adminId != null) ? userRepository.findById(adminId).orElse(null) : null;

        return entitlementRepository.save(CourseEntitlement.builder()
                .user(user)
                .course(course)
                .source(source)
                .grantedByAdmin(admin)
                .build());
    }

}
