package com.sychoi.backend.admin.service;

import com.sychoi.backend.admin.dto.AdminStatsResponse;
import com.sychoi.backend.admin.dto.HostDetailResponse;
import com.sychoi.backend.admin.dto.HostPromoteRequest;
import com.sychoi.backend.admin.dto.HostSummaryResponse;
import com.sychoi.backend.admin.dto.HostUpdateRequest;
import com.sychoi.backend.common.exception.CustomException;
import com.sychoi.backend.user.domain.User;
import com.sychoi.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminHostService {

    private static final Set<String> VALID_SORT_FIELDS = Set.of("createdAt", "nickname", "email");

    private final UserRepository userRepository;

    public Map<String, Object> getHosts(int page, int size, String sort, String direction, String nickname) {
        if (!VALID_SORT_FIELDS.contains(sort)) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "INVALID_INPUT",
                    "정렬 기준은 createdAt, nickname, email 중 하나여야 합니다.");
        }

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<User> userPage;
        if (nickname != null && !nickname.isBlank()) {
            userPage = userRepository.findAllByRoleAndNicknameContainingIgnoreCase("ROLE_HOST", nickname, pageable);
        } else {
            userPage = userRepository.findAllByRole("ROLE_HOST", pageable);
        }

        List<HostSummaryResponse> content = userPage.getContent().stream()
                .map(user -> HostSummaryResponse.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .nickname(user.getNickname())
                        .createdAt(user.getCreatedAt())
                        .build())
                .toList();

        log.info("Admin fetched host list: page={}, size={}, total={}", page, size, userPage.getTotalElements());

        return Map.of(
                "content", content,
                "page", userPage.getNumber(),
                "size", userPage.getSize(),
                "totalElements", userPage.getTotalElements(),
                "totalPages", userPage.getTotalPages()
        );
    }

    public HostDetailResponse getHost(String id) {
        User user = userRepository.findByIdAndRole(id, "ROLE_HOST")
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "HOST_NOT_FOUND", "호스트를 찾을 수 없습니다."));

        log.info("Admin fetched host detail: id={}", id);
        return HostDetailResponse.from(user);
    }

    public HostDetailResponse promoteToHost(HostPromoteRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "사용자를 찾을 수 없습니다."));

        if ("ROLE_HOST".equals(user.getRole())) {
            throw new CustomException(HttpStatus.CONFLICT, "ALREADY_HOST", "이미 호스트입니다.");
        }

        User promoted = User.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .nickname(user.getNickname())
                .createdAt(user.getCreatedAt())
                .role("ROLE_HOST")
                .build();

        User saved = userRepository.save(promoted);
        log.info("Admin promoted user to host: userId={}", user.getId());
        return HostDetailResponse.from(saved);
    }

    public HostDetailResponse updateHost(String id, HostUpdateRequest request) {
        User user = userRepository.findByIdAndRole(id, "ROLE_HOST")
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "HOST_NOT_FOUND", "호스트를 찾을 수 없습니다."));

        if (userRepository.existsByNicknameAndIdNot(request.getNickname(), id)) {
            throw new CustomException(HttpStatus.CONFLICT, "DUPLICATE_NICKNAME", "이미 사용 중인 닉네임입니다.");
        }

        User updated = User.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .nickname(request.getNickname())
                .build();

        User saved = userRepository.save(updated);
        log.info("Admin updated host nickname: hostId={}", id);
        return HostDetailResponse.from(saved);
    }

    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.countByRole("ROLE_USER");
        long totalHosts = userRepository.countByRole("ROLE_HOST");
        long totalAdmins = userRepository.countByRole("ROLE_ADMIN");

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalHosts(totalHosts)
                .totalAdmins(totalAdmins)
                .build();
    }

    public Map<String, Object> getUsers(int page, int size, String sort, String direction, String nickname) {
        if (!VALID_SORT_FIELDS.contains(sort)) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "INVALID_INPUT",
                    "정렬 기준은 createdAt, nickname, email 중 하나여야 합니다.");
        }

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<User> userPage;
        if (nickname != null && !nickname.isBlank()) {
            userPage = userRepository.findAllByRoleAndNicknameContainingIgnoreCase("ROLE_USER", nickname, pageable);
        } else {
            userPage = userRepository.findAllByRole("ROLE_USER", pageable);
        }

        List<HostSummaryResponse> content = userPage.getContent().stream()
                .map(user -> HostSummaryResponse.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .nickname(user.getNickname())
                        .createdAt(user.getCreatedAt())
                        .build())
                .toList();

        log.info("Admin fetched user list: page={}, size={}, total={}", page, size, userPage.getTotalElements());

        return Map.of(
                "content", content,
                "page", userPage.getNumber(),
                "size", userPage.getSize(),
                "totalElements", userPage.getTotalElements(),
                "totalPages", userPage.getTotalPages()
        );
    }

    public void revokeHostRole(String id) {
        User user = userRepository.findByIdAndRole(id, "ROLE_HOST")
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "HOST_NOT_FOUND", "호스트를 찾을 수 없습니다."));

        User revoked = User.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .nickname(user.getNickname())
                .createdAt(user.getCreatedAt())
                .role("ROLE_USER")
                .build();

        userRepository.save(revoked);
        log.info("Admin revoked host role: hostId={}", id);
    }
}
