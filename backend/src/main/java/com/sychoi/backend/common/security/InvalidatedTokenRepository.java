package com.sychoi.backend.common.security;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface InvalidatedTokenRepository extends MongoRepository<InvalidatedToken, String> {
    boolean existsByToken(String token);
}
