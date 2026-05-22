package com.mita.exam.dto;

import com.mita.exam.entity.Submission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDto {
    private Long id;
    private Long userId;
    private Long examId;
    private String examTitle;
    private Integer score;
    private Integer totalQuestions;
    private Double percentage;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private boolean completed;

    public static SubmissionDto from(Submission s) {
        double pct = (s.getTotalQuestions() != null && s.getTotalQuestions() > 0 && s.getScore() != null)
                ? (double) s.getScore() / s.getTotalQuestions() * 100 : 0;
        return SubmissionDto.builder()
                .id(s.getId())
                .userId(s.getUser().getId())
                .examId(s.getExam().getId())
                .examTitle(s.getExam().getTitle())
                .score(s.getScore())
                .totalQuestions(s.getTotalQuestions())
                .percentage(Math.round(pct * 10.0) / 10.0)
                .startedAt(s.getStartedAt())
                .submittedAt(s.getSubmittedAt())
                .completed(s.getSubmittedAt() != null)
                .build();
    }
}
