package com.sychoi.backend.admin.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminStatsResponse {

    private long totalUsers;
    private long totalHosts;
    private long totalAdmins;
}
