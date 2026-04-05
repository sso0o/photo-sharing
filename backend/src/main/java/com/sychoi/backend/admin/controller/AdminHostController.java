package com.sychoi.backend.admin.controller;

import com.sychoi.backend.admin.dto.AdminStatsResponse;
import com.sychoi.backend.admin.service.AdminHostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/hosts")
@RequiredArgsConstructor
public class AdminHostController {

    private final AdminHostService adminHostService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminHostService.getStats());
    }
}
