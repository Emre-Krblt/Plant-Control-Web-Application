package com.plantcontrol.plant_control_api.controller;

import com.plantcontrol.plant_control_api.dto.alert.AlertResponse;
import com.plantcontrol.plant_control_api.security.CustomUserDetails;
import com.plantcontrol.plant_control_api.service.AlertService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping("/api/alerts/active")
    public List<AlertResponse> getActiveAlerts(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return alertService.getActiveAlerts(currentUser.getId());
    }

    @GetMapping("/api/plants/{plantId}/alerts")
    public List<AlertResponse> getAlertsByPlant(
            @PathVariable Long plantId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return alertService.getAlertsByPlant(plantId, currentUser.getId());
    }

    @PutMapping("/api/alerts/{alertId}/resolve")
    public AlertResponse resolveAlert(
            @PathVariable Long alertId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return alertService.resolveAlert(alertId, currentUser.getId());
    }

    @PutMapping("/api/alerts/{alertId}/ignore")
    public AlertResponse ignoreAlert(
            @PathVariable Long alertId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return alertService.ignoreAlert(alertId, currentUser.getId());
    }
}
