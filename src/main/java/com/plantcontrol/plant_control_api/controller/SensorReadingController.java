package com.plantcontrol.plant_control_api.controller;

import com.plantcontrol.plant_control_api.dto.reading.GenerateReadingsResponse;
import com.plantcontrol.plant_control_api.security.CustomUserDetails;
import com.plantcontrol.plant_control_api.service.SensorReadingService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/plants/{plantId}/sensor-readings")
public class SensorReadingController {

    private final SensorReadingService sensorReadingService;

    public SensorReadingController(SensorReadingService sensorReadingService) {
        this.sensorReadingService = sensorReadingService;
    }

    @PostMapping("/generate")
    public GenerateReadingsResponse generateReadings(
            @PathVariable Long plantId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return sensorReadingService.generateSimulatedReadings(
                plantId,
                currentUser.getId()
        );
    }
}
