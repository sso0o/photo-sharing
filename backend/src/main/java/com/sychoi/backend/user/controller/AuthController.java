package com.sychoi.backend.user.controller;

import com.sychoi.backend.user.dto.LoginRequest;
import com.sychoi.backend.user.dto.LoginResponse;
import com.sychoi.backend.user.dto.SignUpRequest;
import com.sychoi.backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/test")
    public String test() {
        return "ok";
    }

    @PostMapping("/signup")
    public ResponseEntity<Void> signUp(@Valid @RequestBody SignUpRequest request) {
        userService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}