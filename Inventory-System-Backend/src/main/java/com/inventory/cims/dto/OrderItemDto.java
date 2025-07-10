package com.inventory.cims.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemDto {
    private Integer id;
    private String orderId;
    private Integer itemId;
    private Integer quantity;
    private BigDecimal pricePerUnit;
}