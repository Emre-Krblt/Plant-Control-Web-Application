package com.plantcontrol.plant_control_api.dto.dashboard;

import java.time.LocalDateTime;

public class DashboardAlertSummary {

    private Long id;
    private Long plantId;
    private String plantName;
    private String severity;
    private String title;
    private String status;
    private LocalDateTime createdAt;

    public DashboardAlertSummary() {
    }

    public DashboardAlertSummary(
            Long id,
            Long plantId,
            String plantName,
            String severity,
            String title,
            String status,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.plantId = plantId;
        this.plantName = plantName;
        this.severity = severity;
        this.title = title;
        this.status = status;
        this.createdAt = createdAt;
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

    public String getSeverity() {
        return severity;
    }

    public String getTitle() {
        return title;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
