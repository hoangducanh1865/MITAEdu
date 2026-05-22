package com.mita.exam.dto;

import com.mita.exam.entity.Exam;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamDto {
    private Long id;
    private Long packageId;
    private String packageName;
    private String title;
    private Integer durationMinutes;
    private Integer partCount;
    private String status;
    private LocalDateTime createdAt;
    private int questionCount;

    public static ExamDto from(Exam exam) {
        return ExamDto.builder()
                .id(exam.getId())
                .packageId(exam.getExamPackage().getId())
                .packageName(exam.getExamPackage().getName())
                .title(exam.getTitle())
                .durationMinutes(exam.getDurationMinutes())
                .partCount(exam.getPartCount())
                .status(exam.getStatus().name())
                .createdAt(exam.getCreatedAt())
                .questionCount(exam.getQuestions().size())
                .build();
    }
}
