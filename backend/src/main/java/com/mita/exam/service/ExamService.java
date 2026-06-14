package com.mita.exam.service;

import com.mita.common.exception.ApiException;
import com.mita.exam.dto.*;
import com.mita.exam.entity.*;
import com.mita.exam.repository.*;
import com.mita.user.entity.User;
import com.mita.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamPackageRepository packageRepository;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ExamPackageDto> getPackages(String tag, Authentication authentication) {
        List<ExamPackage> packages = (tag != null && !tag.isBlank())
                ? packageRepository.findByTag(ExamPackage.Tag.valueOf(tag.toUpperCase()))
                : packageRepository.findAll();
        boolean isAdmin = isAdmin(authentication);
        return packages.stream()
                .map(pkg -> toDto(pkg, isAdmin))
                .toList();
    }

    @Transactional(readOnly = true)
    public ExamPackageDto getPackageById(Long id, Authentication authentication) {
        return toDto(findPackage(id), isAdmin(authentication));
    }

    @Transactional(readOnly = true)
    public List<ExamDto> getExams(Long packageId, String status) {
        List<Exam> exams;
        if (packageId != null && status != null) {
            exams = examRepository.findByExamPackageIdAndStatus(packageId, Exam.Status.valueOf(status.toUpperCase()));
        } else if (packageId != null) {
            exams = examRepository.findByExamPackageId(packageId);
        } else if (status != null) {
            exams = examRepository.findByStatus(Exam.Status.valueOf(status.toUpperCase()));
        } else {
            exams = examRepository.findAll();
        }
        return exams.stream().map(ExamDto::from).toList();
    }

    @Transactional(readOnly = true)
    public ExamDto getExamById(Long id) {
        return ExamDto.from(findExam(id));
    }

    @Transactional(readOnly = true)
    public List<QuestionDto> getQuestions(Long examId, Long userId) {
        // Chỉ trả câu hỏi nếu user đã bắt đầu thi (có submission chưa submit)
        submissionRepository.findByUserIdAndExamIdAndSubmittedAtIsNull(userId, examId)
                .orElseThrow(() -> ApiException.forbidden("Bạn phải bắt đầu bài thi trước"));
        return questionRepository.findByExamIdOrderBySortOrderAsc(examId)
                .stream().map(QuestionDto::from).toList();
    }

    @Transactional
    public SubmissionDto startExam(Long examId, Long userId) {
        Exam exam = findExam(examId);
        if (exam.getStatus() != Exam.Status.PUBLISHED) {
            throw ApiException.badRequest("Bài thi chưa được công bố");
        }
        // Nếu đã có submission đang dở, trả về submission đó
        var existing = submissionRepository.findByUserIdAndExamIdAndSubmittedAtIsNull(userId, examId);
        if (existing.isPresent()) {
            return SubmissionDto.from(existing.get());
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("Người dùng không tồn tại"));
        Submission submission = Submission.builder()
                .user(user)
                .exam(exam)
                .totalQuestions((int) questionRepository.countByExamId(examId))
                .build();
        return SubmissionDto.from(submissionRepository.save(submission));
    }

    private ExamPackage findPackage(Long id) {
        return packageRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Bộ đề không tồn tại"));
    }

    private Exam findExam(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Bài thi không tồn tại"));
    }

    private ExamPackageDto toDto(ExamPackage pkg, boolean isAdmin) {
        ExamPackageDto dto = ExamPackageDto.from(pkg);
        if (isAdmin) {
            dto.setIsLocked(false);
        }
        return dto;
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication != null
                && authentication.getPrincipal() instanceof User user
                && user.getRole() == User.Role.ADMIN;
    }
}
