package com.inventory.cims.service;

import com.inventory.cims.dto.ActivityLogDto;
import com.inventory.cims.entity.ActivityLog;
import com.inventory.cims.repository.ActivityLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class ActivityLogServiceTest {

    @Mock
    private ActivityLogRepository activityLogRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private ActivityLogService activityLogService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllLogs_returnsMappedDtos() {
        ActivityLog log = new ActivityLog();
        log.setId(1);
        log.setTimestamp(LocalDateTime.now());
        log.setUserId(1);
        log.setAction("ACTION");
        log.setDetails("Details");
        log.setCategory("system");

        ActivityLogDto dto = new ActivityLogDto();
        dto.setId(1);
        dto.setTimestamp(log.getTimestamp());
        dto.setUserId(1);
        dto.setAction("ACTION");
        dto.setDetails("Details");
        dto.setCategory("system");

        when(activityLogRepository.findAll()).thenReturn(List.of(log));
        when(modelMapper.map(log, ActivityLogDto.class)).thenReturn(dto);

        var result = activityLogService.getAllLogs();
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("ACTION", result.get(0).getAction());
    }
}