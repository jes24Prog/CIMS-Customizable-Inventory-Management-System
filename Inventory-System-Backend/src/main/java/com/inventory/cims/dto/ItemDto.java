package com.inventory.cims.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ItemDto {
    private Integer id;
    private String name;
    private String description;
    private Integer categoryId;
    private BigDecimal price;
    private Integer stock;
    private String status;
    private String sku;
    private String dimensions;
    private String weight;
    private String manufacturer;
    private String location;
    private LocalDate dateAdded;
    private LocalDateTime lastUpdated;
}