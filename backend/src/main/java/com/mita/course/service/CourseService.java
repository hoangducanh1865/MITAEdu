package com.mita.course.service;

import com.mita.common.exception.ApiException;
import com.mita.course.dto.CourseDto;
import com.mita.course.dto.LessonDto;
import com.mita.course.entity.Course;
import com.mita.course.entity.Lesson;
import com.mita.course.repository.CourseRepository;
import com.mita.course.repository.LessonRepository;
import com.mita.entitlement.service.EntitlementService;
import com.mita.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final EntitlementService entitlementService;

    @Transactional(readOnly = true)
    public List<CourseDto> getAll(String category, Authentication authentication) {
        List<Course> courses = (category != null && !category.isBlank())
                ? courseRepository.findByCategory(resolveCategory(category))
                : courseRepository.findAll();
        boolean isAdmin = isAdmin(authentication);
        return courses.stream()
                .map(course -> {
                    CourseDto dto = CourseDto.from(course);
                    if (isAdmin) {
                        dto.setLocked(false);
                    }
                    return dto;
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public CourseDto getById(Long id, Authentication authentication) {
        Course course = findById(id);
        User user = (User) authentication.getPrincipal();
        boolean hasAccess = entitlementService.hasAccess(user.getId(), id);

        if (hasAccess) {
            CourseDto dto = CourseDto.withLessons(course);
            dto.setLocked(false);
            return dto;
        } else {
            CourseDto dto = CourseDto.from(course);
            dto.setLocked(true);
            return dto;
        }
    }

    @Transactional(readOnly = true)
    public CourseDto getTrialCourse() {
        Course course = courseRepository.findBySlug(TrialAccessPolicy.COURSE_SLUG)
                .orElseThrow(() -> ApiException.notFound("Khóa học thử không tồn tại"));
        List<LessonDto> lessons = course.getLessons().stream()
                .filter(TrialAccessPolicy::isTrialLesson)
                .sorted(Comparator.comparing(Lesson::getSortOrder))
                .map(LessonDto::from)
                .toList();

        CourseDto dto = CourseDto.from(course);
        dto.setLocked(false);
        dto.setLessonCount(lessons.size());
        dto.setLessons(lessons);
        return dto;
    }

    @Transactional(readOnly = true)
    public List<LessonDto> getLessons(Long courseId, Authentication authentication) {
        Course course = findById(courseId);
        User user = (User) authentication.getPrincipal();
        if (!entitlementService.hasAccess(user.getId(), courseId)) {
            throw ApiException.forbidden("Bạn chưa có quyền truy cập khóa học này");
        }
        return lessonRepository.findByCourseIdOrderBySortOrderAsc(courseId)
                .stream().map(LessonDto::from).toList();
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication != null
                && authentication.getPrincipal() instanceof User user
                && user.getRole() == User.Role.ADMIN;
    }

    private Course.Category resolveCategory(String rawCategory) {
        String category = rawCategory.trim().toUpperCase(Locale.ROOT);
        return switch (category) {
            case "KTH-DTTD-DGNL", "TSA" -> Course.Category.TSA;
            case "KNT-TDTD-DGNL-TPHCM-2027", "HSA" -> Course.Category.HSA;
            case "KLD-TDTD-DGNL-TPHCM-2027", "THPT" -> Course.Category.THPT;
            default -> throw ApiException.badRequest("Danh mục khóa học không hợp lệ");
        };
    }

    private Course findById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Khóa học không tồn tại"));
    }
}
