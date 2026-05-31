package com.mita.auth.service;

import com.mita.auth.dto.AuthResponse;
import com.mita.auth.dto.LoginRequest;
import com.mita.auth.dto.RegisterRequest;
import com.mita.auth.jwt.JwtTokenProvider;
import com.mita.common.exception.ApiException;
import com.mita.user.entity.User;
import com.mita.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailVerificationService emailVerificationService;

    /**
     * Đăng ký: tạo tài khoản (chưa kích hoạt) và gửi email xác minh.
     * KHÔNG cấp JWT — user phải xác minh email trước khi đăng nhập.
     */
    @Transactional
    public void register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw ApiException.badRequest("Email đã được sử dụng");
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .school(req.getSchool())
                .city(req.getCity())
                .birthYear(req.getBirthYear())
                .build();
        userRepository.save(user);

        emailVerificationService.sendVerification(user);
    }

    public AuthResponse login(LoginRequest req) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = (User) authentication.getPrincipal();

        // Chặn đăng nhập nếu chưa xác minh email
        if (!user.isEmailVerified()) {
            throw ApiException.forbidden("Tài khoản chưa được xác minh. Vui lòng kiểm tra email để kích hoạt tài khoản.");
        }

        String token = jwtTokenProvider.generateToken(authentication);
        return AuthResponse.of(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name(), user.isEmailVerified());
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> ApiException.notFound("Người dùng không tồn tại"));
    }
}
