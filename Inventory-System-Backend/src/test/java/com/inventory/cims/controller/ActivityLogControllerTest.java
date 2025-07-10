package com.inventory.cims.controller;

import com.inventory.cims.dto.ActivityLogDto;
import com.inventory.cims.service.ActivityLogService;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ActivityLogController.class)
class ActivityLogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private ActivityLogService activityLogService;

    @Test
    void getLogs_returnsJsonList() throws Exception {
        ActivityLogDto dto = new ActivityLogDto();
        dto.setId(1);
        dto.setTimestamp(LocalDateTime.now());
        dto.setUserId(1);
        dto.setAction("ACTION");
        dto.setDetails("Details");
        dto.setCategory("system");

        when(activityLogService.getAllLogs()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/activity-logs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("system"));
    }
}