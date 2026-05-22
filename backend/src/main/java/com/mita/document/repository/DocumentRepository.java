package com.mita.document.repository;

import com.mita.document.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByTypeOrderBySortOrderAsc(Document.Type type);

    List<Document> findByCourseNameOrderBySortOrderAsc(String courseName);

    List<Document> findAllByOrderBySortOrderAsc();
}
