import PracticeLayout from "./layout-wrapper";
import Link from "next/link";

export default function PracticeHomePage() {
  return (
    <PracticeLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        <div style={{
          background: "linear-gradient(135deg,#1565c0,#0d47a1)",
          borderRadius: "18px", padding: "32px 36px", color: "#fff",
        }}>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.7rem", marginBottom: "8px" }}>
            Phòng Luyện MITA 🏆
          </h1>
          <p style={{ opacity: 0.9, fontSize: "0.95rem" }}>
            Luyện đề TSA, HSA đầy đủ — từng phần, đề gộp, thi thử.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <ExamCatCard
            title="Đánh giá Tư duy (TSA)"
            color="#1565c0" bg="#e3f2fd" icon="fa-file-alt"
            links={[
              { label: "Luyện từng phần", href: "/practice/tsa/luyen-tung-phan" },
              { label: "Đề tự tạo",      href: "/practice/tsa/de-tu-tao" },
              { label: "Đề Admin tạo",   href: "/practice/tsa/de-admin" },
              { label: "Khảo thí (Thi thử)", href: "/practice/tsa/khao-thi" },
            ]}
          />
          <ExamCatCard
            title="Đánh giá Năng lực (HSA)"
            color="#2e7d32" bg="#e8f5e9" icon="fa-star"
            links={[
              { label: "Luyện từng phần", href: "/practice/hsa/luyen-tung-phan" },
              { label: "Đề tự tạo",      href: "/practice/hsa/de-tu-tao" },
              { label: "Đề Admin tạo",   href: "/practice/hsa/de-admin" },
              { label: "Khảo thí (Thi thử)", href: "/practice/hsa/khao-thi" },
            ]}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <Link href="/practice/history" style={utilCard}>
            <i className="fas fa-history" style={{ fontSize: "1.4rem", color: "#6a1b9a" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Lịch sử làm bài</div>
              <div style={{ fontSize: "0.78rem", color: "#777", marginTop: "2px" }}>Xem lại các bài thi đã làm</div>
            </div>
          </Link>
          <Link href="/practice/books" style={utilCard}>
            <i className="fas fa-search" style={{ fontSize: "1.4rem", color: "#00796b" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Tra cứu sách</div>
              <div style={{ fontSize: "0.78rem", color: "#777", marginTop: "2px" }}>Tìm sách tham khảo theo chủ đề</div>
            </div>
          </Link>
        </div>
      </div>
    </PracticeLayout>
  );
}

function ExamCatCard({ title, color, bg, icon, links }: {
  title: string; color: string; bg: string; icon: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div style={{ background: "#fff", border: `2px solid ${color}22`, borderRadius: "16px", padding: "22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <span style={{ width: "40px", height: "40px", borderRadius: "10px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: "1.2rem" }}>
          <i className={`fas ${icon}`} />
        </span>
        <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color }}>{title}</h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} style={{
            padding: "9px 14px", borderRadius: "10px", background: bg,
            fontSize: "0.875rem", fontWeight: 600, color,
            display: "flex", alignItems: "center", gap: "8px", textDecoration: "none",
          }}>
            <i className="fas fa-chevron-right" style={{ fontSize: "0.65rem" }} />
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

const utilCard: React.CSSProperties = {
  background: "#fff", border: "2px solid #f0d5d5", borderRadius: "16px",
  padding: "20px 22px", display: "flex", alignItems: "center", gap: "16px",
  color: "#2c2c2c", textDecoration: "none",
};
