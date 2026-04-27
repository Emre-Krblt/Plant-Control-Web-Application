package com.plantcontrol.plant_control_api.controller;

import com.plantcontrol.plant_control_api.dto.sensor.PlantSensorResponse;
import com.plantcontrol.plant_control_api.dto.sensor.PlantSensorUpdateRequest;
import com.plantcontrol.plant_control_api.service.PlantSensorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plants/{plantId}/sensors")
public class PlantSensorController {

    private final PlantSensorService plantSensorService;

    private static final Long TEMP_CURRENT_USER_ID = 1L;

    public PlantSensorController(PlantSensorService plantSensorService) {
        this.plantSensorService = plantSensorService;
    }

    @GetMapping
    public List<PlantSensorResponse> getSensorsByPlant(@PathVariable Long plantId) {
        return plantSensorService.getSensorsByPlant(plantId, TEMP_CURRENT_USER_ID);
    }

    @PutMapping("/{sensorId}")
    public PlantSensorResponse updateSensor(
            @PathVariable Long plantId,
            @PathVariable Long sensorId,
            @Valid @RequestBody PlantSensorUpdateRequest request
    ) {
        return plantSensorService.updateSensor(
                plantId,
                sensorId,
                request,
                TEMP_CURRENT_USER_ID
        );
    }
}
