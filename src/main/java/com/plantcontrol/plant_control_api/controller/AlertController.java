package com.plantcontrol.plant_control_api.controller;

import com.plantcontrol.plant_control_api.dto.alert.AlertResponse;
import com.plantcontrol.plant_control_api.service.AlertService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AlertController {

    private final AlertService alertService;

    private static final Long TEMP_CURRENT_USER_ID = 1L;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping("/api/alerts/active")
    public List<AlertResponse> getActiveAlerts() {
        return alertService.getActiveAlerts(TEMP_CURRENT_USER_ID);
    }

    @GetMapping("/api/plants/{plantId}/alerts")
    public List<AlertResponse> getAlertsByPlant(@PathVariable Long plantId) {
        return alertService.getAlertsByPlant(plantId, TEMP_CURRENT_USER_ID);
    }

    @PutMapping("/api/alerts/{alertId}/resolve")
    public AlertResponse resolveAlert(@PathVariable Long alertId) {
        return alertService.resolveAlert(alertId, TEMP_CURRENT_USER_ID);
    }

    @PutMapping("/api/alerts/{alertId}/ignore")
    public AlertResponse ignoreAlert(@PathVariable Long alertId) {
        return alertService.ignoreAlert(alertId, TEMP_CURRENT_USER_ID);
    }
}
