// Dữ liệu khoá học local (không cần backend)
// Các file PDF được serve từ /public/courses/...

export interface LocalLesson {
  id: string;
  title: string;
  videoUrl?: string;
  pdfUrl?: string;       // File đề
  handwrittenPdfUrl?: string; // File viết tay
}

export interface LocalSession {
  id: string;
  title: string;        // "Buổi 6 - Tỉ lệ thể tích..."
  lessons: LocalLesson[];
}

export interface LocalCourse {
  id: string;           // slug dạng string, ví dụ "hhkg-2k9"
  name: string;
  category: "TSA" | "HSA" | "THPT";
  teacher?: string;
  thumbnailGradient?: string;
  thumbnailLabel?: string;
  description?: string;
  sessions: LocalSession[];
}

export const LOCAL_COURSES: LocalCourse[] = [
  {
    id: "hhkg-2k9",
    name: "Khoá Nền Tảng HHKG 2K9",
    category: "TSA",
    teacher: "Hoàng Đức Anh",
    thumbnailGradient: "linear-gradient(135deg,#b71c1c,#880e4f)",
    thumbnailLabel: "NỀN TẢNG\nHHKG",
    description:
      "Khoá học nền tảng Hình học không gian dành cho học sinh 2K9, bao gồm tài liệu PDF và video bài giảng chi tiết.",
    sessions: [
      {
        id: "buoi6",
        title: "Buổi 6 - Tỉ lệ thể tích của hình chóp tứ giác có đáy là hình bình hành - Tỉ lệ thể tích của khối lăng trụ",
        lessons: [
          {
            id: "buoi6-de",
            title: "File đề - Buổi 6",
            pdfUrl: "/courses/hhkg-2k9/buoi6-de.pdf",
          },
          {
            id: "buoi6-viet-tay",
            title: "Bản viết tay - Buổi 6",
            handwrittenPdfUrl: "/courses/hhkg-2k9/buoi6-viet-tay.pdf",
          },
          {
            id: "buoi6-video",
            title: "Video bài giảng",
            videoUrl:
              "https://www.youtube.com/watch?v=OXTBiczG-6k",
          },
        ],
      },
    ],
  },
];

/** Tìm khoá học local theo id */
export function findLocalCourse(id: string): LocalCourse | undefined {
  return LOCAL_COURSES.find((c) => c.id === id);
}
