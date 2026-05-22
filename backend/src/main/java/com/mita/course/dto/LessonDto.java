package com.mita.course.dto;

import com.mita.course.entity.Lesson;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDto {
    private Long id;
    private Long courseId;
    private String title;
    private Integer sortOrder;
    private String videoUrl;
    private String pdfPath;
    private String handwrittenPdfPath;

    public static LessonDto from(Lesson lesson) {
        return LessonDto.builder()
                .id(lesson.getId())
                .courseId(lesson.getCourse().getId())
                .title(lesson.getTitle())
                .sortOrder(lesson.getSortOrder())
                .videoUrl(lesson.getVideoUrl())
                .pdfPath(lesson.getPdfPath())
                .handwrittenPdfPath(lesson.getHandwrittenPdfPath())
                .build();
    }
}
