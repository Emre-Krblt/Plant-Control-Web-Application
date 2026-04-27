package com.plantcontrol.plant_control_api.service;

import com.plantcontrol.plant_control_api.enums.AlertSeverity;
import com.plantcontrol.plant_control_api.enums.PlantHealthStatus;
import com.plantcontrol.plant_control_api.entity.Plant;

import com.plantcontrol.plant_control_api.dto.alert.AlertResponse;
import com.plantcontrol.plant_control_api.entity.Alert;
import com.plantcontrol.plant_control_api.entity.PlantSensor;
import com.plantcontrol.plant_control_api.entity.SensorReading;
import com.plantcontrol.plant_control_api.enums.AlertStatus;
import com.plantcontrol.plant_control_api.exception.ResourceNotFoundException;
import com.plantcontrol.plant_control_api.repository.AlertRepository;
import com.plantcontrol.plant_control_api.repository.PlantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final PlantRepository plantRepository;

    public AlertService(
            AlertRepository alertRepository,
            PlantRepository plantRepository
    ) {
        this.alertRepository = alertRepository;
        this.plantRepository = plantRepository;
    }

    @Transactional(readOnly = true)
    public List<AlertResponse> getActiveAlerts(Long userId) {
        return alertRepository.findByPlantUserIdAndStatusOrderByCreatedAtDesc(
                        userId,
                        AlertStatus.ACTIVE
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AlertResponse> getAlertsByPlant(Long plantId, Long userId) {
        plantRepository.findByIdAndUserId(plantId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Plant not found."));

        return alertRepository.findByPlantIdOrderByCreatedAtDesc(plantId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AlertResponse resolveAlert(Long alertId, Long userId) {
        Alert alert = alertRepository.findByIdAndPlantUserId(alertId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found."));

        alert.setStatus(AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());

        Alert savedAlert = alertRepository.save(alert);

        updatePlantHealthStatus(alert.getPlant());

        return toResponse(savedAlert);
    }

    @Transactional
    public AlertResponse ignoreAlert(Long alertId, Long userId) {
        Alert alert = alertRepository.findByIdAndPlantUserId(alertId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found."));

        alert.setStatus(AlertStatus.IGNORED);

        if (alert.getResolvedAt() == null) {
            alert.setResolvedAt(LocalDateTime.now());
        }

        Alert savedAlert = alertRepository.save(alert);

        updatePlantHealthStatus(alert.getPlant());

        return toResponse(savedAlert);
    }

        private void updatePlantHealthStatus(Plant plant) {
        List<Alert> activeAlerts = alertRepository.findByPlantIdAndStatusOrderByCreatedAtDesc(
                plant.getId(),
                AlertStatus.ACTIVE
        );

        boolean hasCriticalAlert = activeAlerts.stream()
                .anyMatch(alert -> alert.getSeverity() == AlertSeverity.CRITICAL);

        boolean hasWarningAlert = activeAlerts.stream()
                .anyMatch(alert -> alert.getSeverity() == AlertSeverity.WARNING);

        boolean hasInfoAlert = activeAlerts.stream()
                .anyMatch(alert -> alert.getSeverity() == AlertSeverity.INFO);

        if (hasCriticalAlert) {
            plant.setHealthStatus(PlantHealthStatus.CRITICAL);
        } else if (hasWarningAlert) {
            plant.setHealthStatus(PlantHealthStatus.WARNING);
        } else if (hasInfoAlert) {
            plant.setHealthStatus(PlantHealthStatus.WARNING);
        } else {
            plant.setHealthStatus(PlantHealthStatus.NORMAL);
        }

        plantRepository.save(plant);
    }

    private AlertResponse toResponse(Alert alert) {
        PlantSensor plantSensor = alert.getPlantSensor();
        SensorReading sensorReading = alert.getSensorReading();

        Long plantSensorId = plantSensor != null ? plantSensor.getId() : null;
        String sensorType = plantSensor != null ? plantSensor.getSensorType().name() : null;
        Long sensorReadingId = sensorReading != null ? sensorReading.getId() : null;

        return new AlertResponse(
                alert.getId(),
                alert.getPlant().getId(),
                alert.getPlant().getName(),
                plantSensorId,
                sensorType,
                sensorReadingId,
                alert.getAlertType().name(),
                alert.getSeverity().name(),
                alert.getTitle(),
                alert.getMessage(),
                alert.getCurrentValue(),
                alert.getThresholdMin(),
                alert.getThresholdMax(),
                alert.getStatus().name(),
                alert.getResolvedAt(),
                alert.getCreatedAt(),
                alert.getUpdatedAt()
        );
    }
}
