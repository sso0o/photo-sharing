package com.sychoi.backend.common.security;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Getter
@Builder
@Document(collection = "invalidated_tokens")
public class InvalidatedToken {

    @Id
    private String id;

    @Indexed(unique = true)
    private String token;

    @Indexed(expireAfterSeconds = 0)
    private Date expiresAt;
}
