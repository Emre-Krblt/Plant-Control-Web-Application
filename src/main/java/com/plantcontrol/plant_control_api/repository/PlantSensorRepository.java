package com.plantcontrol.plant_control_api.repository;

import com.plantcontrol.plant_control_api.entity.PlantSensor;
import com.plantcontrol.plant_control_api.enums.SensorType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlantSensorRepository extends JpaRepository<PlantSensor, Long> {

    List<PlantSensor> findByPlantId(Long plantId);

    Optional<PlantSensor> findByPlantIdAndSensorType(Long plantId, SensorType sensorType);

    boolean existsByPlantIdAndSensorType(Long plantId, SensorType sensorType);
}
