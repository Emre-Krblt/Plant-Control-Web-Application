package com.plantcontrol.plant_control_api.controller;

import com.plantcontrol.plant_control_api.entity.Alert;
import com.plantcontrol.plant_control_api.entity.Plant;
import com.plantcontrol.plant_control_api.repository.AlertRepository;
import com.plantcontrol.plant_control_api.repository.PlantRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TestController {

    private final PlantRepository plantRepository;
    private final AlertRepository alertRepository;

    public TestController(
            PlantRepository plantRepository,
            AlertRepository alertRepository
    ) {
        this.plantRepository = plantRepository;
        this.alertRepository = alertRepository;
    }

    @GetMapping("/api/test/plants")
    public List<PlantTestResponse> getPlants() {
        return plantRepository.findAll()
                .stream()
                .map(plant -> new PlantTestResponse(
                        plant.getId(),
                        plant.getName(),
                        plant.getPlantType(),
                        plant.getLocation(),
                        plant.getHealthStatus().name()
                ))
                .toList();
    }

    @GetMapping("/api/test/alerts")
    public List<AlertTestResponse> getAlerts() {
        return alertRepository.findAll()
                .stream()
                .map(alert -> new AlertTestResponse(
                        alert.getId(),
                        alert.getTitle(),
                        alert.getSeverity().name(),
                        alert.getStatus().name()
                ))
                .toList();
    }

    public record PlantTestResponse(
            Long id,
            String name,
            String plantType,
            String location,
            String healthStatus
    ) {
    }

    public record AlertTestResponse(
            Long id,
            String title,
            String severity,
            String status
    ) {
    }
}
