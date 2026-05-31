// Route group layout cho phòng thi THPT — thoát khỏi practice/layout.tsx
// URL /practice/thpt/exam-taking vẫn hoạt động bình thường
export default function ThptExamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
