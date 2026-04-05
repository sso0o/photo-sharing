package com.sychoi.backend.event.repository;

import com.sychoi.backend.event.domain.Event;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {
    List<Event> findByCreatedByUserId(String createdByUserId);
}
