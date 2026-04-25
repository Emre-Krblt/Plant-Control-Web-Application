package com.plantcontrol.plant_control_api.repository;

import com.plantcontrol.plant_control_api.entity.SensorReading;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SensorReadingRepository extends JpaRepository<SensorReading, Long> {
    List<SensorReading> findByPlantSensorIdOrderByRecordedAtDesc(Long plantSensorId);

    Optional<SensorReading> findTopByPlantSensorIdOrderByRecordedAtDesc(Long plantSensorId);

    List<SensorReading> findTop10ByPlantSensorIdOrderByRecordedAtDesc(Long plantSensorId);
}
