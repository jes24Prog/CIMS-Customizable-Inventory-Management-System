package com.inventory.cims.controller;

import com.inventory.cims.dto.OrderItemDto;
import com.inventory.cims.service.OrderItemService;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderItemController.class)
class OrderItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private OrderItemService orderItemService;

    @Test
    void getOrderItems_returnsJsonList() throws Exception {
        OrderItemDto dto = new OrderItemDto();
        dto.setId(1);
        dto.setItemId(1);
        dto.setOrderId("ORD123");
        dto.setQuantity(2);
        dto.setPricePerUnit(BigDecimal.valueOf(50.0));

        when(orderItemService.getAllOrderItems()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/order-items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].quantity").value(2));
    }
}