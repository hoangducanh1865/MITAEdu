package com.mita.course.dto;

import com.mita.course.entity.Course;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDto {
    private Long id;
    private String name;
    private String slug;
    private String category;
    private String teacher;
    private String thumbnailUrl;
    private String description;
    private LocalDateTime createdAt;
    private int lessonCount;
    private List<LessonDto> lessons;

    public static CourseDto from(Course course) {
        return CourseDto.builder()
                .id(course.getId())
                .name(course.getName())
                .slug(course.getSlug())
                .category(course.getCategory().name())
                .teacher(course.getTeacher())
                .thumbnailUrl(course.getThumbnailUrl())
                .description(course.getDescription())
                .createdAt(course.getCreatedAt())
                .lessonCount(course.getLessons().size())
                .build();
    }

    public static CourseDto withLessons(Course course) {
        CourseDto dto = from(course);
        dto.setLessons(course.getLessons().stream().map(LessonDto::from).toList());
        return dto;
    }
}
