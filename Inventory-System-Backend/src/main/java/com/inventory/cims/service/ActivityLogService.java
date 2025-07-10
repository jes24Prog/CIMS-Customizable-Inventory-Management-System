package com.inventory.cims.service;

import com.inventory.cims.dto.ActivityLogDto;
import com.inventory.cims.entity.ActivityLog;
import com.inventory.cims.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityLogService {
    private final ActivityLogRepository activityLogRepository;
    private final ModelMapper modelMapper;

    public List<ActivityLogDto> getAllLogs() {
        List<ActivityLog> logs = activityLogRepository.findAll();
        return logs.stream()
            .map(l -> modelMapper.map(l, ActivityLogDto.class))
            .collect(Collectors.toList());
    }
}