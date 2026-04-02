package com.sychoi.backend.photo.repository;

import com.sychoi.backend.photo.domain.Photo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PhotoRepository extends MongoRepository<Photo, String> {
    List<Photo> findByUserId(String userId);
    List<Photo> findByEventId(String eventId);
}
