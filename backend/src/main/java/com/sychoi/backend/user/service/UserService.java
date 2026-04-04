package com.sychoi.backend.user.service;

import com.sychoi.backend.common.exception.CustomException;
import com.sychoi.backend.common.security.JwtProvider;
import com.sychoi.backend.user.domain.User;
import com.sychoi.backend.user.dto.LoginRequest;
import com.sychoi.backend.user.dto.LoginResponse;
import com.sychoi.backend.user.dto.SignUpRequest;
import com.sychoi.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

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
        log.info("New user registered: {}", request.getEmail());
    }

    public LoginResponse login(LoginRequest request) {
        // 이메일 존재 여부와 비밀번호 불일치를 동일한 에러로 처리 (이메일 열거 공격 방지)
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed - invalid credentials for email: {}", request.getEmail());
            throw new CustomException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String accessToken = jwtProvider.generateToken(user.getId(), user.getRole());
        String refreshToken = jwtProvider.generateRefreshToken(user.getId());

        log.info("Login successful: {}", request.getEmail());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtProvider.getExpirationMs() / 1000)
                .build();
    }
}