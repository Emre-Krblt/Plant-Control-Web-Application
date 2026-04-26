package com.plantcontrol.plant_control_api.controller;

import com.plantcontrol.plant_control_api.dto.plant.PlantCreateRequest;
import com.plantcontrol.plant_control_api.dto.plant.PlantResponse;
import com.plantcontrol.plant_control_api.dto.plant.PlantUpdateRequest;
import com.plantcontrol.plant_control_api.service.PlantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plants")
public class PlantController {

    private final PlantService plantService;

    /*
     * Auth sistemi henüz hazır olmadığı için geçici olarak
     * test datasındaki emre@example.com kullanıcısının id değerini kullanıyoruz.
     */
    private static final Long TEMP_CURRENT_USER_ID = 1L;

    public PlantController(PlantService plantService) {
        this.plantService = plantService;
    }

    @GetMapping
    public List<PlantResponse> getPlants() {
        return plantService.getPlantsByUser(TEMP_CURRENT_USER_ID);
    }

    @GetMapping("/{plantId}")
    public PlantResponse getPlantById(@PathVariable Long plantId) {
        return plantService.getPlantById(plantId, TEMP_CURRENT_USER_ID);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlantResponse createPlant(@Valid @RequestBody PlantCreateRequest request) {
        return plantService.createPlant(request, TEMP_CURRENT_USER_ID);
    }

    @PutMapping("/{plantId}")
    public PlantResponse updatePlant(
            @PathVariable Long plantId,
            @Valid @RequestBody PlantUpdateRequest request
    ) {
        return plantService.updatePlant(plantId, request, TEMP_CURRENT_USER_ID);
    }

    @DeleteMapping("/{plantId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlant(@PathVariable Long plantId) {
        plantService.deletePlant(plantId, TEMP_CURRENT_USER_ID);
    }
}
