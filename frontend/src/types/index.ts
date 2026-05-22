// ── Auth ────────────────────────────────────────────────────────
export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  school?: string;
  city?: string;
  birthYear?: number;
}

// ── User ─────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  school?: string;
  city?: string;
  birthYear?: number;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name: string;
  school?: string;
  city?: string;
  birthYear?: number;
}

// ── Course ───────────────────────────────────────────────────────
export type CourseCategory = "TSA" | "HSA" | "THPT";

export interface Course {
  id: number;
  name: string;
  slug: string;
  category: CourseCategory;
  teacher?: string;
  thumbnailUrl?: string;
  description?: string;
  createdAt: string;
  lessonCount: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  sortOrder: number;
  videoUrl?: string;
  pdfPath?: string;
  handwrittenPdfPath?: string;
}

// ── Exam ─────────────────────────────────────────────────────────
export type ExamTag = "TSA" | "HSA";
export type ExamStatus = "DRAFT" | "PUBLISHED";

export interface ExamPackage {
  id: number;
  name: string;
  tag: ExamTag;
  description?: string;
  isLocked: boolean;
  examCount: number;
}

export interface Exam {
  id: number;
  packageId: number;
  packageName: string;
  title: string;
  durationMinutes: number;
  partCount: number;
  status: ExamStatus;
  createdAt: string;
  questionCount: number;
}

export interface Question {
  id: number;
  sortOrder: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

export interface SubmitRequest {
  examId: number;
  answers: Record<string, string>;
}

export interface Submission {
  id: number;
  userId: number;
  examId: number;
  examTitle: string;
  score?: number;
  totalQuestions?: number;
  percentage?: number;
  startedAt: string;
  submittedAt?: string;
  completed: boolean;
}

export type SubmissionDto = Submission;

export interface QuestionResult extends Question {
  correctAnswer: string;
  userAnswer: string;
  correct: boolean;
}

export interface ResultDto {
  submissionId: number;
  examId: number;
  examTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  startedAt: string;
  submittedAt: string;
  userAnswers: Record<string, string>;
  questions: QuestionResult[];
}

// ── Schedule ─────────────────────────────────────────────────────
export type SchedulePeriod = "MORNING" | "AFTERNOON" | "EVENING";

export interface Schedule {
  id: number;
  courseId?: number;
  dayOfWeek: number;
  period: SchedulePeriod;
  lessonTitle?: string;
  lessonCourse?: string;
}

// ── API wrapper ──────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
