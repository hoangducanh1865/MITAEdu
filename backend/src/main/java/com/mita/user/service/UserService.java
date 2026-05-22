package com.mita.user.service;

import com.mita.common.exception.ApiException;
import com.mita.user.dto.ChangePasswordRequest;
import com.mita.user.dto.UpdateProfileRequest;
import com.mita.user.dto.UserDto;
import com.mita.user.entity.User;
import com.mita.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto getById(Long id) {
        return UserDto.from(findById(id));
    }

    @Transactional
    public UserDto updateProfile(Long id, UpdateProfileRequest req) {
        User user = findById(id);
        user.setName(req.getName());
        user.setSchool(req.getSchool());
        user.setCity(req.getCity());
        user.setBirthYear(req.getBirthYear());
        return UserDto.from(userRepository.save(user));
    }

    @Transactional
    public void changePassword(Long id, ChangePasswordRequest req) {
        User user = findById(id);
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPasswordHash())) {
            throw ApiException.badRequest("Mật khẩu cũ không đúng");
        }
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }

    private User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Người dùng không tồn tại"));
    }
}
