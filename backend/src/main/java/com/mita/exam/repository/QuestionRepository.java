package com.mita.exam.repository;

import com.mita.exam.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByExamIdOrderBySortOrderAsc(Long examId);
    long countByExamId(Long examId);
}
