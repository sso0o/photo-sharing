package com.sychoi.backend.user.service;

import com.sychoi.backend.common.exception.CustomException;
import com.sychoi.backend.user.domain.User;
import com.sychoi.backend.user.dto.SignUpRequest;
import com.sychoi.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public void signUp(SignUpRequest request) {

        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(HttpStatus.CONFLICT, "Email already exists");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // User 생성
        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .role(request.getRole()) // USER or HOST
                .build();

        userRepository.save(user);
    }
}