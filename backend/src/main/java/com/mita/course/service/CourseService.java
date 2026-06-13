package com.mita.course.service;

import com.mita.common.exception.ApiException;
import com.mita.course.dto.CourseDto;
import com.mita.course.dto.LessonDto;
import com.mita.course.entity.Course;
import com.mita.course.repository.CourseRepository;
import com.mita.course.repository.LessonRepository;
import com.mita.entitlement.service.EntitlementService;
import com.mita.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final EntitlementService entitlementService;

    @Transactional(readOnly = true)
    public List<CourseDto> getAll(String category) {
        List<Course> courses = (category != null && !category.isBlank())
                ? courseRepository.findByCategory(Course.Category.valueOf(category.toUpperCase()))
                : courseRepository.findAll();
        return courses.stream().map(CourseDto::from).toList();
    }

    @Transactional(readOnly = true)
    public CourseDto getById(Long id, Authentication authentication) {
        Course course = findById(id);
        User user = (User) authentication.getPrincipal();
        boolean isAdmin = user.getRole() == User.Role.ADMIN;
        boolean hasAccess = isAdmin || entitlementService.hasAccess(user.getId(), id);

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
    public List<LessonDto> getLessons(Long courseId, Authentication authentication) {
        Course course = findById(courseId);
        User user = (User) authentication.getPrincipal();
        boolean isAdmin = user.getRole() == User.Role.ADMIN;
        if (!isAdmin && !entitlementService.hasAccess(user.getId(), courseId)) {
            throw ApiException.forbidden("Bạn chưa có quyền truy cập khóa học này");
        }
        return lessonRepository.findByCourseIdOrderBySortOrderAsc(courseId)
                .stream().map(LessonDto::from).toList();
    }

    private Course findById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Khóa học không tồn tại"));
    }
}
