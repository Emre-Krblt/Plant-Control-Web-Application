package com.plantcontrol.plant_control_api.entity;

import com.plantcontrol.plant_control_api.enums.SensorStatus;
import com.plantcontrol.plant_control_api.enums.SensorType;
import jakarta.persistence.*;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "plant_sensors",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "ux_plant_sensors_plant_sensor_type",
                        columnNames = {"plant_id", "sensor_type"}
                )
        },
        indexes = {
                @Index(name = "idx_plant_sensors_plant_id", columnList = "plant_id"),
                @Index(name = "idx_plant_sensors_sensor_type", columnList = "sensor_type"),
                @Index(name = "idx_plant_sensors_last_status", columnList = "last_status")
        }
)
public class PlantSensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * plant_sensors.plant_id -> plants.id
     *
     * Bir sensör ayarı bir bitkiye aittir.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id", nullable = false)
    private Plant plant;

    @Enumerated(EnumType.STRING)
    @Column(name = "sensor_type", nullable = false, length = 50)
    private SensorType sensorType;

    @Column(name = "is_connected", nullable = false)
    private Boolean isConnected = true;

    @Column(name = "min_threshold", precision = 8, scale = 2)
    private BigDecimal minThreshold;

    @Column(name = "max_threshold", precision = 8, scale = 2)
    private BigDecimal maxThreshold;

    @Column(nullable = false, length = 20)
    private String unit;

    @Enumerated(EnumType.STRING)
    @Column(name = "last_status", nullable = false, length = 50)
    private SensorStatus lastStatus = SensorStatus.NO_DATA;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /*
     * Bir sensörün birçok ölçüm kaydı olabilir.
     */
    @OneToMany(
            mappedBy = "plantSensor",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<SensorReading> readings = new ArrayList<>();

    /*
     * Bir sensöre bağlı birçok uyarı oluşabilir.
     */
    @OneToMany(
            mappedBy = "plantSensor"
    )
    private List<Alert> alerts = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if (this.isConnected == null) {
            this.isConnected = true;
        }

        if (this.lastStatus == null) {
            this.lastStatus = SensorStatus.NO_DATA;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public PlantSensor() {
    }

    public Long getId() {
        return id;
    }

    public Plant getPlant() {
        return plant;
    }

    public SensorType getSensorType() {
        return sensorType;
    }

    public Boolean getConnected() {
        return isConnected;
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

    public SensorStatus getLastStatus() {
        return lastStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<SensorReading> getReadings() {
        return readings;
    }

    public List<Alert> getAlerts() {
        return alerts;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPlant(Plant plant) {
        this.plant = plant;
    }

    public void setSensorType(SensorType sensorType) {
        this.sensorType = sensorType;
    }

    public void setConnected(Boolean connected) {
        isConnected = connected;
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

    public void setLastStatus(SensorStatus lastStatus) {
        this.lastStatus = lastStatus;
    }

    public void setReadings(List<SensorReading> readings) {
        this.readings = readings;
    }

    public void setAlerts(List<Alert> alerts) {
        this.alerts = alerts;
    }
}
