package com.mita.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultDto {
    private Long submissionId;
    private Long examId;
    private String examTitle;
    private int score;
    private int totalQuestions;
    private double percentage;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private Map<String, String> userAnswers;
    private List<QuestionResultDto> questions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionResultDto {
        private Long questionId;
        private Integer sortOrder;
        private String text;
        private String optionA;
        private String optionB;
        private String optionC;
        private String optionD;
        private String correctAnswer;
        private String userAnswer;
        private boolean correct;
    }
}
