package com.mita.entitlement.dto;

import com.mita.entitlement.entity.ActivationCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivationCodeDto {
    private Long id;
    private String code;
    private Long courseId;
    private String courseName;
    private String status;
    private LocalDateTime expiresAt;
    private LocalDateTime usedAt;
    private String usedByEmail;
    private LocalDateTime createdAt;

    public static ActivationCodeDto from(ActivationCode ac) {
        return ActivationCodeDto.builder()
                .id(ac.getId())
                .code(ac.getCode())
                .courseId(ac.getCourse().getId())
                .courseName(ac.getCourse().getName())
                .status(ac.getStatus().name())
                .expiresAt(ac.getExpiresAt())
                .usedAt(ac.getUsedAt())
                .usedByEmail(ac.getUsedBy() != null ? ac.getUsedBy().getEmail() : null)
                .createdAt(ac.getCreatedAt())
                .build();
    }
}
