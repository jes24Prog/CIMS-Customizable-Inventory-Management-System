package com.inventory.cims.service;

import com.inventory.cims.dto.OrderDto;
import com.inventory.cims.entity.Order;
import com.inventory.cims.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllOrders_returnsMappedDtos() {
        Order order = new Order();
        order.setId("ORD123");
        order.setCustomerName("test");
        order.setOrderDate(LocalDate.now());
        order.setTotalAmount(BigDecimal.valueOf(100.0));

        OrderDto dto = new OrderDto();
        dto.setId("ORD123");
        dto.setCustomerName("test");
        dto.setOrderDate(LocalDate.now());
        dto.setTotalAmount(BigDecimal.valueOf(100.0));

        when(orderRepository.findAll()).thenReturn(List.of(order));
        when(modelMapper.map(order, OrderDto.class)).thenReturn(dto);

        var result = orderService.getAllOrders();
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("ORD123", result.get(0).getId());
    }
}