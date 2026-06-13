package com.mita.entitlement.dto;

import lombok.Data;

@Data
public class GenerateCodesRequest {
    private Long courseId;
    private int count;
}
