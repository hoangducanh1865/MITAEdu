"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { ApiResponse, Course } from "@/types";

export function useCourses(category?: string) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = category ? `/api/courses?category=${category}` : "/api/courses";
    api.get<ApiResponse<Course[]>>(url)
      .then((r) => setCourses(r.data.data))
      .catch(() => setError("Không tải được danh sách khóa học"))
      .finally(() => setLoading(false));
  }, [category]);

  return { courses, loading, error };
}
