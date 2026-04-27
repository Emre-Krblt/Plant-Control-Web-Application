package com.plantcontrol.plant_control_api.dto.sensor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PlantSensorResponse {

    private Long id;
    private String sensorType;
    private Boolean connected;
    private BigDecimal minThreshold;
    private BigDecimal maxThreshold;
    private String unit;
    private String lastStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PlantSensorResponse() {
    }

    public PlantSensorResponse(
            Long id,
            String sensorType,
            Boolean connected,
            BigDecimal minThreshold,
            BigDecimal maxThreshold,
            String unit,
            String lastStatus,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.sensorType = sensorType;
        this.connected = connected;
        this.minThreshold = minThreshold;
        this.maxThreshold = maxThreshold;
        this.unit = unit;
        this.lastStatus = lastStatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getSensorType() {
        return sensorType;
    }

    public Boolean getConnected() {
        return connected;
    }

    public BigDecimal getMinThreshold() {
        return minThreshold;
    }

    public BigDecimal getMaxThreshold() {
        return maxThreshold;
    }

    public String getUnit() {
        return unit;
    }

    public String getLastStatus() {
        return lastStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}