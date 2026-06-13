package com.mita.entitlement.repository;

import com.mita.entitlement.entity.ActivationCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ActivationCodeRepository extends JpaRepository<ActivationCode, Long> {

    Optional<ActivationCode> findByCodeIgnoreCase(String code);

    boolean existsByCode(String code);

    List<ActivationCode> findByCourseId(Long courseId);
}
