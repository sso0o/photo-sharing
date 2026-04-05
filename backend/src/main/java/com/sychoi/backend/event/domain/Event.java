package com.sychoi.backend.event.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.Instant;

@Document(collection = "events")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    @Id
    private String id;
    private String title;
    private String description;
    @Indexed
    private String createdByUserId;
    private Instant createdAt;
}
