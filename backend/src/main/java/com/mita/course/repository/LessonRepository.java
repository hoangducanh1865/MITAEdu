package com.mita.course.repository;

import com.mita.course.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByCourseIdOrderBySortOrderAsc(Long courseId);

    @Query("""
            SELECT COUNT(l)
            FROM Lesson l
            WHERE l.course.slug = :courseSlug
              AND l.sortOrder IN :sortOrders
              AND (:mediaId = l.videoMediaId
                   OR :mediaId = l.pdfMediaId
                   OR :mediaId = l.handwrittenMediaId)
            """)
    long countTrialMediaLinks(
            @Param("courseSlug") String courseSlug,
            @Param("sortOrders") Collection<Integer> sortOrders,
            @Param("mediaId") String mediaId);
}
