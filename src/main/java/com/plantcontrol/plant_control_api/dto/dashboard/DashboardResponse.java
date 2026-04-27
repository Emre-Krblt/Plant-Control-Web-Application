package com.plantcontrol.plant_control_api.dto.dashboard;

import java.util.List;

public class DashboardResponse {

    private long totalActivePlants;
    private long normalPlants;
    private long warningPlants;
    private long criticalPlants;
    private long activeAlerts;

    private List<DashboardPlantSummary> recentPlants;
    private List<DashboardAlertSummary> recentActiveAlerts;

    public DashboardResponse() {
    }

    public DashboardResponse(
            long totalActivePlants,
            long normalPlants,
            long warningPlants,
            long criticalPlants,
            long activeAlerts,
            List<DashboardPlantSummary> recentPlants,
            List<DashboardAlertSummary> recentActiveAlerts
    ) {
        this.totalActivePlants = totalActivePlants;
        this.normalPlants = normalPlants;
        this.warningPlants = warningPlants;
        this.criticalPlants = criticalPlants;
        this.activeAlerts = activeAlerts;
        this.recentPlants = recentPlants;
        this.recentActiveAlerts = recentActiveAlerts;
    }

    public long getTotalActivePlants() {
        return totalActivePlants;
    }

    public long getNormalPlants() {
        return normalPlants;
    }

    public long getWarningPlants() {
        return warningPlants;
    }

    public long getCriticalPlants() {
        return criticalPlants;
    }

    public long getActiveAlerts() {
        return activeAlerts;
    }

    public List<DashboardPlantSummary> getRecentPlants() {
        return recentPlants;
    }

    public List<DashboardAlertSummary> getRecentActiveAlerts() {
        return recentActiveAlerts;
    }
}
