package com.plantcontrol.plant_control_api.dto.plant;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PlantResponse {

    private Long id;
    private String name;
    private String plantType;
    private String location;
    private String description;
    private String imageUrl;
    private LocalDate plantedDate;
    private String healthStatus;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PlantResponse() {
    }

    public PlantResponse(
            Long id,
            String name,
            String plantType,
            String location,
            String description,
            String imageUrl,
            LocalDate plantedDate,
            String healthStatus,
            Boolean active,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.name = name;
        this.plantType = plantType;
        this.location = location;
        this.description = description;
        this.imageUrl = imageUrl;
        this.plantedDate = plantedDate;
        this.healthStatus = healthStatus;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPlantType() {
        return plantType;
    }

    public String getLocation() {
        return location;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public LocalDate getPlantedDate() {
        return plantedDate;
    }

    public String getHealthStatus() {
        return healthStatus;
    }

    public Boolean getActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
}
