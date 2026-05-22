package com.mita.schedule.dto;

import com.mita.schedule.entity.Schedule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDto {
    private Long id;
    private Long courseId;
    private Integer dayOfWeek;
    private String period;
    private String lessonTitle;
    private String lessonCourse;

    public static ScheduleDto from(Schedule s) {
        return ScheduleDto.builder()
                .id(s.getId())
                .courseId(s.getCourse() != null ? s.getCourse().getId() : null)
                .dayOfWeek(s.getDayOfWeek())
                .period(s.getPeriod().name())
                .lessonTitle(s.getLessonTitle())
                .lessonCourse(s.getLessonCourse())
                .build();
    }
}
