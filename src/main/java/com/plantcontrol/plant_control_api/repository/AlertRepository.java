package com.plantcontrol.plant_control_api.repository;

import com.plantcontrol.plant_control_api.entity.Alert;
import com.plantcontrol.plant_control_api.enums.AlertStatus;
import com.plantcontrol.plant_control_api.enums.AlertType;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByPlantIdOrderByCreatedAtDesc(Long plantId);

    List<Alert> findByPlantIdAndStatusOrderByCreatedAtDesc(Long plantId, AlertStatus status);

    List<Alert> findByStatusOrderByCreatedAtDesc(AlertStatus status);

    long countByPlantUserIdAndStatus(Long userId, AlertStatus status);

    List<Alert> findByPlantUserIdAndStatusOrderByCreatedAtDesc(Long userId, AlertStatus status);

    Optional<Alert> findFirstByPlantIdAndPlantSensorIdAndAlertTypeAndStatusOrderByCreatedAtDesc(
            Long plantId,
            Long plantSensorId,
            AlertType alertType,
            AlertStatus status
    );

    List<Alert> findByPlantIdAndPlantSensorIdAndStatus(
            Long plantId,
            Long plantSensorId,
            AlertStatus status
    );

    Optional<Alert> findByIdAndPlantUserId(Long alertId, Long userId);
}
