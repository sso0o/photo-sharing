package com.sychoi.backend.admin.controller;

import com.sychoi.backend.admin.dto.AdminStatsResponse;
import com.sychoi.backend.admin.dto.HostDetailResponse;
import com.sychoi.backend.admin.dto.HostPromoteRequest;
import com.sychoi.backend.admin.dto.HostUpdateRequest;
import com.sychoi.backend.admin.service.AdminHostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/hosts")
@RequiredArgsConstructor
public class AdminHostController {

    private final AdminHostService adminHostService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminHostService.getStats());
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String nickname
    ) {
        return ResponseEntity.ok(adminHostService.getHosts(page, size, sort, direction, nickname));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HostDetailResponse> getHost(@PathVariable String id) {
        return ResponseEntity.ok(adminHostService.getHost(id));
    }

    @PostMapping
    public ResponseEntity<HostDetailResponse> promoteToHost(@Valid @RequestBody HostPromoteRequest request) {
        return ResponseEntity.ok(adminHostService.promoteToHost(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HostDetailResponse> updateHost(
            @PathVariable String id,
            @Valid @RequestBody HostUpdateRequest request
    ) {
        return ResponseEntity.ok(adminHostService.updateHost(id, request));
    }

    @DeleteMapping("/{id}/role")
    public ResponseEntity<Void> revokeHostRole(@PathVariable String id) {
        adminHostService.revokeHostRole(id);
        return ResponseEntity.noContent().build();
    }
}
