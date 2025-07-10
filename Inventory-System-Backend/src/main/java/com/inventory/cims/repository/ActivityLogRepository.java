package com.inventory.cims.repository;

import com.inventory.cims.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Integer> {
    }
