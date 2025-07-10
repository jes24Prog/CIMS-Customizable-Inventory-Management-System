package com.inventory.cims.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActivityLogDto {
    private Integer id;
    private LocalDateTime timestamp;
    private Integer userId;
    private String action;
    private String details;
    private String category;
}