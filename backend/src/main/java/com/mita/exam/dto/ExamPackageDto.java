package com.mita.exam.dto;

import com.mita.exam.entity.ExamPackage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamPackageDto {
    private Long id;
    private String name;
    private String tag;
    private String description;
    private Boolean isLocked;
    private int examCount;

    public static ExamPackageDto from(ExamPackage pkg) {
        return ExamPackageDto.builder()
                .id(pkg.getId())
                .name(pkg.getName())
                .tag(pkg.getTag().name())
                .description(pkg.getDescription())
                .isLocked(pkg.getIsLocked())
                .examCount(pkg.getExams().size())
                .build();
    }
}
