package com.plantcontrol.plant_control_api.dto.plant;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PlantCreateRequest {

@NotBlank(message = "Plant name is required")
@Size(max = 150, message = "Plant name must be at most 150 characters")    
private String name;

@Size(max = 100, message = "Plant type must be at most 100 characters.")
private String plantType;

@Size(max = 150, message = "Location must be at most 150 characters.")
private String location;

private String description;

private String imageUrl;

private LocalDate plantedDate;

public PlantCreateRequest() {
}

public String getName() {
    return name;
}

public void setName(String name) {
    this.name = name;
}

public String getPlantType() {
    return plantType;
}

public void setPlantType(String plantType) {
    this.plantType = plantType;
}

public String getLocation() {
    return location;
}

public void setLocation(String location) {
    this.location = location;
}

public String getDescription() {
    return description;
}

public void setDescription(String description) {
    this.description = description;
}

public String getImageUrl() {
    return imageUrl;
}

public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
}

public LocalDate getPlantedDate() {
    return plantedDate;
}

public void setPlantedDate(LocalDate plantedDate) {
    this.plantedDate = plantedDate;
}
}
