package com.plantcontrol.plant_control_api.service;

import com.plantcontrol.plant_control_api.dto.sensor.PlantSensorResponse;
import com.plantcontrol.plant_control_api.dto.sensor.PlantSensorUpdateRequest;
import com.plantcontrol.plant_control_api.entity.Plant;
import com.plantcontrol.plant_control_api.entity.PlantSensor;
import com.plantcontrol.plant_control_api.enums.SensorStatus;
import com.plantcontrol.plant_control_api.exception.BadRequestException;
import com.plantcontrol.plant_control_api.exception.ResourceNotFoundException;
import com.plantcontrol.plant_control_api.repository.PlantRepository;
import com.plantcontrol.plant_control_api.repository.PlantSensorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PlantSensorService {

    private final PlantRepository plantRepository;
    private final PlantSensorRepository plantSensorRepository;

    public PlantSensorService(
            PlantRepository plantRepository,
            PlantSensorRepository plantSensorRepository
    ) {
        this.plantRepository = plantRepository;
        this.plantSensorRepository = plantSensorRepository;
    }

    @Transactional(readOnly = true)
    public List<PlantSensorResponse> getSensorsByPlant(Long plantId, Long userId) {
        ensurePlantBelongsToUser(plantId, userId);

        return plantSensorRepository.findByPlantId(plantId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public PlantSensorResponse updateSensor(
            Long plantId,
            Long sensorId,
            PlantSensorUpdateRequest request,
            Long userId
    ) {
        ensurePlantBelongsToUser(plantId, userId);

        PlantSensor sensor = plantSensorRepository.findById(sensorId)
                .orElseThrow(() -> new ResourceNotFoundException("Sensor not found."));

        if (!sensor.getPlant().getId().equals(plantId)) {
            throw new BadRequestException("Sensor does not belong to this plant.");
        }

        if (request.getMinThreshold().compareTo(request.getMaxThreshold()) > 0) {
            throw new BadRequestException("Minimum threshold cannot be greater than maximum threshold.");
        }

        sensor.setConnected(request.getConnected());
        sensor.setMinThreshold(request.getMinThreshold());
        sensor.setMaxThreshold(request.getMaxThreshold());
        sensor.setUnit(request.getUnit());

        if (!request.getConnected()) {
            sensor.setLastStatus(SensorStatus.DISCONNECTED);
        } else if (sensor.getLastStatus() == SensorStatus.DISCONNECTED) {
            sensor.setLastStatus(SensorStatus.NO_DATA);
        }

        PlantSensor updatedSensor = plantSensorRepository.save(sensor);

        return toResponse(updatedSensor);
    }

    private Plant ensurePlantBelongsToUser(Long plantId, Long userId) {
        return plantRepository.findByIdAndUserId(plantId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Plant not found."));
    }

    private PlantSensorResponse toResponse(PlantSensor sensor) {
        return new PlantSensorResponse(
                sensor.getId(),
                sensor.getSensorType().name(),
                sensor.getConnected(),
                sensor.getMinThreshold(),
                sensor.getMaxThreshold(),
                sensor.getUnit(),
                sensor.getLastStatus().name(),
                sensor.getCreatedAt(),
                sensor.getUpdatedAt()
        );
    }
}
