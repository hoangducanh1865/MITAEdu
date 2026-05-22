package com.mita.exam.repository;

import com.mita.exam.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserId(Long userId);
    List<Submission> findByUserIdOrderByStartedAtDesc(Long userId);
    Optional<Submission> findByUserIdAndExamIdAndSubmittedAtIsNull(Long userId, Long examId);
}
