package com.plantcontrol.plant_control_api.service;

import com.plantcontrol.plant_control_api.dto.plant.PlantCreateRequest;
import com.plantcontrol.plant_control_api.dto.plant.PlantResponse;
import com.plantcontrol.plant_control_api.dto.plant.PlantUpdateRequest;
import com.plantcontrol.plant_control_api.entity.Plant;
import com.plantcontrol.plant_control_api.entity.PlantSensor;
import com.plantcontrol.plant_control_api.entity.User;
import com.plantcontrol.plant_control_api.enums.PlantHealthStatus;
import com.plantcontrol.plant_control_api.enums.SensorStatus;
import com.plantcontrol.plant_control_api.enums.SensorType;
import com.plantcontrol.plant_control_api.repository.PlantRepository;
import com.plantcontrol.plant_control_api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PlantService {

    private final PlantRepository plantRepository;
    private final UserRepository userRepository;

    public PlantService(
            PlantRepository plantRepository,
            UserRepository userRepository
    ) {
        this.plantRepository = plantRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<PlantResponse> getPlantsByUser(Long userId) {
        return plantRepository.findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PlantResponse getPlantById(Long plantId, Long userId) {
        Plant plant = plantRepository.findByIdAndUserId(plantId, userId)
                .orElseThrow(() -> new RuntimeException("Plant not found."));

        return toResponse(plant);
    }

    @Transactional
    public PlantResponse createPlant(PlantCreateRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Plant plant = new Plant();
        plant.setUser(user);
        plant.setName(request.getName());
        plant.setPlantType(request.getPlantType());
        plant.setLocation(request.getLocation());
        plant.setDescription(request.getDescription());
        plant.setImageUrl(request.getImageUrl());
        plant.setPlantedDate(request.getPlantedDate());
        plant.setHealthStatus(PlantHealthStatus.NO_DATA);
        plant.setActive(true);

        addDefaultSensors(plant);

        Plant savedPlant = plantRepository.save(plant);

        return toResponse(savedPlant);
    }

    @Transactional
    public PlantResponse updatePlant(Long plantId, PlantUpdateRequest request, Long userId) {
        Plant plant = plantRepository.findByIdAndUserId(plantId, userId)
                .orElseThrow(() -> new RuntimeException("Plant not found."));

        plant.setName(request.getName());
        plant.setPlantType(request.getPlantType());
        plant.setLocation(request.getLocation());
        plant.setDescription(request.getDescription());
        plant.setImageUrl(request.getImageUrl());
        plant.setPlantedDate(request.getPlantedDate());

        Plant updatedPlant = plantRepository.save(plant);

        return toResponse(updatedPlant);
    }

    @Transactional
    public void deletePlant(Long plantId, Long userId) {
        Plant plant = plantRepository.findByIdAndUserId(plantId, userId)
                .orElseThrow(() -> new RuntimeException("Plant not found."));

        /*
         * Şimdilik hard delete yapıyoruz.
         * Yani kayıt DB'den tamamen silinir.
         *
         * İleride istersek soft delete yapıp:
         * plant.setActive(false);
         * diyebiliriz.
         */
        plantRepository.delete(plant);
    }

    private void addDefaultSensors(Plant plant) {
        PlantSensor temperatureSensor = createSensor(
                plant,
                SensorType.TEMPERATURE,
                new BigDecimal("18.00"),
                new BigDecimal("30.00"),
                "°C"
        );

        PlantSensor airHumiditySensor = createSensor(
                plant,
                SensorType.AIR_HUMIDITY,
                new BigDecimal("40.00"),
                new BigDecimal("70.00"),
                "%"
        );

        PlantSensor soilMoistureSensor = createSensor(
                plant,
                SensorType.SOIL_MOISTURE,
                new BigDecimal("35.00"),
                new BigDecimal("75.00"),
                "%"
        );

        plant.getSensors().add(temperatureSensor);
        plant.getSensors().add(airHumiditySensor);
        plant.getSensors().add(soilMoistureSensor);
    }

    private PlantSensor createSensor(
            Plant plant,
            SensorType sensorType,
            BigDecimal minThreshold,
            BigDecimal maxThreshold,
            String unit
    ) {
        PlantSensor sensor = new PlantSensor();
        sensor.setPlant(plant);
        sensor.setSensorType(sensorType);
        sensor.setConnected(true);
        sensor.setMinThreshold(minThreshold);
        sensor.setMaxThreshold(maxThreshold);
        sensor.setUnit(unit);
        sensor.setLastStatus(SensorStatus.NO_DATA);

        return sensor;
    }

    private PlantResponse toResponse(Plant plant) {
        return new PlantResponse(
                plant.getId(),
                plant.getName(),
                plant.getPlantType(),
                plant.getLocation(),
                plant.getDescription(),
                plant.getImageUrl(),
                plant.getPlantedDate(),
                plant.getHealthStatus().name(),
                plant.getActive(),
                plant.getCreatedAt(),
                plant.getUpdatedAt()
        );
    }
}