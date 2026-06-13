package com.mita.entitlement.dto;

import com.mita.entitlement.entity.CourseEntitlement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseEntitlementDto {
    private Long id;
    private Long userId;
    private String userEmail;
    private Long courseId;
    private String courseName;
    private String status;
    private String source;
    private LocalDateTime startsAt;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;

    public static CourseEntitlementDto from(CourseEntitlement e) {
        return CourseEntitlementDto.builder()
                .id(e.getId())
                .userId(e.getUser().getId())
                .userEmail(e.getUser().getEmail())
                .courseId(e.getCourse().getId())
                .courseName(e.getCourse().getName())
                .status(e.getStatus().name())
                .source(e.getSource().name())
                .startsAt(e.getStartsAt())
                .expiresAt(e.getExpiresAt())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
