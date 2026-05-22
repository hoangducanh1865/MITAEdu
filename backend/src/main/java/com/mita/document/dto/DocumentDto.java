package com.mita.document.dto;

import com.mita.document.entity.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDto {

    private Long id;
    private String title;
    private String type;
    private String description;
    private String courseName;
    private String filePath;
    private String url;
    private String duration;
    private LocalDateTime createdAt;
    private Integer sortOrder;

    public static DocumentDto from(Document document) {
        return DocumentDto.builder()
                .id(document.getId())
                .title(document.getTitle())
                .type(document.getType().name())
                .description(document.getDescription())
                .courseName(document.getCourseName())
                .filePath(document.getFilePath())
                .url(document.getUrl())
                .duration(document.getDuration())
                .createdAt(document.getCreatedAt())
                .sortOrder(document.getSortOrder())
                .build();
    }
}
