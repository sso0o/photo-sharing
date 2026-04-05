package com.sychoi.backend.admin.service;

import com.sychoi.backend.admin.dto.AdminStatsResponse;
import com.sychoi.backend.admin.dto.HostSummaryResponse;
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

    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.countByRole("ROLE_USER");
        long totalAdmins = userRepository.countByRole("ROLE_ADMIN");

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
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
}
