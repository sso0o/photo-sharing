package com.sychoi.backend.photo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PhotoSaveRequest {

    @NotBlank
    private String eventId;

    @NotBlank
    private String imageUrl;
}
