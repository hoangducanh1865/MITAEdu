import type { CourseCategory } from "@/types";

export const COURSE_CATEGORY_CODES = {
  TSA: "KTH-DTTD-DGNL",
  HSA: "KNT-TDTD-DGNL-TPHCM-2027",
  THPT: "KLD-TDTD-DGNL-TPHCM-2027",
} as const satisfies Record<CourseCategory, string>;

const COURSE_CATEGORIES: CourseCategory[] = ["TSA", "HSA", "THPT"];

export function getCourseCategoryFromParam(value: string | null | undefined): CourseCategory {
  if (!value) return "TSA";

  const normalized = value.trim().toUpperCase();
  const legacyCategory = COURSE_CATEGORIES.find((category) => category === normalized);
  if (legacyCategory) return legacyCategory;

  return (
    COURSE_CATEGORIES.find((category) => COURSE_CATEGORY_CODES[category] === normalized)
    ?? "TSA"
  );
}

export function getCourseCategoryCode(value: CourseCategory | string | null | undefined) {
  return COURSE_CATEGORY_CODES[getCourseCategoryFromParam(value)];
}

export function getCourseCategoryUrl(value: CourseCategory | string | null | undefined) {
  return `/courses?category=${getCourseCategoryCode(value)}`;
}
