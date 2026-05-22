package com.mita.document.service;

import com.mita.document.dto.DocumentDto;
import com.mita.document.entity.Document;
import com.mita.document.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;

    public List<DocumentDto> getAll() {
        return documentRepository.findAllByOrderBySortOrderAsc()
                .stream()
                .map(DocumentDto::from)
                .collect(Collectors.toList());
    }

    public List<DocumentDto> getByType(String type) {
        try {
            Document.Type docType = Document.Type.valueOf(type.toUpperCase());
            return documentRepository.findByTypeOrderBySortOrderAsc(docType)
                    .stream()
                    .map(DocumentDto::from)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }

    public List<DocumentDto> getByCourseName(String courseName) {
        return documentRepository.findByCourseNameOrderBySortOrderAsc(courseName)
                .stream()
                .map(DocumentDto::from)
                .collect(Collectors.toList());
    }

    public DocumentDto getById(Long id) {
        return documentRepository.findById(id)
                .map(DocumentDto::from)
                .orElse(null);
    }

    public DocumentDto create(DocumentDto dto) {
        Document document = Document.builder()
                .title(dto.getTitle())
                .type(Document.Type.valueOf(dto.getType().toUpperCase()))
                .description(dto.getDescription())
                .courseName(dto.getCourseName())
                .filePath(dto.getFilePath())
                .url(dto.getUrl())
                .duration(dto.getDuration())
                .sortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0)
                .build();
        Document saved = documentRepository.save(document);
        return DocumentDto.from(saved);
    }
}
