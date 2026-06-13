package com.mita.entitlement.repository;

import com.mita.entitlement.entity.CourseEntitlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CourseEntitlementRepository extends JpaRepository<CourseEntitlement, Long> {

    Optional<CourseEntitlement> findByUserIdAndCourseId(Long userId, Long courseId);

    @Query("""
        SELECT COUNT(e) > 0 FROM CourseEntitlement e
        WHERE e.user.id = :userId
          AND e.course.id = :courseId
          AND e.status = com.mita.entitlement.entity.CourseEntitlement.Status.ACTIVE
          AND (e.expiresAt IS NULL OR e.expiresAt > :now)
    """)
    boolean existsActiveEntitlement(
            @Param("userId") Long userId,
            @Param("courseId") Long courseId,
            @Param("now") LocalDateTime now);

    List<CourseEntitlement> findByUserId(Long userId);

    List<CourseEntitlement> findByCourseId(Long courseId);
}
