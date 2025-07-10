package com.inventory.cims.controller;

import com.inventory.cims.dto.OrderItemDto;
import com.inventory.cims.service.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@RequiredArgsConstructor
public class OrderItemController {
    private final OrderItemService orderItemService;

    @GetMapping
    public List<OrderItemDto> getOrderItems() {
        return orderItemService.getAllOrderItems();
    }

    @PutMapping("/{id}")
    public OrderItemDto updateOrderItem(@PathVariable Long id, @RequestBody OrderItemDto orderItemDto) {
        return orderItemService.updateOrderItem(id, orderItemDto);
    }

    @DeleteMapping("/{id}")
    public void deleteOrderItem(@PathVariable Long id) {
        orderItemService.deleteOrderItem(id);
    }
}