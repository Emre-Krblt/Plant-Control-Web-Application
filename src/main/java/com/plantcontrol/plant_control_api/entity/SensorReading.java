package com.plantcontrol.plant_control_api.entity;

import com.plantcontrol.plant_control_api.enums.SensorStatus;
import com.plantcontrol.plant_control_api.enums.ReadingSource;
import jakarta.persistence.*;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "sensor_readings",
        indexes = {
                @Index(name = "idx_sensor_readings_plant_sensor_id", columnList = "plant_sensor_id"),
                @Index(name = "idx_sensor_readings_recorded_at", columnList = "recorded_at"),
                @Index(name = "idx_sensor_readings_sensor_recorded_at", columnList = "plant_sensor_id, recorded_at"),
                @Index(name = "idx_sensor_readings_status", columnList = "reading_status")
        }
)
public class SensorReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * sensor_readings.plant_sensor_id -> plant_sensors.id
     *
     * Bir ölçüm kaydı bir sensöre aittir.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_sensor_id", nullable = false)
    private PlantSensor plantSensor;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal value;

    @Enumerated(EnumType.STRING)
    @Column(name = "reading_status", nullable = false, length = 50)
    private SensorStatus readingStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ReadingSource source = ReadingSource.SIMULATED;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /*
     * Bir ölçüm kaydı bir veya daha fazla alert oluşturabilir.
     * Normalde çoğu zaman bir ölçümden tek alert çıkar.
     * Ama ilişkiyi esnek bırakıyoruz.
     */
    @OneToMany(mappedBy = "sensorReading")
    private List<Alert> alerts = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        if (this.recordedAt == null) {
            this.recordedAt = now;
        }

        this.createdAt = now;

        if (this.source == null) {
            this.source = ReadingSource.SIMULATED;
        }
    }

    public SensorReading() {
    }

    public Long getId() {
        return id;
    }

    public PlantSensor getPlantSensor() {
        return plantSensor;
    }

    public BigDecimal getValue() {
        return value;
    }

    public SensorStatus getReadingStatus() {
        return readingStatus;
    }

    public ReadingSource getSource() {
        return source;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<Alert> getAlerts() {
        return alerts;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPlantSensor(PlantSensor plantSensor) {
        this.plantSensor = plantSensor;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public void setReadingStatus(SensorStatus readingStatus) {
        this.readingStatus = readingStatus;
    }

    public void setSource(ReadingSource source) {
        this.source = source;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }

    public void setAlerts(List<Alert> alerts) {
        this.alerts = alerts;
    }
}
