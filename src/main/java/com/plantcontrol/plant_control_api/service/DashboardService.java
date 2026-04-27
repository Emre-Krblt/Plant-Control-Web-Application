package com.plantcontrol.plant_control_api.service;

import com.plantcontrol.plant_control_api.dto.dashboard.DashboardAlertSummary;
import com.plantcontrol.plant_control_api.dto.dashboard.DashboardPlantSummary;
import com.plantcontrol.plant_control_api.dto.dashboard.DashboardResponse;
import com.plantcontrol.plant_control_api.entity.Alert;
import com.plantcontrol.plant_control_api.entity.Plant;
import com.plantcontrol.plant_control_api.enums.AlertStatus;
import com.plantcontrol.plant_control_api.enums.PlantHealthStatus;
import com.plantcontrol.plant_control_api.repository.AlertRepository;
import com.plantcontrol.plant_control_api.repository.PlantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DashboardService {

    private final PlantRepository plantRepository;
    private final AlertRepository alertRepository;

    public DashboardService(
            PlantRepository plantRepository,
            AlertRepository alertRepository
    ) {
        this.plantRepository = plantRepository;
        this.alertRepository = alertRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long userId) {
        long totalActivePlants = plantRepository.countByUserIdAndIsActiveTrue(userId);

        long normalPlants = plantRepository.countByUserIdAndHealthStatus(
                userId,
                PlantHealthStatus.NORMAL
        );

        long warningPlants = plantRepository.countByUserIdAndHealthStatus(
                userId,
                PlantHealthStatus.WARNING
        );

        long criticalPlants = plantRepository.countByUserIdAndHealthStatus(
                userId,
                PlantHealthStatus.CRITICAL
        );

        long activeAlerts = alertRepository.countByPlantUserIdAndStatus(
                userId,
                AlertStatus.ACTIVE
        );

        List<DashboardPlantSummary> recentPlants = plantRepository
                .findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(userId)
                .stream()
                .limit(5)
                .map(this::toPlantSummary)
                .toList();

        List<DashboardAlertSummary> recentActiveAlerts = alertRepository
                .findByPlantUserIdAndStatusOrderByCreatedAtDesc(userId, AlertStatus.ACTIVE)
                .stream()
                .limit(5)
                .map(this::toAlertSummary)
                .toList();

        return new DashboardResponse(
                totalActivePlants,
                normalPlants,
                warningPlants,
                criticalPlants,
                activeAlerts,
                recentPlants,
                recentActiveAlerts
        );
    }

    private DashboardPlantSummary toPlantSummary(Plant plant) {
        return new DashboardPlantSummary(
                plant.getId(),
                plant.getName(),
                plant.getPlantType(),
                plant.getLocation(),
                plant.getHealthStatus().name()
        );
    }

    private DashboardAlertSummary toAlertSummary(Alert alert) {
        return new DashboardAlertSummary(
                alert.getId(),
                alert.getPlant().getId(),
                alert.getPlant().getName(),
                alert.getSeverity().name(),
                alert.getTitle(),
                alert.getStatus().name(),
                alert.getCreatedAt()
        );
    }
}
