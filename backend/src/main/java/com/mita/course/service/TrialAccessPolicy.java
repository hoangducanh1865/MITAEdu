package com.mita.course.service;

import com.mita.course.entity.Lesson;

import java.util.Set;

public final class TrialAccessPolicy {
    public static final String COURSE_SLUG = "khoa-nen-tang-vact-2027";
    public static final Set<Integer> LESSON_SORT_ORDERS = Set.of(1, 59);

    private TrialAccessPolicy() {
    }

    public static boolean isTrialLesson(Lesson lesson) {
        return lesson != null
                && lesson.getCourse() != null
                && COURSE_SLUG.equals(lesson.getCourse().getSlug())
                && LESSON_SORT_ORDERS.contains(lesson.getSortOrder());
    }
}
