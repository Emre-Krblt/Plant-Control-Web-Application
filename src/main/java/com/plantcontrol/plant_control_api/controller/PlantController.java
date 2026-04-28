package com.plantcontrol.plant_control_api.controller;

import com.plantcontrol.plant_control_api.dto.plant.PlantCreateRequest;
import com.plantcontrol.plant_control_api.dto.plant.PlantResponse;
import com.plantcontrol.plant_control_api.dto.plant.PlantUpdateRequest;
import com.plantcontrol.plant_control_api.security.CustomUserDetails;
import com.plantcontrol.plant_control_api.service.PlantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plants")
public class PlantController {

    private final PlantService plantService;

    public PlantController(PlantService plantService) {
        this.plantService = plantService;
    }

    @GetMapping
    public List<PlantResponse> getPlants(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return plantService.getPlantsByUser(currentUser.getId());
    }

    @GetMapping("/{plantId}")
    public PlantResponse getPlantById(
            @PathVariable Long plantId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return plantService.getPlantById(plantId, currentUser.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlantResponse createPlant(
            @Valid @RequestBody PlantCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return plantService.createPlant(request, currentUser.getId());
    }

    @PutMapping("/{plantId}")
    public PlantResponse updatePlant(
            @PathVariable Long plantId,
            @Valid @RequestBody PlantUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return plantService.updatePlant(plantId, request, currentUser.getId());
    }

    @DeleteMapping("/{plantId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlant(
            @PathVariable Long plantId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        plantService.deletePlant(plantId, currentUser.getId());
    }
}