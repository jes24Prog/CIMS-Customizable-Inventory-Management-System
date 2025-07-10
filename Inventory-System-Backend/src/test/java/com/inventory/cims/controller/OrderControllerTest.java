package com.inventory.cims.controller;

import com.inventory.cims.dto.OrderDto;
import com.inventory.cims.service.OrderService;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private OrderService orderService;

    @Test
    void getOrders_returnsJsonList() throws Exception {
        OrderDto dto = new OrderDto();
        dto.setId("ORD123");
        dto.setCustomerName("Alice");
        dto.setOrderDate(LocalDate.now());
        dto.setTotalAmount(BigDecimal.valueOf(100.0));

        when(orderService.getAllOrders()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("ORD123"));
    }
}