package com.sychoi.backend.user.repository;

import com.sychoi.backend.user.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);

    Page<User> findAllByRole(String role, Pageable pageable);
    Page<User> findAllByRoleAndNicknameContainingIgnoreCase(String role, String nickname, Pageable pageable);
    Optional<User> findByIdAndRole(String id, String role);
    boolean existsByNicknameAndIdNot(String nickname, String id);
    long countByRole(String role);
}