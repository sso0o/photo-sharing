package com.sychoi.backend.common.security;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final InvalidatedTokenRepository invalidatedTokenRepository;

    public void blacklist(String token, Date expiresAt) {
        invalidatedTokenRepository.save(
                InvalidatedToken.builder()
                        .token(token)
                        .expiresAt(expiresAt)
                        .build()
        );
    }

    public boolean isBlacklisted(String token) {
        return invalidatedTokenRepository.existsByToken(token);
    }
}
