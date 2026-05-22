import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Welcome banner */}
          <div style={{
            background: "linear-gradient(135deg,#d32f2f,#b71c1c)",
            borderRadius: "18px", padding: "32px 36px", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.7rem", marginBottom: "8px" }}>
                Chào mừng đến với MITA! 🎉
              </h1>
              <p style={{ opacity: 0.9, fontSize: "0.95rem" }}>
                Hệ thống luyện thi TSA, HSA, THPTQG — Học hiệu quả, thi chắc thắng!
              </p>
            </div>
            <div style={{ fontSize: "5rem", opacity: 0.3 }}>🌙</div>
          </div>

          {/* Quick links */}
          <section>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "#2c2c2c", marginBottom: "16px" }}>
              Truy cập nhanh
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              <QuickCard href="/courses" icon="fa-graduation-cap" color="#d32f2f" bg="#fdf0f0" label="Khóa học" desc="Xem video & tài liệu" />
              <QuickCard href="/practice" icon="fa-dumbbell" color="#1565c0" bg="#e3f2fd" label="Phòng luyện" desc="Luyện đề TSA & HSA" />
              <QuickCard href="/schedule" icon="fa-calendar-alt" color="#e65100" bg="#fff3e0" label="Lịch học" desc="Thời khóa biểu tuần" />
              <QuickCard href="/profile" icon="fa-user" color="#6a1b9a" bg="#f3e5f5" label="Hồ sơ" desc="Thông tin cá nhân" />
            </div>
          </section>

          {/* Category cards */}
          <section>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "#2c2c2c", marginBottom: "16px" }}>
              Kỳ thi
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              <ExamCatCard
                title="Đánh giá Tư duy (TSA)"
                desc="Bộ đề luyện tập và đề thi thử TSA đầy đủ theo từng phần."
                href="/practice/tsa/luyen-tung-phan"
                color="#1565c0"
                bg="#e3f2fd"
                icon="fa-file-alt"
              />
              <ExamCatCard
                title="Đánh giá Năng lực (HSA)"
                desc="Đề luyện HSA: Toán, Văn, Tiếng Anh, Khoa học tự nhiên."
                href="/practice/hsa/luyen-tung-phan"
                color="#2e7d32"
                bg="#e8f5e9"
                icon="fa-star"
              />
              <ExamCatCard
                title="Thi THPT Quốc Gia"
                desc="Tài liệu và khóa học ôn thi THPTQG theo từng môn."
                href="/courses?category=THPT"
                color="#e65100"
                bg="#fff3e0"
                icon="fa-school"
              />
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

function QuickCard({ href, icon, color, bg, label, desc }: {
  href: string; icon: string; color: string; bg: string; label: string; desc: string;
}) {
  return (
    <Link href={href} style={{
      background: "#fff", border: "2px solid #f0d5d5", borderRadius: "16px",
      padding: "20px", display: "flex", flexDirection: "column", gap: "10px",
      transition: "box-shadow .18s, border-color .18s",
    }}>
      <span style={{
        width: "44px", height: "44px", borderRadius: "12px", background: bg,
        display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: "1.2rem",
      }}>
        <i className={`fas ${icon}`} />
      </span>
      <div>
        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#2c2c2c" }}>{label}</div>
        <div style={{ fontSize: "0.78rem", color: "#777", marginTop: "2px" }}>{desc}</div>
      </div>
    </Link>
  );
}

function ExamCatCard({ title, desc, href, color, bg, icon }: {
  title: string; desc: string; href: string; color: string; bg: string; icon: string;
}) {
  return (
    <Link href={href} style={{
      background: bg, border: `2px solid ${color}22`, borderRadius: "16px",
      padding: "22px", display: "flex", flexDirection: "column", gap: "12px",
    }}>
      <i className={`fas ${icon}`} style={{ color, fontSize: "1.5rem" }} />
      <div>
        <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color }}>{title}</div>
        <div style={{ fontSize: "0.82rem", color: "#555", marginTop: "4px" }}>{desc}</div>
      </div>
      <span style={{ fontSize: "0.8rem", color, fontWeight: 600 }}>
        Bắt đầu luyện tập <i className="fas fa-arrow-right" />
      </span>
    </Link>
  );
}
