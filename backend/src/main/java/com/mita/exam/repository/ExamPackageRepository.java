package com.mita.exam.repository;

import com.mita.exam.entity.ExamPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamPackageRepository extends JpaRepository<ExamPackage, Long> {
    List<ExamPackage> findByTag(ExamPackage.Tag tag);
}
