package com.mita.course.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lessons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @ToString.Exclude
    private Course course;

    @Column(nullable = false)
    private String title;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "pdf_path")
    private String pdfPath;

    @Column(name = "handwritten_pdf_path")
    private String handwrittenPdfPath;

    @Column(name = "video_media_id", length = 100)
    private String videoMediaId;

    @Column(name = "pdf_media_id", length = 100)
    private String pdfMediaId;

    @Column(name = "handwritten_media_id", length = 100)
    private String handwrittenMediaId;
}
