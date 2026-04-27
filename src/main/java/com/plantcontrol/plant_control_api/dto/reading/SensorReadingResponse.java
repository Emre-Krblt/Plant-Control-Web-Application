package com.plantcontrol.plant_control_api.dto.reading;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SensorReadingResponse {

    private Long id;
    private Long plantSensorId;
    private String sensorType;
    private BigDecimal value;
    private String unit;
    private String readingStatus;
    private String source;
    private LocalDateTime recordedAt;

    public SensorReadingResponse() {
    }

    public SensorReadingResponse(
            Long id,
            Long plantSensorId,
            String sensorType,
            BigDecimal value,
            String unit,
            String readingStatus,
            String source,
            LocalDateTime recordedAt
    ) {
        this.id = id;
        this.plantSensorId = plantSensorId;
        this.sensorType = sensorType;
        this.value = value;
        this.unit = unit;
        this.readingStatus = readingStatus;
        this.source = source;
        this.recordedAt = recordedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getPlantSensorId() {
        return plantSensorId;
    }

    public String getSensorType() {
        return sensorType;
    }

    public BigDecimal getValue() {
        return value;
    }

    public String getUnit() {
        return unit;
    }

    public String getReadingStatus() {
        return readingStatus;
    }

    public String getSource() {
        return source;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }
}