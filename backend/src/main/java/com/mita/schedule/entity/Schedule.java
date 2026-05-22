package com.mita.schedule.entity;

import com.mita.course.entity.Course;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "schedules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Schedule {

    public enum Period { MORNING, AFTERNOON, EVENING }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    @ToString.Exclude
    private Course course;

    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Period period;

    @Column(name = "lesson_title")
    private String lessonTitle;

    @Column(name = "lesson_course")
    private String lessonCourse;
}
