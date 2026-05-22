package com.mita.exam.repository;

import com.mita.exam.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByExamPackageId(Long packageId);
    List<Exam> findByExamPackageIdAndStatus(Long packageId, Exam.Status status);
    List<Exam> findByStatus(Exam.Status status);
}
