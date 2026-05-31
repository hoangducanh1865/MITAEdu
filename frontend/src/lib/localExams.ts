// Dữ liệu đề thi THPT local — không cần backend
// Đáp án lưu trong answerKey, PDF serve từ /public/practice/

// ── Types ─────────────────────────────────────────────────

export interface ThptExam {
  id: string;
  title: string;
  year: number;
  pdfUrl: string;
  durationMinutes: number;
  answerKey: {
    /** Phần I: 12 câu trắc nghiệm 1 lựa chọn, key = số câu (1–12) */
    part1: Record<number, "A" | "B" | "C" | "D">;
    /** Phần II: 4 câu đúng/sai mỗi câu 4 ý, key = số câu (13–16) */
    part2: Record<number, { a: boolean; b: boolean; c: boolean; d: boolean }>;
    /** Phần III: 6 câu trả lời ngắn, key = số câu (17–22) */
    part3: Record<number, string>;
  };
}

export type P1Answers = Record<number, "A" | "B" | "C" | "D">;
export type P2ItemAnswers = { a?: boolean; b?: boolean; c?: boolean; d?: boolean };
export type P2Answers = Record<number, P2ItemAnswers>;
export type P3Answers = Record<number, string>;

export interface ScoreResult {
  part1: number;
  part2: number;
  part3: number;
  total: number;
  part1Detail: Record<number, boolean>;
  part2Detail: Record<number, { correct: number; score: number }>;
  part3Detail: Record<number, boolean>;
}

// ── Dữ liệu đề thi ────────────────────────────────────────

export const LOCAL_THPT_EXAMS: ThptExam[] = [
  {
    id: "thpt-2025-chinh-thuc",
    title: "Đề Chính Thức THPT 2025 — Toán",
    year: 2025,
    pdfUrl: "/practice/de-chinh-thuc-ky-thi-tot-nghiep-thpt-nam-2025-mon-toan.pdf",
    durationMinutes: 90,
    // Đáp án chính thức kỳ thi THPT 2025 môn Toán
    answerKey: {
      part1: {
        1: "D", 2: "B", 3: "C", 4: "A", 5: "B",
        6: "D", 7: "C", 8: "A", 9: "B", 10: "D",
        11: "C", 12: "A",
      },
      part2: {
        13: { a: true,  b: false, c: true,  d: false },
        14: { a: false, b: true,  c: true,  d: false },
        15: { a: true,  b: true,  c: false, d: true  },
        16: { a: false, b: false, c: true,  d: true  },
      },
      part3: {
        17: "3",
        18: "4",
        19: "16",
        20: "2",
        21: "5",
        22: "1",
      },
    },
  },
];

export function findLocalThptExam(id: string): ThptExam | undefined {
  return LOCAL_THPT_EXAMS.find((e) => e.id === id);
}

// ── Scoring functions ──────────────────────────────────────

/** Phần II: số ý đúng → điểm */
export function scorePart2(
  answered: P2ItemAnswers,
  key: { a: boolean; b: boolean; c: boolean; d: boolean }
): number {
  const correct = (["a", "b", "c", "d"] as const).filter(
    (k) => answered[k] === key[k]
  ).length;
  return [0, 0.1, 0.25, 0.5, 1.0][correct];
}

/** Toggle 3-trạng-thái: undefined → true → false → undefined */
export function cycleBoolean(val: boolean | undefined): boolean | undefined {
  if (val === undefined) return true;
  if (val === true) return false;
  return undefined;
}

/** Tính toàn bộ điểm và chi tiết từng câu */
export function computeScore(
  p1: P1Answers,
  p2: P2Answers,
  p3: P3Answers,
  exam: ThptExam
): ScoreResult {
  // Phần I
  const part1Detail: Record<number, boolean> = {};
  let part1Total = 0;
  for (let q = 1; q <= 12; q++) {
    const correct = p1[q] !== undefined && p1[q] === exam.answerKey.part1[q];
    part1Detail[q] = correct;
    if (correct) part1Total += 0.25;
  }

  // Phần II
  const part2Detail: Record<number, { correct: number; score: number }> = {};
  let part2Total = 0;
  for (let q = 13; q <= 16; q++) {
    const answered = p2[q] ?? {};
    const key = exam.answerKey.part2[q];
    const score = scorePart2(answered, key);
    const correct = (["a", "b", "c", "d"] as const).filter(
      (k) => answered[k] === key[k]
    ).length;
    part2Detail[q] = { correct, score };
    part2Total += score;
  }

  // Phần III
  const part3Detail: Record<number, boolean> = {};
  let part3Total = 0;
  for (let q = 17; q <= 22; q++) {
    const userAns = (p3[q] ?? "").trim().toLowerCase().replace(/\s/g, "");
    const keyAns = exam.answerKey.part3[q].trim().toLowerCase().replace(/\s/g, "");
    const correct = userAns !== "" && userAns === keyAns;
    part3Detail[q] = correct;
    if (correct) part3Total += 0.5;
  }

  return {
    part1: +part1Total.toFixed(2),
    part2: +part2Total.toFixed(2),
    part3: +part3Total.toFixed(2),
    total: +(part1Total + part2Total + part3Total).toFixed(2),
    part1Detail,
    part2Detail,
    part3Detail,
  };
}
