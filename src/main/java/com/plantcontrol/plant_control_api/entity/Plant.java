package com.plantcontrol.plant_control_api.entity;



import com.plantcontrol.plant_control_api.enums.PlantHealthStatus;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "plants",
        indexes = {
                @Index(name = "idx_plants_user_id", columnList = "user_id"),
                @Index(name = "idx_plants_health_status", columnList = "health_status"),
                @Index(name = "idx_plants_is_active", columnList = "is_active")
        }
)
public class Plant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * plants.user_id -> users.id
     *
     * Bir bitki bir kullanıcıya aittir.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "plant_type", length = 100)
    private String plantType;

    @Column(length = 150)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "planted_date")
    private LocalDate plantedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "health_status", nullable = false, length = 50)
    private PlantHealthStatus healthStatus = PlantHealthStatus.NO_DATA;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /*
     * Bir bitkinin birden fazla sensörü olabilir.
     * Örnek:
     * - TEMPERATURE
     * - AIR_HUMIDITY
     * - SOIL_MOISTURE
     */
    @OneToMany(
            mappedBy = "plant",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<PlantSensor> sensors = new ArrayList<>();

    /*
     * Bir bitkinin birden fazla uyarısı olabilir.
     */
    @OneToMany(
            mappedBy = "plant",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Alert> alerts = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if (this.healthStatus == null) {
            this.healthStatus = PlantHealthStatus.NO_DATA;
        }

        if (this.isActive == null) {
            this.isActive = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Plant() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
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

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public LocalDate getPlantedDate() {
        return plantedDate;
    }

    public PlantHealthStatus getHealthStatus() {
        return healthStatus;
    }

    public Boolean getActive() {
        return isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<PlantSensor> getSensors() {
        return sensors;
    }

    public List<Alert> getAlerts() {
        return alerts;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPlantType(String plantType) {
        this.plantType = plantType;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setPlantedDate(LocalDate plantedDate) {
        this.plantedDate = plantedDate;
    }

    public void setHealthStatus(PlantHealthStatus healthStatus) {
        this.healthStatus = healthStatus;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public void setSensors(List<PlantSensor> sensors) {
        this.sensors = sensors;
    }

    public void setAlerts(List<Alert> alerts) {
        this.alerts = alerts;
    }
}
