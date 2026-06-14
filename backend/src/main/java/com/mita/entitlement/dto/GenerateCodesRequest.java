package com.mita.entitlement.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class GenerateCodesRequest {
    private Long courseId;
    private List<Long> courseIds;
    private int count;
    /** Thời hạn kích hoạt. Null = không giới hạn thời gian. */
    private LocalDateTime expiresAt;
}
