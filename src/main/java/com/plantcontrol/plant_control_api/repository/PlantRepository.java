package com.plantcontrol.plant_control_api.repository;

import com.plantcontrol.plant_control_api.entity.Plant;
import com.plantcontrol.plant_control_api.enums.PlantHealthStatus;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PlantRepository extends JpaRepository<Plant, Long> {
    
    List<Plant> findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(Long UserId);

    List<Plant> findByUserIdOrderByCreatedAtDesc(Long UserId);

    Optional<Plant> findByIdAndUserId(Long plantId, Long userId);

    long countByUserIdAndIsActiveTrue(Long userId);

    long countByUserIdAndHealthStatus(Long userId, PlantHealthStatus healthStatus);
}
