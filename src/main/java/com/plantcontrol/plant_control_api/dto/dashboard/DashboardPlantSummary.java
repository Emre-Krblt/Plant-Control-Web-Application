package com.plantcontrol.plant_control_api.dto.dashboard;

public class DashboardPlantSummary {

    private Long id;
    private String name;
    private String plantType;
    private String location;
    private String healthStatus;

    public DashboardPlantSummary() {
    }

    public DashboardPlantSummary(
            Long id,
            String name,
            String plantType,
            String location,
            String healthStatus
    ) {
        this.id = id;
        this.name = name;
        this.plantType = plantType;
        this.location = location;
        this.healthStatus = healthStatus;
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

    public String getHealthStatus() {
        return healthStatus;
    }
}
