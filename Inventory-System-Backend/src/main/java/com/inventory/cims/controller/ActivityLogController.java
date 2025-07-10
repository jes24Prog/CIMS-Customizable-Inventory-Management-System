package com.inventory.cims.controller;

import com.inventory.cims.dto.ActivityLogDto;
import com.inventory.cims.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activity-logs")
@RequiredArgsConstructor
public class ActivityLogController {
    private final ActivityLogService activityLogService;

    @GetMapping
    public List<ActivityLogDto> getLogs() {
        return activityLogService.getAllLogs();
    }
}