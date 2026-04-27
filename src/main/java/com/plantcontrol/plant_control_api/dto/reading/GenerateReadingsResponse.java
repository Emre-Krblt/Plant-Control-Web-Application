package com.plantcontrol.plant_control_api.dto.reading;

import java.util.List;

public class GenerateReadingsResponse {

    private Long plantId;
    private String plantHealthStatus;
    private List<SensorReadingResponse> readings;

    public GenerateReadingsResponse() {
    }

    public GenerateReadingsResponse(
            Long plantId,
            String plantHealthStatus,
            List<SensorReadingResponse> readings
    ) {
        this.plantId = plantId;
        this.plantHealthStatus = plantHealthStatus;
        this.readings = readings;
    }

    public Long getPlantId() {
        return plantId;
    }

    public String getPlantHealthStatus() {
        return plantHealthStatus;
    }

    public List<SensorReadingResponse> getReadings() {
        return readings;
    }
}
