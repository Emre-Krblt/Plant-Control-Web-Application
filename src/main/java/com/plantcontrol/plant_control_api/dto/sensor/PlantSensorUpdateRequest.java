package com.plantcontrol.plant_control_api.dto.sensor;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class PlantSensorUpdateRequest {

    @NotNull(message = "Connected status is required.")
    private Boolean connected;

    @NotNull(message = "Minimum threshold is required.")
    @DecimalMin(value = "0.0", message = "Minimum threshold cannot be negative.")
    private BigDecimal minThreshold;

    @NotNull(message = "Maximum threshold is required.")
    @DecimalMin(value = "0.0", message = "Maximum threshold cannot be negative.")
    private BigDecimal maxThreshold;

    @NotNull(message = "Unit is required.")
    @Size(max = 20, message = "Unit must be at most 20 characters.")
    private String unit;

    public PlantSensorUpdateRequest() {
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

    public void setConnected(Boolean connected) {
        this.connected = connected;
    }

    public void setMinThreshold(BigDecimal minThreshold) {
        this.minThreshold = minThreshold;
    }

    public void setMaxThreshold(BigDecimal maxThreshold) {
        this.maxThreshold = maxThreshold;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}
