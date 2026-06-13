package com.mita.entitlement.dto;

import lombok.Data;

@Data
public class AdminGrantRequest {
    private Long userId;
    private Long courseId;
}
