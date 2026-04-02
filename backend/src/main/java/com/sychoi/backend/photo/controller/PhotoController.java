package com.sychoi.backend.photo.controller;

import com.sychoi.backend.photo.dto.PhotoResponse;
import com.sychoi.backend.photo.dto.PhotoSaveRequest;
import com.sychoi.backend.photo.dto.PresignedUrlRequest;
import com.sychoi.backend.photo.dto.PresignedUrlResponse;
import com.sychoi.backend.photo.service.PhotoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @PostMapping("/presigned-url")
    public ResponseEntity<PresignedUrlResponse> getPresignedUrl(
            @RequestBody @Valid PresignedUrlRequest request,
            Authentication authentication
    ) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(photoService.generatePresignedUrl(userId, request));
    }

    @PostMapping
    public ResponseEntity<PhotoResponse> savePhoto(
            @RequestBody @Valid PhotoSaveRequest request,
            Authentication authentication
    ) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(photoService.savePhoto(userId, request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<PhotoResponse>> getMyPhotos(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(photoService.getMyPhotos(userId));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<PhotoResponse>> getEventPhotos(@PathVariable String eventId) {
        return ResponseEntity.ok(photoService.getEventPhotos(eventId));
    }
}
