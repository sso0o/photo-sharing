package com.sychoi.backend.photo.service;

import com.sychoi.backend.common.s3.S3Service;
import com.sychoi.backend.photo.domain.Photo;
import com.sychoi.backend.photo.dto.PhotoResponse;
import com.sychoi.backend.photo.dto.PhotoSaveRequest;
import com.sychoi.backend.photo.dto.PresignedUrlRequest;
import com.sychoi.backend.photo.dto.PresignedUrlResponse;
import com.sychoi.backend.photo.repository.PhotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final S3Service s3Service;

    public PresignedUrlResponse generatePresignedUrl(String userId, PresignedUrlRequest request) {
        String key = "events/" + request.getEventId() + "/users/" + userId + "/" + request.getFileName();
        String presignedUrl = s3Service.createPresignedUrl(key);
        String imageUrl = presignedUrl.substring(0, presignedUrl.indexOf('?'));
        return new PresignedUrlResponse(presignedUrl, imageUrl);
    }

    public PhotoResponse savePhoto(String userId, PhotoSaveRequest request) {
        Photo photo = Photo.builder()
                .userId(userId)
                .eventId(request.getEventId())
                .imageUrl(request.getImageUrl())
                .createdAt(LocalDateTime.now())
                .build();
        return toResponse(photoRepository.save(photo));
    }

    public List<PhotoResponse> getMyPhotos(String userId) {
        return photoRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PhotoResponse> getEventPhotos(String eventId) {
        return photoRepository.findByEventId(eventId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private PhotoResponse toResponse(Photo photo) {
        return PhotoResponse.builder()
                .id(photo.getId())
                .userId(photo.getUserId())
                .eventId(photo.getEventId())
                .imageUrl(photo.getImageUrl())
                .createdAt(photo.getCreatedAt())
                .build();
    }
}
