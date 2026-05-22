package com.mita.user.dto;

import com.mita.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String school;
    private String city;
    private Integer birthYear;
    private LocalDateTime createdAt;

    public static UserDto from(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .school(user.getSchool())
                .city(user.getCity())
                .birthYear(user.getBirthYear())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
