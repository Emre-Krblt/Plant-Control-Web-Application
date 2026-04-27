package com.plantcontrol.plant_control_api.controller;

import com.plantcontrol.plant_control_api.dto.dashboard.DashboardResponse;
import com.plantcontrol.plant_control_api.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    private final DashboardService dashboardService;

    private static final Long TEMP_CURRENT_USER_ID = 1L;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/api/dashboard")
    public DashboardResponse getDashboard() {
        return dashboardService.getDashboard(TEMP_CURRENT_USER_ID);
    }
}
