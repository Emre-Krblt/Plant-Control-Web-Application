package com.plantcontrol.plant_control_api.dto.alert;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AlertResponse {

    private Long id;

    private Long plantId;
    private String plantName;

    private Long plantSensorId;
    private String sensorType;

    private Long sensorReadingId;

    private String alertType;
    private String severity;
    private String title;
    private String message;

    private BigDecimal currentValue;
    private BigDecimal thresholdMin;
    private BigDecimal thresholdMax;

    private String status;

    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AlertResponse() {
    }

    public AlertResponse(
            Long id,
            Long plantId,
            String plantName,
            Long plantSensorId,
            String sensorType,
            Long sensorReadingId,
            String alertType,
            String severity,
            String title,
            String message,
            BigDecimal currentValue,
            BigDecimal thresholdMin,
            BigDecimal thresholdMax,
            String status,
            LocalDateTime resolvedAt,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.plantId = plantId;
        this.plantName = plantName;
        this.plantSensorId = plantSensorId;
        this.sensorType = sensorType;
        this.sensorReadingId = sensorReadingId;
        this.alertType = alertType;
        this.severity = severity;
        this.title = title;
        this.message = message;
        this.currentValue = currentValue;
        this.thresholdMin = thresholdMin;
        this.thresholdMax = thresholdMax;
        this.status = status;
        this.resolvedAt = resolvedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getPlantId() {
        return plantId;
    }

    public String getPlantName() {
        return plantName;
    }

    public Long getPlantSensorId() {
        return plantSensorId;
    }

    public String getSensorType() {
        return sensorType;
    }

    public Long getSensorReadingId() {
        return sensorReadingId;
    }

    public String getAlertType() {
        return alertType;
    }

    public String getSeverity() {
        return severity;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public BigDecimal getCurrentValue() {
        return currentValue;
    }

    public BigDecimal getThresholdMin() {
        return thresholdMin;
    }

    public BigDecimal getThresholdMax() {
        return thresholdMax;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
