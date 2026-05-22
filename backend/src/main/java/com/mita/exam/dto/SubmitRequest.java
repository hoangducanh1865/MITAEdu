package com.mita.exam.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class SubmitRequest {
    @NotNull(message = "examId không được để trống")
    private Long examId;

    // key = questionId (String), value = answer (A|B|C|D)
    private Map<String, String> answers;
}
