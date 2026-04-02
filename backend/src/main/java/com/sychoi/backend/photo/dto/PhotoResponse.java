package com.sychoi.backend.photo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class PhotoResponse {
    private String id;
    private String userId;
    private String eventId;
    private String imageUrl;
    private LocalDateTime createdAt;
}
