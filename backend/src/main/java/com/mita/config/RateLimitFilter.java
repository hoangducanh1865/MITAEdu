package com.mita.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mita.common.dto.ApiResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate limiter trong bộ nhớ (theo IP) cho các endpoint nhạy cảm: chống brute-force mật khẩu,
 * dò mã kích hoạt và spam email. Vượt ngưỡng trong cửa sổ thời gian sẽ trả HTTP 429.
 *
 * Lưu ý: phù hợp cho triển khai 1 instance. Nếu chạy nhiều instance, cần chuyển sang
 * store chia sẻ (vd Redis) để đếm chính xác trên toàn cụm.
 */
public class RateLimitFilter extends OncePerRequestFilter {

    private record Rule(String method, String pathPrefix, int limit, long windowMs) {}

    // Ngưỡng cho từng endpoint (method + path) — số request tối đa / cửa sổ thời gian.
    private static final List<Rule> RULES = List.of(
            new Rule("POST", "/api/auth/login", 10, 5 * 60_000L),
            new Rule("POST", "/api/auth/register", 10, 60 * 60_000L),
            new Rule("POST", "/api/auth/forgot-password", 5, 15 * 60_000L),
            new Rule("POST", "/api/auth/resend-verification", 5, 15 * 60_000L),
            new Rule("POST", "/api/access-codes/activate", 10, 5 * 60_000L)
    );

    private final ConcurrentHashMap<String, Deque<Long>> hits = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        Rule rule = matchRule(request);
        if (rule != null && isOverLimit(rule, clientIp(request))) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            objectMapper.writeValue(response.getWriter(),
                    ApiResponse.error("Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút."));
            return;
        }
        chain.doFilter(request, response);
    }

    private Rule matchRule(HttpServletRequest request) {
        String method = request.getMethod();
        String path = request.getServletPath();
        if (path == null) {
            return null;
        }
        for (Rule r : RULES) {
            if (r.method().equals(method) && path.startsWith(r.pathPrefix())) {
                return r;
            }
        }
        return null;
    }

    private boolean isOverLimit(Rule rule, String ip) {
        String key = ip + "|" + rule.pathPrefix();
        long now = System.currentTimeMillis();
        long windowStart = now - rule.windowMs();
        Deque<Long> dq = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (dq) {
            while (!dq.isEmpty() && dq.peekFirst() < windowStart) {
                dq.pollFirst();
            }
            if (dq.size() >= rule.limit()) {
                return true;
            }
            dq.addLast(now);
            return false;
        }
    }

    private String clientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(xff)) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
