package com.plantcontrol.plant_control_api.controller;

import com.plantcontrol.plant_control_api.dto.sensor.PlantSensorResponse;
import com.plantcontrol.plant_control_api.dto.sensor.PlantSensorUpdateRequest;
import com.plantcontrol.plant_control_api.security.CustomUserDetails;
import com.plantcontrol.plant_control_api.service.PlantSensorService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plants/{plantId}/sensors")
public class PlantSensorController {

    private final PlantSensorService plantSensorService;

    public PlantSensorController(PlantSensorService plantSensorService) {
        this.plantSensorService = plantSensorService;
    }

    @GetMapping
    public List<PlantSensorResponse> getSensorsByPlant(
            @PathVariable Long plantId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return plantSensorService.getSensorsByPlant(plantId, currentUser.getId());
    }

    @PutMapping("/{sensorId}")
    public PlantSensorResponse updateSensor(
            @PathVariable Long plantId,
            @PathVariable Long sensorId,
            @Valid @RequestBody PlantSensorUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return plantSensorService.updateSensor(
                plantId,
                sensorId,
                request,
                currentUser.getId()
        );
    }
}
