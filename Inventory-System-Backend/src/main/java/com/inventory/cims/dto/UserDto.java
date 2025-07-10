package com.inventory.cims.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserDto {
    private Integer id;
    private String username;
    private String name;
    private String email;
    private String role;
    private String avatar;
    private LocalDateTime createdAt;
    private List<ActivityLogDto> activityLogs;
}
