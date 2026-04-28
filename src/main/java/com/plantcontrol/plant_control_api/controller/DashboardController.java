package com.plantcontrol.plant_control_api.controller;

import com.plantcontrol.plant_control_api.dto.dashboard.DashboardResponse;
import com.plantcontrol.plant_control_api.security.CustomUserDetails;
import com.plantcontrol.plant_control_api.service.DashboardService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/api/dashboard")
    public DashboardResponse getDashboard(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return dashboardService.getDashboard(currentUser.getId());
    }
}
