package com.sychoi.backend.event.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
public class EventResponse {
    private String id;
    private String title;
    private String description;
    private String createdByUserId;
    private Instant createdAt;
}
