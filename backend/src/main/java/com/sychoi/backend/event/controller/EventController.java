package com.sychoi.backend.event.controller;

import com.sychoi.backend.event.dto.EventCreateRequest;
import com.sychoi.backend.event.dto.EventResponse;
import com.sychoi.backend.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @RequestBody @Valid EventCreateRequest request,
            Authentication authentication
    ) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEvent(@PathVariable String id) {
        return ResponseEntity.ok(eventService.getEvent(id));
    }
}
