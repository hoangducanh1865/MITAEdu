export default function Footer() {
  return (
    <footer style={{
      background: "#b71c1c",
      borderTop: "none",
      padding: "40px 60px 0",
      marginTop: "auto",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px", maxWidth: "1100px", margin: "0 auto" }}>
        {/* LIÊN HỆ */}
        <div>
          <h4 style={colTitle}>LIÊN HỆ</h4>
          <p style={colText}><i className="fas fa-building" style={{ marginRight: 8, opacity: 0.7 }} /><strong>CÔNG TY CỔ PHẦN ĐẦU TƯ GIÁO DỤC MITA</strong></p>
          <p style={colText}><i className="fas fa-user-tie" style={{ marginRight: 8, opacity: 0.7 }} />Chịu trách nhiệm: HethongMITA - Hoàng Trung Anh</p>
          <p style={colText}><i className="fas fa-envelope" style={{ marginRight: 8, opacity: 0.7 }} />mita.education.official@gmail.com</p>
          <p style={colText}><i className="fas fa-phone" style={{ marginRight: 8, opacity: 0.7 }} />0123456789</p>
          <div style={{ display: "flex", gap: "12px", marginTop: "14px" }}>
            <SocialIcon href="https://www.facebook.com/hoangducanh1865" icon="fab fa-facebook" />
            <SocialIcon href="https://www.facebook.com/hoangducanh1865" icon="fab fa-facebook-messenger" />
            <SocialIcon href="https://www.youtube.com/@%C4%90%E1%BB%A9cAnhHo%C3%A0ng-j6v" icon="fab fa-youtube" />
          </div>
        </div>

        {/* THÔNG TIN */}
        <div>
          <h4 style={colTitle}>THÔNG TIN</h4>
          <FooterLink href="#">Giới thiệu</FooterLink>
          <FooterLink href="#">Câu hỏi thường gặp</FooterLink>
          <FooterLink href="#">Điều khoản dịch vụ</FooterLink>
          <FooterLink href="#">Chính sách bảo mật</FooterLink>
        </div>

        {/* ĐIỀU KHOẢN */}
        <div>
          <h4 style={colTitle}>ĐIỀU KHOẢN</h4>
          <FooterLink href="#">Điều khoản sử dụng</FooterLink>
          <FooterLink href="#">Chính sách hoàn tiền</FooterLink>
          <FooterLink href="#">Quy định học viên</FooterLink>
          <FooterLink href="#">Liên hệ hỗ trợ</FooterLink>
        </div>
      </div>

      <div style={{
        textAlign: "center", marginTop: "32px", fontSize: "0.8rem",
        color: "rgba(255,255,255,0.6)",
        borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "16px",
        paddingBottom: "16px",
      }}>
        © 2026, Bản quyền thuộc về MITA — CÔNG TY CỔ PHẦN ĐẦU TƯ GIÁO DỤC MITA
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={{
      display: "block", fontSize: "0.875rem",
      color: "rgba(255,255,255,0.8)", marginBottom: "8px",
      transition: "color .15s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
    >
      {children}
    </a>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{
        width: "34px", height: "34px", borderRadius: "50%",
        background: "rgba(255,255,255,0.18)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background .15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
    >
      <i className={icon} style={{ color: "#fff", fontSize: "1rem" }} />
    </a>
  );
}

const colTitle: React.CSSProperties = {
  fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.9rem",
  color: "#fff", letterSpacing: "0.5px", marginBottom: "12px",
};
const colText: React.CSSProperties = {
  fontSize: "0.8rem", color: "rgba(255,255,255,0.85)", marginBottom: "6px",
};
