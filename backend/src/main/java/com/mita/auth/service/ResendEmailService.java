package com.mita.auth.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@Slf4j
public class ResendEmailService {

    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${app.from-email}")
    private String fromEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendVerificationEmail(String toEmail, String recipientName, String verifyUrl) {
        String html = buildEmailHtml(recipientName, verifyUrl);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = Map.of(
                "from", fromEmail,
                "to", new String[]{toEmail},
                "subject", "Xác minh email của bạn — MITAEdu",
                "html", html
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.exchange(RESEND_API_URL, HttpMethod.POST, request, String.class);
            log.info("Verification email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", toEmail, e.getMessage());
            // Không ném exception để không làm hỏng luồng đăng ký
        }
    }

    public void sendPasswordResetEmail(String toEmail, String recipientName, String resetUrl) {
        sendPasswordActionEmail(
                toEmail,
                "Đặt lại mật khẩu — MITAEdu",
                buildPasswordActionHtml(
                        recipientName,
                        resetUrl,
                        "Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản MITAEdu của bạn. Nhấn vào nút bên dưới để tạo mật khẩu mới.",
                        "Đặt lại mật khẩu",
                        "Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này — tài khoản của bạn vẫn an toàn."
                ),
                "Password reset email sent to {}",
                "Failed to send password reset email to {}: {}"
        );
    }

    public void sendPasswordChangeEmail(String toEmail, String recipientName, String resetUrl) {
        sendPasswordActionEmail(
                toEmail,
                "Đổi mật khẩu — MITAEdu",
                buildPasswordActionHtml(
                        recipientName,
                        resetUrl,
                        "Bạn vừa yêu cầu đổi mật khẩu cho tài khoản MITAEdu. Nhấn vào nút bên dưới để thiết lập mật khẩu mới.",
                        "Đổi mật khẩu",
                        "Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này và giữ nguyên mật khẩu hiện tại."
                ),
                "Password change email sent to {}",
                "Failed to send password change email to {}: {}"
        );
    }

    private void sendPasswordActionEmail(
            String toEmail,
            String subject,
            String html,
            String successLog,
            String errorLog) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = Map.of(
                "from", fromEmail,
                "to", new String[]{toEmail},
                "subject", subject,
                "html", html
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.exchange(RESEND_API_URL, HttpMethod.POST, request, String.class);
            log.info(successLog, toEmail);
        } catch (Exception e) {
            log.error(errorLog, toEmail, e.getMessage());
        }
    }

    private String buildPasswordActionHtml(String name, String resetUrl, String intro, String actionLabel, String ignoreMessage) {
        return """
                <!DOCTYPE html>
                <html lang="vi">
                <head><meta charset="UTF-8"></head>
                <body style="font-family:sans-serif;background:#f5f5f5;padding:40px 0;margin:0">
                  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)">
                    <div style="background:linear-gradient(135deg,#d32f2f,#b71c1c);padding:32px 40px;text-align:center">
                      <div style="font-size:2rem">🌙</div>
                      <h1 style="color:#fff;font-size:1.4rem;margin:8px 0 0;font-family:sans-serif">MITAEdu</h1>
                    </div>
                    <div style="padding:36px 40px">
                      <h2 style="color:#2c2c2c;font-size:1.2rem;margin:0 0 12px">Xin chào, %s!</h2>
                      <p style="color:#555;line-height:1.7;margin:0 0 24px">
                        %s
                      </p>
                      <div style="text-align:center;margin:32px 0">
                        <a href="%s"
                           style="display:inline-block;background:#d32f2f;color:#fff;text-decoration:none;
                                  padding:14px 36px;border-radius:10px;font-weight:700;font-size:1rem">
                          %s
                        </a>
                      </div>
                      <p style="color:#888;font-size:0.82rem;line-height:1.6;margin:0">
                        Link này có hiệu lực trong <strong>1 giờ</strong>. %s<br><br>
                        Hoặc copy link sau vào trình duyệt:<br>
                        <a href="%s" style="color:#d32f2f;word-break:break-all">%s</a>
                      </p>
                    </div>
                    <div style="background:#fdf0f0;padding:20px 40px;text-align:center">
                      <p style="color:#aaa;font-size:0.78rem;margin:0">© 2025 MITAEdu — Nền tảng luyện thi hàng đầu</p>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(name, intro, resetUrl, actionLabel, ignoreMessage, resetUrl, resetUrl);
    }

    private String buildEmailHtml(String name, String verifyUrl) {
        return """
                <!DOCTYPE html>
                <html lang="vi">
                <head><meta charset="UTF-8"></head>
                <body style="font-family:sans-serif;background:#f5f5f5;padding:40px 0;margin:0">
                  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)">
                    <div style="background:linear-gradient(135deg,#d32f2f,#b71c1c);padding:32px 40px;text-align:center">
                      <div style="font-size:2rem">🌙</div>
                      <h1 style="color:#fff;font-size:1.4rem;margin:8px 0 0;font-family:sans-serif">MITAEdu</h1>
                    </div>
                    <div style="padding:36px 40px">
                      <h2 style="color:#2c2c2c;font-size:1.2rem;margin:0 0 12px">Xin chào, %s!</h2>
                      <p style="color:#555;line-height:1.7;margin:0 0 24px">
                        Cảm ơn bạn đã đăng ký tài khoản MITAEdu. Vui lòng xác minh địa chỉ email của bạn bằng cách nhấn vào nút bên dưới.
                      </p>
                      <div style="text-align:center;margin:32px 0">
                        <a href="%s"
                           style="display:inline-block;background:#d32f2f;color:#fff;text-decoration:none;
                                  padding:14px 36px;border-radius:10px;font-weight:700;font-size:1rem">
                          Xác minh email
                        </a>
                      </div>
                      <p style="color:#888;font-size:0.82rem;line-height:1.6;margin:0">
                        Link này có hiệu lực trong <strong>24 giờ</strong>. Nếu bạn không đăng ký tài khoản, hãy bỏ qua email này.<br><br>
                        Hoặc copy link sau vào trình duyệt:<br>
                        <a href="%s" style="color:#d32f2f;word-break:break-all">%s</a>
                      </p>
                    </div>
                    <div style="background:#fdf0f0;padding:20px 40px;text-align:center">
                      <p style="color:#aaa;font-size:0.78rem;margin:0">© 2025 MITAEdu — Nền tảng luyện thi hàng đầu</p>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(name, verifyUrl, verifyUrl, verifyUrl);
    }
}
