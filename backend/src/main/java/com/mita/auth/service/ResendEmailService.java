package com.mita.auth.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
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
        String logoUrl = buildLogoUrl(resetUrl);
        return """
                <!DOCTYPE html>
                <html lang="vi">
                <head><meta charset="UTF-8"></head>
                <body style="font-family:sans-serif;background:#f0f7fd;padding:40px 0;margin:0">
                  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(30,122,184,.14);border:1px solid #c5ddf0">
                    <div style="background:#fff;padding:32px 40px 24px;text-align:center;border-bottom:4px solid #1e7ab8">
                      <img src="%s" alt="MITA Education" style="display:block;width:320px;max-width:100%%;height:auto;margin:0 auto">
                    </div>
                    <div style="padding:36px 40px">
                      <h2 style="color:#2c2c2c;font-size:1.2rem;margin:0 0 12px">Xin chào, %s!</h2>
                      <p style="color:#555;line-height:1.7;margin:0 0 24px">
                        %s
                      </p>
                      <div style="text-align:center;margin:32px 0">
                        <a href="%s"
                           style="display:inline-block;background:#1e7ab8;color:#fff;text-decoration:none;
                                  padding:14px 36px;border-radius:10px;font-weight:700;font-size:1rem">
                          %s
                        </a>
                      </div>
                      <p style="color:#888;font-size:0.82rem;line-height:1.6;margin:0">
                        Link này có hiệu lực trong <strong>1 giờ</strong>. %s<br><br>
                        Hoặc copy link sau vào trình duyệt:<br>
                        <a href="%s" style="color:#1e7ab8;word-break:break-all">%s</a>
                      </p>
                    </div>
                    <div style="background:#f0f7fd;padding:20px 40px;text-align:center;border-top:1px solid #c5ddf0">
                      <p style="color:#777;font-size:0.78rem;margin:0">© 2026 MITA Education — Luyện thi đánh giá năng lực</p>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(logoUrl, name, intro, resetUrl, actionLabel, ignoreMessage, resetUrl, resetUrl);
    }

    private String buildEmailHtml(String name, String verifyUrl) {
        String logoUrl = buildLogoUrl(verifyUrl);
        return """
                <!DOCTYPE html>
                <html lang="vi">
                <head><meta charset="UTF-8"></head>
                <body style="font-family:sans-serif;background:#f0f7fd;padding:40px 0;margin:0">
                  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(30,122,184,.14);border:1px solid #c5ddf0">
                    <div style="background:#fff;padding:32px 40px 24px;text-align:center;border-bottom:4px solid #1e7ab8">
                      <img src="%s" alt="MITA Education" style="display:block;width:320px;max-width:100%%;height:auto;margin:0 auto">
                    </div>
                    <div style="padding:36px 40px">
                      <h2 style="color:#2c2c2c;font-size:1.2rem;margin:0 0 12px">Xin chào, %s!</h2>
                      <p style="color:#555;line-height:1.7;margin:0 0 24px">
                        Cảm ơn bạn đã đăng ký tài khoản MITAEdu. Vui lòng xác minh địa chỉ email của bạn bằng cách nhấn vào nút bên dưới.
                      </p>
                      <div style="text-align:center;margin:32px 0">
                        <a href="%s"
                           style="display:inline-block;background:#1e7ab8;color:#fff;text-decoration:none;
                                  padding:14px 36px;border-radius:10px;font-weight:700;font-size:1rem">
                          Xác minh email
                        </a>
                      </div>
                      <p style="color:#888;font-size:0.82rem;line-height:1.6;margin:0">
                        Link này có hiệu lực trong <strong>24 giờ</strong>. Nếu bạn không đăng ký tài khoản, hãy bỏ qua email này.<br><br>
                        Hoặc copy link sau vào trình duyệt:<br>
                        <a href="%s" style="color:#1e7ab8;word-break:break-all">%s</a>
                      </p>
                    </div>
                    <div style="background:#f0f7fd;padding:20px 40px;text-align:center;border-top:1px solid #c5ddf0">
                      <p style="color:#777;font-size:0.78rem;margin:0">© 2026 MITA Education — Luyện thi đánh giá năng lực</p>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(logoUrl, name, verifyUrl, verifyUrl, verifyUrl);
    }

    private String buildLogoUrl(String actionUrl) {
        try {
            URI uri = URI.create(actionUrl);
            if (uri.getScheme() == null || uri.getHost() == null) {
                return "https://mitaedu.com/logo-mita-2.png";
            }
            String port = uri.getPort() == -1 ? "" : ":" + uri.getPort();
            return uri.getScheme() + "://" + uri.getHost() + port + "/logo-mita-2.png";
        } catch (IllegalArgumentException ex) {
            return "https://mitaedu.com/logo-mita-2.png";
        }
    }
}
