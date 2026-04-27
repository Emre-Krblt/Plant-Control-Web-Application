package com.plantcontrol.plant_control_api.service;

import com.plantcontrol.plant_control_api.dto.reading.GenerateReadingsResponse;
import com.plantcontrol.plant_control_api.dto.reading.SensorReadingResponse;
import com.plantcontrol.plant_control_api.entity.Alert;
import com.plantcontrol.plant_control_api.entity.Plant;
import com.plantcontrol.plant_control_api.entity.PlantSensor;
import com.plantcontrol.plant_control_api.entity.SensorReading;
import com.plantcontrol.plant_control_api.enums.AlertSeverity;
import com.plantcontrol.plant_control_api.enums.AlertStatus;
import com.plantcontrol.plant_control_api.enums.AlertType;
import com.plantcontrol.plant_control_api.enums.PlantHealthStatus;
import com.plantcontrol.plant_control_api.enums.ReadingSource;
import com.plantcontrol.plant_control_api.enums.SensorStatus;
import com.plantcontrol.plant_control_api.exception.ResourceNotFoundException;
import com.plantcontrol.plant_control_api.repository.AlertRepository;
import com.plantcontrol.plant_control_api.repository.PlantRepository;
import com.plantcontrol.plant_control_api.repository.PlantSensorRepository;
import com.plantcontrol.plant_control_api.repository.SensorReadingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class SensorReadingService {

    private final PlantRepository plantRepository;
    private final PlantSensorRepository plantSensorRepository;
    private final SensorReadingRepository sensorReadingRepository;
    private final AlertRepository alertRepository;

    public SensorReadingService(
            PlantRepository plantRepository,
            PlantSensorRepository plantSensorRepository,
            SensorReadingRepository sensorReadingRepository,
            AlertRepository alertRepository
    ) {
        this.plantRepository = plantRepository;
        this.plantSensorRepository = plantSensorRepository;
        this.sensorReadingRepository = sensorReadingRepository;
        this.alertRepository = alertRepository;
    }

    @Transactional
    public GenerateReadingsResponse generateSimulatedReadings(Long plantId, Long userId) {
        Plant plant = plantRepository.findByIdAndUserId(plantId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Plant not found."));

        List<PlantSensor> sensors = plantSensorRepository.findByPlantId(plantId);

        List<SensorReadingResponse> readingResponses = sensors.stream()
                .map(sensor -> createSimulatedReading(plant, sensor))
                .toList();

        updatePlantHealthStatus(plant);
        plantRepository.save(plant);

        return new GenerateReadingsResponse(
                plant.getId(),
                plant.getHealthStatus().name(),
                readingResponses
        );
    }

    private SensorReadingResponse createSimulatedReading(Plant plant, PlantSensor sensor) {
        SensorStatus status;
        BigDecimal value;

        if (!sensor.getConnected()) {
            status = SensorStatus.DISCONNECTED;
            value = BigDecimal.ZERO;
        } else {
            value = generateRandomValue(sensor);
            status = evaluateStatus(value, sensor.getMinThreshold(), sensor.getMaxThreshold());
        }

        SensorReading reading = new SensorReading();
        reading.setPlantSensor(sensor);
        reading.setValue(value);
        reading.setReadingStatus(status);
        reading.setSource(ReadingSource.SIMULATED);

        SensorReading savedReading = sensorReadingRepository.save(reading);

        sensor.setLastStatus(status);
        plantSensorRepository.save(sensor);

        if (status == SensorStatus.LOW || status == SensorStatus.HIGH || status == SensorStatus.DISCONNECTED) {
            createAlert(plant, sensor, savedReading, status, value);
        }

        return toResponse(savedReading);
    }

    private BigDecimal generateRandomValue(PlantSensor sensor) {
        BigDecimal min = sensor.getMinThreshold();
        BigDecimal max = sensor.getMaxThreshold();

        double minDouble = min.doubleValue();
        double maxDouble = max.doubleValue();

        /*
         * Normalde hep min-max arası değer üretirsek alert az oluşur.
         * Test için aralığı biraz genişletiyoruz.
         *
         * Örneğin min=35, max=75 ise:
         * random aralık yaklaşık 25 - 85 olur.
         */
        double range = maxDouble - minDouble;
        double extendedMin = Math.max(0, minDouble - range * 0.25);
        double extendedMax = maxDouble + range * 0.25;

        double randomValue = ThreadLocalRandom.current().nextDouble(extendedMin, extendedMax);

        return BigDecimal.valueOf(randomValue).setScale(2, RoundingMode.HALF_UP);
    }

    private SensorStatus evaluateStatus(
            BigDecimal value,
            BigDecimal minThreshold,
            BigDecimal maxThreshold
    ) {
        if (value.compareTo(minThreshold) < 0) {
            return SensorStatus.LOW;
        }

        if (value.compareTo(maxThreshold) > 0) {
            return SensorStatus.HIGH;
        }

        return SensorStatus.NORMAL;
    }

    private void createAlert(
            Plant plant,
            PlantSensor sensor,
            SensorReading reading,
            SensorStatus status,
            BigDecimal value
    ) {
        Alert alert = new Alert();
        alert.setPlant(plant);
        alert.setPlantSensor(sensor);
        alert.setSensorReading(reading);
        alert.setCurrentValue(value);
        alert.setThresholdMin(sensor.getMinThreshold());
        alert.setThresholdMax(sensor.getMaxThreshold());
        alert.setStatus(AlertStatus.ACTIVE);

        if (status == SensorStatus.LOW) {
            alert.setAlertType(AlertType.LOW_VALUE);
            alert.setSeverity(AlertSeverity.WARNING);
            alert.setTitle(sensor.getSensorType().name() + " değeri düşük");
            alert.setMessage("Sensör değeri minimum eşik değerinin altında.");
        } else if (status == SensorStatus.HIGH) {
            alert.setAlertType(AlertType.HIGH_VALUE);
            alert.setSeverity(AlertSeverity.WARNING);
            alert.setTitle(sensor.getSensorType().name() + " değeri yüksek");
            alert.setMessage("Sensör değeri maksimum eşik değerinin üstünde.");
        } else if (status == SensorStatus.DISCONNECTED) {
            alert.setAlertType(AlertType.SENSOR_DISCONNECTED);
            alert.setSeverity(AlertSeverity.INFO);
            alert.setTitle(sensor.getSensorType().name() + " sensörü bağlı değil");
            alert.setMessage("Sensör bağlı olmadığı için veri okunamadı.");
        }

        alertRepository.save(alert);
    }

    private void updatePlantHealthStatus(Plant plant) {
        boolean hasCriticalAlert = alertRepository
                .findByPlantIdAndStatusOrderByCreatedAtDesc(plant.getId(), AlertStatus.ACTIVE)
                .stream()
                .anyMatch(alert -> alert.getSeverity() == AlertSeverity.CRITICAL);

        boolean hasWarningAlert = alertRepository
                .findByPlantIdAndStatusOrderByCreatedAtDesc(plant.getId(), AlertStatus.ACTIVE)
                .stream()
                .anyMatch(alert -> alert.getSeverity() == AlertSeverity.WARNING);

        if (hasCriticalAlert) {
            plant.setHealthStatus(PlantHealthStatus.CRITICAL);
        } else if (hasWarningAlert) {
            plant.setHealthStatus(PlantHealthStatus.WARNING);
        } else {
            plant.setHealthStatus(PlantHealthStatus.NORMAL);
        }
    }

    private SensorReadingResponse toResponse(SensorReading reading) {
        PlantSensor sensor = reading.getPlantSensor();

        return new SensorReadingResponse(
                reading.getId(),
                sensor.getId(),
                sensor.getSensorType().name(),
                reading.getValue(),
                sensor.getUnit(),
                reading.getReadingStatus().name(),
                reading.getSource().name(),
                reading.getRecordedAt()
        );
    }
}