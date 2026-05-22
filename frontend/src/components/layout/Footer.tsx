export default function Footer() {
  return (
    <footer style={{
      background: "#fff", borderTop: "2px solid #f0d5d5",
      padding: "40px 60px", marginTop: "auto",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px", maxWidth: "1100px", margin: "0 auto" }}>
        {/* LIÊN HỆ */}
        <div>
          <h4 style={colTitle}>LIÊN HỆ</h4>
          <p style={colText}><strong>CÔNG TY CỔ PHẦN ĐẦU TƯ GIÁO DỤC MITA</strong></p>
          <p style={colText}>Chịu trách nhiệm nội dung: HethongMITA - Hoàng Trung Anh</p>
          <p style={colText}>Email: mita.education.official@gmail.com</p>
          <p style={colText}>SĐT: 0123456789</p>
          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <SocialIcon href="https://www.facebook.com/hoangducanh1865" icon="fab fa-facebook" color="#1877f2" />
            <SocialIcon href="https://www.facebook.com/hoangducanh1865" icon="fab fa-facebook-messenger" color="#0095f6" />
            <SocialIcon href="https://www.youtube.com/@%C4%90%E1%BB%A9cAnhHo%C3%A0ng-j6v" icon="fab fa-youtube" color="#ff0000" />
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

      <div style={{ textAlign: "center", marginTop: "32px", fontSize: "0.8rem", color: "#777", borderTop: "1px solid #f0d5d5", paddingTop: "16px" }}>
        © 2026, Bản quyền thuộc về MITA — CÔNG TY CỔ PHẦN ĐẦU TƯ GIÁO DỤC MITA
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={{ display: "block", fontSize: "0.875rem", color: "#555", marginBottom: "8px", transition: "color .15s" }}>
      {children}
    </a>
  );
}

function SocialIcon({ href, icon, color }: { href: string; icon: string; color: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#fdf0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <i className={icon} style={{ color, fontSize: "1rem" }} />
    </a>
  );
}

const colTitle: React.CSSProperties = {
  fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.9rem",
  color: "#d32f2f", letterSpacing: "0.5px", marginBottom: "12px",
};
const colText: React.CSSProperties = {
  fontSize: "0.8rem", color: "#555", marginBottom: "6px",
};
