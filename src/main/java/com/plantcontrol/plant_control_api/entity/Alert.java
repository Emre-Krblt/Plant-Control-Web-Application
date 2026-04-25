package com.plantcontrol.plant_control_api.entity;

import com.plantcontrol.plant_control_api.enums.AlertType;
import com.plantcontrol.plant_control_api.enums.AlertSeverity;
import com.plantcontrol.plant_control_api.enums.AlertStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "alerts",
        indexes = {
                @Index(name = "idx_alerts_plant_id", columnList = "plant_id"),
                @Index(name = "idx_alerts_plant_sensor_id", columnList = "plant_sensor_id"),
                @Index(name = "idx_alerts_sensor_reading_id", columnList = "sensor_reading_id"),
                @Index(name = "idx_alerts_status", columnList = "status"),
                @Index(name = "idx_alerts_severity", columnList = "severity"),
                @Index(name = "idx_alerts_created_at", columnList = "created_at"),
                @Index(name = "idx_alerts_plant_status_created_at", columnList = "plant_id, status, created_at")
        }
)
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * alerts.plant_id -> plants.id
     *
     * Her uyarı bir bitkiye bağlıdır.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id", nullable = false)
    private Plant plant;

    /*
     * alerts.plant_sensor_id -> plant_sensors.id
     *
     * Bazı durumlarda null olabilir.
     * Çünkü SQL tarafında ON DELETE SET NULL kullandık.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_sensor_id")
    private PlantSensor plantSensor;

    /*
     * alerts.sensor_reading_id -> sensor_readings.id
     *
     * Sensör bağlantısı yok gibi durumlarda reading olmayabilir.
     * Bu yüzden nullable bıraktık.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sensor_reading_id")
    private SensorReading sensorReading;

    @Enumerated(EnumType.STRING)
    @Column(name = "alert_type", nullable = false, length = 50)
    private AlertType alertType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AlertSeverity severity;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "current_value", precision = 8, scale = 2)
    private BigDecimal currentValue;

    @Column(name = "threshold_min", precision = 8, scale = 2)
    private BigDecimal thresholdMin;

    @Column(name = "threshold_max", precision = 8, scale = 2)
    private BigDecimal thresholdMax;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AlertStatus status = AlertStatus.ACTIVE;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;

        if (this.status == null) {
            this.status = AlertStatus.ACTIVE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Alert() {
    }

    public Long getId() {
        return id;
    }

    public Plant getPlant() {
        return plant;
    }

    public PlantSensor getPlantSensor() {
        return plantSensor;
    }

    public SensorReading getSensorReading() {
        return sensorReading;
    }

    public AlertType getAlertType() {
        return alertType;
    }

    public AlertSeverity getSeverity() {
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

    public AlertStatus getStatus() {
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

    public void setId(Long id) {
        this.id = id;
    }

    public void setPlant(Plant plant) {
        this.plant = plant;
    }

    public void setPlantSensor(PlantSensor plantSensor) {
        this.plantSensor = plantSensor;
    }

    public void setSensorReading(SensorReading sensorReading) {
        this.sensorReading = sensorReading;
    }

    public void setAlertType(AlertType alertType) {
        this.alertType = alertType;
    }

    public void setSeverity(AlertSeverity severity) {
        this.severity = severity;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setCurrentValue(BigDecimal currentValue) {
        this.currentValue = currentValue;
    }

    public void setThresholdMin(BigDecimal thresholdMin) {
        this.thresholdMin = thresholdMin;
    }

    public void setThresholdMax(BigDecimal thresholdMax) {
        this.thresholdMax = thresholdMax;
    }

    public void setStatus(AlertStatus status) {
        this.status = status;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}
