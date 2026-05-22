package com.mita.course.service;

import com.mita.common.exception.ApiException;
import com.mita.course.dto.CourseDto;
import com.mita.course.dto.LessonDto;
import com.mita.course.entity.Course;
import com.mita.course.repository.CourseRepository;
import com.mita.course.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    @Transactional(readOnly = true)
    public List<CourseDto> getAll(String category) {
        List<Course> courses = (category != null && !category.isBlank())
                ? courseRepository.findByCategory(Course.Category.valueOf(category.toUpperCase()))
                : courseRepository.findAll();
        return courses.stream().map(CourseDto::from).toList();
    }

    @Transactional(readOnly = true)
    public CourseDto getById(Long id) {
        Course course = findById(id);
        return CourseDto.withLessons(course);
    }

    @Transactional(readOnly = true)
    public List<LessonDto> getLessons(Long courseId) {
        findById(courseId);
        return lessonRepository.findByCourseIdOrderBySortOrderAsc(courseId)
                .stream().map(LessonDto::from).toList();
    }

    private Course findById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Khóa học không tồn tại"));
    }
}
