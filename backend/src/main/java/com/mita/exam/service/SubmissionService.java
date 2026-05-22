package com.mita.exam.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mita.common.exception.ApiException;
import com.mita.exam.dto.ResultDto;
import com.mita.exam.dto.SubmissionDto;
import com.mita.exam.dto.SubmitRequest;
import com.mita.exam.entity.Question;
import com.mita.exam.entity.Submission;
import com.mita.exam.repository.QuestionRepository;
import com.mita.exam.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final QuestionRepository questionRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public ResultDto submit(SubmitRequest req, Long userId) {
        Submission submission = submissionRepository
                .findByUserIdAndExamIdAndSubmittedAtIsNull(userId, req.getExamId())
                .orElseThrow(() -> ApiException.badRequest("Không tìm thấy bài thi đang làm"));

        Map<String, String> answers = req.getAnswers() != null ? req.getAnswers() : Map.of();
        List<Question> questions = questionRepository.findByExamIdOrderBySortOrderAsc(req.getExamId());

        // Tính điểm
        long correct = questions.stream()
                .filter(q -> q.getCorrectAnswer().equalsIgnoreCase(
                        answers.getOrDefault(String.valueOf(q.getId()), "")))
                .count();

        try {
            submission.setAnswersJson(objectMapper.writeValueAsString(answers));
        } catch (JsonProcessingException e) {
            throw ApiException.badRequest("Dữ liệu đáp án không hợp lệ");
        }
        submission.setScore((int) correct);
        submission.setTotalQuestions(questions.size());
        submission.setSubmittedAt(LocalDateTime.now());
        submissionRepository.save(submission);

        return buildResult(submission, questions, answers);
    }

    @Transactional(readOnly = true)
    public List<SubmissionDto> getUserHistory(Long userId) {
        return submissionRepository.findByUserIdOrderByStartedAtDesc(userId)
                .stream().map(SubmissionDto::from).toList();
    }

    @Transactional(readOnly = true)
    public ResultDto getResult(Long submissionId, Long userId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> ApiException.notFound("Kết quả không tồn tại"));
        if (!submission.getUser().getId().equals(userId)) {
            throw ApiException.forbidden("Bạn không có quyền xem kết quả này");
        }
        if (submission.getSubmittedAt() == null) {
            throw ApiException.badRequest("Bài thi chưa được nộp");
        }

        List<Question> questions = questionRepository.findByExamIdOrderBySortOrderAsc(submission.getExam().getId());
        Map<String, String> answers = parseAnswers(submission.getAnswersJson());
        return buildResult(submission, questions, answers);
    }

    private Map<String, String> parseAnswers(String json) {
        if (json == null || json.isBlank()) return Map.of();
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            return Map.of();
        }
    }

    private ResultDto buildResult(Submission submission, List<Question> questions, Map<String, String> answers) {
        List<ResultDto.QuestionResultDto> qResults = questions.stream()
                .map(q -> {
                    String userAnswer = answers.getOrDefault(String.valueOf(q.getId()), "");
                    return ResultDto.QuestionResultDto.builder()
                            .questionId(q.getId())
                            .sortOrder(q.getSortOrder())
                            .text(q.getText())
                            .optionA(q.getOptionA())
                            .optionB(q.getOptionB())
                            .optionC(q.getOptionC())
                            .optionD(q.getOptionD())
                            .correctAnswer(q.getCorrectAnswer())
                            .userAnswer(userAnswer)
                            .correct(q.getCorrectAnswer().equalsIgnoreCase(userAnswer))
                            .build();
                })
                .collect(Collectors.toList());

        int total = questions.size();
        int score = submission.getScore() != null ? submission.getScore() : 0;
        double pct = total > 0 ? Math.round(score * 1000.0 / total) / 10.0 : 0;

        return ResultDto.builder()
                .submissionId(submission.getId())
                .examId(submission.getExam().getId())
                .examTitle(submission.getExam().getTitle())
                .score(score)
                .totalQuestions(total)
                .percentage(pct)
                .startedAt(submission.getStartedAt())
                .submittedAt(submission.getSubmittedAt())
                .userAnswers(answers)
                .questions(qResults)
                .build();
    }
}
