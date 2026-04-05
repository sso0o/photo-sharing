package com.sychoi.backend.event.service;

import com.sychoi.backend.common.exception.CustomException;
import com.sychoi.backend.event.domain.Event;
import com.sychoi.backend.event.dto.EventCreateRequest;
import com.sychoi.backend.event.dto.EventResponse;
import com.sychoi.backend.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public EventResponse createEvent(String userId, EventCreateRequest request) {
        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .createdByUserId(userId)
                .createdAt(Instant.now())
                .build();
        Event saved = eventRepository.save(event);
        log.info("Event created: id={}, userId={}", saved.getId(), userId);
        return toResponse(saved);
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public EventResponse getEvent(String id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "EVENT_NOT_FOUND", "이벤트를 찾을 수 없습니다."));
        return toResponse(event);
    }

    private EventResponse toResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .createdByUserId(event.getCreatedByUserId())
                .createdAt(event.getCreatedAt())
                .build();
    }
}
