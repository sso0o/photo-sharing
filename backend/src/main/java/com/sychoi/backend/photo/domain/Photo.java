package com.sychoi.backend.photo.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "photos")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Photo {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String eventId;

    private String imageUrl;

    private LocalDateTime createdAt;
}
