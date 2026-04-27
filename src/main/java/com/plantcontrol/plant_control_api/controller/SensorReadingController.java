package com.plantcontrol.plant_control_api.controller;

import com.plantcontrol.plant_control_api.dto.reading.GenerateReadingsResponse;
import com.plantcontrol.plant_control_api.service.SensorReadingService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/plants/{plantId}/sensor-readings")
public class SensorReadingController {

    private final SensorReadingService sensorReadingService;

    private static final Long TEMP_CURRENT_USER_ID = 1L;

    public SensorReadingController(SensorReadingService sensorReadingService) {
        this.sensorReadingService = sensorReadingService;
    }

    @PostMapping("/generate")
    public GenerateReadingsResponse generateReadings(@PathVariable Long plantId) {
        return sensorReadingService.generateSimulatedReadings(
                plantId,
                TEMP_CURRENT_USER_ID
        );
    }
}
