package com.mita.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank(message = "Họ tên không được để trống")
    private String name;
    @Pattern(regexp = "^[0-9+().\\s-]{8,20}$", message = "Số điện thoại không hợp lệ")
    private String phone;
    private String school;
    private String city;
    private Integer birthYear;
}
