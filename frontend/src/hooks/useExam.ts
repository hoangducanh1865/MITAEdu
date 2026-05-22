"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { ApiResponse, Exam, Question } from "@/types";

export function useExam(examId: string) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!examId) return;
    Promise.all([
      api.get<ApiResponse<Exam>>(`/api/exams/${examId}`),
      api.get<ApiResponse<Question[]>>(`/api/exams/${examId}/questions`).catch(() => ({ data: { data: [] } })),
    ])
      .then(([examRes, qRes]) => {
        setExam(examRes.data.data);
        setQuestions(qRes.data.data as Question[]);
      })
      .catch(() => setError("Không tải được bài thi"))
      .finally(() => setLoading(false));
  }, [examId]);

  return { exam, questions, loading, error };
}
