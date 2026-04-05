package com.sychoi.backend.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
@AllArgsConstructor
public class HostSummaryResponse {

    private String id;
    private String email;
    private String nickname;
    private Instant createdAt;
}
