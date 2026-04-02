package com.sychoi.backend.user.controller;

import com.sychoi.backend.common.exception.CustomException;
import com.sychoi.backend.common.security.JwtProvider;
import com.sychoi.backend.user.domain.User;
import com.sychoi.backend.user.dto.LoginRequest;
import com.sychoi.backend.user.dto.SignUpRequest;
import com.sychoi.backend.user.repository.UserRepository;
import com.sychoi.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        return ResponseEntity.ok(jwtProvider.generateToken(user.getId(), user.getRole()));
    }


    @GetMapping("/test")
    public String test() {
        return "ok";
    }

    @PostMapping("/signup")
    public String signUp(@RequestBody SignUpRequest request) {
        userService.signUp(request);
        return "User registered successfully";
    }
}