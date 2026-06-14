package com.mita.entitlement.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GenerateCodesRequest {
    private Long courseId;
    private int count;
    /** Thời hạn kích hoạt. Null = không giới hạn thời gian. */
    private LocalDateTime expiresAt;
}
