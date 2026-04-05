package com.sychoi.backend.admin.dto;

import com.sychoi.backend.user.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
@AllArgsConstructor
public class HostDetailResponse {

    private String id;
    private String email;
    private String nickname;
    private String role;
    private Instant createdAt;

    public static HostDetailResponse from(User user) {
        return HostDetailResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
